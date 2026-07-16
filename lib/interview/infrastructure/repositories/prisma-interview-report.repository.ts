import { prisma } from "@/lib/prisma";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { InterviewReportEntity } from "../../domain/entities/interview-report.entity";
import { InterviewReportRepositoryPort } from "../../ports/interview-report-repository.port";

type InterviewReportAnalysis = {
  type: "interview_report";
  jobTitle: string;
  questions: Array<{
    content: string;
    expectedSkills: string[];
  }>;
  answers: Array<{
    content: string;
    analysis: {
      clarityScore: number;
      specificityScore: number;
      confidenceScore: number;
      feedback: string;
      detectedWeaknesses: string[];
    };
  }>;
  scores: {
    clarity: number;
    specificity: number;
    confidence: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  readiness: "ready" | "needs_improvement" | "not_ready";
};

function isInterviewReportAnalysis(data: unknown): data is InterviewReportAnalysis {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    data.type === "interview_report" &&
    "jobTitle" in data &&
    "questions" in data &&
    "answers" in data &&
    "scores" in data &&
    "strengths" in data &&
    "weaknesses" in data &&
    "recommendations" in data &&
    "readiness" in data
  );
}

export class PrismaInterviewReportRepository implements InterviewReportRepositoryPort {
  async saveReport(report: Omit<InterviewReportEntity, "id" | "createdAt">): Promise<Result<InterviewReportEntity>> {
    try {
      const analysis: InterviewReportAnalysis = {
        type: "interview_report",
        jobTitle: report.jobTitle,
        questions: report.questions,
        answers: report.answers,
        scores: report.scores,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.recommendations,
        readiness: report.readiness,
      };

      const created = await prisma.interviewSession.update({
        where: { id: report.sessionId },
        data: {
          analysis: analysis as any,
          completedAt: new Date(),
        },
      });

      const savedAnalysis = created.analysis;
      if (!isInterviewReportAnalysis(savedAnalysis)) {
        return fail(new InfrastructureError("Invalid analysis structure"));
      }

      return ok({
        id: created.id,
        sessionId: created.id,
        userId: created.userId || report.userId,
        jobTitle: savedAnalysis.jobTitle,
        questions: savedAnalysis.questions,
        answers: savedAnalysis.answers,
        scores: savedAnalysis.scores,
        strengths: savedAnalysis.strengths,
        weaknesses: savedAnalysis.weaknesses,
        recommendations: savedAnalysis.recommendations,
        readiness: savedAnalysis.readiness,
        createdAt: created.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save interview report";
      return fail(new InfrastructureError(message));
    }
  }

  async getLatestReport(sessionId: string): Promise<Result<InterviewReportEntity>> {
    try {
      const session = await prisma.interviewSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) return fail(new InfrastructureError("Interview session not found"));

      const analysis = session.analysis;
      if (!isInterviewReportAnalysis(analysis)) {
        return fail(new InfrastructureError("Interview report not found for this session"));
      }

      return ok({
        id: session.id,
        sessionId: session.id,
        userId: session.userId || "",
        jobTitle: analysis.jobTitle,
        questions: analysis.questions,
        answers: analysis.answers,
        scores: analysis.scores,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        recommendations: analysis.recommendations,
        readiness: analysis.readiness,
        createdAt: session.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to get interview report";
      return fail(new InfrastructureError(message));
    }
  }
}
