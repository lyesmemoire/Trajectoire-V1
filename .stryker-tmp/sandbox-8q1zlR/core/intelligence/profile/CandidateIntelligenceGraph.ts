// @ts-nocheck
import { ScoreEngine } from "../engines/scoreEngine";
import { InsightEngine } from "../engines/insightEngine";
import { RecommendationEngine } from "../engines/recommendationEngine";
import { CandidateGraphBuilder, CandidateGraphInput } from "./CandidateGraphBuilder";
import { CandidateGraphValidator } from "./CandidateGraphValidator";
import { CandidateGraphSnapshot } from "./CandidateGraphSnapshot";
import { CandidateGraphDiff } from "./CandidateGraphDiff";

/**
 * Candidate Intelligence Graph
 *
 * Responsibilities:
 * - Aggregate ALL candidate information into a single source of truth
 * - Orchestrate all intelligence engines
 * - Provide consolidated view for all application layers
 * - No UI logic, no React, no hooks
 * - Pure domain orchestration
 */

export interface LiveScores {
  communication: number;
  leadership: number;
  structure: number;
  confidence: number;
  impact: number;
  stressManagement: number;
  synthesis: number;
}

export interface CandidateIdentity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
}

export interface CareerInfo {
  currentRole?: string;
  yearsOfExperience: number;
  targetRoles: string[];
  targetIndustries: string[];
  targetLocations: string[];
  careerLevel: "junior" | "mid" | "senior" | "lead" | "executive";
}

export interface Skill {
  name: string;
  category: "hard" | "soft";
  level: number; // 0-100
  confidence: number; // 0-1
  lastAssessed: Date;
}

export interface CommunicationProfile {
  clarity: number;
  persuasion: number;
  listening: number;
  structure: number;
  confidence: number;
}

export interface LeadershipProfile {
  vision: number;
  execution: number;
  teamBuilding: number;
  conflictResolution: number;
  decisionMaking: number;
}

export interface EmployabilityScore {
  overall: number;
  technical: number;
  behavioral: number;
  cultural: number;
  trajectory: "up" | "stable" | "down";
}

export interface Strength {
  id: string;
  category: string;
  priority: "low" | "medium" | "high";
  confidence: number;
  impact: "low" | "medium" | "high";
  evidence: string;
}

export interface Weakness {
  id: string;
  category: string;
  priority: "low" | "medium" | "high";
  confidence: number;
  impact: "low" | "medium" | "high";
  evidence: string;
  suggestion: string;
}

export interface Pattern {
  type: "recurring_strength" | "recurring_weakness" | "improvement_area" | "risk";
  description: string;
  frequency: number;
  contexts: string[];
}

export interface Progress {
  overallScore: number;
  previousScore: number;
  change: number;
  trend: "up" | "stable" | "down";
  timeline: Array<{
    date: Date;
    score: number;
    context: string;
  }>;
}

export interface Trajectory {
  currentLevel: string;
  nextLevel: string;
  estimatedTimeToNext: string | null;
  requiredSkills: string[] | null;
  blockers: string[] | null;
  accelerators: string[] | null;
}

export interface Recommendation {
  type: "job" | "skill" | "interview" | "learning";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  confidence: number;
  impact: "low" | "medium" | "high";
}

export interface RiskAnalysis {
  overallRisk: "low" | "medium" | "high";
  risks: Array<{
    category: string;
    description: string;
    severity: "low" | "medium" | "high";
    mitigation: string;
  }>;
}

export interface DecisionReadiness {
  overall: number;
  technicalReadiness: number;
  behavioralReadiness: number;
  confidence: number;
  gaps: string[];
}

export interface CandidateGraph {
  identity: CandidateIdentity;
  career: CareerInfo;
  skills: Skill[];
  softSkills: Skill[];
  hardSkills: Skill[];
  communication: CommunicationProfile;
  leadership: LeadershipProfile;
  confidence: number;
  employability: EmployabilityScore;
  careerLevel: string;
  strengths: Strength[];
  weaknesses: Weakness[];
  patterns: Pattern[];
  progress: Progress;
  trajectory: Trajectory;
  recommendedJobs: Recommendation[];
  recommendedSkills: Recommendation[];
  recommendedInterviews: Recommendation[];
  recommendedLearning: Recommendation[];
  riskAnalysis: RiskAnalysis;
  decisionReadiness: DecisionReadiness;
  overallScore: number;
  
