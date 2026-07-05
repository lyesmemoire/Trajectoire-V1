import { Result } from "@/lib/core/result";

export interface AtsAnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AtsAnalysisGateway {
  analyzeCv(text: string, jobDescription?: string): Promise<Result<AtsAnalysisResult>>;
}
