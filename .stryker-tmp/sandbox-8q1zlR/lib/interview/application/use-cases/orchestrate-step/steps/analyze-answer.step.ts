// @ts-nocheck
import { InterviewOrchestrationContext } from "../../../contexts/interview-orchestration.context";
import { AnswerAnalyzerPort } from "../../../../ports/answer-analyzer.port";
import { Result, ok, fail } from "@/lib/core/result";
import { InterviewQuestion } from "../../../../domain/value-objects/interview-question.vo";
import { Clock } from "@/lib/core/time/Clock";

export class AnalyzeAnswerStep {
  constructor(private readonly analyzer: AnswerAnalyzerPort) {}

  async execute(context: InterviewOrchestrationContext, currentQuestionContent: string): Promise<Result<void>> {
    // Recreate the value object for the current question
    const question = InterviewQuestion.create({
      content: currentQuestionContent,
      generatedAt: Clock.now(),
    });

    const analysisResult = await this.analyzer.analyze(context.incomingAnswer, question);
    
    if (analysisResult.isFailure()) return fail(analysisResult.unwrapError());

    context.analysis = analysisResult.unwrap();
    
    return ok(undefined);
  }
}
