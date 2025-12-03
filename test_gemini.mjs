import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY not set in environment.');
  process.exit(2);
}

async function runTest() {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: 'Say: Hello from VitalSync test.' }] }
    });

    console.log('=== AI Test Response ===');
    if (response?.text) console.log(response.text);
    else console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('AI test failed:', err);
    process.exit(3);
  }
}

runTest();
