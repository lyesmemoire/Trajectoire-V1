// runtime/prompt-budget/PromptBudgetManager.ts
/**
 * Deterministic Prompt Budget Manager.
 *
 * It takes a RuntimeContext, applies a deterministic pipeline of normalization,
 * sorting, truncation, token estimation and an emergency trim, and returns an
 * immutable PromptBudgetResult.
 *
 * The implementation follows the architectural constraints provided:
 *   • immutable return model
 *   • explicit deterministic sorting before any truncation
 *   • stage‑specific trim methods
 *   • simple deterministic token estimation (length / 4)
 *   • final emergency trimming loop
 *   • hash generation for replay verification
 *   • deep‑freeze of the result for safety
 */

import type { RuntimeContext } from "../contracts/types/runtime";
import type { RuntimeEvent, MemoryEntry, TopicNode, BudgetTruncationStrategy, PromptBudgetPolicy, PromptBudgetReport } from "../types/prompt";
import { DEFAULT_PROMPT_BUDGET_POLICY } from "../types/prompt";
import { deepFreeze } from "@core/freeze/deepFreeze";

/**
 * Result returned by PromptBudgetManager. All collections are readonly and the
 * object is deep‑frozen.
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
 * Simple deterministic hash – djb2 variant. Produces a 32‑bit signed integer.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Convert to unsigned 32‑bit integer
  return hash >>> 0;
}

/**
 * Stable sort by a numeric timestamp then by string id (lexicographic).
 */
function stableSortByTimestampThenId<
  T extends { askedAt?: number; id?: string },
>(arr: T[]): T[] {
  // copy to avoid mutating the original array
  const copy = arr.slice();
  copy.sort((a, b) => {
    const tA = a.askedAt ?? 0;
    const tB = b.askedAt ?? 0;
    if (tA !== tB) return tA - tB;
    const idA = a.id ?? "";
    const idB = b.id ?? "";
    return idA.localeCompare(idB);
  });
  return copy;
}

/**
 * Approximate token count using the simple deterministic heuristic:
 *   tokens ≈ ceil(text.length / 4)
 * This works on any stringified representation of the payload.
 */
function approximateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * PromptBudgetManager – main class.
 */
export class PromptBudgetManager {
  private readonly policy: PromptBudgetPolicy;
  private readonly maxTokens: number;

  constructor(
    policy: PromptBudgetPolicy = DEFAULT_PROMPT_BUDGET_POLICY,
    maxTokens: number = 1500,
  ) {
    this.policy = policy;
    this.maxTokens = maxTokens;
  }

