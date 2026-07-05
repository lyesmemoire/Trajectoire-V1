export interface InterviewAnswerProps {
  content: string;
  submittedAt: Date;
  metrics?: {
    silenceDuration?: number;
    wordCount?: number;
    consecutiveHesitations?: number;
  };
}

export class InterviewAnswer {
  public readonly content: string;
  public readonly submittedAt: Date;
  public readonly metrics?: InterviewAnswerProps["metrics"];

  private constructor(props: InterviewAnswerProps) {
    this.content = props.content;
    this.submittedAt = props.submittedAt;
    this.metrics = props.metrics;
  }

  public static create(props: InterviewAnswerProps): InterviewAnswer {
    if (!props.content || props.content.trim() === "") {
      throw new Error("Answer content cannot be empty.");
    }
    return new InterviewAnswer(props);
  }
}
