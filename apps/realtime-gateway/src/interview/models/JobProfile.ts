// apps/realtime-gateway/src/interview/models/JobProfile.ts
export interface JobProfile {
  id: string;
  title: string;
  seniorityLevel?: "junior" | "mid" | "senior" | "lead";
  requiredSkills: string[];
  responsibilities: string[];
  location?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "internship";
  description?: string;
  technologies?: string[];
}
