import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY not set in environment.');
  process.exit(2);
}

async function runTest() {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const context = "User: 30-year-old, no chronic conditions, occasional headaches.";
    const message = "I have a mild headache. What can I do to ease it?";

    const parts = [];
    parts.push({ text: `System Instruction: You are VitalSync, a helpful health AI. Context: ${context}` });
    parts.push({ text: message });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts }
    });

    console.log('=== Chat Test Response ===');
    console.log(response.text || JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('Chat test failed:', err);
    process.exit(3);
  }
}

runTest();
