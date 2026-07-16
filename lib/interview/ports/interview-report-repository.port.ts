import { Result } from "@/lib/core/result";
import { InterviewReportEntity } from "../domain/entities/interview-report.entity";

export interface InterviewReportRepositoryPort {
  saveReport(report: Omit<InterviewReportEntity, "id" | "createdAt">): Promise<Result<InterviewReportEntity>>;
  getLatestReport(sessionId: string): Promise<Result<InterviewReportEntity>>;
}
