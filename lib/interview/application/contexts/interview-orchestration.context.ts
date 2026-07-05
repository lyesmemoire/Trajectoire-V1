import { InterviewSessionAggregate } from "../../domain/aggregates/interview-session.aggregate";
import { InterviewAnswer } from "../../domain/value-objects/interview-answer.vo";
import { AnswerAnalysis } from "../../domain/value-objects/answer-analysis.vo";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";

export class InterviewOrchestrationContext {
  public session!: InterviewSessionAggregate;
  public incomingAnswer!: InterviewAnswer;
  public analysis?: AnswerAnalysis;
  public isRecoveryTriggered: boolean = false;
  public suggestedStrategy: string = "transition";
  public nextQuestion?: InterviewQuestion;
}
