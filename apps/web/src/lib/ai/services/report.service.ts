
import AIClient from "../client";
import { AI_MODELS } from "../models";
import { REPORT_SYSTEM_PROMPT, REPORT_GENERATION_PROMPT } from "../prompts/report";
import { RetryManager } from "../retry/RetryManager";
import { ReportSchema } from "../schemas/report.schema";
import { ValidationError, ExternalServiceError } from "@/core/errors";

/**
 * Report Service
 * Handles report generation using AI
 * Returns JSON without writing to database
 */

export interface ReportInput {
  jobTitle: string;
  level: string;
  interviewType: string;
  durationMinutes: number;
  conversationHistory: string;
  cv?: string;
  userContext?: string;
  sessionId?: string;
  userId?: string;
  analysis?: any;
}

export interface ReportAnalysis {
  overallScore: number;
  communication: number;
  technical: number;
  confidence: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  recommendation: string;
  questionByQuestion?: Array<{
    messageId?: string; // propagated from qnaEvaluations, validated server-side
    question: string;
    answer: string;
    competency: string | null;
    score: number;
    whatWentWell: string[];
    whatWasMissing: string[];
    howToImprove: string[];
    betterAnswer: string;
  }>;
}

export class ReportService {
  /**
   * Generate a complete interview report
   * @param input - Report generation input data
   * @returns Report analysis
   */
  public static async generateReport(input: ReportInput): Promise<ReportAnalysis> {
    const client = AIClient.getInstance();

    // Build qnaContext from persisted evaluations if available
    const sessionAnalysis = input.analysis as Record<string, any> | null | undefined;
    const qnaEvaluations: any[] = Array.isArray(sessionAnalysis?.qnaEvaluations)
      ? sessionAnalysis!.qnaEvaluations
      : [];
    const interviewState = sessionAnalysis?.interviewState ?? null;
    const claims: any[] = Array.isArray(sessionAnalysis?.claims)
      ? sessionAnalysis!.claims
      : (Array.isArray(interviewState?.claims) ? interviewState.claims : []);
    const conflicts: any[] = Array.isArray(sessionAnalysis?.conflicts)
      ? sessionAnalysis!.conflicts
      : (Array.isArray(interviewState?.conflicts) ? interviewState.conflicts : []);

    let qnaContext = "";

    if (qnaEvaluations.length > 0) {
      // Build the trusted set of valid messageIds from persisted evaluations.
      // This is the only source of truth — the LLM is instructed to copy
      // these IDs verbatim but we validate them after generation.
      const evalLines = qnaEvaluations.map((qna: any, i: number) => {
        const e = qna.evaluation ?? {};
        const scores = [e.relevance, e.specificity, e.evidence, e.competencyScore]
          .filter((v) => typeof v === "number") as number[];
        const avg = scores.length > 0
          ? Math.round(scores.reduce((sum, v) => sum + v, 0) / scores.length)
          : null;
        return [
          `[Exchange ${i + 1}]`,
          // messageId is injected verbatim so the LLM can echo it back.
          // Server-side validation (below) ensures only known IDs survive.
          `MessageId: ${qna.messageId ?? "none"}`,
          `Competency: ${qna.competency ?? "N/A"}`,
          avg !== null ? `Pre-computed score: ${avg}` : "Pre-computed score: unavailable",
          `ConcreteExample: ${e.hasConcreteExample}`,
          `PersonalOwnership: ${e.hasPersonalOwnership}`,
          `Metrics: ${e.hasMetrics}`,
          `Outcome: ${e.hasOutcome}`,
          `CompetencyLevel: ${e.demonstratedCompetency}`,
          `MissingEvidence: ${(e.missingEvidence ?? []).join(", ") || "none"}`,
          `Reason: ${e.shortReason ?? ""}`,
        ].join("\n");
      });

      qnaContext += `\nEVALUATION DATA (pre-computed per answer — use these to derive scores):\n${evalLines.join("\n\n")}`;
    }

    if (claims.length > 0) {
      qnaContext += `\n\nCANDIDATE CLAIMS:\n${claims.map((c: any) => `- ${c.key}: "${c.value}" (turn ${c.sourceTurn})`).join("\n")}`;
    }

    if (conflicts.length > 0) {
      const openConflicts = conflicts.filter((c: any) => c.status === "OPEN");
      if (openConflicts.length > 0) {
        qnaContext += `\n\nCONTRADICTIONS DETECTED:\n${openConflicts.map((c: any) => `- ${c.key}: first said "${c.previousValue}" (turn ${c.previousTurn}), then "${c.newValue}" (turn ${c.currentTurn}) — severity: ${c.severity}`).join("\n")}`;
      }
    }

    const systemPrompt = REPORT_SYSTEM_PROMPT;
    const generationPrompt = REPORT_GENERATION_PROMPT(
      input.jobTitle,
      input.level,
      input.interviewType,
      input.durationMinutes,
      qnaContext,
    );

    const fullPrompt = `${systemPrompt}

Conversation History:
${input.conversationHistory}

${input.userContext ? `User Context: ${input.userContext}` : ''}

${input.cv ? `CV: ${input.cv}` : ''}`;

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.REPORT,
          messages: [
            { role: "system", content: fullPrompt },
            { role: "user", content: generationPrompt },
          ],
          temperature: 0.3,
          responseFormat: { type: "json_object" },
        });

        // Validate with Zod
        const parsed = JSON.parse(response.content);
        const validated = ReportSchema.safeParse(parsed);
        if (!validated.success) {
          throw new ValidationError(`Validation failed: ${validated.error.message}`);
        }

        return validated.data;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Report generation failed", "ReportService");
    }

    const llmOutput = result.data;

    // ── messageId validation ───────────────────────────────────────────────
    // The LLM is instructed to echo MessageId values from the context.
    // We NEVER trust what the LLM returned — we validate against the
    // trusted set built from qnaEvaluations. Unknown or duplicate IDs
    // are stripped so that no wrong audio can appear under a question.
    if (llmOutput.questionByQuestion && llmOutput.questionByQuestion.length > 0 && qnaEvaluations.length > 0) {
      // Build a map: messageId → qnaEvaluation (only those with a messageId)
      const validIdSet = new Set<string>(
        qnaEvaluations
          .map((qna: any) => qna.messageId)
          .filter((id: any): id is string => typeof id === "string" && id.length > 0)
      );

      const seenIds = new Set<string>();

      llmOutput.questionByQuestion = llmOutput.questionByQuestion.map((item: any) => {
        const llmId: unknown = (item as any).messageId;

        // Only accept a messageId if:
        // 1. It is a non-empty string
        // 2. It belongs to the trusted set from qnaEvaluations
        // 3. It has not already been used for another item (no duplicates)
        if (
          typeof llmId === "string" &&
          llmId.length > 0 &&
          validIdSet.has(llmId) &&
          !seenIds.has(llmId)
        ) {
          seenIds.add(llmId);
          return { ...item, messageId: llmId };
        }

        // Invalid / duplicate / hallucinated → replay disabled for this item
        const { messageId: _dropped, ...rest } = item as any;
        return rest;
      });
    }

    return llmOutput;
  }

  /**
   * Generate recommendations based on report
   * @param reportAnalysis - Existing report analysis
   * @param sessionId - Optional session ID for tracking
   * @param userId - Optional user ID for tracking
   * @returns Enhanced recommendations
   */
  public static async generateRecommendations(
    reportAnalysis: ReportAnalysis,
    sessionId?: string,
    userId?: string
  ): Promise<string> {
    const client = AIClient.getInstance();
    const actualSessionId = sessionId || "default";

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.REPORT,
          messages: [
            {
              role: "system",
              content: "Based on the interview performance, provide specific recommendations for improvement. Focus on areas that need immediate attention, skills to develop, and preparation strategies.",
            },
            {
              role: "user",
              content: JSON.stringify(reportAnalysis),
            },
          ],
          temperature: 0.4,
        });

        return response.content;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Recommendation generation failed", "ReportService");
    }

    return result.data;
  }
}
