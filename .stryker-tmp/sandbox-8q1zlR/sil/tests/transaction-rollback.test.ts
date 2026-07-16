// @ts-nocheck
import { describe, it, expect } from "vitest";
import { InMemoryStorageAdapter } from "../services/storage-adapter";
import { PostgresReportRepository } from "../services/postgres/report-repository";
import { ReportRecord } from "../contracts/storage";

describe("SIL Phase 2-D — Transaction Rollback", () => {
  it("Should rollback partial writes if a transaction is aborted", async () => {
    const storageAdapter = new InMemoryStorageAdapter();
    const reportRepo = new PostgresReportRepository(storageAdapter);

    const report: ReportRecord = {
      reportId: "rep-tx-1",
      sessionId: "sess-tx-1",
      tenantId: "tenant-A",
      reportHash: "hash-A",
      evaluationHash: "hash-B",
      reportPayload: {}
    };

    const tx = await storageAdapter.transaction();
    await tx.begin();

    // Partial write
    await reportRepo.save("tenant-A", report, tx);

    // Simulate failure
    await tx.rollback();

    // Verify state is clean
    const rawStorage = await storageAdapter._dumpStore();
    expect(rawStorage.has("reports")).toBe(false);

    const loaded = await reportRepo.load("tenant-A", "rep-tx-1");
    expect(loaded).toBeNull();
  });
});
