// runtime/types/prompt.ts
/**
 * Shared types for prompt budgeting, snapshots, and layer results.
 */
export type MemoryEntry = any;
export type NodeMetadata = any;
export type RuntimeEvent = any;
export type TopicNode = any;

export type BudgetTruncationStrategy =
  | "drop_oldest"
  | "drop_low_confidence"
  | "drop_low_priority"
  | "summarize";

export interface PromptBudgetPolicy {
  memoryStrategy: BudgetTruncationStrategy;
  contradictionStrategy: BudgetTruncationStrategy;
  weakSignalStrategy: BudgetTruncationStrategy;
  topicStrategy: BudgetTruncationStrategy;
  recentEventStrategy: BudgetTruncationStrategy;
}

export interface PromptSliceResult {
  readonly memoryEntries: readonly MemoryEntry[];
  readonly topicNodes: readonly NodeMetadata[];
  readonly contradictions: readonly string[];
  readonly weakSignals: readonly string[];
  readonly recentEvents: readonly RuntimeEvent[];
  readonly estimatedTokens: number;
  readonly truncated: boolean;
}

export interface PromptBudgetReport {
  // counts before/after for each collection
  initialMemoryEntries: number;
  finalMemoryEntries: number;
  initialTopics: number;
  finalTopics: number;
  initialContradictions: number;
  finalContradictions: number;
  initialWeakSignals: number;
  finalWeakSignals: number;
  initialRecentEvents: number;
  finalRecentEvents: number;

  // how many were removed per collection
  removedMemoryEntries: number;
  removedTopics: number;
  removedContradictions: number;
  removedWeakSignals: number;
  removedRecentEvents: number;

  // list of strategies applied (e.g., "memory:drop_oldest")
  appliedStrategies: readonly string[];

  // token budgeting
  initialTokenEstimate: number;
  finalTokenEstimate: number;

  // overall flag
  truncated: boolean;
  // snapshot hash (populated by manager)
  hash?: string;
}

/**
 * Result produced by PromptBudgetManager – immutable collections and a report.
 */
export interface PromptBudgetResult {
  readonly memoryEntries: readonly MemoryEntry[];
  readonly topicNodes: readonly TopicNode[];
  readonly contradictions: readonly string[];
  readonly weakSignals: readonly string[];
  readonly recentEvents: readonly RuntimeEvent[];
  readonly report: PromptBudgetReport;
}

/**
 * Result returned by each prompt layer – named, content, and deterministic token estimate.
 */
export interface PromptLayerResult {
  readonly name: string;
  readonly content: string;
  readonly tokenEstimate: number;
}

export interface PromptSnapshot {
  version: string;
  generatedAt: number;
  tokenEstimate: number;

  system: string;
  persona: string;
  context: string;
  objective: string;
  constraints: string;
  safety: string;

  finalPrompt: string;
  hash: string;
  budgetReport: PromptBudgetReport;
  // Preserve the order of layers for replay safety.
  readonly layerOrder: readonly string[];
}

// Default deterministic policy (deep‑frozen for safety)
import { deepFreeze } from "@core/freeze/deepFreeze";

export const DEFAULT_PROMPT_BUDGET_POLICY: PromptBudgetPolicy = deepFreeze({
  memoryStrategy: "drop_oldest",
  contradictionStrategy: "drop_low_confidence",
  weakSignalStrategy: "drop_low_confidence",
  topicStrategy: "drop_low_priority",
  recentEventStrategy: "drop_oldest",
});
