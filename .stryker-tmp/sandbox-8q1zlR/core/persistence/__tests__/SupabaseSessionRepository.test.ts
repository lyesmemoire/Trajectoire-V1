/**
 * Supabase Session Repository Tests
 *
 * Tests for SupabaseSessionRepository implementation.
 * Tests cover save, update, restore, close, delete operations.
 */
// @ts-nocheck


import { describe, it, expect, beforeEach, vi } from "vitest";
import { SupabaseSessionRepositoryImpl } from "../repositories/SupabaseSessionRepository";
import { SessionSnapshotMapperImpl } from "../mappers/SessionSnapshotMapper";
import { ChecksumServiceImpl } from "../services/ChecksumService";
import { SessionSnapshot } from "../types";
import { PersistenceError } from "../errors/PersistenceError";

// ============================================================================
// MOCKS
// ============================================================================

const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  update: vi.fn(() => mockSupabase),
  delete: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  single: vi.fn(() => mockSupabase),
} as any;

vi.mock("../../../lib/db/client", () => ({
  getServerDb: vi.fn(() => Promise.resolve(mockSupabase)),
}));

// ============================================================================
// TEST DATA
// ============================================================================

const createMockSnapshot = (
  sessionId: string = "test-session-1",
): SessionSnapshot => ({
  sessionId,
  candidateId: "candidate-123",
  startedAt: new Date("2026-07-11T10:00:00Z"),
  endedAt: undefined,
  duration: undefined,
  runtimeState: { state: "running", provider: "openai" },
  providerState: { connected: true },
  audioState: { muted: false },
  pipelineState: { active: true },
  timeline: [{ event: "start", timestamp: "2026-07-11T10:00:00Z" }],
  correlationIds: ["corr-1", "corr-2"],
  diagnostics: { health: "good" },
  metadata: { version: "1.0" },
  errors: [],
  events: [],
  lastSavedAt: undefined,
  saveCount: 0,
});

// ============================================================================
// TEST SUITE
// ============================================================================

