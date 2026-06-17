// apps/realtime-gateway/src/interview/models/CompactInterviewContext.ts

export interface CompactInterviewContext {
  validatedSkills: string[]; // skills confirmed by candidate answers
  weakSkills: string[]; // skills where confidence is low or contradictory
  contradictions: string[]; // statements that conflict with CV/profile
  communicationProfile: string; // e.g., "concise", "verbose", "technical"
  stressSignals: string[]; // detected stress or fatigue signals
  confidenceTrend: number[]; // rolling confidence scores per question
  coveredTopics: string[]; // topics already asked about
}
