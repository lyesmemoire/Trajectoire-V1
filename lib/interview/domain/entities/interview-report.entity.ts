export interface InterviewReportEntity {
  id: string;
  sessionId: string;
  userId: string;
  jobTitle: string;
  questions: Array<{
    content: string;
    expectedSkills: string[];
  }>;
  answers: Array<{
    content: string;
    analysis: {
      clarityScore: number;
      specificityScore: number;
      confidenceScore: number;
      feedback: string;
      detectedWeaknesses: string[];
    };
  }>;
  scores: {
    clarity: number;
    specificity: number;
    confidence: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  readiness: "ready" | "needs_improvement" | "not_ready";
  createdAt: Date;
}
