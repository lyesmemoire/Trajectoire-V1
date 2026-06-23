import { ReportRepository, ReportRecord, StorageAdapter, StorageTransaction } from "../../contracts/storage";

export class PostgresReportRepository implements ReportRepository {
  constructor(private adapter: StorageAdapter) {}

  async save(tenantId: string, report: ReportRecord, tx?: StorageTransaction): Promise<void> {
    await this.adapter.saveRecord("reports", tenantId, report.reportId, report, tx);
  }

  async load(tenantId: string, reportId: string): Promise<ReportRecord | null> {
    return this.adapter.loadRecord<ReportRecord>("reports", tenantId, reportId);
  }
}
