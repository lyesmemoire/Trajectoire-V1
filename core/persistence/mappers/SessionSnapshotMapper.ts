/**
 * Session Snapshot Mapper
 *
 * Maps between SessionSnapshot and Database DTO.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transformation.
 */

import { SessionSnapshot, SessionDatabaseDTO } from "../types";

// ============================================================================
// SESSION SNAPSHOT MAPPER INTERFACE
// ============================================================================

export interface SessionSnapshotMapper {
  /**
   * Map SessionSnapshot to Database DTO
   */
  toDatabaseDTO(snapshot: SessionSnapshot): SessionDatabaseDTO;

  /**
   * Map Database DTO to SessionSnapshot
   */
  fromDatabaseDTO(dto: SessionDatabaseDTO): SessionSnapshot;

  /**
   * Map raw Supabase record to Database DTO
   */
  fromSupabaseRecord(record: any): SessionDatabaseDTO;
}

// ============================================================================
// SESSION SNAPSHOT MAPPER IMPLEMENTATION
// ============================================================================

export class SessionSnapshotMapperImpl implements SessionSnapshotMapper {
  toDatabaseDTO(snapshot: SessionSnapshot): SessionDatabaseDTO {
    return {
      session_id: snapshot.sessionId,
      candidate_id: snapshot.candidateId,
      started_at: snapshot.startedAt.toISOString(),
      ended_at: snapshot.endedAt?.toISOString(),
      duration: snapshot.duration,
      runtime_state: snapshot.runtimeState,
      provider_state: snapshot.providerState,
      audio_state: snapshot.audioState,
      pipeline_state: snapshot.pipelineState,
      timeline: snapshot.timeline,
      correlation_ids: snapshot.correlationIds,
      diagnostics: snapshot.diagnostics,
      metadata: snapshot.metadata,
      errors: snapshot.errors,
      events: snapshot.events,
      last_saved_at: snapshot.lastSavedAt?.toISOString(),
      save_count: snapshot.saveCount,
    };
  }

  fromDatabaseDTO(dto: SessionDatabaseDTO): SessionSnapshot {
    return {
      sessionId: dto.session_id,
      candidateId: dto.candidate_id,
      startedAt: new Date(dto.started_at),
      endedAt: dto.ended_at ? new Date(dto.ended_at) : undefined,
      duration: dto.duration,
      runtimeState: dto.runtime_state,
      providerState: dto.provider_state,
      audioState: dto.audio_state,
      pipelineState: dto.pipeline_state,
      timeline: dto.timeline,
      correlationIds: dto.correlation_ids,
      diagnostics: dto.diagnostics,
      metadata: dto.metadata,
      errors: dto.errors,
      events: dto.events,
      lastSavedAt: dto.last_saved_at ? new Date(dto.last_saved_at) : undefined,
      saveCount: dto.save_count || 0,
    };
  }

  fromSupabaseRecord(record: any): SessionDatabaseDTO {
    return {
      id: record.id,
      session_id: record.session_id,
      user_id: record.user_id,
      candidate_id: record.candidate_id,
      status: record.status,
      started_at: record.started_at,
      ended_at: record.ended_at,
      duration: record.duration,
      last_saved_at: record.last_saved_at,
      save_count: record.save_count,
      runtime_state: record.runtime_state,
      provider_state: record.provider_state,
      audio_state: record.audio_state,
      pipeline_state: record.pipeline_state,
      timeline: record.timeline,
      correlation_ids: record.correlation_ids,
      diagnostics: record.diagnostics,
      metadata: record.metadata,
      errors: record.errors,
      events: record.events,
      version: record.version,
      checksum: record.checksum,
      created_at: record.created_at,
      updated_at: record.updated_at,
      closed_at: record.closed_at,
    };
  }
}
