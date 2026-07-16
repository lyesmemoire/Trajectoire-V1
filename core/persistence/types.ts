/**
 * Persistence Types
 *
 * Central type definitions for session persistence.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY type definitions.
 */

// ============================================================================
// SESSION SNAPSHOT
// ============================================================================

export interface SessionSnapshot {
  sessionId: string;
  candidateId?: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  runtimeState: Record<string, unknown>;
  providerState: Record<string, unknown>;
  audioState: Record<string, unknown>;
  pipelineState: Record<string, unknown>;
  timeline: Record<string, unknown>[];
  correlationIds: string[];
  diagnostics: Record<string, unknown>;
  metadata: Record<string, unknown>;
  errors: Record<string, unknown>[];
  events: Record<string, unknown>[];
  lastSavedAt?: Date;
  saveCount: number;
}

// ============================================================================
// DATABASE DTO
// ============================================================================

export interface SessionDatabaseDTO {
  id?: string;
  session_id: string;
  user_id?: string;
  candidate_id?: string;
  status?: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  last_saved_at?: string;
  save_count?: number;
  runtime_state: Record<string, unknown>;
  provider_state: Record<string, unknown>;
  audio_state: Record<string, unknown>;
  pipeline_state: Record<string, unknown>;
  timeline: Record<string, unknown>[];
  correlation_ids: string[];
  diagnostics: Record<string, unknown>;
  metadata: Record<string, unknown>;
  errors: Record<string, unknown>[];
  events: Record<string, unknown>[];
  version?: string;
  checksum?: string;
  created_at?: string;
  updated_at?: string;
  closed_at?: string;
}

// ============================================================================
// PERSISTENCE STATUS
// ============================================================================

export interface PersistenceStatus {
  sessionId: string;
  isPersisted: boolean;
  lastSavedAt?: Date;
  saveCount: number;
  lastError?: string;
  syncStatus: "synced" | "pending" | "error";
}
