import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

// Using the recommended model for text tasks
const MODEL_NAME = "gemini-3-flash-preview";

export const generateAudit = async (problem: string): Promise<AuditResult> => {
  // ROBUST KEY CHECKING:
  // 1. Try the standard Node/Build injected key (process.env.API_KEY)
  // 2. Try the Vite-specific Client key (import.meta.env.VITE_API_KEY)
  // This "Double Check" fixes most Vercel deployment issues.
  let apiKey = process.env.API_KEY;
  
  // Fallback for Vite/Vercel if the process.env injection missed
  if (!apiKey || apiKey.length === 0) {
    // @ts-ignore - ignoring typescript warning for import.meta in some configs
    apiKey = import.meta.env.VITE_API_KEY;
  }
  
  // Debug logging to help you (Check your browser console with F12)
  if (apiKey) {
     console.log(`Gemini API: Key found (starts with ${apiKey.substring(0, 4)}...)`);
  } else {
     console.error("Gemini API: Key is completely MISSING in both process.env and import.meta.env");
  }
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API Key is missing. Please check Vercel > Settings > Environment Variables. Ensure it is named 'VITE_API_KEY'. Then Redeploy.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `User Problem: "${problem}"
      
      Task:
      1. Analyze "Financial Impact". 
         - IF the user input contains specific numbers (revenue, costs, etc.), calculate a realistic "Annualized Profit Bleed" in dollars.
         - IF NO numbers are provided, provide a short, punchy qualitative assessment (e.g., "High Risk: Margin Erosion", "Critical: Cash Flow Stagnation"). DO NOT invent a dollar amount or a hypothetical revenue baseline.
      2. Provide a 3-step "Triage Plan" using professional, high-level financial terms.
      
      Format the response strictly as JSON.`,
      config: {
        systemInstruction: "You are a decisive, high-end CFO and Business Strategy Consultant for Small and Medium Businesses (SMBs). Your tone is direct, professional, and focuses on ROI and cash flow. Analyze the business problem provided and offer strategic financial advice.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bleed_estimate: {
              type: Type.STRING,
              description: "The estimated dollar amount OR qualitative impact assessment.",
            },
            triage_plan: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "A list of 3 strategic steps to fix the issue.",
            },
          },
          required: ["bleed_estimate", "triage_plan"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. Please try again.");
    }

    // Defensive parsing: remove potential markdown code blocks if the model includes them
    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanText) as AuditResult;
    } catch (parseError) {
      console.error("JSON Parse Error:", cleanText);
      throw new Error("Failed to parse the AI analysis. Please try again.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide friendlier error messages
    if (error.message?.includes("403") || error.message?.includes("API key")) {
      throw new Error("Invalid API Key. The key exists but Google rejected it. Check if the key is active in Google AI Studio.");
    }
    if (error.message?.includes("429")) {
      throw new Error("System is busy (Quota Exceeded). Please try again in a minute.");
    }
    if (error.message?.includes("404")) {
        throw new Error("Model not found. Check if the model name is correct.");
    }
    
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
};