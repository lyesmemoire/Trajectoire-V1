/**
 * core/simulation/simulation-state.ts — État global de simulation (P3.8). PURE.
 *
 * Centralise pression + mémoire + cross-session + évaluation invisible + persona.
 * `updateSimulation` agrège les 5 sous-modules en une transition déterministe.
 *
 * Branchement V2 : le moteur consomme `SimulationState` pour adapter rythme,
 * ton, difficulté et relances — SANS changer l'API V2 (additif).
 */

import {
  type PressureState,
  createPressureState,
  updatePressure,
} from "./pressure.js";
import {
  type MemoryState,
  createMemoryState,
  updateMemory,
  type MemoryUpdate,
} from "./memory.js";
import {
  type CrossSessionState,
  createCrossSessionState,
  type PreviousSession,
} from "./cross-session.js";
import {
  type HiddenEval,
  createHiddenEval,
  updateHiddenEval,
} from "./hidden-eval.js";
import {
  type ReactivePersona,
  createReactivePersona,
  updatePersona,
} from "./persona-reactivity.js";

export interface SimulationState {
  pressure: PressureState;
  memory: MemoryState;
  crossSession: CrossSessionState;
  hiddenEval: HiddenEval;
  persona: ReactivePersona;
  /** Index du tour courant (pour la décroissance mémoire). */
  turn: number;
}

export function createSimulationState(
  previousSessions: PreviousSession[] = [],
): SimulationState {
  return {
    pressure: createPressureState(),
    memory: createMemoryState(),
    crossSession: createCrossSessionState(previousSessions),
    hiddenEval: createHiddenEval(),
    persona: createReactivePersona(),
    turn: 0,
  };
}

/** Signal unifié dérivé d'un tour (perception + évaluation). */
export interface SimulationSignal {
  weakAnswer?: boolean;
  strongAnswer?: boolean;
  strongTechnical?: boolean;
  contradiction?: boolean;
  bluff?: boolean;
  progression?: boolean;
  /** Fait à mémoriser ce tour (optionnel). */
  memoryUpdate?: MemoryUpdate;
}

export function updateSimulation(
  state: SimulationState,
  signal: SimulationSignal,
): SimulationState {
  const turn = state.turn + 1;

  const pressure = updatePressure(state.pressure, {
    ...(signal.weakAnswer !== undefined ? { weakAnswer: signal.weakAnswer } : {}),
    ...(signal.strongAnswer !== undefined ? { strongAnswer: signal.strongAnswer } : {}),
    ...(signal.contradiction !== undefined ? { contradiction: signal.contradiction } : {}),
    ...(signal.bluff !== undefined ? { bluff: signal.bluff } : {}),
  });

  const memory = updateMemory(state.memory, turn, signal.memoryUpdate);

  const hiddenEval = updateHiddenEval(state.hiddenEval, {
    ...(signal.contradiction !== undefined ? { contradiction: signal.contradiction } : {}),
    ...(signal.bluff !== undefined ? { bluff: signal.bluff } : {}),
    ...(signal.strongTechnical !== undefined
      ? { strongStructuredAnswer: signal.strongTechnical }
      : {}),
    ...(signal.progression !== undefined ? { progression: signal.progression } : {}),
  });

  const persona = updatePersona(
    state.persona,
    {
      ...(signal.bluff !== undefined ? { bluff: signal.bluff } : {}),
      ...(signal.weakAnswer !== undefined ? { weakAnswer: signal.weakAnswer } : {}),
      ...(signal.strongTechnical !== undefined ? { strongTechnical: signal.strongTechnical } : {}),
      ...(signal.contradiction !== undefined ? { contradiction: signal.contradiction } : {}),
    },
    hiddenEval,
  );

  return {
    pressure,
    memory,
    crossSession: state.crossSession,
    hiddenEval,
    persona,
    turn,
  };
}
