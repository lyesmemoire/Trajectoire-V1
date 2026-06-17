import type { DifficultyLevel } from "../DifficultyLevel";
import { toConfidence } from "./shared/confidenceUtils";
import { deepFreeze } from "@core/freeze/deepFreeze";
import { DEFAULT_SELECTOR_WEIGHTS } from "./shared/selectorWeights";
import { PHASE_DIFFICULTY_CEILINGS, OVERLOAD_THRESHOLDS, DIFFICULTY_RANK, rankToDifficulty } from "../policies/difficultyPolicies";
import type { TopicSelectorContext } from "./shared/selectorContext";
import { DIFFICULTY_SELECTOR_VERSION } from "../version/difficultySelectorVersion";
import { buildSelectorEnvelope } from "../../contracts/selectors/buildSelectorEnvelope";
import type { SelectorResultEnvelope } from "../../contracts/selectors/SelectorResultEnvelope";
import { hashObjectStable } from "../../utils/hash";


export interface DifficultySelectorConfig {
  maxTimeMs?: number;
  weights?: Partial<typeof DEFAULT_SELECTOR_WEIGHTS>;
}

function computeTransitionPenalty(prevRank: number, newRank: number): number {
  const diff = Math.abs(newRank - prevRank);
  return diff > 1 ? -1 : 0;
}

export function selectDifficulty(
  ctx: TopicSelectorContext & { previousDifficulty?: DifficultyLevel },
  config?: DifficultySelectorConfig,
): SelectorResultEnvelope<DifficultyLevel> {
  const inputHash = hashObjectStable({ ctx, config });
  const startTimestamp = ctx.clock.now();

const weights = { ...DEFAULT_SELECTOR_WEIGHTS, ...(config?.weights ?? {}) };

  const hesitationScore = ctx.signals.get("hesitation");
  const communicationConfidence = ctx.signals.get("confidence");
  const contradictionDensity = ctx.signals.get("contradiction");
  const fatigueScore = ctx.signals.get("fatigue");

  // Approximate momentum for now
  const momentum = 0.5;

  const rawScores: Record<string, number> = {
    topicConfidence: ctx.topicConfidence * (weights.topicConfidenceWeight ?? 1),
    hesitation: -hesitationScore * (weights.hesitationWeight ?? 1),
    communication: communicationConfidence * (weights.communicationWeight ?? 1),
    contradiction: -contradictionDensity * (weights.contradictionWeight ?? 1),
    fatigue: -fatigueScore * (weights.fatigueWeight ?? 1),
    momentum: momentum * (weights.momentumWeight ?? 1),
    timePressure:
      (1 - ctx.remainingTimeMs / (config?.maxTimeMs ?? 600_000)) *
      (weights.timePressureWeight ?? 1),
  };

  const prevRank = ctx.previousDifficulty
    ? DIFFICULTY_RANK[ctx.previousDifficulty as DifficultyLevel]
    : 0;
  rawScores.previousDifficultyMomentum =
    prevRank * (weights.difficultyMomentumWeight ?? 1);

  const rawAggregate = Object.values(rawScores).reduce((a, b) => a + b, 0);
  const aggregateRaw = Number.isFinite(rawAggregate) ? rawAggregate : -Infinity;
  const rankThresholds = {
    introductory: -Infinity,
    intermediate: -0.5,
    advanced: 0.5,
    expert: 1.5,
  } as const;

  let tentativeRank = 0;
  if (aggregateRaw >= rankThresholds.expert) tentativeRank = 3;
  else if (aggregateRaw >= rankThresholds.advanced) tentativeRank = 2;
  else if (aggregateRaw >= rankThresholds.intermediate) tentativeRank = 1;

  const transitionPenalty = ctx.previousDifficulty
    ? computeTransitionPenalty(prevRank, tentativeRank)
    : 0;
  const adjustedRaw = aggregateRaw + transitionPenalty;

  if (adjustedRaw >= rankThresholds.expert) tentativeRank = 3;
  else if (adjustedRaw >= rankThresholds.advanced) tentativeRank = 2;
  else if (adjustedRaw >= rankThresholds.intermediate) tentativeRank = 1;
  else tentativeRank = 0;

  if (
    fatigueScore > OVERLOAD_THRESHOLDS.fatigue ||
    contradictionDensity > OVERLOAD_THRESHOLDS.contradiction
  ) {
    tentativeRank = Math.min(tentativeRank, 1);
  }

  const ceilingDifficulty =
    PHASE_DIFFICULTY_CEILINGS[ctx.interviewPhase] ?? "expert";
  const ceilingRank = DIFFICULTY_RANK[ceilingDifficulty];
  tentativeRank = Math.min(tentativeRank, ceilingRank);

  const selectedDifficulty = rankToDifficulty(tentativeRank);
  const confidence = toConfidence(adjustedRaw, -2, 2);

  const endTimestamp = ctx.clock.now();

  const traceEvent = deepFreeze({
    selector: "difficulty",
    selectorVersion: DIFFICULTY_SELECTOR_VERSION,
    chosen: selectedDifficulty,
    rejected: [],
    reasons: [
      `DifficultySelector (raw=${adjustedRaw.toFixed(2)}, rank=${tentativeRank})`,
    ],
    timestamp: startTimestamp,
  });



  return buildSelectorEnvelope({
    selectorName: "difficulty",
    selectorVersion: DIFFICULTY_SELECTOR_VERSION,
    rawResult: selectedDifficulty,
    confidence,
    inputHash,
    metrics: {
      durationMs: endTimestamp - startTimestamp,
      policyCount: 0,
    },
    traceEvents: [traceEvent as any],
  });
}
