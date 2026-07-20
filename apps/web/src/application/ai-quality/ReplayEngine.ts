/**
 * Replay Engine
 * Records and replays conversations for debugging and analysis
 */

import {
  ConversationReplay,
  ReplayTurn,
  ReplayComparison,
  ConversationTurn,
} from "./interfaces/IEvaluationPlatform";
import { evaluationEngine, ConversationEvaluation } from "./EvaluationEngine";

// ============================================================================
// REPLAY ENGINE CLASS
// ============================================================================

export class ReplayEngine {
  private static instance: ReplayEngine;
  private conversationRecordings: Map<string, ConversationTurn[]> = new Map();
  private replays: Map<string, ConversationReplay> = new Map();

  private constructor() {}

  static getInstance(): ReplayEngine {
    if (!ReplayEngine.instance) {
      ReplayEngine.instance = new ReplayEngine();
    }
    return ReplayEngine.instance;
  }

  /**
   * Record conversation
   */
  recordConversation(conversationId: string, turns: ConversationTurn[]): void {
    // Deep copy turns to avoid reference issues
    const recordedTurns = turns.map(turn => ({ ...turn }));
    this.conversationRecordings.set(conversationId, recordedTurns);
  }

  /**
   * Get recorded conversation
   */
  getRecording(conversationId: string): ConversationTurn[] | null {
    const recording = this.conversationRecordings.get(conversationId);
    if (!recording) {
      return null;
    }

    // Return deep copy
    return recording.map(turn => ({ ...turn }));
  }

