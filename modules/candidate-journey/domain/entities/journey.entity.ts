export type JourneyStep = 
  | "CV_UPLOAD"
  | "CAREER_PROFILE"
  | "JOB_OFFER_IMPORT"
  | "ATS_ANALYSIS"
  | "CV_OPTIMIZATION"
  | "INTERVIEW_SIMULATION"
  | "FINAL_REPORT";

export type JourneyStatus = 
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export interface JourneyData {
  userId: string;
  cvId?: string;
  cvUrl?: string;
  careerProfileId?: string;
  profileExtraction?: any;
  jobOfferId?: string;
  jobOfferDescription?: string;
  atsAnalysisResult?: {
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  optimizedCvId?: string;
  optimizedCvText?: string;
  interviewSessionId?: string;
  finalReport?: {
    overall_assessment: string;
    dimension_scores: {
      structure: number;
      specificity: number;
      impact: number;
      adaptability: number;
    };
    strengths: string[];
    development_areas: Array<{
      area: string;
      observation: string;
      recommendation: string;
    }>;
    cv_coherence: {
      is_coherent: boolean;
      discrepancies: string[];
    };
    readiness_level: "NOT_READY" | "DEVELOPING" | "READY" | "EXCELLENT";
  };
}

export interface Journey {
  id: string;
  userId: string;
  currentStep: JourneyStep;
  status: JourneyStatus;
  data: JourneyData;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}
