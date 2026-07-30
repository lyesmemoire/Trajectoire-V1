/**
 * Estime la charge émotionnelle laissée par une session.
 * Plus le score est élevé, plus le système doit ralentir.
 */
export function estimateMentalLoad(session: _unknown): number {
  let load = 0;

  if (session.interruptionCount > 5) load += 30;
  if (session.confidenceDrop > 20) load += 40;
  if (session.averagePauseDuration > 4) load += 20; // Hésitations
  if (session.score < 40) load += 10;

  return Math.min(100, load);
}
