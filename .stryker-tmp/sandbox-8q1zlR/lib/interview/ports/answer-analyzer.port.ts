// @ts-nocheck
import { Result } from "@/lib/core/result";
import { AnswerAnalysis } from "../domain/value-objects/answer-analysis.vo";
import { InterviewAnswer } from "../domain/value-objects/interview-answer.vo";
import { InterviewQuestion } from "../domain/value-objects/interview-question.vo";

export interface AnswerAnalyzerPort {
  analyze(
    answer: InterviewAnswer,
    question: InterviewQuestion
  ): Promise<Result<AnswerAnalysis>>;
}
