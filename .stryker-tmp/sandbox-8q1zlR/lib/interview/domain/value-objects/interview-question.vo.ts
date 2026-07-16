// @ts-nocheck
export interface InterviewQuestionProps {
  content: string;
  expectedSkills?: string[];
  intent?: string;
  generatedAt: Date;
}

export class InterviewQuestion {
  public readonly content: string;
  public readonly expectedSkills?: string[];
  public readonly intent?: string;
  public readonly generatedAt: Date;

  private constructor(props: InterviewQuestionProps) {
    this.content = props.content;
    this.expectedSkills = props.expectedSkills;
    this.intent = props.intent;
    this.generatedAt = props.generatedAt;
  }

  public static create(props: InterviewQuestionProps): InterviewQuestion {
    if (!props.content || props.content.trim() === "") {
      throw new Error("Question content cannot be empty.");
    }
    return new InterviewQuestion(props);
  }
}
