import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult } from "../types";

// Using the recommended model for text tasks
const MODEL_NAME = "gemini-3-flash-preview";

export const generateAudit = async (problem: string): Promise<AuditResult> => {
  // Check for API key existence to provide clear debugging
  // Note: process.env.API_KEY is replaced by Vite at build time based on your configuration
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API Key is missing. Check your environment variables (API_KEY or VITE_API_KEY).");
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
    
    // Provide friendlier error messages for common issues
    if (error.message?.includes("403") || error.message?.includes("API key")) {
      throw new Error("Invalid API Key or Permissions. Please check your API key.");
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