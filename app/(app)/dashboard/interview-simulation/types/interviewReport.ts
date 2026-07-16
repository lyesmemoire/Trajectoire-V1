export interface InterviewReport {
  globalScore: number;
  level: "débutant" | "intermédiaire" | "avancé" | "expert";
  progression: {
    previousScore?: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  duration: number;
  company: string;
  position: string;
  date: Date;
  
  scores: ScoreBreakdown;
  questionAnalysis: QuestionAnalysis[];
  timeline: TimelineEvent[];
  highlights: Highlight[];
  improvements: Improvement[];
  starAnalysis: STARAnalysis[];
  languageAnalysis: LanguageAnalysis;
  postureAnalysis: PostureAnalysis;
  recruiterVision: RecruiterVision;
  comparison: Comparison;
  actionPlan: ActionPlan;
  nextSimulation: NextSimulation;
  
  behavioralAnalysis: BehavioralAnalysis;
  recruiterPrivateNotes: RecruiterPrivateNotes;
  decisionEstimation: DecisionEstimation;
  tippingFactors: TippingFactors;
  executiveSummary: ExecutiveSummary;
  enhancedComparison: EnhancedComparison;
}

export interface ScoreBreakdown {
  communication: ScoreDetail;
  leadership: ScoreDetail;
  confidence: ScoreDetail;
  structure: ScoreDetail;
  impact: ScoreDetail;
  argumentation: ScoreDetail;
  stressManagement: ScoreDetail;
  listening: ScoreDetail;
}

export interface ScoreDetail {
  score: number;
  level: "faible" | "moyen" | "bon" | "excellent";
  explanation: string;
  justification: string;
  why: string;
  whatExplainsIt: string;
  excellentCandidateWould: string;
  howToGain10Points: string;
}

export interface QuestionAnalysis {
  id: string;
  question: string;
  responseSummary: string;
  positives: string[];
  weaknesses: string[];
  recruiterThoughts: string;
  recruiterExpectations: string;
  score: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: "positive" | "negative" | "neutral";
  description: string;
  impact: "low" | "medium" | "high";
}

export interface Highlight {
  id: string;
  category: "leadership" | "communication" | "conflict" | "synthesis" | "other";
  title: string;
  description: string;
  timestamp: number;
  impact: "low" | "medium" | "high";
}

export interface Improvement {
  id: string;
  category: string;
  description: string;
  suggestion: string;
  concreteExample: string;
  priority: "low" | "medium" | "high";
}

export interface BehavioralAnalysis {
  traits: string[];
  style: string;
  nuances: string[];
  observations: string[];
}

export interface RecruiterPrivateNotes {
  positiveChecks: string[];
  questionMarks: string[];
  stars: string[];
}

export interface DecisionEstimation {
  secondInterviewProbability: number;
  hrRecommendationProbability: number;
  managerValidationProbability: number;
  directorValidationProbability: number;
  explanation: string;
}

export interface TippingFactors {
  whatCouldHaveTipped: string[];
  criticalMoments: string[];
}

export interface ExecutiveSummary {
  content: string;
  maxWords: number;
}

export interface EnhancedComparison {
  userLevel: number;
  averageCandidate: number;
  goodCandidate: number;
  excellentCandidate: number;
  differences: {
    vsAverage: string;
    vsGood: string;
    vsExcellent: string;
  };
}

export interface STARAnalysis {
  questionId: string;
  situation: {
    present: boolean;
    quality: number;
    feedback: string;
  };
  task: {
    present: boolean;
    quality: number;
    feedback: string;
  };
  action: {
    present: boolean;
    quality: number;
    feedback: string;
  };
  result: {
    present: boolean;
    quality: number;
    feedback: string;
  };
  overallScore: number;
}

export interface LanguageAnalysis {
  fillerWords: {
    count: number;
    frequency: "low" | "medium" | "high";
    examples: string[];
  };
  repetitions: {
    count: number;
    frequency: "low" | "medium" | "high";
    examples: string[];
  };
  clarity: {
    score: number;
    feedback: string;
  };
  sentenceLength: {
    average: number;
    variance: number;
    feedback: string;
  };
  vocabulary: {
    diversity: number;
    sophistication: number;
    feedback: string;
  };
  persuasion: {
    score: number;
    feedback: string;
  };
  fluency: {
    score: number;
    feedback: string;
  };
}

export interface PostureAnalysis {
  confidence: {
    score: number;
    feedback: string;
  };
  calmness: {
    score: number;
    feedback: string;
  };
  leadership: {
    score: number;
    feedback: string;
  };
  energy: {
    score: number;
    feedback: string;
  };
  impact: {
    score: number;
    feedback: string;
  };
  presence: {
    score: number;
    feedback: string;
  };
}

export interface RecruiterVision {
  wouldContinue: string[];
  wouldHaveReservations: string[];
  overallDecision: "poursuivre" | "hésitant" | "ne pas poursuivre";
  summary: string;
}

export interface Comparison {
  userLevel: number;
  expectedLevel: number;
  gaps: ComparisonGap[];
}

export interface ComparisonGap {
  skill: string;
  userScore: number;
  expectedScore: number;
  gap: number;
  priority: "low" | "medium" | "high";
}

export interface ActionPlan {
  sevenDays: ActionStep[];
  thirtyDays: ActionStep[];
  ninetyDays: ActionStep[];
}

export interface ActionStep {
  id: string;
  objective: string;
  duration: string;
  expectedResult: string;
  resources?: string[];
}

export interface NextSimulation {
  type: string;
  reason: string;
  improvements: string[];
  difficulty: string;
}
