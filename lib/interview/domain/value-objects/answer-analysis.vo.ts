export interface AnswerAnalysisProps {
  clarityScore: number;
  specificityScore: number;
  confidenceScore: number;
  feedback: string;
  detectedWeaknesses: string[];
}

export class AnswerAnalysis {
  public readonly clarityScore: number;
  public readonly specificityScore: number;
  public readonly confidenceScore: number;
  public readonly feedback: string;
  public readonly detectedWeaknesses: string[];

  private constructor(props: AnswerAnalysisProps) {
    this.clarityScore = props.clarityScore;
    this.specificityScore = props.specificityScore;
    this.confidenceScore = props.confidenceScore;
    this.feedback = props.feedback;
    this.detectedWeaknesses = props.detectedWeaknesses;
  }

  public static create(props: AnswerAnalysisProps): AnswerAnalysis {
    if (props.clarityScore < 0 || props.clarityScore > 100) throw new Error("Clarity score must be between 0 and 100.");
    if (props.specificityScore < 0 || props.specificityScore > 100) throw new Error("Specificity score must be between 0 and 100.");
    if (props.confidenceScore < 0 || props.confidenceScore > 100) throw new Error("Confidence score must be between 0 and 100.");
    
    return new AnswerAnalysis(props);
  }
}
