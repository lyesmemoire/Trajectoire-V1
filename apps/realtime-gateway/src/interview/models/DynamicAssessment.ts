// apps/realtime-gateway/src/interview/models/DynamicAssessment.ts

export interface DynamicAssessment {
  confidenceTrend: number[]; // rolling confidence scores per question (0‑100)
  communicationTrend: number[]; // rolling communication scores per question (0‑100)
}
