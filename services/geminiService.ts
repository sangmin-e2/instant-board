
import { GoogleGenAI } from "@google/genai";

// API 키가 있을 때만 클라이언트 초기화 (지연 초기화)
let ai: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI | null => {
  if (ai) return ai;
  
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API key is not set. AI improvement feature will be disabled.');
    return null;
  }
  
  try {
    ai = new GoogleGenAI({ apiKey });
    return ai;
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    return null;
  }
};

export const getSmartImprovement = async (text: string): Promise<string> => {
  const aiClient = getAI();
  
  // API 키가 없으면 원본 텍스트 반환
  if (!aiClient) {
    console.warn('Gemini API is not available. Returning original text.');
    return text;
  }
  
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve and polish the following note text for a digital pinboard. Keep it concise but make it sound more professional or engaging: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};
