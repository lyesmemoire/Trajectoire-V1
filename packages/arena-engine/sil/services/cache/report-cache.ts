import { StorageAdapter, ReportRecord } from "../../contracts/storage";

export class RedisReportCache {
  constructor(private adapter: StorageAdapter) {}

  async set(tenantId: string, report: ReportRecord): Promise<void> {
    await this.adapter.saveRecord<ReportRecord>("cache_reports", tenantId, report.reportId, report);
  }

  async get(tenantId: string, reportId: string): Promise<ReportRecord | null> {
    return this.adapter.loadRecord<ReportRecord>("cache_reports", tenantId, reportId);
  }

  async delete(tenantId: string, reportId: string): Promise<void> {
    // To 'delete' in this mock cache, we save null
    await this.adapter.saveRecord<any>("cache_reports", tenantId, reportId, null as any);
  }
}
