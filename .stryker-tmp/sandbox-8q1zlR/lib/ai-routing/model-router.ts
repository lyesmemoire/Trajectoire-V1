// @ts-nocheck
import { mistralModel, mistralSmallModel } from "@/lib/mistral";

export type TaskType =
  | "interruption"
  | "scoring"
  | "replay"
  | "dna_analysis"
  | "coaching";

/**
 * Intelligent Model Router to optimize costs and performance.
 */
export function getModelForTask(task: TaskType) {
  switch (task) {
    case "interruption":
    case "scoring":
      // Speed and cost are priority
      return mistralSmallModel;

    case "dna_analysis":
    case "replay":
    case "coaching":
      // Depth and reasoning are priority
      return mistralModel;

    default:
      return mistralSmallModel;
  }
}

export interface InferenceConfig {
  maxTokens: number;
  temperature: number;
}

export function getConfigForTask(task: TaskType): InferenceConfig {
  const configs: Record<TaskType, InferenceConfig> = {
    interruption: { maxTokens: 50, temperature: 0.1 },
    scoring: { maxTokens: 200, temperature: 0 },
    replay: { maxTokens: 1000, temperature: 0.3 },
    dna_analysis: { maxTokens: 1500, temperature: 0.2 },
    coaching: { maxTokens: 800, temperature: 0.7 },
  };
  return configs[task];
}
