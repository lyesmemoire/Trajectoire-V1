// @ts-nocheck
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
