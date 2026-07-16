// @ts-nocheck
import { InterviewOrchestrationContext } from "../../../contexts/interview-orchestration.context";
import { QuestionGeneratorPort } from "../../../../ports/question-generator.port";
import { Result, ok, fail } from "@/lib/core/result";

export class GenerateQuestionStep {
  constructor(private readonly generator: QuestionGeneratorPort) {}

  async execute(context: InterviewOrchestrationContext): Promise<Result<void>> {
    const questionResult = await this.generator.generateNextQuestion(
      context.session,
      context.suggestedStrategy
    );

    if (questionResult.isFailure()) return fail(questionResult.unwrapError());

    context.nextQuestion = questionResult.unwrap();
    
    return ok(undefined);
  }
}
