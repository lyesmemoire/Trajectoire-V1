import { CandidateGraph } from "./CandidateIntelligenceGraph";

/**
 * Candidate Graph Snapshot Data
 */
export interface CandidateGraphSnapshotData {
  id: string;
  timestamp: Date;
  graph: CandidateGraph;
  metadata: {
    version: string;
    source: string;
    context?: string;
  };
}

/**
 * Candidate Graph Snapshot
 *
 * Responsibilities:
 * - Create immutable snapshot of candidate graph
 * - Serve as historical record
 * - Enable comparison and analytics
 * - Support progression tracking
 * - Enable rollback capability
 */

export class CandidateGraphSnapshot {
  private data: CandidateGraphSnapshotData;

  private constructor(data: CandidateGraphSnapshotData) {
    this.data = data;
  }

  /**
   * Create snapshot from candidate graph
   */
  static create(graph: CandidateGraph, context?: string): CandidateGraphSnapshot {
    return new CandidateGraphSnapshot({
      id: CandidateGraphSnapshot.generateSnapshotId(),
      timestamp: new Date(),
      graph: CandidateGraphSnapshot.deepClone(graph),
      metadata: {
        version: "1.0",
        source: "CandidateIntelligenceGraph",
        context,
      },
    });
  }
  
  /**
   * Generate unique snapshot ID
   */
  private static generateSnapshotId(): string {
    return `snapshot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * Deep clone candidate graph to ensure immutability
   */
  private static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
  
  /**
   * Restore graph from snapshot
   */
  restore(): CandidateGraph {
    return CandidateGraphSnapshot.deepClone(this.data.graph);
  }
  
  /**
   * Check if snapshot is expired
   */
  static isExpired(snapshot: CandidateGraphSnapshot, maxAgeMs: number): boolean {
    const age = Date.now() - snapshot.data.timestamp.getTime();
    return age > maxAgeMs;
  }
  
  /**
   * Get snapshot age in milliseconds
   */
  static getAge(snapshot: CandidateGraphSnapshot): number {
    return Date.now() - snapshot.data.timestamp.getTime();
  }
  
  /**
   * Get snapshot age in human-readable format
   */
  static getAgeHuman(snapshot: CandidateGraphSnapshot): string {
    const ageMs = CandidateGraphSnapshot.getAge(snapshot);
    const seconds = Math.floor(ageMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }

  get id(): string {
    return this.data.id;
  }

  get timestamp(): Date {
    return this.data.timestamp;
  }

  get graph(): CandidateGraph {
    return this.data.graph;
  }
}
