import { GoogleGenAI } from "@google/genai";
import { FoodAnalysis } from '../types';

// --- CONFIGURATION ---
// Set to FALSE to use Client-Side Direct API (Works immediately in browser)
// Set to TRUE to use Python Backend (Requires running server.py)
const USE_BACKEND = false; 
const BACKEND_URL = 'http://localhost:5000/api';

// API Key provided by environment variable (do NOT hardcode secrets)
declare const process: any;
const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY || '';
// Client-side SDK instance
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Generate a response from the AI model (Chat)
 */
export const generateHealthResponse = async (
  message: string, 
  context: string, 
  image?: string
): Promise<string> => {
  try {
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, image })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data.text;
    } else {
      // Client-side Direct Call
      const modelId = 'gemini-2.5-flash';
      
      const parts: any[] = [];
      
      // Add System Context
      if (context) {
         parts.push({ text: `System Instruction: You are VitalSync, a helpful health AI. Context: ${context}` });
      }
      
      // Add Image if present
      if (image) {
        // Remove header if present (data:image/jpeg;base64,)
        const base64Data = image.includes(',') ? image.split(',')[1] : image;
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
            }
        });
      }
      
      // Add User Message
      parts.push({ text: message });

      const response = await ai.models.generateContent({
        model: modelId,
        contents: { parts: parts }
      });
      
      return response.text || "I processed that, but couldn't generate a text response.";
    }
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm having trouble connecting to the AI service right now. Please check your internet connection or API key.";
  }
};

/**
 * Analyze a food image for nutritional info
 */
export const analyzeFoodImage = async (image: string): Promise<FoodAnalysis | null> => {
  try {
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/analyze-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
      });
      const data = await response.json();
      // Handle potential double-encoding from some backends
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsedData.error) throw new Error(parsedData.error);
      return parsedData as FoodAnalysis;
    } else {
       // Client-side Direct Call
       const base64Data = image.includes(',') ? image.split(',')[1] : image;
       const prompt = `Analyze this food image and provide nutritional information.
        Return ONLY a raw JSON object with this structure (no markdown formatting):
        {
          "foodName": "string",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number,
          "healthy": boolean,
          "advice": "string"
        }`;

       const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: {
               parts: [
                   { text: prompt },
                   { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
               ]
           },
           config: { responseMimeType: 'application/json' }
       });
       
       const text = response.text;
       return text ? JSON.parse(text) : null;
    }
  } catch (error) {
    console.error("Food Analysis Error:", error);
    return null;
  }
};

/**
 * Predict water intake needs
 */
export const predictWaterNeeds = async (
  weather: string, 
  activity: string, 
  weight: number
): Promise<number> => {
  try {
    if (USE_BACKEND) {
      const response = await fetch(`${BACKEND_URL}/predict-water`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weather, activity, weight })
      });
      const data = await response.json();
      return data.water_needs || 2500;
    } else {
        // Client-side Direct Call
        const prompt = `Calculate daily water intake goal (in ml) for a person with:
        Weight: ${weight}kg
        Activity Level: ${activity}
        Weather Condition: ${weather}
        Return ONLY a JSON object: { "water_needs": number }`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) return 2500;
        const json = JSON.parse(text);
        return json.water_needs || 2500;
    }
  } catch (error) {
    console.error("Water Prediction Error:", error);
    return 2500; // Fallback default
  }
};

/**
 * Analyze Mood Diary
 */
export const analyzeMoodAndSuggest = async (diaryEntry: string): Promise<{sentiment: string; suggestion: string}> => {
  try {
    if (USE_BACKEND) {
        const response = await fetch(`${BACKEND_URL}/analyze-mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diary: diaryEntry })
        });
        const data = await response.json();
        return typeof data === 'string' ? JSON.parse(data) : data;
    } else {
        // Client-side Direct Call
        const prompt = `Analyze this diary entry: "${diaryEntry}"
        Return ONLY a JSON object:
        {
          "sentiment": "string (e.g., Happy, Stressed, Anxious)",
          "suggestion": "string (short helpful tip)"
        }`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    }
  } catch (error) {
    console.error("Mood Analysis Error:", error);
    return { sentiment: "Neutral", suggestion: "Keep tracking your mood to see patterns over time." };
  }
};
