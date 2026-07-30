import { z } from "zod";
import { CognitiveState } from "./CognitiveState";
import { DecisionGraph, DecisionGraphSchema } from "./DecisionGraph";
import { SnapshotMetadata, SnapshotMetadataSchema } from "./SnapshotMetadata";

// ===================================================================
// SNAPSHOT — Cognitive Snapshot Contract
// ===================================================================

export interface Snapshot {
  id: string;
  sessionId: string;
  timestamp: Date;
  sequence: number;
  cognitiveState: CognitiveState;
  decisionGraph: DecisionGraph;
  metadata: SnapshotMetadata;
}

// Zod Schema
export const SnapshotSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().min(1),
  timestamp: z.date(),
  sequence: z.number().int().min(0),
  cognitiveState: z.any(), // Will be replaced with CognitiveStateSchema when available
  decisionGraph: DecisionGraphSchema,
  metadata: SnapshotMetadataSchema,
});
