// runtime/prompts/SystemLayer.ts
/**
 * SystemLayer – static framing for the recruiter/system.
 * Pure, deterministic, side‑effect free.
 */
import type { PromptLayerResult } from "../types/prompt";

/**
 * Assemble the system layer content.
 * In a real product this would pull recruiter/company info from config.
 * Here we use a deterministic placeholder.
 */
export function assembleSystemLayer(): PromptLayerResult {
  const content = `You are a senior recruiter conducting a real‑time technical interview. Follow the interview guidelines and maintain professionalism.`;
  const tokenEstimate = Math.ceil(content.length / 4); // deterministic heuristic
  return {
    name: "SYSTEM",
    content,
    tokenEstimate,
  };
}
