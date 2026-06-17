// runtime/prompts/ContextLayer.ts
/**
 * ContextLayer – builds the contextual part of the prompt from the budgeted result.
 * Pure, deterministic, side‑effect free.
 *
 * It receives a PromptBudgetResult (produced by PromptBudgetManager) and
 * deterministically formats memory entries and topic nodes.
 */
import type { PromptLayerResult, PromptBudgetResult } from "../types/prompt";

/**
 * Helper to create a deterministic string representation of a memory entry.
 * Adjust as needed – for now we assume a MemoryEntry has `question` and `answer`.
 */ function formatMemoryEntry(entry: any): string {
  const q = entry.question ?? "";
  const a = entry.answer ?? "";
  return `Q: ${q}\nA: ${a}`;
}

/**
 * Helper to create a deterministic string representation of a topic node.
 * We assume a TopicNode has `topic`, `priority`, and optional `interestScore`.
 */ function formatTopicNode(node: any): string {
  const t = node.topic ?? "";
  const p = node.priority ?? 0;
  const i = node.interestScore ?? 0;
  return `Topic: ${t} (priority: ${p.toFixed(2)}, interest: ${i.toFixed(2)})`;
}

export function assembleContextLayer(
  budgetResult: PromptBudgetResult,
): PromptLayerResult {
  const {
    memoryEntries,
    topicNodes,
    contradictions,
    weakSignals,
    recentEvents,
  } = budgetResult;

  // Deterministically order already sorted by manager, but ensure stable order.
  const memoryStr = memoryEntries.map(formatMemoryEntry).join("\n---\n");
  const topicsStr = topicNodes.map(formatTopicNode).join("\n---\n");
  const contradictionsStr = contradictions.join(", ");
  const weakStr = weakSignals.join(", ");
  const eventsStr = recentEvents.map((e: any) => e.type ?? "").join(", ");

  const content = `Context:\n${memoryStr}\n\nTopics:\n${topicsStr}\n\nContradictions: ${contradictionsStr}\nWeak Signals: ${weakStr}\nRecent Events: ${eventsStr}`;

  const tokenEstimate = Math.ceil(content.length / 4);
  return {
    name: "CONTEXT",
    content,
    tokenEstimate,
  };
}
