/**
 * Job Offer Graph
 * 
 * This file defines the structure for job offer data extracted from job descriptions.
 * It follows the same architectural principles as CandidateGraph but for job offers.
 * 
 * Constraints:
 * - No matching logic
 * - No recommendations
 * - No interview preparation
 * - Only extraction and structuring of job offer data
 * - All data includes explainability (source, proof, confidence, explanation)
 */

import { JobOfferExtractionOutput } from "../engines/jobOfferExtractor";

export interface JobOfferGraph {
  // Metadata
  id: string;
  userId: string;
  jobOfferId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // General Information
  generalInfo: {
    title?: string;
    company?: string;
    sector?: string;
    location?: string;
    contractType?: string;
    remoteWork?: string;
    salary?: string;
    hierarchyLevel?: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Missions
  missions?: Array<{
    description: string;
    importance: "critical" | "high" | "medium" | "low";
    estimatedFrequency?: string;
    context?: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // Responsibilities
  responsibilities?: Array<{
    type: "operational" | "technical" | "functional" | "managerial";
    description: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // Hard Skills
  hardSkills?: Array<{
    category: "languages" | "frameworks" | "databases" | "cloud" | "devops" | "cybersecurity" | "architecture" | "tools" | "methodologies";
    name: string;
    level?: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // Soft Skills
  softSkills?: Array<{
    name: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // Technologies
  technologies?: Array<{
    name: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // Seniority
  seniority?: {
    level: "Junior" | "Intermediate" | "Senior" | "Lead" | "Principal" | "Architect";
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Expected Level
  expectedLevel?: {
    yearsOfExperience?: string;
    degree?: string;
    certifications?: string[];
    languages?: string[];
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Domain
  domain?: {
    name: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Prioritization
  requirements?: Array<{
    description: string;
    priority: "essential" | "strongly_desired" | "bonus";
    justification: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // Implicit Criteria
  implicitCriteria?: Array<{
    name: string;
    proofs: string[];
    justification: string;
    confidence: number;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // ATS Keywords
  atsKeywords?: {
    jobs: string[];
    skills: string[];
    technologies: string[];
    certifications: string[];
    domains: string[];
    methods: string[];
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Difficulty
  difficulty?: {
    technicalComplexity: number;
    businessComplexity: number;
    expectedAutonomy: number;
    versatility: number;
    responsibility: number;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Company Culture
  companyCulture?: {
    innovation?: boolean;
    collaboration?: boolean;
    excellence?: boolean;
    autonomy?: boolean;
    diversity?: boolean;
    quality?: boolean;
    agility?: boolean;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  // Extraction Metadata
  extractionMetadata?: {
    extractedAt: Date;
    version: string;
    confidence: number;
  };
}

export interface JobOfferGraphInput {
  id: string;
  userId: string;
  jobOfferId: string;
  extractionData: JobOfferExtractionOutput;
}

export class JobOfferGraphBuilder {
  /**
   * Build job offer graph from extraction data
   */
  static build(input: JobOfferGraphInput): JobOfferGraph {
    const now = new Date(0); // Fixed date for determinism
    
    return {
      id: input.id,
      userId: input.userId,
      jobOfferId: input.jobOfferId,
      createdAt: now,
      updatedAt: now,
      generalInfo: input.extractionData.generalInfo,
      missions: input.extractionData.missions,
      responsibilities: input.extractionData.responsibilities,
      hardSkills: input.extractionData.hardSkills,
      softSkills: input.extractionData.softSkills,
      technologies: input.extractionData.technologies,
      seniority: input.extractionData.seniority,
      expectedLevel: input.extractionData.expectedLevel,
      domain: input.extractionData.domain,
      requirements: input.extractionData.requirements,
      implicitCriteria: input.extractionData.implicitCriteria,
      atsKeywords: input.extractionData.atsKeywords,
      difficulty: input.extractionData.difficulty,
      companyCulture: input.extractionData.companyCulture,
      extractionMetadata: {
        extractedAt: input.extractionData.metadata.extractedAt,
        version: input.extractionData.metadata.version,
        confidence: input.extractionData.metadata.confidence,
      },
    };
  }
  
  /**
   * Validate job offer graph
   */
  static validate(graph: JobOfferGraph): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!graph.id) errors.push("Missing id");
    if (!graph.userId) errors.push("Missing userId");
    if (!graph.jobOfferId) errors.push("Missing jobOfferId");
    if (!graph.generalInfo) errors.push("Missing generalInfo");
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
