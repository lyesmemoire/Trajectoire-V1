// apps/realtime-gateway/src/interview/models/InterviewContext.ts
import { CandidateProfile } from "./CandidateProfile";
import { JobProfile } from "./JobProfile";

export interface InterviewContext {
  candidate: CandidateProfile;
  job: JobProfile;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  interviewLevel: "junior" | "mid" | "senior" | "lead";
}

export interface CompactInterviewContext {
  candidateSummary: string;
  jobSummary: string;
  strengths: string[];
  weaknesses: string[];
  currentTopic?: string;
}