  /**
   * Core entry point – produces a fully deterministic budget result.
   */
  public budget(context: RuntimeContext): PromptBudgetResult {
    // ------------------------------------------------------------
    // 1️⃣ Normalise – shallow copies of each collection
    // ------------------------------------------------------------
    const rawMemory = context.questionMemory?.entries ?? [];
    const rawTopics = context.topicGraph?.getAllNodes?.() ?? [];
    const rawContradictions: string[] = [];
    rawTopics.forEach((node: any) => {
      if (Array.isArray(node.contradictions))
        rawContradictions.push(...node.contradictions);
    });
    const rawWeakSignals: string[] = (context as any).weakSignals ?? [];
    const rawRecentEvents: RuntimeEvent[] = (context as any).recentEvents ?? [];

    // ------------------------------------------------------------
    // 2️⃣ Sort – deterministic ordering for each collection
    // ------------------------------------------------------------
    const memory = stableSortByTimestampThenId(rawMemory as any);
    const topics = stableSortByTimestampThenId(rawTopics as any);
    const contradictions = rawContradictions.slice().sort(); // alphabetical deterministic
    const weakSignals = rawWeakSignals.slice().sort();
    const recentEvents = rawRecentEvents
      .slice()
      .sort((a: any, b: any) => (a.timestamp ?? 0) - (b.timestamp ?? 0));

    // ------------------------------------------------------------
    // 3️⃣ Build initial report values
    // ------------------------------------------------------------
    const report: PromptBudgetReport = {
      initialMemoryEntries: memory.length,
      finalMemoryEntries: memory.length,
      initialTopics: topics.length,
      finalTopics: topics.length,
      initialContradictions: contradictions.length,
      finalContradictions: contradictions.length,
      initialWeakSignals: weakSignals.length,
      finalWeakSignals: weakSignals.length,
      initialRecentEvents: recentEvents.length,
      finalRecentEvents: recentEvents.length,
      removedMemoryEntries: 0,
      removedTopics: 0,
      removedContradictions: 0,
      removedWeakSignals: 0,
      removedRecentEvents: 0,
      appliedStrategies: [],
      initialTokenEstimate: 0,
      finalTokenEstimate: 0,
      truncated: false,
    } as PromptBudgetReport;

    // ------------------------------------------------------------
    // 4️⃣ Stage‑wise truncation according to policy
    // ------------------------------------------------------------
    // Helper to record removals
    const recordRemoval = (stage: keyof PromptBudgetReport, count: number) => {
      if (count <= 0) return;
      const removedKey =
        `removed${stage.charAt(0).toUpperCase() + stage.slice(1)}` as keyof PromptBudgetReport;
      (report[removedKey] as number) += count;
    };

    // Trim memory
    const { trimmed: memTrimmed, removed: memRemoved } = this.trimMemory(
      memory,
      this.policy.memoryStrategy,
    );
    report.finalMemoryEntries = memTrimmed.length;
    report.removedMemoryEntries += memRemoved;
    (report.appliedStrategies as string[]).push(`memory:${this.policy.memoryStrategy}`);

    // Trim contradictions
    const { trimmed: conTrimmed, removed: conRemoved } =
      this.trimContradictions(
        contradictions,
        this.policy.contradictionStrategy,
      );
    report.finalContradictions = conTrimmed.length;
    report.removedContradictions += conRemoved;
    (report.appliedStrategies as string[]).push(`contradictions:${this.policy.contradictionStrategy}`);

    // Trim weak signals
    const { trimmed: weakTrimmed, removed: weakRemoved } = this.trimWeakSignals(
      weakSignals,
      this.policy.weakSignalStrategy,
    );
    report.finalWeakSignals = weakTrimmed.length;
    report.removedWeakSignals += weakRemoved;
    (report.appliedStrategies as string[]).push(`weakSignals:${this.policy.weakSignalStrategy}`);

    // Trim recent events
    const { trimmed: evTrimmed, removed: evRemoved } = this.trimRecentEvents(
      recentEvents,
      this.policy.recentEventStrategy,
    );
    report.finalRecentEvents = evTrimmed.length;
    report.removedRecentEvents += evRemoved;
    (report.appliedStrategies as string[]).push(`recentEvents:${this.policy.recentEventStrategy}`);

    // Trim topics
    const { trimmed: topicTrimmed, removed: topicRemoved } = this.trimTopics(
      topics,
      this.policy.topicStrategy,
    );
    report.finalTopics = topicTrimmed.length;
    report.removedTopics += topicRemoved;
    (report.appliedStrategies as string[]).push(`topics:${this.policy.topicStrategy}`);

    // ------------------------------------------------------------
    // 5️⃣ Token estimation (deterministic approximation)
    // ------------------------------------------------------------
    const tokenEstimate = this.estimateTokens({
      memory: memTrimmed,
      contradictions: conTrimmed,
      weakSignals: weakTrimmed,
      recentEvents: evTrimmed,
      topicNodes: topicTrimmed,
    });
    report.initialTokenEstimate = tokenEstimate;
    report.finalTokenEstimate = tokenEstimate;

    // ------------------------------------------------------------
    // 6️⃣ Emergency trim if over budget
    // ------------------------------------------------------------
    const finalMemory = memTrimmed;
    const finalTopics = topicTrimmed;
    const finalContradictions = conTrimmed;
    const finalWeak = weakTrimmed;
    const finalEvents = evTrimmed;
    let currentTokens = tokenEstimate;
    if (currentTokens > this.maxTokens) {
      report.truncated = true;
      // simple deterministic loop: remove from the lowest‑priority collection in order
      while (currentTokens > this.maxTokens) {
        if (finalWeak.length > 0) {
          finalWeak.pop();
          report.removedWeakSignals++;
        } else if (finalContradictions.length > 0) {
          finalContradictions.pop();
          report.removedContradictions++;
        } else if (finalTopics.length > 0) {
          finalTopics.pop();
          report.removedTopics++;
        } else if (finalMemory.length > 0) {
          finalMemory.pop();
          report.removedMemoryEntries++;
        } else if (finalEvents.length > 0) {
          finalEvents.pop();
          report.removedRecentEvents++;
        }
        // re‑estimate (very cheap approximation – each removal reduces token count by a fixed heuristic)
        currentTokens = this.estimateTokens({
          memory: finalMemory,
          contradictions: finalContradictions,
          weakSignals: finalWeak,
          recentEvents: finalEvents,
          topicNodes: finalTopics,
        });
      }
    }
    report.finalTokenEstimate = currentTokens;

    // ------------------------------------------------------------
    // 7️⃣ Build result object and compute hash
    // ------------------------------------------------------------
    const result: PromptBudgetResult = {
      memoryEntries: finalMemory as any,
      topicNodes: finalTopics as any,
      contradictions: finalContradictions,
      weakSignals: finalWeak,
      recentEvents: finalEvents as any,
      report,
    };

    // Deterministic hash of the snapshot (JSON order is stable because we sorted already)
    const snapshotString = JSON.stringify({
      memoryEntries: result.memoryEntries,
      topicNodes: result.topicNodes,
      contradictions: result.contradictions,
      weakSignals: result.weakSignals,
      recentEvents: result.recentEvents,
    });
    const hash = hashString(snapshotString);
    // attach hash to the report (as string for readability)
    (result.report as any).hash = hash.toString(16);

    // ------------------------------------------------------------
    // 8️⃣ Freeze result immutably
    // ------------------------------------------------------------
    return deepFreeze(result);
  }

