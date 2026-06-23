import { SessionRegistry, SessionRegistryEntry } from "../contracts/session-registry";

/**
 * In-memory implementation of SessionRegistry.
 * 
 * Production would use Redis/Postgres for persistence across pod restarts.
 * This implementation is sufficient for single-process and test scenarios.
 */
export class MemorySessionRegistry implements SessionRegistry {
  private registry: Map<string, SessionRegistryEntry> = new Map();

  register(sessionId: string, tenantId: string): void {
    if (!sessionId || !tenantId) {
      throw new Error(`SessionRegistry: Cannot register with empty sessionId=${sessionId} or tenantId=${tenantId}`);
    }

    const existing = this.registry.get(sessionId);
    if (existing && existing.tenantId !== tenantId) {
      // This should never happen if the Ingestor enforces correctly.
      // If it does, it's a critical invariant violation.
      throw new Error(
        `SessionRegistry: INVARIANT VIOLATION — session ${sessionId} already registered to tenant ${existing.tenantId}, cannot re-register to ${tenantId}`
      );
    }

    if (!existing) {
      this.registry.set(sessionId, {
        sessionId,
        tenantId,
        createdAt: Date.now(),
      });
    }
  }

  getTenantId(sessionId: string): string | undefined {
    return this.registry.get(sessionId)?.tenantId;
  }

  has(sessionId: string): boolean {
    return this.registry.has(sessionId);
  }

  unregister(sessionId: string): void {
    this.registry.delete(sessionId);
  }

  clearTenant(tenantId: string): void {
    for (const [sessionId, entry] of this.registry) {
      if (entry.tenantId === tenantId) {
        this.registry.delete(sessionId);
      }
    }
  }
}
