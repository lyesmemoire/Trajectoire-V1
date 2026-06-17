// apps/realtime-gateway/src/interview/models/InterviewState.ts

import type { InterviewEvent } from "./InterviewEvent";
import type { InterviewStatus } from "./InterviewStatus";

export interface InterviewState {
  sessionId: string;
  tenantId?: string;
  organizationId?: string;
  status: InterviewStatus;
  readonly events: InterviewEvent[];
  snapshots: unknown[]; // For session snapshotting
  expiresAt?: number; // Epoch ms for expiration

  // Other potential fields like candidate ID, job ID, context, etc.
  candidateId?: string;
  jobId?: string;
}