  // NEW: Enriched CV Data
  experiences?: Array<{
    company: string;
    sector?: string;
    position: string;
    startDate?: string;
    endDate?: string;
    duration?: string;
    missions?: string[];
    responsibilities?: string[];
    achievements?: string[];
    measurableResults?: string[];
    technologies?: string[];
    tools?: string[];
    management?: {
      teamSize?: number;
      budget?: string;
      level?: string;
    };
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  projects?: Array<{
    context: string;
    role: string;
    technologies: string[];
    results: string[];
    demonstratedSkills: string[];
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  achievements?: Array<{
    description: string;
    experience?: string;
    skill?: string;
    proof: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  implicitSkills?: Array<{
    name: string;
    category: "management" | "leadership" | "communication" | "negotiation" | "architecture" | "mentorship" | "crisis_management";
    confidence: number;
    demonstratedIn: string[];
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  careerEvolution?: {
    promotions: Array<{
      from: string;
      to: string;
      company: string;
      date?: string;
      explainability?: {
        source: string;
        proof: string;
        confidence: number;
        explanation: string;
      };
    }>;
    progressions: Array<{
      description: string;
      explainability?: {
        source: string;
        proof: string;
        confidence: number;
        explanation: string;
      };
    }>;
    responsibilityChanges: Array<{
      description: string;
      explainability?: {
        source: string;
        proof: string;
        confidence: number;
        explanation: string;
      };
    }>;
    sectorChanges: Array<{
      from: string;
      to: string;
      explainability?: {
        source: string;
        proof: string;
        confidence: number;
        explanation: string;
      };
    }>;
  };
  
  inconsistencies?: Array<{
    type: "gap" | "overlap" | "unusual_duration" | "frequent_changes";
    description: string;
    severity: "low" | "medium" | "high";
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  atsKeywords?: {
    technologies: string[];
    jobTitles: string[];
    certifications: string[];
    sectors: string[];
    skills: string[];
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  };
  
  vigilanceZones?: Array<{
    type: "under_demonstrated_skill" | "short_experience" | "frequent_changes" | "unproven_skill";
    description: string;
    severity: "low" | "medium" | "high";
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
  // REMOVED: probableInterviewQuestions - violates single responsibility (interview preparation is not CV extraction)
  
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
}

export class CandidateIntelligenceGraph {
  /**
   * Build complete candidate intelligence graph from raw data
   * Delegates to CandidateGraphBuilder for orchestration
   */
  static buildGraph(data: CandidateGraphInput): CandidateGraph {
    return CandidateGraphBuilder.build(data);
  }
  
  /**
   * Validate candidate graph
   * Delegates to CandidateGraphValidator
   */
  static validate(graph: CandidateGraph) {
    return CandidateGraphValidator.validate(graph);
  }
  
  /**
   * Create snapshot of candidate graph
   * Delegates to CandidateGraphSnapshot
   */
  static createSnapshot(graph: CandidateGraph, context?: string) {
    return CandidateGraphSnapshot.create(graph, context);
  }
  
  /**
   * Compare two snapshots
   * Delegates to CandidateGraphDiff
   */
  static compareSnapshots(current: CandidateGraphSnapshot, previous: CandidateGraphSnapshot) {
    return CandidateGraphDiff.compare(current, previous);
  }
  
  /**
   * Update graph with new interview data
   */
  static updateWithInterview(graph: CandidateGraph, _interviewData: unknown): CandidateGraph {
    // This will be implemented when interview data structure is defined
    return graph;
  }
  
  /**
   * Update graph with new scores
   */
  static updateWithScores(graph: CandidateGraph, newScores: LiveScores): CandidateGraph {
    const newOverallScore = ScoreEngine.calculateGlobalScore(newScores);
    
    return {
      ...graph,
      overallScore: newOverallScore,
      strengths: InsightEngine.generateStrengths(newOverallScore),
      weaknesses: RecommendationEngine.generateWeaknesses(newOverallScore),
      communication: {
        ...graph.communication,
        clarity: newScores.communication,
        persuasion: newScores.communication,
        listening: newScores.communication,
        structure: newScores.structure,
        confidence: newScores.confidence,
      },
      leadership: {
        ...graph.leadership,
        vision: newScores.leadership,
        execution: newScores.leadership,
        teamBuilding: newScores.leadership,
        conflictResolution: newScores.leadership,
        decisionMaking: newScores.leadership,
      },
      confidence: newScores.confidence,
      employability: {
        ...graph.employability,
        overall: newOverallScore,
        technical: newScores.impact,
        behavioral: (newScores.communication + newScores.leadership) / 2,
        cultural: newScores.confidence,
      },
    };
  }
}
