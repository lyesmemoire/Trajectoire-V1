// runtime/question-engine/selectors/ObjectiveSelector.ts
import {
  ObjectiveSelectorContext,
} from "./shared/selectorContext";
import { QuestionObjective } from "../QuestionObjective";
import { deepFreeze } from "@core/freeze/deepFreeze";
import { ScoredItem } from "./shared/deterministicSort";
import { toConfidence } from "./shared/confidenceUtils";
import { applyFatiguePolicy } from "../objective-policies/fatiguePolicy";
import { applyContradictionPolicy } from "../objective-policies/contradictionPolicy";
import { applyExplorationPolicy } from "../objective-policies/explorationPolicy";
import { applyRecoveryPolicy } from "../objective-policies/recoveryPolicy";
import { OBJECTIVE_SELECTOR_VERSION } from "../version/objectiveSelectorVersion";
import { SelectorResultEnvelope } from "../../contracts/selectors/SelectorResultEnvelope";
import { breakTieDeterministically } from "./shared/DeterministicTieBreaker";
import { hashObjectStable } from "../../utils/hash";

export function selectObjective(
  ctx: ObjectiveSelectorContext,
): SelectorResultEnvelope<QuestionObjective> {
  const inputHash = hashObjectStable(ctx);
  const startTimestamp = ctx.clock.now();

  const policies = [
    applyFatiguePolicy,
    applyContradictionPolicy,
    applyExplorationPolicy,
    applyRecoveryPolicy,
  ];

  const effects = policies.map((p) => p(ctx));

// Revised handling of effects to avoid mutating the original array
  const sortedEffects = [...effects].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    // Deterministic tie‑break using selector version and effect IDs
    const idA = (a.id ?? JSON.stringify(a)) as string;
    const idB = (b.id ?? JSON.stringify(b)) as string;
    return breakTieDeterministically(
      "objective",
      OBJECTIVE_SELECTOR_VERSION,
      idA,
      idB,
    ).localeCompare(breakTieDeterministically(
      "objective",
      OBJECTIVE_SELECTOR_VERSION,
      idB,
      idA,
    ));
  });

  // Use sortedEffects for subsequent processing
  const forbidden = new Set<QuestionObjective>();
  const scoreMods: Record<string, number> = {};
  const overrides: string[] = [];

  for (const effect of sortedEffects) {
    if (effect.forbiddenObjectives) {
      effect.forbiddenObjectives.forEach((o) => forbidden.add(o));
    }
    if (effect.scoreModifiers) {
      for (const [obj, mod] of Object.entries(effect.scoreModifiers)) {
        scoreMods[obj] = (scoreMods[obj] || 0) + mod;
      }
    }
    if (effect.id) {
      overrides.push(effect.id);
    }
  }

// Build scored candidates from accumulated score modifiers
const scored: ScoredItem<any>[] = Object.entries(scoreMods).map(([obj, raw]) => ({
  item: { objective: obj } as any,
  raw,
  id: obj,
}));

// Rank candidates using copy‑on‑write sort and deterministic tie‑break
const ranked = [...scored].sort((a, b) => {
  if (b.raw !== a.raw) return b.raw - a.raw;
  const hashA = breakTieDeterministically(
    "objective",
    OBJECTIVE_SELECTOR_VERSION,
    a.id,
    inputHash,
  );
  const hashB = breakTieDeterministically(
    "objective",
    OBJECTIVE_SELECTOR_VERSION,
    b.id,
    inputHash,
  );
  return hashA.localeCompare(hashB);
});

// Guard against empty candidate list
if (ranked.length === 0) {
  const emptyEnvelope: SelectorResultEnvelope<QuestionObjective> = {
    value: undefined as unknown as QuestionObjective,
    confidence: 0,
    selectorName: "objective",
    selectorVersion: OBJECTIVE_SELECTOR_VERSION,
    inputHash,
    outputHash: hashObjectStable({ best: undefined, inputHash }),
    executionMetrics: {
      durationMs: 0,
      candidateCount: 0,
      policyCount: overrides.length,
    },
    traceEvents: [],
    deterministicReplayKey: hashObjectStable({ selectorName: "objective", inputHash }),
  };
  return deepFreeze(emptyEnvelope);
}

const best = ranked[0]!;
const minRaw = ranked[ranked.length - 1]!.raw;
const maxRaw = best.raw;
const confidence = maxRaw === minRaw ? 1 : toConfidence(best.raw, minRaw, maxRaw);

const rejected = ranked.slice(1).map((c) => c.item.objective);

  const endTimestamp = ctx.clock.now();

  const outputHash = hashObjectStable({ best, inputHash });

  const envelope: SelectorResultEnvelope<QuestionObjective> = {
    value: best.item.objective as unknown as QuestionObjective,
    confidence,
    selectorName: "objective",
    selectorVersion: OBJECTIVE_SELECTOR_VERSION,
    inputHash,
    outputHash,
    executionMetrics: {
      durationMs: endTimestamp - startTimestamp,
      candidateCount: ranked.length,
      policyCount: overrides.length,
    },
    traceEvents: [],
    deterministicReplayKey: hashObjectStable({ selectorName: "objective", inputHash }),
  };
  return deepFreeze(envelope);
}
