import { GoogleGenAI, Type } from "@google/genai";
import { AuditResult, AuditData } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

// Helper to reliably get the API Key in various environments (Local vs Vercel)
const getApiKey = (): string => {
  // 1. Try the standard process.env (populated by vite.config.ts define)
  if (typeof process !== "undefined" && process.env?.API_KEY) {
    return process.env.API_KEY;
  }
  
  // 2. Fallback to Vite's native environment variable object
  // Vercel automatically injects VITE_ variables here.
  try {
    // @ts-ignore
    if (import.meta.env?.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore error if import.meta is not defined
  }

  return "";
};

export const generateAudit = async (data: AuditData | string): Promise<AuditResult> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("Gemini API Error: API Key is missing.");
    throw new Error("System configuration error: API Key is missing. Please check your Vercel settings (VITE_API_KEY).");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  let promptContext = "";

  if (typeof data === "string") {
    // Handling simple text input (e.g. from ProfitLeakDetector)
    promptContext = `
      Analyze this specific business financial pain point:
      "${data}"
      
      Task:
      1. Analyze "Financial Health & Risk". Estimate a qualitative "Profit Bleed" or "Efficiency Loss" caused by this issue.
      2. Provide a 3-step "Triage Plan" to address this specific issue.
      
      Format the response strictly as JSON.
    `;
  } else {
    // Construct a detailed prompt based on the collected form data (e.g. from BusinessAudit)
    promptContext = `
      Analyze this business profile for a financial audit:
      - Business Name: ${data.businessName}
      - Industry: ${data.industry}
      - Monthly Revenue: ${data.revenue}
      - Employee Count: ${data.employees}
      - Current Accounting Setup: ${data.accountingSetup}
      - Reported Pain Points: ${data.painPoints.join(", ")}
      - Specific Issues: "${data.customPain}"
      
      Task:
      1. Analyze "Financial Health & Risk".
         - Based on their Revenue of ${data.revenue} and Accounting Setup (${data.accountingSetup}), assess the maturity gap. (e.g., if they are doing $500k/mo on Excel, that is a critical risk).
         - If they provided specific pain points, estimate a qualitative or quantitative "Profit Bleed" or "Efficiency Loss".
      2. Provide a 3-step "Triage Plan".
         - Step 1 should be an immediate fix based on their setup.
         - Step 2 should be a strategic move appropriate for their industry (${data.industry}).
         - Step 3 should be a growth enabler.
      
      Format the response strictly as JSON.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: promptContext,
      config: {
        systemInstruction: "You are a decisive, high-end CFO and Business Strategy Consultant for SMBs named IronClad. Your tone is direct, professional, and focuses on ROI, cash flow, and scalable infrastructure. You are analyzing a lead's business data to provide a hook for a deeper consultation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bleed_estimate: {
              type: Type.STRING,
              description: "A short, punchy assessment of their risk level or financial leak (e.g., 'Critical Risk: Data Silos causing ~15% margin erosion').",
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

    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanText) as AuditResult;
    } catch (parseError) {
      console.error("JSON Parse Error:", cleanText);
      throw new Error("Failed to parse the AI analysis. Please try again.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message?.includes("403") || error.message?.includes("API key")) {
      throw new Error("Service configuration error. Please contact support.");
    }
    if (error.message?.includes("429")) {
      throw new Error("System is busy (Quota Exceeded). Please try again in a minute.");
    }
    
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
};