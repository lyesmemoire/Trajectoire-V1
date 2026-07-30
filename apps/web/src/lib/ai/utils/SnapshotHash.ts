import { createHash } from "crypto";

// ===================================================================
// SNAPSHOT HASH — SHA256 Hash for State Comparison
// ===================================================================

export interface SnapshotData {
  sessionId: string;
  timestamp: Date;
  knowledgeGraph: any;
  evidenceLedger: any;
  contradictionLedger: any;
  timeline: any;
  confidence: any;
  decisionGraph: any;
}

export interface SnapshotHashResult {
  hash: string;
  algorithm: string;
  timestamp: Date;
  dataLength: number;
}

export class SnapshotHash {
  /**
   * Calculate SHA256 hash of snapshot data
   */
  static calculateHash(snapshot: SnapshotData): SnapshotHashResult {
    const normalized = this.normalizeSnapshot(snapshot);
    const hash = createHash("sha256").update(normalized).digest("hex");
    
    return {
      hash,
      algorithm: "sha256",
      timestamp: new Date(),
      dataLength: normalized.length,
    };
  }

  /**
   * Normalize snapshot data for consistent hashing
   * Sorts keys and removes non-deterministic values
   */
  private static normalizeSnapshot(snapshot: SnapshotData): string {
    const normalized = {
      sessionId: snapshot.sessionId,
      timestamp: snapshot.timestamp.toISOString(),
      knowledgeGraph: this.normalizeObject(snapshot.knowledgeGraph),
      evidenceLedger: this.normalizeObject(snapshot.evidenceLedger),
      contradictionLedger: this.normalizeObject(snapshot.contradictionLedger),
      timeline: this.normalizeObject(snapshot.timeline),
      confidence: this.normalizeObject(snapshot.confidence),
      decisionGraph: this.normalizeObject(snapshot.decisionGraph),
    };
    
    return JSON.stringify(normalized, null, 2);
  }

  /**
   * Normalize object by sorting keys recursively
   */
  private static normalizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizeObject(item));
    }

    if (typeof obj === "object") {
      const sorted: Record<string, any> = {};
      const keys = Object.keys(obj).sort();
      
      for (const key of keys) {
        // Skip non-deterministic fields
        if (key === "id" || key === "createdAt" || key === "updatedAt") {
          continue;
        }
        sorted[key] = this.normalizeObject(obj[key]);
      }
      
      return sorted;
    }

    return obj;
  }

  /**
   * Compare two snapshot hashes
   */
  static compareHashes(hash1: string, hash2: string): boolean {
    return hash1 === hash2;
  }

  /**
   * Verify snapshot integrity against expected hash
   */
  static verifyIntegrity(snapshot: SnapshotData, expectedHash: string): boolean {
    const result = this.calculateHash(snapshot);
    return result.hash === expectedHash;
  }

  /**
   * Calculate hash of event stream for replay verification
   */
  static calculateEventStreamHash(events: any[]): string {
    const normalized = events.map(event => ({
      id: event.id,
      sessionId: event.sessionId,
      sequence: event.sequence,
      eventType: event.eventType,
      engine: event.engine,
      engineVersion: event.engineVersion,
      payload: this.normalizeObject(event.payload),
      provider: event.provider,
      model: event.model,
      promptId: event.promptId,
      promptVersion: event.promptVersion,
      promptChecksum: event.promptChecksum,
      schemaVersion: event.schemaVersion,
    }));
    
    const sorted = normalized.sort((a, b) => a.sequence - b.sequence);
    return createHash("sha256").update(JSON.stringify(sorted, null, 2)).digest("hex");
  }
}
