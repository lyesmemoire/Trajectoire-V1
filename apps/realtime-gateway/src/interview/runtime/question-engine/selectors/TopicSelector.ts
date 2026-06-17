// runtime/question-engine/selectors/TopicSelector.ts
/**
 * TopicSelector – deterministic selection of the next interview topic.
 */
import type { TopicGraphSnapshot } from "../../types/graph";
import type { PromptBudgetResult } from "../../types/prompt";
import { computePriorityScore } from "../scoring/computePriorityScore";
import { computeNoveltyScore } from "../scoring/computeNoveltyScore";
import { computeCoverageScore } from "../scoring/computeCoverageScore";
import { computeFatigueScore } from "../scoring/computeFatigueScore";
import { computeContradictionPenalty } from "../scoring/computeContradictionPenalty";
import { toConfidence } from "./shared/confidenceUtils";
import { deepFreeze } from "../../utils/deepFreeze";
import { BaseSelectorContext, TopicSelectorContext, withContext } from "./shared/selectorContext";
import { TOPIC_SELECTOR_VERSION } from "../version/topicSelectorVersion";
import { ScoredItem } from "./shared/deterministicSort.js";
import { SelectorResultEnvelope } from "../../contracts/selectors/SelectorResultEnvelope";
import { buildSelectorEnvelope } from "../../contracts/selectors/buildSelectorEnvelope";
import { breakTieDeterministically } from "./shared/DeterministicTieBreaker";
import { hashObjectStable } from "../../utils/hash";

export interface TopicSelectorConfig {
  explorationFactor: number;
}

export function selectTopic(
  ctx: BaseSelectorContext,
  snapshot: TopicGraphSnapshot,
  budgetResult: PromptBudgetResult,
  config: TopicSelectorConfig,
): SelectorResultEnvelope<TopicSelectorContext> {
  const inputHash = hashObjectStable(ctx);
  const startTimestamp = ctx.clock.now();

  const eligible = snapshot.nodes.filter((n: any) => n.saturationScore < 1);

  const scored: ScoredItem<string>[] = eligible.map((node: any) => {
    const priority = computePriorityScore({ node, snapshot, budgetResult });
    const novelty = computeNoveltyScore({ node, snapshot, budgetResult });
    const coverage = computeCoverageScore({ node, snapshot, budgetResult });
    const fatigue = computeFatigueScore({ node, snapshot, budgetResult });
    const contradiction = computeContradictionPenalty({
      node,
      snapshot,
      budgetResult,
    });

    const raw =
      priority +
      coverage -
      fatigue -
      contradiction +
      config.explorationFactor * novelty;
    return { item: node.id, raw, id: node.id };
  });

  const sorted = [...scored].sort((a, b) => {
    if (b.raw !== a.raw) return b.raw - a.raw;
    const hashA = breakTieDeterministically(
      "topic",
      TOPIC_SELECTOR_VERSION,
      a.id,
      inputHash,
    );
    const hashB = breakTieDeterministically(
      "topic",
      TOPIC_SELECTOR_VERSION,
      b.id,
      inputHash,
    );
    return hashA.localeCompare(hashB);
  });

  if (sorted.length === 0) {
    throw new Error("TopicSelector: no eligible topics found");
  }

  const best = sorted[0]!;
  const minRaw = sorted[sorted.length - 1]!.raw;
  const maxRaw = best.raw;
  const confidence =
    maxRaw === minRaw ? 1 : toConfidence(best.raw, minRaw, maxRaw);

  const chosenId = best.item;
  const rejectedIds = scored.slice(1).map((s) => s.item);

  // Build output context matching canonical envelope
  const outputContext = withContext<TopicSelectorContext>(ctx, {
    selectedTopicId: chosenId,
    topicConfidence: confidence,
  });

  // Simple deterministic trace event
  const traceEvent = {
    type: "TOPIC_SELECTION",
    timestamp: startTimestamp,
    data: { chosenId, confidence },
  };

  const endTimestamp = ctx.clock.now();

  const envelope = buildSelectorEnvelope({
    selectorName: "topic",
    selectorVersion: TOPIC_SELECTOR_VERSION,
    rawResult: outputContext,
    confidence,
    inputHash,
    metrics: {
      durationMs: endTimestamp - startTimestamp,
      candidateCount: scored.length,
      policyCount: 0,
    },
    traceEvents: [traceEvent as any],
  });
  return deepFreeze(envelope);
}
