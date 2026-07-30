import { z } from "zod";

// ===================================================================
// SNAPSHOT METADATA — Snapshot Metadata Contract
// ===================================================================

export interface SnapshotMetadata {
  snapshotId: string;
  sessionId: string;
  sequence: number;
  timestamp: Date;
  eventCount: number;
  checksum: string;
}

// Zod Schema
export const SnapshotMetadataSchema = z.object({
  snapshotId: z.string().uuid(),
  sessionId: z.string().min(1),
  sequence: z.number().int().min(0),
  timestamp: z.date(),
  eventCount: z.number().int().min(0),
  checksum: z.string().min(1),
});
