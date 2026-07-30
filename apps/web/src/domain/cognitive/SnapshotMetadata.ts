import { z } from "zod";

// ===================================================================
// SNAPSHOT METADATA — Snapshot Metadata Contract
// ===================================================================

export interface SnapshotMetadata {
  snapshotId: string;
  sessionId: string;
  sequence: number;
  version: number;
  parentSnapshotId: string | null;
  timestamp: Date;
  createdAt: Date;
  createdBy: string;
  traceId: string;
  correlationId: string;
  eventCount: number;
  checksum: string;
}

// Zod Schema
export const SnapshotMetadataSchema = z.object({
  snapshotId: z.string().uuid(),
  sessionId: z.string().min(1),
  sequence: z.number().int().min(0),
  version: z.number().int().min(0),
  parentSnapshotId: z.string().uuid().nullable(),
  timestamp: z.date(),
  createdAt: z.date(),
  createdBy: z.string().min(1),
  traceId: z.string().uuid(),
  correlationId: z.string().uuid(),
  eventCount: z.number().int().min(0),
  checksum: z.string().min(1),
});
