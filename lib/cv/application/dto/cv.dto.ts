export interface CvDTO {
  id: string;
  title?: string;
  originalText?: string;
  optimizedText?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface CreateCvDTO {
  userId: string;
  originalText?: string;
  pdfUrl?: string;
}

export interface UpdateCvDTO {
  optimizedText?: string;
  title?: string;
}

export interface AtsAnalysisDTO {
  cvId: string;
  scoreBefore?: number;
  scoreAfter?: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