  /**
   * Replay conversation
   */
  async replayConversation(
    originalConversationId: string,
    replayVersion: string
  ): Promise<ConversationReplay> {
    const originalTurns = this.getRecording(originalConversationId);
    if (!originalTurns) {
      throw new Error(`Recording not found: ${originalConversationId}`);
    }

    // Simulate replay (in production, would actually re-run the conversation)
    const replayedTurns = await this.simulateReplay(originalTurns, replayVersion);

    // Calculate comparison
    const comparison = this.calculateComparison(originalTurns, replayedTurns);

    const replay: ConversationReplay = {
      id: `replay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalConversationId,
      replayedAt: new Date(),
      originalVersion: "1.0.0", // Would be stored with original recording
      replayVersion,
      turns: this.createReplayTurns(originalTurns, replayedTurns),
      comparison,
    };

    this.replays.set(replay.id, replay);
    return replay;
  }

  /**
   * Simulate replay (mock - in production would re-run actual conversation)
   */
  private async simulateReplay(
    originalTurns: ConversationTurn[],
    version: string
  ): Promise<ConversationTurn[]> {
    // Mock replay - in production would actually re-run the conversation
    // with the new version and return the actual results
    return originalTurns.map(turn => ({
      ...turn,
      id: `replay_${turn.id}`,
      timestamp: new Date(),
      tokens: turn.tokens ? Math.round(turn.tokens * (1 + (Math.random() - 0.5) * 0.2)) : undefined,
      latency: turn.latency ? Math.round(turn.latency * (1 + (Math.random() - 0.5) * 0.3)) : undefined,
    }));
  }

  /**
   * Calculate comparison between original and replay
   */
  private calculateComparison(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): ReplayComparison {
    const overallSimilarity = this.calculateOverallSimilarity(originalTurns, replayedTurns);
    
    const qualityDelta = this.calculateQualityDelta(originalTurns, replayedTurns);
    const costDelta = this.calculateCostDelta(originalTurns, replayedTurns);
    const latencyDelta = this.calculateLatencyDelta(originalTurns, replayedTurns);
    
    const differences = this.identifyDifferences(originalTurns, replayedTurns);

    return {
      overallSimilarity,
      qualityDelta,
      costDelta,
      latencyDelta,
      differences,
    };
  }

  /**
   * Calculate overall similarity
   */
  private calculateOverallSimilarity(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): number {
    if (originalTurns.length === 0 || replayedTurns.length === 0) {
      return 0;
    }

    let totalSimilarity = 0;
    const minLength = Math.min(originalTurns.length, replayedTurns.length);

    for (let i = 0; i < minLength; i++) {
      const similarity = this.calculateTurnSimilarity(originalTurns[i], replayedTurns[i]);
      totalSimilarity += similarity;
    }

    // Normalize by max length
    const maxLength = Math.max(originalTurns.length, replayedTurns.length);
    return totalSimilarity / maxLength;
  }

  /**
   * Calculate turn similarity
   */
  private calculateTurnSimilarity(turnA: ConversationTurn, turnB: ConversationTurn): number {
    // Simple similarity based on content
    const contentA = turnA.content.toLowerCase();
    const contentB = turnB.content.toLowerCase();

    if (contentA === contentB) {
      return 1;
    }

    // Calculate word overlap
    const wordsA = new Set(contentA.split(/\s+/));
    const wordsB = new Set(contentB.split(/\s+/));
    
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate quality delta
   */
  private calculateQualityDelta(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): number {
    // Evaluate both conversations and compare
    const originalEvaluation = evaluationEngine.evaluateConversation(
      "original",
      "replay",
      originalTurns
    );
    const replayedEvaluation = evaluationEngine.evaluateConversation(
      "replayed",
      "replay",
      replayedTurns
    );

    return replayedEvaluation.overallScore - originalEvaluation.overallScore;
  }

  /**
   * Calculate cost delta
   */
  private calculateCostDelta(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): number {
    const originalCost = originalTurns.reduce((sum, t) => sum + (t.tokens || 0), 0) * 0.001;
    const replayedCost = replayedTurns.reduce((sum, t) => sum + (t.tokens || 0), 0) * 0.001;

    return replayedCost - originalCost;
  }

  /**
   * Calculate latency delta
   */
  private calculateLatencyDelta(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): number {
    const originalLatency = originalTurns.reduce((sum, t) => sum + (t.latency || 0), 0);
    const replayedLatency = replayedTurns.reduce((sum, t) => sum + (t.latency || 0), 0);

    return replayedLatency - originalLatency;
  }

  /**
   * Identify differences between conversations
   */
  private identifyDifferences(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): string[] {
    const differences: string[] = [];

    // Check length difference
    if (originalTurns.length !== replayedTurns.length) {
      differences.push(
        `Conversation length changed from ${originalTurns.length} to ${replayedTurns.length} turns`
      );
    }

    // Check content differences
    const minLength = Math.min(originalTurns.length, replayedTurns.length);
    for (let i = 0; i < minLength; i++) {
      const similarity = this.calculateTurnSimilarity(originalTurns[i], replayedTurns[i]);
      if (similarity < 0.8) {
        differences.push(
          `Turn ${i}: Content significantly different (similarity: ${similarity.toFixed(2)})`
        );
      }
    }

    // Check token differences
    const originalTokens = originalTurns.reduce((sum, t) => sum + (t.tokens || 0), 0);
    const replayedTokens = replayedTurns.reduce((sum, t) => sum + (t.tokens || 0), 0);
    if (Math.abs(originalTokens - replayedTokens) > 100) {
      differences.push(
        `Total tokens changed from ${originalTokens} to ${replayedTokens}`
      );
    }

    // Check latency differences
    const originalLatency = originalTurns.reduce((sum, t) => sum + (t.latency || 0), 0);
    const replayedLatency = replayedTurns.reduce((sum, t) => sum + (t.latency || 0), 0);
    if (Math.abs(originalLatency - replayedLatency) > 1000) {
      differences.push(
        `Total latency changed from ${originalLatency}ms to ${replayedLatency}ms`
      );
    }

    return differences;
  }

  /**
   * Create replay turns
   */
  private createReplayTurns(
    originalTurns: ConversationTurn[],
    replayedTurns: ConversationTurn[]
  ): ReplayTurn[] {
    const replayTurns: ReplayTurn[] = [];
    const maxLength = Math.max(originalTurns.length, replayedTurns.length);

    for (let i = 0; i < maxLength; i++) {
      const original = originalTurns[i];
      const replayed = replayedTurns[i];

      if (!original || !replayed) {
        replayTurns.push({
          original: original || { id: `missing_${i}`, role: "recruiter", content: "", timestamp: new Date() },
          replayed: replayed || { id: `missing_${i}`, role: "recruiter", content: "", timestamp: new Date() },
          difference: "Missing turn",
          similarity: 0,
        });
        continue;
      }

      const similarity = this.calculateTurnSimilarity(original, replayed);
      const difference = similarity < 0.8 ? "Content significantly different" : "Similar content";

      replayTurns.push({
        original,
        replayed,
        difference,
        similarity,
      });
    }

    return replayTurns;
  }

  /**
   * Get replay by ID
   */
  getReplay(replayId: string): ConversationReplay | null {
    return this.replays.get(replayId) || null;
  }

  /**
   * Get all replays
   */
  getAllReplays(): ConversationReplay[] {
    return Array.from(this.replays.values());
  }

  /**
   * Get replays by conversation
   */
  getReplaysByConversation(conversationId: string): ConversationReplay[] {
    return this.getAllReplays().filter(r => r.originalConversationId === conversationId);
  }

  /**
   * Get replays by version
   */
  getReplaysByVersion(version: string): ConversationReplay[] {
    return this.getAllReplays().filter(r => r.replayVersion === version);
  }

  /**
   * Delete replay
   */
  deleteReplay(replayId: string): void {
    this.replays.delete(replayId);
  }

  /**
   * Delete recording
   */
  deleteRecording(conversationId: string): void {
    this.conversationRecordings.delete(conversationId);
    // Also delete associated replays
    const associatedReplays = this.getReplaysByConversation(conversationId);
    associatedReplays.forEach(replay => {
      this.replays.delete(replay.id);
    });
  }

  /**
   * Get replay statistics
   */
  getStatistics(): {
    totalRecordings: number;
    totalReplays: number;
    averageSimilarity: number;
    averageQualityDelta: number;
    averageCostDelta: number;
    averageLatencyDelta: number;
  } {
    const replays = this.getAllReplays();
    const totalRecordings = this.conversationRecordings.size;
    const totalReplays = replays.length;

    if (totalReplays === 0) {
      return {
        totalRecordings,
        totalReplays,
        averageSimilarity: 0,
        averageQualityDelta: 0,
        averageCostDelta: 0,
        averageLatencyDelta: 0,
      };
    }

    const averageSimilarity =
      replays.reduce((sum, r) => sum + r.comparison.overallSimilarity, 0) / totalReplays;
    const averageQualityDelta =
      replays.reduce((sum, r) => sum + r.comparison.qualityDelta, 0) / totalReplays;
    const averageCostDelta =
      replays.reduce((sum, r) => sum + r.comparison.costDelta, 0) / totalReplays;
    const averageLatencyDelta =
      replays.reduce((sum, r) => sum + r.comparison.latencyDelta, 0) / totalReplays;

    return {
      totalRecordings,
      totalReplays,
      averageSimilarity,
      averageQualityDelta,
      averageCostDelta,
      averageLatencyDelta,
    };
  }

  /**
   * Export replay data
   */
  exportReplays(): {
    recordings: Record<string, ConversationTurn[]>;
    replays: ConversationReplay[];
  } {
    const recordings: Record<string, ConversationTurn[]> = {};
    this.conversationRecordings.forEach((turns, id) => {
      recordings[id] = turns;
    });

    return {
      recordings,
      replays: this.getAllReplays(),
    };
  }

  /**
   * Import replay data
   */
  importReplays(data: {
    recordings: Record<string, ConversationTurn[]>;
    replays: ConversationReplay[];
  }): void {
    Object.entries(data.recordings).forEach(([id, turns]) => {
      this.conversationRecordings.set(id, turns);
    });

    data.replays.forEach(replay => {
      this.replays.set(replay.id, replay);
    });
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.conversationRecordings.clear();
    this.replays.clear();
  }
}

export const replayEngine = ReplayEngine.getInstance();
