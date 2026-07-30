/**
 * Propose des comportements de masquage de latence pour humaniser l'attente IA.
 */
export const LATENCY_PHRASES = [
  "Je réfléchis à ce que vous venez de dire...",
  "D'accord, je vois votre point. Laissez-moi analyser...",
  "C'est une perspective intéressante. Hm...",
  "Entendu. Par rapport à cela...",
  "Je prends note de ces précisions...",
];

export function getRandomLatencyPhrase() {
  return LATENCY_PHRASES[Math.floor(Math.random() * LATENCY_PHRASES.length)];
}

/**
 * Détermine si on doit afficher une animation de "Victor réfléchit".
 */
export function shouldShowThinkingState(latencyMs: _number): boolean {
  return latencyMs > 1500;
}
