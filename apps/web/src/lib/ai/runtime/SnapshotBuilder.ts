import { Snapshot } from "../../../domain/cognitive/Snapshot";
import { SnapshotMetadata } from "../../../domain/cognitive/SnapshotMetadata";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";
import { InvestigationContext } from "../../../domain/cognitive/InvestigationContext";
import { DecisionGraph } from "../../../domain/cognitive/DecisionGraph";

// ===================================================================
// SNAPSHOT BUILDER — Snapshot Builder Contract
// ===================================================================

export interface SnapshotBuilder {
  build(
    domainState: CognitiveState,
    previousContext: InvestigationContext,
    metadata: Partial<SnapshotMetadata>
  ): InvestigationContext;
}

export class DefaultSnapshotBuilder implements SnapshotBuilder {
  build(
    domainState: CognitiveState,
    previousContext: InvestigationContext,
    metadata: Partial<SnapshotMetadata>
  ): InvestigationContext {
    // Create minimal DecisionGraph for Phase A.2
    const decisionGraph: DecisionGraph = {
      nodes: new Map(),
      edges: new Map(),
      root: null,
    };

    // Create immutable InvestigationContext from domain state
    const snapshot: Snapshot = {
      id: metadata.snapshotId || crypto.randomUUID(),
      sessionId: previousContext.sessionId,
      timestamp: metadata.timestamp || new Date(),
      sequence: metadata.sequence || 0,
      cognitiveState: domainState,
      decisionGraph,
      metadata: {
        snapshotId: metadata.snapshotId || crypto.randomUUID(),
        sessionId: previousContext.sessionId,
        sequence: metadata.sequence || 0,
        version: metadata.version || (previousContext.metadata.snapshotVersion || 0) + 1,
        parentSnapshotId: metadata.parentSnapshotId || previousContext.metadata.snapshotId || null,
        timestamp: metadata.timestamp || new Date(),
        createdAt: metadata.createdAt || new Date(),
        createdBy: metadata.createdBy || "CognitiveRuntime",
        traceId: metadata.traceId || crypto.randomUUID(),
        correlationId: metadata.correlationId || crypto.randomUUID(),
        eventCount: metadata.eventCount || 0,
        checksum: metadata.checksum || crypto.randomUUID(),
      },
    };

    // Return new InvestigationContext (immutable)
    return {
      ...previousContext,
      metadata: {
        ...previousContext.metadata,
        snapshotVersion: snapshot.metadata.version,
        snapshotId: snapshot.metadata.snapshotId,
        parentSnapshotId: snapshot.metadata.parentSnapshotId,
        lastSnapshotAt: snapshot.metadata.createdAt,
        traceId: snapshot.metadata.traceId,
        correlationId: snapshot.metadata.correlationId,
      },
      // In a full implementation, this would include the actual snapshot data
      // For Phase A.2, we're focusing on the architecture
    };
  }
}
