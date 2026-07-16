// @ts-nocheck
import { describe, it, expect, beforeEach } from "vitest";
import { SILIngestor } from "../../services/ingestor";
import { CryptoEventVerifier } from "../../services/crypto-event-verifier";
import { MockTenantKeyManager, signEventForTest } from "./crypto-test-helper";
import { MemoryEventStore } from "../../services/memory-event-store";
import { MemorySessionRegistry } from "../../services/memory-session-registry";

describe("SILIngestor Security Integrations", () => {
  let keyManager: MockTenantKeyManager;
  let verifier: CryptoEventVerifier;
  let store: MemoryEventStore;
  let registry: MemorySessionRegistry;
  let ingestor: SILIngestor;

  const TENANT = "tenant-sec";
  const SECRET = "secret-sec";

  const mockWakeup = {
    notify: async () => {}
  };

  beforeEach(() => {
    keyManager = new MockTenantKeyManager();
    keyManager.setSecret(TENANT, SECRET);
    verifier = new CryptoEventVerifier(keyManager);
    store = new MemoryEventStore();
    registry = new MemorySessionRegistry();
    ingestor = new SILIngestor(verifier, store, registry, mockWakeup);
  });

  it("duplicate-event-id.test.ts: should silently drop duplicate events (idempotency)", async () => {
    const event = signEventForTest({
      eventId: "dupe-1",
      type: "SESSION_CREATED",
      sessionId: "s1",
      tenantId: TENANT,
      timestamp: Date.now(),
    }, SECRET);

    // First ingestion should succeed
    await ingestor.ingest(event);
    const history1 = await store.readAfter(TENANT, "s1", -1);
    expect(history1.length).toBe(1);

    // Second ingestion with same eventId should be ignored
    await ingestor.ingest(event);
    const history2 = await store.readAfter(TENANT, "s1", -1);
    expect(history2.length).toBe(1); // Still 1, not appended again
  });
});
