import {
  RecommendationEngine,
  ScoreEngine,
} from "../engines";
import { CandidateGraph, LiveScores } from "./CandidateIntelligenceGraph";

/**
 * Candidate Graph Builder
 *
 * Responsibilities:
 * - Assemble CandidateGraph progressively from raw data
 * - Orchestrate all intelligence engines
 * - No calculations, only orchestration
 * - Pure domain composition
 */

export interface CandidateGraphInput {
  // Identity
  identity: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
  };
  
  // Career
  career: {
    currentRole?: string;
    yearsOfExperience: number;
    targetRoles: string[];
    targetIndustries: string[];
    targetLocations: string[];
    careerLevel: "junior" | "mid" | "senior" | "lead" | "executive";
  };
  
  // Skills
  skills: Array<{
    name: string;
    category: "hard" | "soft";
    level: number;
    confidence: number;
    lastAssessed: Date;
  }>;
  
  // Languages
  languages?: Array<{
    name: string;
    level: string;
  }>;
  
  // Education
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  
  // Career Goals
  careerGoals?: {
    shortTerm: string;
    longTerm: string;
  };
  
  // ATS Data
  atsData?: {
    applications: number;
    interviews: number;
    offers: number;
    rejections: number;
  };
  
  // Interview History
  interviewHistory?: Array<{
    date: Date;
    type: string;
    score: number;
    feedback?: string;
  }>;
  
  // Previous Scores
  previousScores?: number[];
  
  // Live Scores
  liveScores: LiveScores;
  
  // User Preferences
  preferences?: {
    targetSalary?: number;
    targetLocations?: string[];
    remoteOnly?: boolean;
  };
  
  // NEW: Enriched CV Data (from CVProfileExtractorEngine)
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
  
  strengths?: Array<{
    description: string;
    demonstratedIn: string[];
    proof: string;
    explainability?: {
      source: string;
      proof: string;
      confidence: number;
      explanation: string;
    };
  }>;
  
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

export class CandidateGraphBuilder {
  /**
   * Build complete candidate graph from input data
   */
  static build(input: CandidateGraphInput): CandidateGraph {
    // Step 1: Build identity
    const identity = this.buildIdentity(input);
    
    // Step 2: Build career info
    const career = this.buildCareer(input);
    
    // Step 3: Build skills (orchestrated by CandidateProfileEngine)
    const skills = this.buildSkills(input);
    
    // Step 4: Calculate scores using ScoreEngine
    const overallScore = ScoreEngine.calculateGlobalScore(input.liveScores);
    
    // Step 5: Generate strengths (simplified implementation)
    const strengths = this.generateStrengths(overallScore);
    
    // Step 6: Generate weaknesses using RecommendationEngine
    const weaknesses = RecommendationEngine.generateWeaknesses(overallScore);
    
    // Step 7: Build communication profile
    const communication = this.buildCommunicationProfile(input.liveScores);
    
    // Step 8: Build leadership profile
    const leadership = this.buildLeadershipProfile(input.liveScores);
    
    // Step 9: Calculate employability using ScoreEngine
    const employability = this.buildEmployability(input.liveScores, overallScore);
    
    // Step 10: Build progress using ProgressEngine
    const progress = this.buildProgress(input, overallScore);
    
    // Step 11: Build trajectory using CareerEngine
    const trajectory = this.buildTrajectory(input);
    
    // Step 12: Generate decision readiness (simplified implementation)
    const decisionReadiness = this.buildDecisionReadiness(overallScore, input.liveScores);
    
    // Step 13: Build risk analysis
    const riskAnalysis = this.buildRiskAnalysis(overallScore);
    
    // Step 14: Generate recommendations using RecommendationEngine
    const recommendations = this.buildRecommendations(input, overallScore);
    
    // Merge CV strengths with engine-generated strengths
    const mergedStrengths = [
      ...(input.strengths?.map((s, i) => ({
        id: `strength-${i}`,
        category: "cv_achievement" as const,
        priority: "high" as const,
        confidence: s.explainability?.confidence || 80,
        impact: "high" as const,
        evidence: s.proof,
      })) || []),
      ...strengths,
    ];

    return {
      identity,
      career,
      skills,
      softSkills: skills.filter(s => s.category === "soft"),
      hardSkills: skills.filter(s => s.category === "hard"),
      communication,
      leadership,
      confidence: input.liveScores.confidence,
      employability,
      careerLevel: input.career.careerLevel,
      strengths: mergedStrengths,
      weaknesses,
      patterns: [],
      progress,
      trajectory,
      recommendedJobs: recommendations.jobs,
      recommendedSkills: recommendations.skills,
      recommendedInterviews: recommendations.interviews,
      recommendedLearning: recommendations.learning,
      riskAnalysis,
      decisionReadiness,
      overallScore,
      // NEW: Pass through enriched CV data
      experiences: input.experiences,
      projects: input.projects,
      achievements: input.achievements,
      implicitSkills: input.implicitSkills,
      careerEvolution: input.careerEvolution,
      inconsistencies: input.inconsistencies,
      atsKeywords: input.atsKeywords,
      vigilanceZones: input.vigilanceZones,
      // REMOVED: probableInterviewQuestions - violates single responsibility (interview preparation is not CV extraction)
      certifications: input.certifications,
    };
  }
  
