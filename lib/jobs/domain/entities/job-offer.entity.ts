/**
 * Job Offer Entity
 * 
 * Represents a job offer in the domain
 */

export interface JobOfferEntity {
  id: string;
  userId: string;
  title?: string;
  company?: string;
  description: string;
  source?: string;
  sourceType?: "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT";
  createdAt: Date;
  updatedAt: Date;
}

export interface JobOfferAnalysisEntity {
  jobOfferId: string;
  extractedAt: Date;
  confidence: number;
  version: string;
}
