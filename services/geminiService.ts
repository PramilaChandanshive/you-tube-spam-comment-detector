import { GoogleGenAI, Type } from "@google/genai";
import { CommentAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeComment = async (text: string): Promise<CommentAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following YouTube comment for spam, scams, or malicious intent: "${text}"`,
      config: {
        systemInstruction: "You are an expert YouTube comment moderator. Detect common spam patterns: 'sub4sub', telegram links, crypto scams, repetitive promotional text, or bot-like behavior. Return findings in structured JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSpam: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
            category: { 
              type: Type.STRING, 
              enum: ['Spam', 'Scam', 'Self-Promotion', 'Bot', 'Safe'] 
            },
            reason: { type: Type.STRING }
          },
          required: ["isSpam", "confidence", "category", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      id: Math.random().toString(36).substr(2, 9),
      text,
      ...result
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

/**
 * Simulates fetching comments from a YouTube URL by generating realistic examples using Gemini.
 */
export const fetchAndAnalyzeFromUrl = async (url: string): Promise<CommentAnalysis[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 6 realistic YouTube comments that might appear on a video at this URL: ${url}. 
                 Include a variety: 2 safe/genuine comments, 1 obvious crypto scam with telegram link, 
                 1 'sub4sub' request, 1 generic bot-like praise, and 1 sophisticated self-promotion. 
                 Then analyze each of them.`,
      config: {
        systemInstruction: "Act as a YouTube data simulator. Generate a list of comments and their spam analysis. Ensure the comments look like real internet users (slang, typos, etc.).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              isSpam: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              category: { 
                type: Type.STRING, 
                enum: ['Spam', 'Scam', 'Self-Promotion', 'Bot', 'Safe'] 
              },
              reason: { type: Type.STRING }
            },
            required: ["text", "isSpam", "confidence", "category", "reason"]
          }
        }
      }
    });

    const rawResults = JSON.parse(response.text || "[]");
    return rawResults.map((r: any) => ({
      ...r,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error("Gemini URL Simulation Error:", error);
    throw error;
  }
};

/**
 * Simulates polling for a few new comments for live monitoring.
 */
export const fetchRecentComments = async (url: string): Promise<CommentAnalysis[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 1-2 new incoming comments for this YouTube video: ${url}. 
                 Occasionally make one a spam comment (30% chance). Analyze them.`,
      config: {
        systemInstruction: "You are a real-time YouTube comment feed simulator. Provide 1 or 2 new comments that just arrived.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              isSpam: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              category: { 
                type: Type.STRING, 
                enum: ['Spam', 'Scam', 'Self-Promotion', 'Bot', 'Safe'] 
              },
              reason: { type: Type.STRING }
            },
            required: ["text", "isSpam", "confidence", "category", "reason"]
          }
        }
      }
    });

    const rawResults = JSON.parse(response.text || "[]");
    return rawResults.map((r: any) => ({
      ...r,
      id: Math.random().toString(36).substr(2, 9)
    }));
  } catch (error) {
    console.error("Gemini Live Polling Error:", error);
    return [];
  }
};
