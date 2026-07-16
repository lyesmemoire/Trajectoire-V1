// Core Intelligence Types
// This file contains all shared types used across the intelligence engines

export interface CandidateProfile {
  identity: CandidateIdentity;
  career: CandidateCareer;
  skills: CandidateSkills;
  metrics: CandidateMetrics;
  behavior: CandidateBehavior;
  history: CandidateHistory;
}

export interface CandidateIdentity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  lastActive: Date;
}

export interface CandidateCareer {
  currentLevel: "junior" | "intermediate" | "senior" | "expert" | "executive";
  yearsOfExperience: number;
  targetLevel: "junior" | "intermediate" | "senior" | "expert" | "executive";
  sector: string;
  currentPosition?: string;
  targetPosition?: string;
  companySize?: "startup" | "sme" | "midsize" | "large" | "enterprise";
}

export interface CandidateSkills {
  hardSkills: Skill[];
  softSkills: Skill[];
  strengths: string[];
  weaknesses: string[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  lastAssessed: Date;
  trend: "improving" | "stable" | "declining";
}

export interface CandidateMetrics {
  atsScore: number;
  atsTrend: "up" | "down" | "stable";
  totalSimulations: number;
  totalTimeSpent: number; // in minutes
  successRate: number; // 0-100
  averageScore: number;
  bestScore: number;
  currentStreak: number; // consecutive improvements
}

export interface CandidateBehavior {
  communicationStyle: "direct" | "diplomatic" | "analytical" | "expressive";
  personalityType: string;
  confidenceLevel: number; // 0-100
  leadershipStyle: "authoritative" | "collaborative" | "servant" | "transformational";
  synthesisAbility: number; // 0-100
  businessImpact: number; // 0-100
  argumentationQuality: number; // 0-100
  starProficiency: number; // 0-100
  stressManagement: number; // 0-100
  persuasionAbility: number; // 0-100
}

export interface CandidateHistory {
  simulations: SimulationRecord[];
  progressions: ProgressionRecord[];
  achievements: Achievement[];
  recurringErrors: RecurringError[];
}

export interface SimulationRecord {
  id: string;
  date: Date;
  type: string;
  position: string;
  company: string;
  difficulty: string;
  score: number;
  duration: number;
  keyInsights: string[];
}

export interface ProgressionRecord {
  date: Date;
  metric: string;
  previousValue: number;
  newValue: number;
  change: number;
  trend: "improvement" | "regression" | "stagnation" | "acceleration" | "plateau";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: string;
}

export interface RecurringError {
  pattern: string;
  firstOccurrence: Date;
  lastOccurrence: Date;
  frequency: number;
  severity: "low" | "medium" | "high";
  status: "active" | "resolved" | "improving";
}

export interface JobAnalysis {
  position: string;
  seniority: "junior" | "intermediate" | "senior" | "expert" | "executive";
  sector: string;
  requiredSkills: Skill[];
  softSkills: string[];
  culture: CultureProfile;
  keywords: string[];
  leadershipExpectations: LeadershipExpectations;
  communicationExpectations: CommunicationExpectations;
  technicalLevel: number;
  expectedRecruiterType: string;
  exigencyLevel: number;
  expectedPressure: number;
  probableQuestions: string[];
  probableTraps: string[];
}

export interface CultureProfile {
  values: string[];
  workStyle: string;
  pace: string;
  collaboration: string;
  innovation: string;
}

export interface LeadershipExpectations {
  style: string[];
  level: number;
  focus: string[];
}

export interface CommunicationExpectations {
  style: string[];
  clarity: number;
  persuasion: number;
}

export interface InterviewAnalysis {
  forces: string[];
  weaknesses: string[];
  contradictions: string[];
  progressionAxes: string[];
  exampleQuality: number;
  starQuality: number;
  impact: number;
  leadership: number;
  clarity: number;
  persuasion: number;
  structure: number;
  coherence: number;
  confidence: number;
}

export interface Insight {
  id: string;
  category: string;
  observation: string;
  severity: "info" | "warning" | "critical";
  actionable: boolean;
  timestamp: Date;
}

export interface Recommendation {
  id: string;
  category: string;
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  why: string;
  how: string;
  impact: string;
  estimatedTime: string;
  expectedGain: string;
  concreteExample: string;
}

export interface CoachPlan {
  sevenDays: DailyPlan[];
  thirtyDays: WeeklyPlan[];
  ninetyDays: MonthlyPlan[];
}

export interface DailyPlan {
  day: number;
  objectives: string[];
  exercises: Exercise[];
  reading?: string[];
  simulation?: SimulationRecommendation;
}

export interface WeeklyPlan {
  week: number;
  objectives: string[];
  dailyFocus: string[];
  exercises: Exercise[];
  simulations: SimulationRecommendation[];
}

export interface MonthlyPlan {
  month: number;
  objectives: string[];
  weeklyFocus: string[];
  milestones: string[];
  simulations: SimulationRecommendation[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "star" | "leadership" | "communication" | "persuasion" | "other";
}

export interface SimulationRecommendation {
  type: string;
  difficulty: string;
  focus: string[];
  reason: string;
}

export interface Decision {
  action: string;
  probability: number;
  reasoning: string;
  conditions?: string[];
}

export interface ProgressTrend {
  metric: string;
  current: number;
  previous: number;
  trend: "improvement" | "regression" | "stagnation" | "acceleration" | "plateau";
  velocity: number;
  prediction?: number;
}

export interface MemoryEvent {
  id: string;
  type: "error" | "success" | "progression" | "pattern" | "insight";
  content: string;
  timestamp: Date;
  relatedTo?: string[];
  confidence: number;
}