  // --------------------------------------------------------------------
  // Trimming helpers – each returns trimmed array and count of removed items
  // --------------------------------------------------------------------

  private trimMemory(
    memory: readonly MemoryEntry[],
    strategy: BudgetTruncationStrategy,
  ): { trimmed: MemoryEntry[]; removed: number } {
    const copy = memory.slice();
    if (strategy === "drop_oldest") {
      const max = 10; // arbitrary stage cap – can be refined later
      const toDrop = Math.max(0, copy.length - max);
      copy.splice(0, toDrop);
      return { trimmed: copy, removed: toDrop };
    }
    // other strategies could be added later
    return { trimmed: copy, removed: 0 };
  }

  private trimContradictions(
    contradictions: readonly string[],
    strategy: BudgetTruncationStrategy,
  ): { trimmed: string[]; removed: number } {
    const copy = contradictions.slice();
    if (strategy === "drop_low_confidence") {
      const max = 5;
      const toDrop = Math.max(0, copy.length - max);
      copy.splice(copy.length - toDrop, toDrop);
      return { trimmed: copy, removed: toDrop };
    }
    if (strategy === "drop_oldest") {
      const max = 5;
      const toDrop = Math.max(0, copy.length - max);
      copy.splice(0, toDrop);
      return { trimmed: copy, removed: toDrop };
    }
    return { trimmed: copy, removed: 0 };
  }

  private trimWeakSignals(
    weakSignals: readonly string[],
    strategy: BudgetTruncationStrategy,
  ): { trimmed: string[]; removed: number } {
    const copy = weakSignals.slice();
    if (strategy === "drop_low_confidence") {
      const max = 5;
      const toDrop = Math.max(0, copy.length - max);
      copy.splice(copy.length - toDrop, toDrop);
      return { trimmed: copy, removed: toDrop };
    }
    return { trimmed: copy, removed: 0 };
  }

  private trimRecentEvents(
    events: readonly RuntimeEvent[],
    strategy: BudgetTruncationStrategy,
  ): { trimmed: RuntimeEvent[]; removed: number } {
    const copy = events.slice();
    if (strategy === "drop_oldest") {
      const max = 20;
      const toDrop = Math.max(0, copy.length - max);
      copy.splice(0, toDrop);
      return { trimmed: copy, removed: toDrop };
    }
    return { trimmed: copy, removed: 0 };
  }

  private trimTopics(
    topics: readonly TopicNode[],
    strategy: BudgetTruncationStrategy,
  ): { trimmed: TopicNode[]; removed: number } {
    const copy = topics.slice();
    if (strategy === "drop_low_priority") {
      // assume each TopicNode has a numeric `priority` field – higher = more important
      copy.sort((a: any, b: any) => b.priority - a.priority); // descending priority
      const max = 15;
      const toDrop = Math.max(0, copy.length - max);
      copy.splice(copy.length - toDrop, toDrop);
      return { trimmed: copy, removed: toDrop };
    }
    return { trimmed: copy, removed: 0 };
  }

  // --------------------------------------------------------------------
  // Token estimation – deterministic heuristic based on string length.
  // --------------------------------------------------------------------
  private estimateTokens(args: {
    memory: readonly MemoryEntry[];
    contradictions: readonly string[];
    weakSignals: readonly string[];
    recentEvents: readonly RuntimeEvent[];
    topicNodes: readonly TopicNode[];
  }): number {
    const parts = [
      JSON.stringify(args.memory),
      JSON.stringify(args.contradictions),
      JSON.stringify(args.weakSignals),
      JSON.stringify(args.recentEvents),
      JSON.stringify(args.topicNodes),
    ];
    const totalText = parts.join("|");
    return approximateTokens(totalText);
  }
}
