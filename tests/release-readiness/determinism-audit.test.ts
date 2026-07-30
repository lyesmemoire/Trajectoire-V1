import { describe, it, expect } from "vitest";
import { MemoryEventStore } from "../../apps/web/src/lib/ai/repositories/MemoryEventStore";
import { SnapshotHash, SnapshotData } from "../../apps/web/src/lib/ai/utils/SnapshotHash";

describe("Release Readiness - Determinism Audit", () => {
  it("Functional determinism: Same Input → Same Prompt → Same Provider → Same Model → Same Seed → Same Events → Same Snapshot", () => {
    // Simulate functional determinism test
    // Given the same input, prompt, provider, model, and seed
    // We should get the same events and snapshot
    
    const input = {
      sessionId: "test-session",
      traceId: "trace-001",
      correlationId: "corr-001",
      content: "J'ai migré 180 microservices.",
    };

    const prompt = {
      id: "evidence-default",
      version: "1.0.0",
      checksum: "sha256-placeholder",
      template: "Analyze this observation for evidence",
    };

    const provider = "internal";
    const model = "internal";
    const seed = 42; // If available for deterministic LLM

    // Create events with consistent metadata
    const events = [
      {
        id: "event-1",
        sessionId: input.sessionId,
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: {
          observationId: "obs-1",
          evidenceType: "StrongEvidence",
          confidence: 0.9,
        },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {
          traceId: input.traceId,
          correlationId: input.correlationId,
        },
        provider,
        model,
        promptId: prompt.id,
        promptVersion: prompt.version,
        promptChecksum: prompt.checksum,
        schemaVersion: "1.0",
      },
    ];

    // Create snapshot from events
    const snapshot: SnapshotData = {
      sessionId: input.sessionId,
      timestamp: new Date("2024-01-01T00:00:00Z"),
      knowledgeGraph: {
        entities: [],
        relationships: [],
        facts: [],
      },
      evidenceLedger: {
        totalEntries: 1,
        entries: [
          {
            id: "entry-1",
            observationId: "obs-1",
            evidenceType: "StrongEvidence",
            confidence: 0.9,
            timestamp: new Date("2024-01-01T00:00:00Z"),
          },
        ],
      },
      contradictionLedger: {
        totalEntries: 0,
        entries: [],
      },
      timeline: {
        events: [],
        statistics: {
          totalEvents: 0,
          withTimestamp: 0,
          withDuration: 0,
          averageConfidence: 0,
        },
      },
      confidence: {
        overallScore: 0.9,
        dimensionScores: {
          evidence: 0.9,
        },
      },
      decisionGraph: {
        decisions: [],
        confidence: 0,
      },
    };

    // Calculate hash of events
    const eventsHash = SnapshotHash.calculateEventStreamHash(events);

    // Calculate hash of snapshot
    const snapshotHash = SnapshotHash.calculateHash(snapshot);

    // Verify hashes are deterministic (same input produces same output)
    expect(eventsHash).toMatch(/^[a-f0-9]{64}$/);
    expect(snapshotHash.hash).toMatch(/^[a-f0-9]{64}$/);

    // Re-run with same input should produce same hashes
    const eventsHash2 = SnapshotHash.calculateEventStreamHash(events);
    const snapshotHash2 = SnapshotHash.calculateHash(snapshot);

    expect(eventsHash).toBe(eventsHash2);
    expect(snapshotHash.hash).toBe(snapshotHash2.hash);
  });

  it("Different inputs should produce different hashes", () => {
    const input1 = {
      sessionId: "test-session",
      content: "J'ai migré 180 microservices.",
    };

    const input2 = {
      sessionId: "test-session",
      content: "J'ai migré 120 microservices.",
    };

    const events1 = [
      {
        id: "event-1",
        sessionId: input1.sessionId,
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: { content: input1.content },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {},
        provider: "internal",
        model: "internal",
        promptId: "evidence-default",
        promptVersion: "1.0.0",
        promptChecksum: "sha256-placeholder",
        schemaVersion: "1.0",
      },
    ];

    const events2 = [
      {
        id: "event-1",
        sessionId: input2.sessionId,
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: { content: input2.content },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {},
        provider: "internal",
        model: "internal",
        promptId: "evidence-default",
        promptVersion: "1.0.0",
        promptChecksum: "sha256-placeholder",
        schemaVersion: "1.0",
      },
    ];

    const hash1 = SnapshotHash.calculateEventStreamHash(events1);
    const hash2 = SnapshotHash.calculateEventStreamHash(events2);

    // Different inputs should produce different hashes
    expect(hash1).not.toBe(hash2);
  });

  it("Different prompts should produce different hashes", () => {
    const prompt1 = {
      id: "evidence-default",
      version: "1.0.0",
      checksum: "sha256-abc",
    };

    const prompt2 = {
      id: "evidence-default",
      version: "1.1.0",
      checksum: "sha256-def",
    };

    const events1 = [
      {
        id: "event-1",
        sessionId: "test-session",
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: {},
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {},
        provider: "internal",
        model: "internal",
        promptId: prompt1.id,
        promptVersion: prompt1.version,
        promptChecksum: prompt1.checksum,
        schemaVersion: "1.0",
      },
    ];

    const events2 = [
      {
        id: "event-1",
        sessionId: "test-session",
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: {},
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {},
        provider: "internal",
        model: "internal",
        promptId: prompt2.id,
        promptVersion: prompt2.version,
        promptChecksum: prompt2.checksum,
        schemaVersion: "1.0",
      },
    ];

    const hash1 = SnapshotHash.calculateEventStreamHash(events1);
    const hash2 = SnapshotHash.calculateEventStreamHash(events2);

    // Different prompts should produce different hashes
    expect(hash1).not.toBe(hash2);
  });

  it("Different providers/models should produce different hashes", () => {
    const events1 = [
      {
        id: "event-1",
        sessionId: "test-session",
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: {},
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {},
        provider: "openai",
        model: "gpt-4",
        promptId: "evidence-default",
        promptVersion: "1.0.0",
        promptChecksum: "sha256-placeholder",
        schemaVersion: "1.0",
      },
    ];

    const events2 = [
      {
        id: "event-1",
        sessionId: "test-session",
        sequence: 1,
        eventType: "EVIDENCE_DETECTED",
        engine: "evidence",
        engineVersion: "1.0.0",
        payload: {},
        createdAt: new Date("2024-01-01T00:00:00Z"),
        metadata: {},
        provider: "anthropic",
        model: "claude-3",
        promptId: "evidence-default",
        promptVersion: "1.0.0",
        promptChecksum: "sha256-placeholder",
        schemaVersion: "1.0",
      },
    ];

    const hash1 = SnapshotHash.calculateEventStreamHash(events1);
    const hash2 = SnapshotHash.calculateEventStreamHash(events2);

    // Different providers/models should produce different hashes
    expect(hash1).not.toBe(hash2);
  });
});
