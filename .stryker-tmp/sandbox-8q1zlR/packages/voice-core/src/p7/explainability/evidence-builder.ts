// @ts-nocheck
import { Signal } from "../scoring-engine/scoring-contract.js";
import { RuntimeTrace } from "../trace-contract.js";
import { EvidenceNode } from "./explanation-contract.js";

/**
 * Evidence Builder — Pattern Detection Engine
 *
 * Transforms raw signals + trace into structured EvidenceNodes.
 *
 * Rules:
 * - 1 evidence = 1 detected pattern
 * - 100% deterministic (no random grouping, no LLM)
 * - Consecutive signals of the same type are grouped into trend evidence
 * - Isolated signals produce individual evidence
 */

interface SignalWithTurn {
  signal: Signal;
  turnIndex: number;
}

export function buildEvidence(signals: Signal[], trace: RuntimeTrace): EvidenceNode[] {
  const evidences: EvidenceNode[] = [];
  const sessionId = trace.sessionId;

  // Sort signals by timestamp for deterministic processing
  const sorted = [...signals].sort((a, b) => a.timestamp - b.timestamp);

  // Map signals to their turn indices
  const withTurns: SignalWithTurn[] = sorted.map(s => ({
    signal: s,
    turnIndex: findTurnIndex(s.timestamp, trace),
  }));

  // Group consecutive signals of the same type for trend detection
  const groups = groupConsecutiveByType(withTurns);

  for (const group of groups) {
    if (group.length >= 3) {
      // Consecutive trend pattern (≥3 signals)
      evidences.push(buildTrendEvidence(group, sessionId));
    } else if (group.length === 2) {
      // Pair pattern
      evidences.push(buildPairEvidence(group, sessionId));
    } else if (group.length === 1) {
      // Isolated signal
      const item = group[0];
      if (!item) {
        throw new Error("Expected signal in isolated group");
      }
      evidences.push(buildIsolatedEvidence(item, sessionId));
    } else {
      // Handle case where group might be empty despite logic
      throw new Error("Unexpected empty group in evidence builder");
    }
  }

  return evidences;
}

// ─── Internal Helpers ───────────────────────────────────────────────

function findTurnIndex(timestamp: number, trace: RuntimeTrace): number {
  for (let i = trace.turns.length - 1; i >= 0; i--) {
    const turn = trace.turns[i];
if (!turn?.input?.timestamp) continue;

if (timestamp >= turn.input.timestamp) return i;
  }
  return 0;
}

function groupConsecutiveByType(items: SignalWithTurn[]): SignalWithTurn[][] {
  if (items.length === 0) return [];

  const groups: SignalWithTurn[][] = [];
  const firstItem = items[0];
  if (!firstItem) return [];
  let current: SignalWithTurn[] = [firstItem];

  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1];
    const curr = items[i];

    if (!prev || !curr) {
      throw new Error(`Missing item at index ${i} or ${i-1} during grouping`);
    }

    // Same type AND consecutive turns (within 1 turn gap)
    if (
      curr.signal.type === prev.signal.type &&
      curr.turnIndex - prev.turnIndex <= 1
    ) {
      current.push(curr);
    } else {
      groups.push(current);
      current = [curr];
    }
  }
  groups.push(current);
  return groups;
}

function buildTrendEvidence(group: SignalWithTurn[], sessionId: string): EvidenceNode {
  if (group.length === 0) throw new Error("Cannot build trend evidence from empty group");
  const first = group[0];
  if (!first) throw new Error("Empty group encountered");
  const type = first.signal.type;
  const turnIndices = group.map(g => g.turnIndex);
  const avgValue = group.reduce((s, g) => s + (g.signal.value ?? 0), 0) / group.length;
  const direction = avgValue > 0 ? "positive" : "negative";
  const excerpts = group
    .map(g => g.signal.excerpt || `Turn#${g.turnIndex}`)
    .join(" → ");

  return {
    id: `ev_trend_${type}_t${turnIndices[0]} _t${turnIndices[turnIndices.length - 1]}`,
    signalIds: group.map(g => g.signal.id),
    excerpt: excerpts,
    weight: Math.abs(avgValue),
    rationale: `${direction} ${type} trend across ${group.length} consecutive turns (Turn#${turnIndices.join(", Turn#")})`,
    traceability: {
      sessionId,
      turnIndex: turnIndices[0] ?? 0,
    },
  };
}

function buildPairEvidence(group: SignalWithTurn[], sessionId: string): EvidenceNode {
  if (group.length < 2) throw new Error("Cannot build pair evidence from group with < 2 signals");
  const first = group[0];
  const second = group[1];
  if (!first || !second) throw new Error("Missing signals in pair group");
  const type = first.signal.type;
  const avgValue = (first.signal.value + second.signal.value) / 2;
  const direction = avgValue > 0 ? "positive" : "negative";

  return {
    id: `ev_pair_${type}_t${first.turnIndex}_t${second.turnIndex}`,
    signalIds: group.map(g => g.signal.id),
    excerpt: group.map(g => g.signal.excerpt || `Turn#${g.turnIndex}`).join(" → "),
    weight: Math.abs(avgValue),
    rationale: `${direction} ${type} pattern in Turn#${first.turnIndex} and Turn#${second.turnIndex}`,
    traceability: {
      sessionId,
      turnIndex: first.turnIndex,
    },
  };
}

function buildIsolatedEvidence(item: SignalWithTurn, sessionId: string): EvidenceNode {
  const direction = item.signal.value > 0 ? "positive" : "negative";

  return {
    id: `ev_${item.signal.type}_t${item.turnIndex}`,
    signalIds: [item.signal.id],
    excerpt: item.signal.excerpt || `Turn#${item.turnIndex}`,
    weight: Math.abs(item.signal.value),
    rationale: `${direction} ${item.signal.type} signal at Turn#${item.turnIndex}`,
    traceability: {
      sessionId,
      turnIndex: item.turnIndex,
    },
  };
}
