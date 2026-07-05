import { Result } from "@/lib/core/result";
import { InterviewSessionAggregate } from "../domain/aggregates/interview-session.aggregate";
import { InterviewQuestion } from "../domain/value-objects/interview-question.vo";

export interface QuestionGeneratorPort {
  generateNextQuestion(
    session: InterviewSessionAggregate,
    strategy: string
  ): Promise<Result<InterviewQuestion>>;
}
