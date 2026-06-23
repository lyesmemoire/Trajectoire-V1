import {
  BEHAVIOR_FRAGMENTS,
  PRESSURE_FRAGMENTS,
  SCORING_CRITERIA,
} from "../fragments/behavior";
import { PromptIntegrity } from "../integrity";

export const PROMPT_ENGINE_VERSION = "2.4.0";

export interface PromptAssemblyResult {
  text: string;
  fingerprint: string;
  metadata: {
    version: string;
    fragments: string[];
  };
}

/**
 * Moteur d'assemblage dynamique des prompts avec couche d'intégrité.
 */
export function assemblePrompt(config: {
  persona: "stress" | "faang" | "supportive";
  pressure: "low" | "high";
  phase: "intro" | "deep_dive" | "closing";
}): PromptAssemblyResult {
  const fragments: string[] = [];

  // 1. Base Comportementale
  if (config.persona === "stress") fragments.push("SKEPTIC");
  else if (config.persona === "supportive") fragments.push("EMPATHIC");
  else fragments.push("DIRECT");

  // 2. Injection de la Pression
  if (config.pressure === "high") fragments.push("HIGH_PRESSURE");
  else fragments.push("LOW_PRESSURE");

  // 3. Critères de scoring
  if (config.phase === "deep_dive") fragments.push("METRICS_FOCUS");
  else fragments.push("STAR_METHOD");

  const textParts = [
    config.persona === "stress"
      ? BEHAVIOR_FRAGMENTS.SKEPTIC
      : config.persona === "supportive"
        ? BEHAVIOR_FRAGMENTS.EMPATHIC
        : BEHAVIOR_FRAGMENTS.DIRECT,

    config.pressure === "high"
      ? PRESSURE_FRAGMENTS.HIGH
      : PRESSURE_FRAGMENTS.LOW,

    config.phase === "deep_dive"
      ? SCORING_CRITERIA.METRICS
      : SCORING_CRITERIA.STAR,
  ];

  // Randomisation contrôlée pour casser les signatures de scrapers
  const variations = [
    "Soyez bref.",
    "Répondez directement.",
    "Pas de fioritures.",
  ];
  textParts.push(variations[Math.floor(Math.random() * variations.length)]!);

  const finalPrompt = textParts.join(" ");

  return {
    text: finalPrompt,
    fingerprint: PromptIntegrity.generateFingerprint(finalPrompt),
    metadata: {
      version: PROMPT_ENGINE_VERSION,
      fragments,
    },
  };
}
