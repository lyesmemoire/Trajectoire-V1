/**
 * Supabase Session Repository Implementation
 *
 * Implements SessionPersistence interface using Supabase.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY Supabase data persistence.
 */
// @ts-nocheck


import { SessionPersistence } from "../interfaces/SessionPersistence";
import {
  SessionSnapshot,
  PersistenceStatus,
} from "../types";
import { SessionSnapshotMapper } from "../mappers/SessionSnapshotMapper";
import { ChecksumService } from "../services/ChecksumService";
import { PersistenceError } from "../errors/PersistenceError";
import { getServerDb } from "../../../lib/db/client";

// ============================================================================
// SUPABASE SESSION REPOSITORY IMPLEMENTATION
// ============================================================================

export class SupabaseSessionRepositoryImpl implements SessionPersistence {
  private tableName: string = "runtime_sessions";
  private mapper: SessionSnapshotMapper;
  private checksumService: ChecksumService;

  constructor(mapper: SessionSnapshotMapper, checksumService: ChecksumService) {
    this.mapper = mapper;
    this.checksumService = checksumService;
  }

  async saveSession(snapshot: SessionSnapshot): Promise<string> {
    try {
      const dto = this.mapper.toDatabaseDTO(snapshot);

      // Generate unique ID for the session
      const id = crypto.randomUUID();

      const supabase = await getServerDb();

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({
          id,
          session_id: dto.session_id,
          candidate_id: dto.candidate_id,
          status: "active",
          started_at: dto.started_at,
          ended_at: dto.ended_at,
          duration: dto.duration,
          runtime_state: dto.runtime_state,
          provider_state: dto.provider_state,
          audio_state: dto.audio_state,
          pipeline_state: dto.pipeline_state,
          timeline: dto.timeline,
          correlation_ids: dto.correlation_ids,
          diagnostics: dto.diagnostics,
          metadata: dto.metadata,
          errors: dto.errors,
          events: dto.events,
          version: "1.0",
          checksum: this.checksumService.calculateChecksum(dto),
        })
        .select("session_id")
        .single();

      if (error) {
        throw this.handleError(error);
      }

      return data.session_id;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSession(snapshot: SessionSnapshot): Promise<void> {
    try {
      const dto = this.mapper.toDatabaseDTO(snapshot);

      const supabase = await getServerDb();

      const { error } = await supabase
        .from(this.tableName)
        .update({
          candidate_id: dto.candidate_id,
          ended_at: dto.ended_at,
          duration: dto.duration,
          runtime_state: dto.runtime_state,
          provider_state: dto.provider_state,
          audio_state: dto.audio_state,
          pipeline_state: dto.pipeline_state,
          timeline: dto.timeline,
          correlation_ids: dto.correlation_ids,
          diagnostics: dto.diagnostics,
          metadata: dto.metadata,
          errors: dto.errors,
          events: dto.events,
          checksum: this.checksumService.calculateChecksum(dto),
        })
        .eq("session_id", dto.session_id);

      if (error) {
        throw this.handleError(error);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async closeSession(snapshot: SessionSnapshot): Promise<void> {
    try {
      const dto = this.mapper.toDatabaseDTO(snapshot);

      const supabase = await getServerDb();

      const { error } = await supabase
        .from(this.tableName)
        .update({
          status: "closed",
          ended_at: dto.ended_at,
          duration: dto.duration,
          runtime_state: dto.runtime_state,
          provider_state: dto.provider_state,
          audio_state: dto.audio_state,
          pipeline_state: dto.pipeline_state,
          timeline: dto.timeline,
          correlation_ids: dto.correlation_ids,
          diagnostics: dto.diagnostics,
          metadata: dto.metadata,
          errors: dto.errors,
          events: dto.events,
          checksum: this.checksumService.calculateChecksum(dto),
        })
        .eq("session_id", dto.session_id);

      if (error) {
        throw this.handleError(error);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async restoreSession(sessionId: string): Promise<SessionSnapshot | null> {
    try {
      const supabase = await getServerDb();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("session_id", sessionId)
        .eq("status", "active")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          return null;
        }
        throw this.handleError(error);
      }

      if (!data) {
        return null;
      }

      // Map database record to DTO using mapper
      const dto = this.mapper.fromSupabaseRecord(data);

      // Verify checksum using checksum service
      if (
        data.checksum &&
        !this.checksumService.verifyChecksum(dto, data.checksum)
      ) {
        throw PersistenceError.corruption(
          `Checksum mismatch for session ${sessionId}`,
        );
      }

      return this.mapper.fromDatabaseDTO(dto);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const supabase = await getServerDb();

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("session_id", sessionId);

      if (error) {
        throw this.handleError(error);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPersistenceStatus(sessionId: string): Promise<PersistenceStatus> {
    try {
      const supabase = await getServerDb();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("session_id, last_saved_at, save_count, status")
        .eq("session_id", sessionId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned - session not persisted
          return {
            sessionId,
            isPersisted: false,
            saveCount: 0,
            syncStatus: "pending",
          };
        }
        throw this.handleError(error);
      }

      if (!data) {
        return {
          sessionId,
          isPersisted: false,
          saveCount: 0,
          syncStatus: "pending",
        };
      }

      return {
        sessionId,
        isPersisted: true,
        lastSavedAt: data.last_saved_at
          ? new Date(data.last_saved_at)
          : undefined,
        saveCount: data.save_count || 0,
        syncStatus: data.status === "active" ? "synced" : "pending",
      };
    } catch (error) {
      return {
        sessionId,
        isPersisted: false,
        saveCount: 0,
        syncStatus: "error",
        lastError: (error as Error).message,
      };
    }
  }

  private handleError(error: unknown): PersistenceError {
    if (error instanceof Error) {
      if (
        error.message.includes("timeout") ||
        error.message.includes("ETIMEDOUT")
      ) {
        return PersistenceError.timeout(error.message);
      }

      if (
        error.message.includes("connection") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return PersistenceError.connection(error.message);
      }

      if (
        error.message.includes("not found") ||
        error.message.includes("PGRST116")
      ) {
        return PersistenceError.notFound(error.message);
      }

      if (
        error.message.includes("duplicate") ||
        error.message.includes("23505")
      ) {
        return PersistenceError.conflict(error.message);
      }

      if (
        error.message.includes("corruption") ||
        error.message.includes("checksum")
      ) {
        return PersistenceError.corruption(error.message);
      }

      // Handle Supabase error objects
      if ("code" in error) {
        const supabaseError = error as { code: string; message: string };
        return PersistenceError.unknown(
          `Supabase error ${supabaseError.code}: ${supabaseError.message}`,
        );
      }

      return PersistenceError.unknown(error.message);
    }

    return PersistenceError.unknown(String(error));
  }
}
