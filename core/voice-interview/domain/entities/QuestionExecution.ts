import type { QuestionId, TopicId, StressLevel, MunitionId } from "../types.js";

export interface QuestionExecutionProps {
  questionId: QuestionId | MunitionId;
  topic: TopicId;
  attempts: number;
  isMunition: boolean;
  stressLevel: StressLevel | null;
  success: boolean;
  abandoned: boolean;
}

export class QuestionExecution {
  private _attempts: number;
  private _success: boolean;
  private _abandoned: boolean;

  private constructor(
    public readonly id: QuestionId | MunitionId,
    public readonly topic: TopicId,
    public readonly isMunition: boolean,
    public readonly stressLevel: StressLevel | null,
    attempts: number,
    success: boolean,
    abandoned: boolean
  ) {
    this._attempts = attempts;
    this._success = success;
    this._abandoned = abandoned;
  }

  public static createNew(id: QuestionId | MunitionId, topic: TopicId, isMunition: boolean, stressLevel: StressLevel | null): QuestionExecution {
    return new QuestionExecution(id, topic, isMunition, stressLevel, 1, false, false);
  }

  public static reconstitute(props: QuestionExecutionProps): QuestionExecution {
    return new QuestionExecution(
      props.questionId,
      props.topic,
      props.isMunition,
      props.stressLevel,
      props.attempts,
      props.success,
      props.abandoned
    );
  }

  public get attempts(): number { return this._attempts; }
  public get success(): boolean { return this._success; }
  public get abandoned(): boolean { return this._abandoned; }

  public recordRetry(): void {
    if (this._success || this._abandoned) {
      throw new Error("Cannot retry a question that is already succeeded or abandoned");
    }
    this._attempts += 1;
  }

  public markSuccess(): void {
    if (this._abandoned) {
      throw new Error("Cannot succeed an abandoned question");
    }
    this._success = true;
  }

  public markAbandoned(): void {
    if (this._success) {
      throw new Error("Cannot abandon a succeeded question");
    }
    this._abandoned = true;
  }
}
