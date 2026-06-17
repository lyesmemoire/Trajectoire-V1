/**
 * core/simulation/memory.ts — Mémoire imparfaite du recruteur (P3.8). PURE, déterministe.
 *
 * Simule un humain : décroissance de confiance, renforcement sur signaux forts,
 * fixation cognitive sur les contradictions, rappel biaisé.
 */

export interface MemoryFact {
  value: string;
  confidence: number; // 0–1
  lastSeen: number; // index de tour
}

export interface MemoryState {
  facts: Record<string, MemoryFact>;
}

export function createMemoryState(): MemoryState {
  return { facts: {} };
}

const DECAY = 0.05;

export interface MemoryUpdate {
  key: string;
  value: string;
  strongSignal?: boolean;
  contradiction?: boolean;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Met à jour la mémoire pour un tour : décroissance globale + renforcement
 * du fait observé. `turn` = index courant.
 */
export function updateMemory(
  state: MemoryState,
  turn: number,
  update?: MemoryUpdate,
): MemoryState {
  const facts: Record<string, MemoryFact> = {};
  // Décroissance de tous les faits existants.
  for (const [k, f] of Object.entries(state.facts)) {
    facts[k] = { ...f, confidence: clamp01(f.confidence - DECAY) };
  }
  // Renforcement du fait courant.
  if (update) {
    const prev = facts[update.key];
    let confidence = prev ? prev.confidence : 0.5;
    if (update.strongSignal) confidence += 0.2;
    if (update.contradiction) confidence += 0.3; // fixation cognitive
    facts[update.key] = {
      value: update.value,
      confidence: clamp01(confidence),
      lastSeen: turn,
    };
  }
  return { facts };
}

export type RecallResult =
  | { status: "forgotten" }
  | { status: "approximate"; value: string }
  | { status: "exact"; value: string };

/** Rappel biaisé selon la confiance. */
export function recall(state: MemoryState, key: string): RecallResult {
  const f = state.facts[key];
  if (!f || f.confidence < 0.3) return { status: "forgotten" };
  if (f.confidence < 0.6) return { status: "approximate", value: f.value };
  return { status: "exact", value: f.value };
}
