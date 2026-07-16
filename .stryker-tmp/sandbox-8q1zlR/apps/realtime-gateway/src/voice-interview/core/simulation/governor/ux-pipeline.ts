/**
 * governor/ux-pipeline.ts — Perception Composition Governor (P4.1). PURE.
 *
 * Orchestrateur final qui rend l'UX SÛRE et BORNÉE GLOBALEMENT :
 *   base UX (P4) → budget émotionnel → règles de composition → garde-fous → anti-drift
 *
 * Système de CONTRAINTES, pas de comportement : il ne crée aucun effet, il
 * contrôle la composition des effets pour rester « humain plausible ».
 * Aucun impact V2 / simulation core / pipeline décisionnel.
 */
// @ts-nocheck


import type { PerceptionUX } from "../perception-ux.js";
import type { ReactiveMode } from "../persona-reactivity.js";
import {
  type EmotionalBudget,
  createEmotionalBudget,
  costOf,
  spendBudget,
} from "./emotional-budget.js";
import { applyCompositionRules } from "./composition-rules.js";
import {
  type GuardrailState,
  type GlobalUXGuardrails,
  DEFAULT_GUARDRAILS,
  createGuardrailState,
  applyGuardrails,
} from "./guardrails.js";
import {
  type AntiDriftState,
  createAntiDriftState,
  applyAntiDrift,
} from "./anti-drift.js";

/** État persistant du governor (par session). */
export interface GovernorState {
  budget: EmotionalBudget;
  guardrails: GuardrailState;
  antiDrift: AntiDriftState;
}

export function createGovernorState(budgetTotal = 100): GovernorState {
  return {
    budget: createEmotionalBudget(budgetTotal),
    guardrails: createGuardrailState(),
    antiDrift: createAntiDriftState(),
  };
}

export interface GovernedUX {
  ux: PerceptionUX;
  state: GovernorState;
  /** Facteur d'atténuation appliqué par le budget (1 = plein effet). */
  budgetScale: number;
}

/** Atténue les effets forts d'une UX par un facteur (0–1). */
function scaleUX(ux: PerceptionUX, scale: number): PerceptionUX {
  return {
    ...ux,
    interruptionChance: ux.interruptionChance * scale,
    silenceProbability: ux.silenceProbability * scale,
    toneShift: ux.toneShift > 0 ? ux.toneShift * scale : ux.toneShift,
    questionSharpness: ux.questionSharpness * scale + ux.questionSharpness * (1 - scale) * 0.5,
  };
}

/**
 * Gouverne une UX de base pour un tour. Ordre strict :
 *  1. budget émotionnel (atténue si épuisé)
 *  2. règles de composition (anti-contradiction + persona)
 *  3. garde-fous globaux (bornes dures + anti-saut + anti deux extrêmes)
 *  4. anti-drift (attracteurs + amortissement oscillation)
 */
export function governUX(
  baseUX: PerceptionUX,
  personaMode: ReactiveMode,
  state: GovernorState,
  guardrails: GlobalUXGuardrails = DEFAULT_GUARDRAILS,
): GovernedUX {
  // 1) Budget.
  const cost = costOf({
    interruption: baseUX.interruptionChance,
    silence: baseUX.silenceProbability,
    toneShift: baseUX.toneShift,
    sharpness: baseUX.questionSharpness,
  });
  const { budget, scale } = spendBudget(state.budget, cost, {
    interruption: baseUX.interruptionChance,
    silence: baseUX.silenceProbability,
    toneShift: baseUX.toneShift,
    sharpness: baseUX.questionSharpness,
  });
  let ux = scale < 1 ? scaleUX(baseUX, scale) : baseUX;

  // 2) Composition.
  ux = applyCompositionRules(ux, personaMode);

  // 3) Garde-fous.
  const guarded = applyGuardrails(ux, state.guardrails, guardrails);
  ux = guarded.ux;

  // 4) Anti-drift.
  const drifted = applyAntiDrift(ux, state.antiDrift);
  ux = drifted.ux;

  return {
    ux,
    state: { budget, guardrails: guarded.state, antiDrift: drifted.state },
    budgetScale: scale,
  };
}
