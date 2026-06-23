import { describe, it, expect } from "vitest";
import { ShardRouter } from "../sharding/shard-router";

describe("Phase 2-K: Node Routing Determinism", () => {
  it("should always route the same tenant to the same shard", () => {
    const router = new ShardRouter(5); // 5 shards
    
    const tenantA = "tenant-alpha";
    const tenantB = "tenant-beta";

    const shardA1 = router.getShard(tenantA);
    const shardA2 = router.getShard(tenantA);
    
    const shardB1 = router.getShard(tenantB);

    expect(shardA1).toBe(shardA2);
    // Even if we instantiate a new router with same cluster size
    const router2 = new ShardRouter(5);
    expect(router2.getShard(tenantA)).toBe(shardA1);
    expect(router2.getShard(tenantB)).toBe(shardB1);
  });

  it("should throw error if tenantId is not provided", () => {
    const router = new ShardRouter(3);
    expect(() => router.getShard("")).toThrow("tenantId required");
  });
});
