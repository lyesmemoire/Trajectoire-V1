import { describe, it, expect } from "vitest";
import { InterviewStrategyService } from "../InterviewStrategyService";
import type { AnswerEvaluation } from "@/lib/ai/schemas/answer-evaluation.schema";
import type { UnifiedInterviewContext } from "@/application/interview-context/UnifiedInterviewContextService";

const mockContext: UnifiedInterviewContext = {
  version: 1,
  userId: "user-1",
  sessionId: "session-1",
  candidate: { cvId: null, fileName: null, cvText: "" },
  job: { title: "Dev", description: "", level: "Senior", interviewType: "RH" },
  matching: { reportId: null, score: 80, matchedSkills: [], missingSkills: ["React"], suggestions: [] },
  history: { previousSessionCount: 0, previousScores: [], averageScore: null },
  priorities: [],
  generatedAt: new Date().toISOString()
};

function buildMockEvaluation(overrides: Partial<AnswerEvaluation>): AnswerEvaluation {
  return {
    relevanceScore: 80,
    specificityScore: 80,
    evidenceScore: 80,
    competencyScore: 80,
    hasConcreteExample: true,
    hasPersonalOwnership: true,
    hasMetrics: true,
    hasOutcome: true,
    isVague: false,
    isEvasive: false,
    isTooShort: false,
    demonstratedCompetency: "strong",
    missingEvidence: [],
    recommendedAction: "NEXT_QUESTION",
    followUpType: null,
    shortReason: "OK",
    extractedClaims: [],
    claimConflicts: [],
    resolvedConflicts: [],
    ...overrides
  };
}

describe("Interview Decision Flow (Structured Evaluation)", () => {
  it("A. Réponse générique sans exemple → FOLLOW_UP / ASK_EXAMPLE", () => {
    const evaluation = buildMockEvaluation({
      recommendedAction: "FOLLOW_UP",
      followUpType: "ASK_EXAMPLE",
      missingEvidence: ["example"]
    });

    const strategy = InterviewStrategyService.build({
      context: mockContext,
      evaluation
    });

    expect(strategy.instructions.some(i => i.includes("exemple concret"))).toBe(true);
    
  });

  it("B. Bon exemple mais aucun rôle personnel → FOLLOW_UP / ASK_PERSONAL_ROLE", () => {
    const evaluation = buildMockEvaluation({
      recommendedAction: "FOLLOW_UP",
      followUpType: "ASK_PERSONAL_ROLE",
      missingEvidence: ["personal_role"]
    });

    const strategy = InterviewStrategyService.build({
      context: mockContext,
      evaluation
    });

    expect(strategy.instructions.some(i => i.includes("rôle individuel"))).toBe(true);
  });

  it("C. Rôle clair mais aucun résultat → FOLLOW_UP / ASK_RESULT", () => {
    const evaluation = buildMockEvaluation({
      recommendedAction: "FOLLOW_UP",
      followUpType: "ASK_RESULT",
      missingEvidence: ["result"]
    });

    const strategy = InterviewStrategyService.build({
      context: mockContext,
      evaluation
    });

    expect(strategy.instructions.some(i => i.includes("résultat final"))).toBe(true);
  });

  it("D. Exemple + rôle + résultat + métriques → NEXT_QUESTION", () => {
    const evaluation = buildMockEvaluation({
      recommendedAction: "NEXT_QUESTION",
      followUpType: null,
      missingEvidence: []
    });

    const strategy = InterviewStrategyService.build({
      context: mockContext,
      evaluation
    });

    expect(strategy.recruiterBehavior.allowTopicChange).toBe(true);
  });

  it("E. Réponse très vague → FOLLOW_UP / CLARIFY", () => {
    const evaluation = buildMockEvaluation({
      recommendedAction: "FOLLOW_UP",
      followUpType: "CLARIFY",
      missingEvidence: ["clarification"]
    });

    const strategy = InterviewStrategyService.build({
      context: mockContext,
      evaluation
    });

    expect(strategy.instructions.some(i => i.includes("clarifier"))).toBe(true);
    expect(strategy.focus).toBe("clarification");
  });

  it("F. Échec fournisseur IA → fallback actuel", () => {
    // Le fallback est exécuté dans l'AnswerEvaluator et renvoie une AnswerEvaluation générée par les regex
    // On simule ce que le fallback produirait pour une réponse sans métrique
    const fallbackEval = buildMockEvaluation({
      recommendedAction: "FOLLOW_UP",
      followUpType: "ASK_METRIC",
      missingEvidence: ["metrics"],
      shortReason: "Évaluation via Regex (Fallback technique)"
    });

    const strategy = InterviewStrategyService.build({
      context: mockContext,
      evaluation: fallbackEval
    });

    
    expect(strategy.instructions.some(i => i.includes("métriques"))).toBe(true);
  });
});

