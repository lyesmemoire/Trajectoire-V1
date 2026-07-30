import { track } from "../analytics";

/**
 * Detects suspicious behavioral patterns from navigation logs.
 */
export function analyzeCloningRisk(navEvents: string[], timingEvents: number[], ) {
  // Logic to detect if user is visiting pages too perfectly (Bot signature)
  const isLinear = navEvents.length > 5 && isNavigationTooPerfect(timingEvents);

  if (isLinear) {
    track("cloning_risk_detected", {
      level: "high",
      reason: "LINEAR_NAVIGATION_PATTERN",
    });
    return true;
  }
  return false;
}

function isNavigationTooPerfect(timings: number[]): boolean {
  if (timings.length < 3) return false;
  // Calculate variance in time between clicks
  const diffs = [];
  for (let i = 1; i < timings.length; i++)
    diffs.push((timings[i] ?? 0) - (timings[i - 1] ?? 0));

  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const variance =
    diffs.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / diffs.length;

  return variance < 100; // Human variance is much higher
}
