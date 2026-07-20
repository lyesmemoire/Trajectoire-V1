import { createHash } from "crypto";

/**
 * Injects subtle variations in the AI's behavior to prevent easy model fingerprinting.
 * This acts as a "Behavioral Watermark".
 */
export function injectBehavioralVariance(
  basePrompt: string,
  sessionId: string,
): string {
  // Use session ID to generate a stable but unique seed for this interview
  const seed = createHash("md5").update(sessionId).digest("hex");
  const variantIndex = parseInt(seed.substring(0, 2), 16) % 3;

  const variations = [
    "Préfère les phrases courtes et percutantes.",
    "Utilise parfois un ton légèrement plus formel.",
    "N'hésite pas à demander des détails sur la chronologie des faits.",
  ];

  return `${basePrompt}\n[VARIANT_MARKER_${seed.slice(0, 4)}]: ${variations[variantIndex]}`;
}

/**
 * Unified Threat Scoring for sessions.
 */
export function computeSessionThreatScore(signals: {
  cloningRisk: boolean;
  scrapingRisk: boolean;
  rapidNavigation: boolean;
  headlessDetected: boolean;
}): number {
  let score = 0;
  if (signals.headlessDetected) score += 50;
  if (signals.cloningRisk) score += 30;
  if (signals.rapidNavigation) score += 20;
  return Math.min(100, score);
}
