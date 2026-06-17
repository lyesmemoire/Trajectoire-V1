// runtime/prompts/ObjectiveLayer.ts
/**
 * ObjectiveLayer – frames the interview objective for the LLM.
 * Pure, deterministic, side‑effect free.
 */
import type { PromptLayerResult } from "../types/prompt";

/**
 * Assemble the objective layer content.
 * In a full implementation this would depend on InterviewDecision, phase, etc.
 * Here we provide a deterministic placeholder.
 */
export function assembleObjectiveLayer(): PromptLayerResult {
  const content = `Objective: Evaluate the candidate's technical skills, problem‑solving ability, and communication clarity through targeted questions.`;
  const tokenEstimate = Math.ceil(content.length / 4);
  return {
    name: "OBJECTIVE",
    content,
    tokenEstimate,
  };
}
