// @ts-nocheck
import { AnswerAnalyzerPort } from "../../ports/answer-analyzer.port";
import { InterviewAnswer } from "../../domain/value-objects/interview-answer.vo";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";
import { AnswerAnalysis } from "../../domain/value-objects/answer-analysis.vo";
import { Result, ok } from "@/lib/core/result";

export class OpenAiAnswerAnalyzerAdapter implements AnswerAnalyzerPort {
  async analyze(
    answer: InterviewAnswer,
    question: InterviewQuestion
  ): Promise<Result<AnswerAnalysis>> {
    // Dans une implémentation réelle, on appellerait OpenAI pour évaluer la réponse.

    const mockAnalysis = AnswerAnalysis.create({
      clarityScore: 75,
      specificityScore: 70,
      confidenceScore: 80,
      feedback: "Bonne réponse, mais manque de détails sur le résultat.",
      detectedWeaknesses: ["too_generic"]
    });

    return ok(mockAnalysis);
  }
}