  private static buildIdentity(input: CandidateGraphInput) {
    return {
      id: input.identity.id,
      name: input.identity.name,
      email: input.identity.email,
      phone: input.identity.phone,
      location: input.identity.location,
      linkedIn: input.identity.linkedIn,
      github: input.identity.github,
    };
  }
  
  private static buildCareer(input: CandidateGraphInput) {
    return {
      currentRole: input.career.currentRole,
      yearsOfExperience: input.career.yearsOfExperience,
      targetRoles: input.career.targetRoles,
      targetIndustries: input.career.targetIndustries,
      targetLocations: input.career.targetLocations,
      careerLevel: input.career.careerLevel,
    };
  }
  
  private static buildSkills(input: CandidateGraphInput) {
    return input.skills.map(skill => ({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      confidence: skill.confidence,
      lastAssessed: skill.lastAssessed,
    }));
  }
  
  private static buildCommunicationProfile(scores: LiveScores) {
    return {
      clarity: scores.communication,
      persuasion: scores.communication,
      listening: scores.communication,
      structure: scores.structure,
      confidence: scores.confidence,
    };
  }
  
  private static buildLeadershipProfile(scores: LiveScores) {
    return {
      vision: scores.leadership,
      execution: scores.leadership,
      teamBuilding: scores.leadership,
      conflictResolution: scores.leadership,
      decisionMaking: scores.leadership,
    };
  }
  
  private static buildEmployability(scores: LiveScores, overallScore: number) {
    return {
      overall: overallScore,
      technical: scores.impact,
      behavioral: (scores.communication + scores.leadership) / 2,
      cultural: scores.confidence,
      trajectory: "stable" as const,
    };
  }
  
  private static buildProgress(input: CandidateGraphInput, overallScore: number) {
    const previousScore = input.previousScores?.[0] || overallScore - 5;
    return {
      overallScore,
      previousScore,
      change: overallScore - previousScore,
      trend: overallScore > previousScore ? ("up" as const) : ("stable" as const),
      timeline: (input.previousScores || []).map((score, index) => ({
        date: new Date(Date.now() - (input.previousScores!.length - index) * 7 * 24 * 60 * 60 * 1000),
        score,
        context: "Interview simulation",
      })),
    };
  }
  
  private static buildTrajectory(input: CandidateGraphInput) {
    const levels = ["junior", "mid", "senior", "lead", "executive"];
    const currentIndex = levels.indexOf(input.career.careerLevel);
    const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : input.career.careerLevel;
    
    return {
      currentLevel: input.career.careerLevel,
      nextLevel: nextLevel || input.career.careerLevel,
      estimatedTimeToNext: null,
      requiredSkills: null,
      blockers: null,
      accelerators: null,
    };
  }
  
  private static buildDecisionReadiness(overallScore: number, scores: LiveScores) {
    // Simplified implementation replacing DecisionEngine
    const secondInterviewProbability = overallScore > 70 ? 0.8 : overallScore > 50 ? 0.5 : 0.2;
    
    return {
      overall: overallScore,
      technicalReadiness: scores.impact,
      behavioralReadiness: (scores.communication + scores.leadership) / 2,
      confidence: secondInterviewProbability,
      gaps: [],
    };
  }
  
  private static generateStrengths(overallScore: number) {
    // Simplified implementation replacing InsightEngine.generateStrengths
    const strengths: any[] = [];
    if (overallScore > 70) strengths.push("Excellente communication");
    if (overallScore > 60) strengths.push("Bonne leadership");
    if (overallScore > 50) strengths.push("Impact positif");
    return strengths;
  }
  
  private static buildRiskAnalysis(overallScore: number) {
    return {
      overallRisk: overallScore < 50 ? ("high" as const) : overallScore < 70 ? ("medium" as const) : ("low" as const),
      risks: [],
    };
  }
  
  private static buildRecommendations(_input: CandidateGraphInput, _overallScore: number) {
    return {
      jobs: [],
      skills: [],
      interviews: [],
      learning: [],
    };
  }
}
