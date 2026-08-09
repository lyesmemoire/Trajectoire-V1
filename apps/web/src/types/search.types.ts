export interface RankedResult {
  id: string;
  score: number;
  confidence: number;
  explanation: string;
  justification: string[];
}

export interface RelatedSkills {
  skill: string;
  related: string[];
  transferable: string[];
  complementary: string[];
  confidence: number;
}

export interface CareerPath {
  currentPosition: string;
  missingSkills: string[];
  recommendedTrainings: string[];
  futureSkills: string[];
  accessibleJobs: string[];
  estimatedTime: string;
}

export interface SimilarityResult {
  candidateId?: string;
  jobId?: string;
  id?: string;
  score: number;
  explanation: string;
  factors?: {
    skills: number;
    experience: number;
    languages: number;
    education: number;
    certifications: number;
  };
}
