/**
 * CalculateInterviewTimingResponse DTO
 *
 * Response DTO for calculating interview timing.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY data transfer object definition.
 */
// @ts-nocheck


export interface CalculateInterviewTimingResponse {
  totalDuration: number;
  sectionTimings: SectionTimingDTO[];
  calculatedAt: Date;
}

export interface SectionTimingDTO {
  sectionId: string;
  sectionName: string;
  duration: number;
  questionCount: number;
}
