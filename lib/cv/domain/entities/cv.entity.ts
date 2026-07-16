export interface CvEntity {
  id: string;
  userId: string;
  title?: string;
  originalText?: string;
  optimizedText?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AtsAnalysisEntity {
  id: string;
  cvId: string;
  userId: string;
  scoreBefore?: number;
  scoreAfter?: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  createdAt: Date;
}

export interface ProfileExtractionEntity {
  id: string;
  cvId: string;
  userId: string;
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  languages: Array<{
    language: string;
    level: string;
  }>;
  certifications: string[];
  summary: string;
  detectedProfession: string;
  createdAt: Date;
}

export interface OptimizedCvEntity {
  id: string;
  cvId: string;
  userId: string;
  version: number;
  text: string;
  atsContext?: string;
  createdAt: Date;
}
