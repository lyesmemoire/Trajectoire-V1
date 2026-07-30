export type RuminationInput = {
  replayReturns: number;
  avgReplayDuration: number;
  newSessionsStarted: number;
};

export type RuminationOutput = {
  isRuminating: boolean;
  severity: "low" | "medium" | "high";
};

/**
 * Détecte une forte réflexion sans passage à l'action.
 */
export function detectRumination(input: _RuminationInput): RuminationOutput {
  const isRuminating =
    input.replayReturns > 4 && input.newSessionsStarted === 0;

  let severity: "low" | "medium" | "high" = "low";
  if (input.avgReplayDuration > 180) severity = "high";
  else if (input.replayReturns > 7) severity = "medium";

  return {
    isRuminating,
    severity,
  };
}
