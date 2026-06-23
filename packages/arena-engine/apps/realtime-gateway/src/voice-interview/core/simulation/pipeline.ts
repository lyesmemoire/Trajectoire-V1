/**
 * core/simulation/pipeline.ts — Pipeline d'entretien (P3.10). PURE.
 *
 * Orchestrateur EXPLICITE : V2 (décision) → Simulation (comportement) → sortie.
 *
 * Verrouillage architectural :
 *  - V2 est PUR : il ne connaît pas la simulation (aucun import inverse).
 *  - La simulation est EXTERNE : son état vit ici, pas dans l'état V2.
 *  - L'integration ne décide jamais de question : elle façonne la sortie.
 *
 * Contrat figé : SimulationContract { input: V2Decision, state, output }.
 */

import {
  initInterviewV2,
  nextV2Step,
  type InterviewStateV2,
  type InitV2Input,
  type NextV2Result,
} from "../v2/interview-engine-v2.js";
import {
  type SimulationState,
  createSimulationState,
  updateSimulation,
} from "./simulation-state.js";
import {
  deriveSignal,
  buildSimulationContext,
  applySimulationToQuestion,
  applyOpeningContext,
  type SimulationContext,
} from "./integration.js";
import type { PreviousSession } from "./cross-session.js";
import {
  deriveRecruiterMind,
  personaFromMind,
  type RecruiterMindState,
} from "./recruiter-mind.js";
import { perceiveUX, type PerceptionUX } from "./perception-ux.js";
// P4.1 : Emotional UX Control System (contraintes globales sur l'UX).
import {
  type GovernorState,
  createGovernorState,
  governUX,
} from "./governor/index.js";

/** Décision brute issue de V2 (entrée du contrat de simulation). */
export interface V2Decision {
  question: string;
  evaluationScore: number;
  specificity: number;
  bluffProbability: number;
  hasContradiction: boolean;
  isTechnical: boolean;
  previousScore?: number;
}

/** Contrat figé entre V2 et la simulation (P3.10). */
export interface SimulationContract {
  input: V2Decision;
  state: SimulationState;
  output: SimulationContext;
}

/** État global du pipeline (V2 pur + simulation externe). */
export interface PipelineState {
  v2: InterviewStateV2;
  simulation: SimulationState;
  /** État du gouverneur UX (P4.1) : budget + garde-fous + anti-drift. */
  governor: GovernorState;
}

/** Sortie d'un tour du pipeline (façonnée). */
export interface PipelineTurn {
  question: string;
  state: PipelineState;
  /** Résultat V2 brut (score, signaux, contradiction, rapport final…). */
  v2: NextV2Result;
  context: SimulationContext;
  /** État mental unifié du recruteur (P3.11). */
  mind: RecruiterMindState;
  /** Paramètres de mise en scène UX (P4) dérivés du mind. */
  ux: PerceptionUX;
}

export interface PipelineInitInput extends InitV2Input {
  previousSessions?: PreviousSession[];
}

/** Extrait la décision V2 sous la forme du contrat (sans coupler V2). */
function toV2Decision(
  question: string,
  r: NextV2Result,
  isTechnical: boolean,
  previousScore?: number,
): V2Decision {
  return {
    question,
    evaluationScore: r.evaluationScore,
    specificity: r.signals.specificity,
    bluffProbability: r.bluff.bluffProbability,
    hasContradiction: !!r.contradiction,
    isTechnical,
    ...(previousScore !== undefined ? { previousScore } : {}),
  };
}

/** Initialise le pipeline : V2 (pur) + simulation (externe) + hook d'ouverture. */
export function initInterviewPipeline(input: PipelineInitInput): {
  question: string;
  state: PipelineState;
} {
  const { state: v2, question } = initInterviewV2(input);
  const simulation = createSimulationState(input.previousSessions ?? []);
  const ctx = buildSimulationContext(simulation, { opening: true });
  return {
    question: applyOpeningContext(question, ctx),
    state: { v2, simulation, governor: createGovernorState() },
  };
}

/**
 * Exécute UN tour : V2 décide, la simulation se met à jour, la sortie est façonnée.
 * V2 reste totalement inconscient de la simulation.
 */
export function runInterviewPipeline(
  state: PipelineState,
  transcript: string,
): PipelineTurn {
  // 1) V2 décide (pur).
  const v2 = nextV2Step(state.v2, transcript);

  // 2) Construit la décision contractuelle (depuis la sortie V2 publique).
  const isTechnical = state.v2.phase === "technical";
  const previousScore =
    state.v2.answered.length > 0
      ? state.v2.answered[state.v2.answered.length - 1]!.score
      : undefined;
  const decision = toV2Decision(v2.question, v2, isTechnical, previousScore);

  // 3) Simulation : met à jour l'état + façonne la sortie.
  const simulation = updateSimulation(
    state.simulation,
    deriveSignal({
      score: decision.evaluationScore,
      specificity: decision.specificity,
      bluffProbability: decision.bluffProbability,
      hasContradiction: decision.hasContradiction,
      isTechnical: decision.isTechnical,
      ...(decision.previousScore !== undefined
        ? { previousScore: decision.previousScore }
        : {}),
    }),
  );
  const context = buildSimulationContext(simulation);
  const question = v2.finished
    ? v2.question
    : applySimulationToQuestion(v2.question, context);

  // P3.11 : état mental unifié dérivé (vue d'agent cohérent).
  const mind = deriveRecruiterMind(simulation);
  // P4 : projection perceptive brute (mise en scène UX), pure dérivation du mind.
  const baseUX = perceiveUX(mind);
  // P4.1 : gouvernance UX (budget + composition + garde-fous + anti-drift).
  const governed = governUX(baseUX, personaFromMind(mind), state.governor);

  return {
    question,
    state: {
      v2: v2.updatedState,
      simulation,
      governor: governed.state,
    },
    v2,
    context,
    mind,
    ux: governed.ux,
  };
}
