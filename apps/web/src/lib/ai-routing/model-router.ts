import {
  getFastAIModel,
  getReasoningAIModel,
} from "@/lib/ai/ai-models";
import type { LanguageModel } from "ai";

export type TaskType =
  | "interruption"
  | "scoring"
  | "replay"
  | "dna_analysis"
  | "coaching";

/**
 * Intelligent model router.
 *
 * Business code selects a capability/tier rather than a vendor.
 * Provider selection is delegated to the central AI gateway.
 */
export function getModelForTask(task: TaskType): LanguageModel {
  switch (task) {
    case "interruption":
    case "scoring":
      return getFastAIModel();

    case "dna_analysis":
    case "replay":
    case "coaching":
      return getReasoningAIModel();

    default:
      return getFastAIModel();
  }
}

export interface InferenceConfig {
  maxTokens: number;
  temperature: number;
}

export function getConfigForTask(task: TaskType): InferenceConfig {
  const configs: Record<TaskType, InferenceConfig> = {
    interruption: {
      maxTokens: 50,
      temperature: 0.1,
    },
    scoring: {
      maxTokens: 200,
      temperature: 0,
    },
    replay: {
      maxTokens: 1000,
      temperature: 0.3,
    },
    dna_analysis: {
      maxTokens: 1500,
      temperature: 0.2,
    },
    coaching: {
      maxTokens: 800,
      temperature: 0.7,
    },
  };

  return configs[task];
}