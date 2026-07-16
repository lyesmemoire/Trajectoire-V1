/**
 * Emotional Safety Layer: Prevents AI from crossing ethical boundaries
 * or inflicting psychological harm under pressure.
 */
// @ts-nocheck


export interface SafetyCheck {
  isSafe: boolean;
  reason?: string;
  adjustment?: string;
}

const FORBIDDEN_TONES = [
  /humili/gi,
  /insult/gi,
  /idiot/gi,
  /stupide/gi,
  /incapable/gi,
  /échec total/gi,
];

/**
 * Validates Victor's response before it reaches the user.
 */
export function validateAiResponse(
  response: string,
  pressureLevel: number,
): SafetyCheck {
  // 1. Check for toxic vocabulary
  if (FORBIDDEN_TONES.some((pattern) => pattern.test(response))) {
    return {
      isSafe: false,
      reason: "TOXIC_TONE_DETECTED",
      adjustment: "Reformulez avec exigence mais respect professionnel.",
    };
  }

  // 2. Prevent over-escalation (Don't crush the user)
  if (pressureLevel > 90 && response.length > 500) {
    return {
      isSafe: true, // Not dangerous, but suboptimal
      adjustment: "Soyez bref. La pression doit être concise.",
    };
  }

  return { isSafe: true };
}

/**
 * Ensures Replay advice remains constructive.
 */
export function sanitizeReplayCoaching(advice: string): string {
  // Replace negative psychological labels with action-oriented career terms
  return advice
    .replace(/anxiété/gi, "gestion du stress")
    .replace(/panique/gi, "moment de tension")
    .replace(/mauvais/gi, "axe de progression");
}
