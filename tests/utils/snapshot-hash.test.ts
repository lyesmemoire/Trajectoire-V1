import { describe, it, expect } from "vitest";
import { SnapshotHash, SnapshotData } from "../../apps/web/src/lib/ai/utils/SnapshotHash";

describe("SnapshotHash", () => {
  describe("calculateHash", () => {
    it("should calculate consistent hash for same snapshot", () => {
      const snapshot: SnapshotData = {
        sessionId: "test-session",
        timestamp: new Date("2024-01-01T00:00:00Z"),
        knowledgeGraph: { entities: [], relationships: [] },
        evidenceLedger: { totalEntries: 0, entries: [] },
        contradictionLedger: { totalEntries: 0, entries: [] },
        timeline: { events: [], statistics: {} },
        confidence: { overallScore: 0, dimensionScores: {} },
        decisionGraph: { decisions: [], confidence: 0 },
      };

      const result1 = SnapshotHash.calculateHash(snapshot);
      const result2 = SnapshotHash.calculateHash(snapshot);

      expect(result1.hash).toBe(result2.hash);
      expect(result1.algorithm).toBe("sha256");
      expect(result1.hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should produce different hashes for different snapshots", () => {
      const snapshot1: SnapshotData = {
        sessionId: "test-session",
        timestamp: new Date("2024-01-01T00:00:00Z"),
        knowledgeGraph: { entities: [], relationships: [] },
        evidenceLedger: { totalEntries: 0, entries: [] },
        contradictionLedger: { totalEntries: 0, entries: [] },
        timeline: { events: [], statistics: {} },
        confidence: { overallScore: 0, dimensionScores: {} },
        decisionGraph: { decisions: [], confidence: 0 },
      };

      const snapshot2: SnapshotData = {
        ...snapshot1,
        sessionId: "different-session",
      };

      const hash1 = SnapshotHash.calculateHash(snapshot1);
      const hash2 = SnapshotHash.calculateHash(snapshot2);

      expect(hash1.hash).not.toBe(hash2.hash);
    });
  });

  describe("compareHashes", () => {
    it("should return true for identical hashes", () => {
      const hash = "a1b2c3d4e5f6";
      expect(SnapshotHash.compareHashes(hash, hash)).toBe(true);
    });

    it("should return false for different hashes", () => {
      const hash1 = "a1b2c3d4e5f6";
      const hash2 = "f6e5d4c3b2a1";
      expect(SnapshotHash.compareHashes(hash1, hash2)).toBe(false);
    });
  });

  describe("verifyIntegrity", () => {
    it("should verify integrity with correct hash", () => {
      const snapshot: SnapshotData = {
        sessionId: "test-session",
        timestamp: new Date("2024-01-01T00:00:00Z"),
        knowledgeGraph: { entities: [], relationships: [] },
        evidenceLedger: { totalEntries: 0, entries: [] },
        contradictionLedger: { totalEntries: 0, entries: [] },
        timeline: { events: [], statistics: {} },
        confidence: { overallScore: 0, dimensionScores: {} },
        decisionGraph: { decisions: [], confidence: 0 },
      };

      const result = SnapshotHash.calculateHash(snapshot);
      const isValid = SnapshotHash.verifyIntegrity(snapshot, result.hash);

      expect(isValid).toBe(true);
    });

    it("should fail verification with incorrect hash", () => {
      const snapshot: SnapshotData = {
        sessionId: "test-session",
        timestamp: new Date("2024-01-01T00:00:00Z"),
        knowledgeGraph: { entities: [], relationships: [] },
        evidenceLedger: { totalEntries: 0, entries: [] },
        contradictionLedger: { totalEntries: 0, entries: [] },
        timeline: { events: [], statistics: {} },
        confidence: { overallScore: 0, dimensionScores: {} },
        decisionGraph: { decisions: [], confidence: 0 },
      };

      const isValid = SnapshotHash.verifyIntegrity(snapshot, "incorrect-hash");

      expect(isValid).toBe(false);
    });
  });

  describe("calculateEventStreamHash", () => {
    it("should calculate consistent hash for event stream", () => {
      const events = [
        {
          id: "event-1",
          sessionId: "test-session",
          sequence: 1,
          eventType: "TEST_EVENT",
          engine: "test",
          engineVersion: "1.0.0",
          payload: { data: "test" },
          provider: "internal",
          model: "internal",
          promptId: "test",
          promptVersion: "1.0.0",
          promptChecksum: "abc123",
          schemaVersion: "1.0",
        },
      ];

      const hash1 = SnapshotHash.calculateEventStreamHash(events);
      const hash2 = SnapshotHash.calculateEventStreamHash(events);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should sort events by sequence for consistent hashing", () => {
      const events = [
        {
          id: "event-2",
          sessionId: "test-session",
          sequence: 2,
          eventType: "TEST_EVENT",
          engine: "test",
          engineVersion: "1.0.0",
          payload: { data: "test2" },
          provider: "internal",
          model: "internal",
          promptId: "test",
          promptVersion: "1.0.0",
          promptChecksum: "abc123",
          schemaVersion: "1.0",
        },
        {
          id: "event-1",
          sessionId: "test-session",
          sequence: 1,
          eventType: "TEST_EVENT",
          engine: "test",
          engineVersion: "1.0.0",
          payload: { data: "test1" },
          provider: "internal",
          model: "internal",
          promptId: "test",
          promptVersion: "1.0.0",
          promptChecksum: "abc123",
          schemaVersion: "1.0",
        },
      ];

      const hash1 = SnapshotHash.calculateEventStreamHash(events);
      const hash2 = SnapshotHash.calculateEventStreamHash([...events].reverse());

      expect(hash1).toBe(hash2);
    });
  });
});
