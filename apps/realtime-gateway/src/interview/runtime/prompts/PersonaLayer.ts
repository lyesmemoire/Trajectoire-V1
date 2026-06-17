// runtime/prompts/PersonaLayer.ts
/**
 * PersonaLayer – injects recruiter/personality style.
 * Pure, deterministic, side‑effect free.
 */
import type { PromptLayerResult } from "../types/prompt";

/**
 * Assemble the persona layer.
 * In a real implementation this could use recruiter config, interview mode, JD metadata.
 * For now we return a deterministic placeholder.
 */
export function assemblePersonaLayer(): PromptLayerResult {
  const content = `You speak in a friendly, encouraging tone, and ask clear, concise technical questions. Keep the conversation professional and focused.`;
  const tokenEstimate = Math.ceil(content.length / 4);
  return {
    name: "PERSONA",
    content,
    tokenEstimate,
  };
}
