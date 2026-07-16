// @ts-nocheck
import { describe, it, expect } from "vitest";
import { InMemoryStorageAdapter } from "../services/storage-adapter";
import { PostgresReportRepository } from "../services/postgres/report-repository";
import { ReportRecord } from "../contracts/storage";

describe("SIL Phase 2-D — Duplicate Persistence", () => {
  it("Should act idempotently when persisting the exact same report twice", async () => {
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);

    const report: ReportRecord = {
      reportId: "rep-123",
      sessionId: "sess-123",
      tenantId: "tenant-A",
      reportHash: "hash-ABC",
      evaluationHash: "hash-DEF",
      reportPayload: { score: 90 }
    };

    // First save
    await reportRepo.save("tenant-A", report);
    
    // Second save (simulating retry or duplicate event)
    await reportRepo.save("tenant-A", report);

    // Verify it exists and is exactly the single truth
    const rawStorage = await storageAdapter._dumpStore();
    const reportsCol = rawStorage.get("reports")!;
    
    expect(reportsCol.size).toBe(1); // Still exactly 1
    
    const loaded = await reportRepo.load("tenant-A", "rep-123");
    expect(loaded).toBeDefined();
    expect(loaded!.reportHash).toBe("hash-ABC");
  });
});
