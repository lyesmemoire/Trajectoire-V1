import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { Clock } from "@/lib/core/clock/Clock";
import { InterviewState, InterviewStateMachine } from "./interview-state-machine";
import { InterviewQuestion } from "../value-objects/interview-question.vo";
import { InterviewAnswer } from "../value-objects/interview-answer.vo";
import { AnswerAnalysis } from "../value-objects/answer-analysis.vo";
import { PressureLevel } from "../value-objects/pressure-level.vo";
import { Persona } from "../value-objects/persona.vo";
import {
  InterviewStarted,
  AnswerSubmitted,
  RecoveryTriggered,
  InterviewPressureAdjusted,
  InterviewCompleted,
  InterviewStepOrchestrated
} from "../events/interview-events";

export interface InterviewSessionProps {
  userId: string;
  jobTitle: string;
  jobDescription?: string;
  cvId?: string;
  candidateSummary?: string;
  questions: InterviewQuestion[];
  answers: Array<{ answer: InterviewAnswer; analysis?: AnswerAnalysis }>;
  currentState: InterviewState;
  pressureLevel: PressureLevel;
  persona: Persona;
  startTime: Date;
  endTime?: Date;
}

export class InterviewSessionAggregate extends AggregateRoot {
  public readonly id: string;
  public props: InterviewSessionProps;
  private readonly clock: Clock;

  private constructor(id: string, props: InterviewSessionProps, clock: Clock) {
    super();
    this.id = id;
    this.props = props;
    this.clock = clock;
  }

  public static create(
    id: string,
    userId: string,
    jobTitle: string,
    persona: Persona,
    clock: Clock,
    jobDescription?: string,
    cvId?: string,
    candidateSummary?: string
  ): InterviewSessionAggregate {
    const aggregate = new InterviewSessionAggregate(id, {
      userId,
      jobTitle,
      jobDescription,
      cvId,
      candidateSummary,
      questions: [],
      answers: [],
      currentState: "READY",
      pressureLevel: PressureLevel.create(20),
      persona,
      startTime: clock.now(),
    }, clock);

    aggregate.recordEvent(new InterviewStarted(aggregate.id, {
      userId,
      jobTitle,
    }));

    return aggregate;
  }

  public static load(id: string, props: InterviewSessionProps, clock: Clock): InterviewSessionAggregate {
    return new InterviewSessionAggregate(id, props, clock);
  }

  // Getters
  get userId(): string { return this.props.userId; }
  get currentState(): InterviewState { return this.props.currentState; }
  get pressureLevel(): PressureLevel { return this.props.pressureLevel; }
  get questions(): InterviewQuestion[] { return [...this.props.questions]; }
  get answers(): Array<{ answer: InterviewAnswer; analysis?: AnswerAnalysis }> { return [...this.props.answers]; }
  get persona(): Persona { return this.props.persona; }

  // Business Methods

  public advance(nextState: InterviewState): void {
    if (!InterviewStateMachine.isValidTransition(this.props.currentState, nextState)) {
      throw new Error(`Invalid state transition from ${this.props.currentState} to ${nextState}`);
    }
    this.props.currentState = nextState;
  }

  public addQuestion(question: InterviewQuestion): void {
    this.props.questions.push(question);
  }

  public submitAnswer(answer: InterviewAnswer, analysis: AnswerAnalysis): void {
    this.props.answers.push({ answer, analysis });
    
    this.recordEvent(new AnswerSubmitted(this.id, {
      answerContent: answer.content,
    }));
  }

  public orchestrateStep(isRecovery: boolean): void {
    this.recordEvent(new InterviewStepOrchestrated(this.id, {
      step: isRecovery ? "RECOVERY" : "STANDARD",
    }));
  }

  public adjustPressure(newPressure: PressureLevel): void {
    const oldPressure = this.props.pressureLevel;
    this.props.pressureLevel = newPressure;

    this.recordEvent(new InterviewPressureAdjusted(this.id, {
      previousPressure: oldPressure.value,
      newPressure: newPressure.value,
    }));
  }

  public triggerRecovery(newPressure: PressureLevel): void {
    const oldPressure = this.props.pressureLevel;
    this.props.pressureLevel = newPressure;
    this.advance("RECOVERY");

    this.recordEvent(new RecoveryTriggered(this.id, {
      previousPressure: oldPressure.value,
      newPressure: newPressure.value,
    }));
  }

  public finish(): void {
    this.advance("COMPLETED");
    this.props.endTime = this.clock.now();

    this.recordEvent(new InterviewCompleted(this.id, {
      finalPressure: this.props.pressureLevel.value,
    }));
  }
}
