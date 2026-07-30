/**
 * CandidateMemory - Value Object
 * 
 * Structured memory of the candidate, NOT a conversation history.
 * Stores extracted information in a structured format for analysis.
 */

import { z } from 'zod';

// ============================================================================
// Project Experience
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  technologies: string[];
  achievements: string[];
  challenges: string[];
  impact: string;
  teamSize: number;
  verified: boolean;
}

// ============================================================================
// Work Experience
// ============================================================================

export interface Company {
  id: string;
  name: string;
  role: string;
  level: string;
  startDate: Date;
  endDate?: Date;
  responsibilities: string[];
  achievements: string[];
  teamSize: number;
  directReports?: number;
  verified: boolean;
}

// ============================================================================
// Skills
// ============================================================================

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain' | 'tool';
  level: number; // 0-10
  yearsOfExperience: number;
  lastUsed: Date;
  verified: boolean;
  context: string[];
}

// ============================================================================
// Achievements
// ============================================================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  impact: string;
  metrics?: Record<string, number>;
  category: 'technical' | 'leadership' | 'business' | 'innovation';
  verified: boolean;
}

// ============================================================================
// Failures / Learning
// ============================================================================

export interface Failure {
  id: string;
  description: string;
  date: Date;
  context: string;
  lessonsLearned: string[];
  resolution: string;
  category: 'technical' | 'leadership' | 'communication' | 'decision';
}

// ============================================================================
// Leadership Examples
// ============================================================================

export interface LeadershipExample {
  id: string;
  situation: string;
  task: string;
  actions: string[];
  result: string;
  teamSize: number;
  duration: string;
  category: 'crisis' | 'growth' | 'conflict' | 'mentoring' | 'strategic';
  verified: boolean;
}

// ============================================================================
// STAR Elements
// ============================================================================

export interface STARElement {
  id: string;
  competency: string;
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
  completeness: number; // 0-4 (number of elements present)
  lastUpdated: Date;
}

// ============================================================================
// Answer Quality Tracking
// ============================================================================

export interface AnswerQuality {
  id: string;
  questionId: string;
  competency: string;
  strength: 'strong' | 'moderate' | 'weak';
  confidence: number; // 0-100
  evidence: string[];
  gaps: string[];
  timestamp: Date;
}

// ============================================================================
// Contradictions
// ============================================================================

export interface Contradiction {
  id: string;
  type: 'date' | 'number' | 'responsibility' | 'technology' | 'chronology';
  description: string;
  conflictingStatements: string[];
  severity: 'low' | 'medium' | 'high';
  detectedAt: Date;
  resolved: boolean;
  resolution?: string;
}

// ============================================================================
// Pending Topics
// ============================================================================

export interface PendingTopic {
  id: string;
  topic: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  addedAt: Date;
  attempts: number;
}

// ============================================================================
// Communication Profile
// ============================================================================

export interface CommunicationProfile {
  fillers: {
    count: number;
    commonFillers: string[];
    frequency: number; // per minute
  };
  hesitations: {
    count: number;
    averageDuration: number; // seconds
    frequency: number;
  };
  speechRate: {
    wordsPerMinute: number;
    average: number;
    variance: number;
  };
  clarity: {
    score: number; // 0-100
    issues: string[];
  };
  energy: {
    average: number; // 0-10
    variance: number;
  };
  emotion: {
    dominant: string;
    confidence: number;
  };
  vocabulary: {
    diversity: number;
    complexity: number;
    technicalTerms: string[];
  };
}

// ============================================================================
// Stress Profile
// ============================================================================

export interface StressProfile {
  baselinePressure: number; // 0-100
  pressureTolerance: number; // 0-100
  stressIndicators: {
    increasedFillers: boolean;
    increasedHesitations: boolean;
    speechRateChange: number; // percentage change
    voiceTremor: boolean;
  };
  recoveryTime: number; // seconds to recover from stress
  optimalPressure: number; // 0-100
}

// ============================================================================
// Confidence Tracking
// ============================================================================

// Canonical Reference: BCM-OBJ-004 (blueprint.cognitive.confidence)
// Owner: Chief Cognitive Architect
export interface Confidence {
  overall: number; // 0-100
  byCompetency: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: Date;
}

// ============================================================================
// Main Memory Structure
// ============================================================================

export interface CandidateMemory {
  id: string;
  candidateId: string;
  sessionId: string;
  
  // Experience
  projects: Project[];
  companies: Compunknown[];
  
  // Skills
  skills: Skill[];
  
  // Achievements & Failures
  achievements: Achievement[];
  failures: Failure[];
  
  // Leadership
  leadershipExamples: LeadershipExample[];
  
  // STAR tracking
  starElements: STARElement[];
  
  // Answer quality
  answerQuality: AnswerQuality[];
  
  // Contradictions
  contradictions: Contradiction[];
  
  // Pending topics
  pendingTopics: PendingTopic[];
  
  // Profiles
  communicationProfile: CommunicationProfile;
  stressProfile: StressProfile;
  confidence: Confidence;
  
  // Metadata
  lastUpdated: Date;
  version: number;
}

// ============================================================================
// Validation Schemas
// ============================================================================

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  role: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  technologies: z.array(z.string()),
  achievements: z.array(z.string()),
  challenges: z.array(z.string()),
  impact: z.string(),
  teamSize: z.number().min(0),
  verified: z.boolean(),
});

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: z.string(),
  level: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()),
  teamSize: z.number().min(0),
  directReports: z.number().min(0).optional(),
  verified: z.boolean(),
});

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.enum(['technical', 'soft', 'domain', 'tool']),
  level: z.number().min(0).max(10),
  yearsOfExperience: z.number().min(0),
  lastUsed: z.date(),
  verified: z.boolean(),
  context: z.array(z.string()),
});

export const CandidateMemorySchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string().uuid(),
  sessionId: z.string().uuid(),
  projects: z.array(ProjectSchema),
  companies: z.array(CompanySchema),
  skills: z.array(SkillSchema),
  achievements: z.array(z.any()),
  failures: z.array(z.any()),
  leadershipExamples: z.array(z.any()),
  starElements: z.array(z.any()),
  answerQuality: z.array(z.any()),
  contradictions: z.array(z.any()),
  pendingTopics: z.array(z.any()),
  communicationProfile: z.any(),
  stressProfile: z.any(),
  confidence: z.any(),
  lastUpdated: z.date(),
  version: z.number().min(1),
});
