import { generateText } from "@/lib/openai";

export async function aiCvOptimization(cvContent: string) {
  // Logic is handled in the API route to ensure credits are deducted first
  // This service just encapsulates the prompt logic if needed
  return generateText(`You are an expert CV optimizer. Optimize the following CV content. 
  Rules:
  1. Improve only the 5 most impactful bullet points.
  2. Use strong action verbs.
  3. Do NOT invent experience.
  4. Keep the format clean.
  
  CV Content:
  ${cvContent}`);
}