describe("SupabaseSessionRepository", () => {
  let repository: SupabaseSessionRepositoryImpl;
  let mapper: SessionSnapshotMapperImpl;
  let checksumService: ChecksumServiceImpl;

  beforeEach(() => {
    vi.clearAllMocks();
    mapper = new SessionSnapshotMapperImpl();
    checksumService = new ChecksumServiceImpl();
    repository = new SupabaseSessionRepositoryImpl(mapper, checksumService);

    // Reset all mock calls
    mockSupabase.from.mockClear();
    mockSupabase.insert.mockClear();
    mockSupabase.update.mockClear();
    mockSupabase.delete.mockClear();
    mockSupabase.select.mockClear();
    mockSupabase.eq.mockClear();
    mockSupabase.single.mockClear();
  });

  describe("saveSession", () => {
    it("should save session successfully", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: { session_id: snapshot.sessionId },
        error: null,
      });

      const result = await repository.saveSession(snapshot);

      expect(result).toBe(snapshot.sessionId);
      expect(mockSupabase.from).toHaveBeenCalledWith("runtime_sessions");
      expect(mockSupabase.insert).toHaveBeenCalled();
      expect(mockSupabase.single).toHaveBeenCalled();
    });

    it("should handle duplicate session error", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "23505", message: "duplicate key" },
      });

      await expect(repository.saveSession(snapshot)).rejects.toThrow(
        PersistenceError,
      );
    });

    it("should handle connection error", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "ECONNREFUSED", message: "Connection refused" },
      });

      await expect(repository.saveSession(snapshot)).rejects.toThrow(
        PersistenceError,
      );
    });

    it("should handle timeout error", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "ETIMEDOUT", message: "Timeout" },
      });

      await expect(repository.saveSession(snapshot)).rejects.toThrow(
        PersistenceError,
      );
    });
  });

  describe("updateSession", () => {
    it("should update session successfully", async () => {
      const snapshot = createMockSnapshot();
      snapshot.saveCount = 1;

      mockSupabase.single.mockResolvedValueOnce({
        data: { session_id: snapshot.sessionId },
        error: null,
      });

      await repository.updateSession(snapshot);

      expect(mockSupabase.from).toHaveBeenCalledWith("runtime_sessions");
      expect(mockSupabase.update).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith(
        "session_id",
        snapshot.sessionId,
      );
    });

    it("should handle not found error", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "Not found" },
      });

      await expect(repository.updateSession(snapshot)).rejects.toThrow(
        PersistenceError,
      );
    });
  });

  describe("closeSession", () => {
    it("should close session successfully", async () => {
      const snapshot = createMockSnapshot();
      snapshot.endedAt = new Date("2026-07-11T11:00:00Z");
      snapshot.duration = 3600;

      mockSupabase.single.mockResolvedValueOnce({
        data: { session_id: snapshot.sessionId },
        error: null,
      });

      await repository.closeSession(snapshot);

      expect(mockSupabase.from).toHaveBeenCalledWith("runtime_sessions");
      expect(mockSupabase.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: "closed" }),
      );
    });
  });

  describe("restoreSession", () => {
    it("should restore session successfully", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: "db-id-1",
          session_id: snapshot.sessionId,
          candidate_id: snapshot.candidateId,
          status: "active",
          started_at: snapshot.startedAt.toISOString(),
          ended_at: null,
          duration: null,
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
          last_saved_at: null,
          save_count: 1,
          checksum: "abc123",
          created_at: snapshot.startedAt.toISOString(),
          updated_at: snapshot.startedAt.toISOString(),
        },
        error: null,
      });

      const result = await repository.restoreSession(snapshot.sessionId);

      expect(result).not.toBeNull();
      expect(result?.sessionId).toBe(snapshot.sessionId);
      expect(result?.candidateId).toBe(snapshot.candidateId);
    });

    it("should return null when session not found", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "Not found" },
      });

      const result = await repository.restoreSession("non-existent-session");

      expect(result).toBeNull();
    });

    it("should handle checksum mismatch", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: "db-id-1",
          session_id: snapshot.sessionId,
          candidate_id: snapshot.candidateId,
          status: "active",
          started_at: snapshot.startedAt.toISOString(),
          ended_at: null,
          duration: null,
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
          last_saved_at: null,
          save_count: 1,
          checksum: "wrong-checksum", // Wrong checksum
          created_at: snapshot.startedAt.toISOString(),
          updated_at: snapshot.startedAt.toISOString(),
          user_id: null,
          version: "1.0",
          closed_at: null,
        },
        error: null,
      });

      await expect(
        repository.restoreSession(snapshot.sessionId),
      ).rejects.toThrow();
    });

    it("should only restore active sessions", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          id: "db-id-1",
          session_id: "test-session",
          candidate_id: "candidate-123",
          status: "closed", // Closed session
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
          duration: 3600,
          runtime_state: {},
          provider_state: {},
          audio_state: {},
          pipeline_state: {},
          timeline: [],
          correlation_ids: [],
          diagnostics: {},
          metadata: {},
          errors: [],
          events: [],
          last_saved_at: null,
          save_count: 1,
          checksum: "abc123",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: null,
          version: "1.0",
          closed_at: new Date().toISOString(),
        },
        error: null,
      });

      const result = await repository.restoreSession("test-session");

      expect(result).toBeNull();
    });
  });

  describe("deleteSession", () => {
    it("should delete session successfully", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await repository.deleteSession("test-session");

      expect(mockSupabase.from).toHaveBeenCalledWith("runtime_sessions");
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith(
        "session_id",
        "test-session",
      );
    });
  });

  describe("getPersistenceStatus", () => {
    it("should return persistence status for existing session", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: {
          session_id: "test-session",
          last_saved_at: new Date().toISOString(),
          save_count: 5,
          status: "active",
        },
        error: null,
      });

      const status = await repository.getPersistenceStatus("test-session");

      expect(status.sessionId).toBe("test-session");
      expect(status.isPersisted).toBe(true);
      expect(status.saveCount).toBe(5);
      expect(status.syncStatus).toBe("synced");
    });

    it("should return pending status for non-existent session", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "PGRST116", message: "Not found" },
      });

      const status = await repository.getPersistenceStatus(
        "non-existent-session",
      );

      expect(status.sessionId).toBe("non-existent-session");
      expect(status.isPersisted).toBe(false);
      expect(status.saveCount).toBe(0);
      expect(status.syncStatus).toBe("pending");
    });

    it("should return error status on error", async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: null,
        error: { code: "500", message: "Internal server error" },
      });

      const status = await repository.getPersistenceStatus("test-session");

      expect(status.sessionId).toBe("test-session");
      expect(status.isPersisted).toBe(false);
      expect(status.syncStatus).toBe("error");
      expect(status.lastError).toBeDefined();
    });
  });

  describe("checksum calculation", () => {
    it("should generate consistent checksums for same data", async () => {
      const snapshot = createMockSnapshot();

      mockSupabase.single.mockResolvedValueOnce({
        data: { session_id: snapshot.sessionId },
        error: null,
      });

      await repository.saveSession(snapshot);

      // The same data should produce the same checksum
      const firstCall = mockSupabase.insert.mock.calls[0];
      if (!firstCall) throw new Error("First call not found");
      const firstChecksum = (firstCall[0] as any).checksum;

      mockSupabase.single.mockResolvedValueOnce({
        data: { session_id: snapshot.sessionId },
        error: null,
      });

      await repository.saveSession(snapshot);

      const secondCall = mockSupabase.insert.mock.calls[1];
      if (!secondCall) throw new Error("Second call not found");
      const secondChecksum = (secondCall[0] as any).checksum;

      expect(firstChecksum).toBe(secondChecksum);
    });
  });
});
