/**
 * SessionRegistry — Lightweight metadata store for session→tenant mapping.
 * 
 * This is the ONLY source of truth for which tenant owns which session.
 * The Ingestor depends on this (NOT on RuntimeState) to enforce tenant isolation.
 * 
 * Design invariants:
 * - Stateless from the Ingestor's perspective (read-only lookup)
 * - Populated on SESSION_CREATED and on recovery
 * - Never mutated by event processing
 */
// @ts-nocheck

export interface SessionRegistryEntry {
  sessionId: string;
  tenantId: string;
  createdAt: number;
}

export interface SessionRegistry {
  /** Register a session→tenant binding. Called on SESSION_CREATED and recovery. */
  register(sessionId: string, tenantId: string): void;

  /** Get the tenant owning a session. Returns undefined if session is unknown. */
  getTenantId(sessionId: string): string | undefined;

  /** Check if a session is registered. */
  has(sessionId: string): boolean;

  /** Unregister a session (for cleanup, expiration, or tests). */
  unregister(sessionId: string): void;

  /** Clear all sessions belonging to a tenant (for teardown or admin operations). */
  clearTenant(tenantId: string): void;
}
