/**
 * World Model Engine Interfaces
 * Complete representation of the professional world
 */

import { z } from "zod";

// ============================================================================
// SKILL
// ============================================================================

export interface Skill {
  id: string;
  name: string;
  category: "hard" | "soft" | "technical" | "behavioral" | "leadership";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  parentSkillIds: string[];
  childSkillIds: string[];
  relatedSkillIds: string[];
  technologies: string[];
  industries: string[];
  estimatedSalary: number;
  demand: number; // 0-1
  growth: number; // 0-1
  automationRisk: number; // 0-1
  learningTime: number; // months
  prerequisites: string[];
  difficulty: number; // 0-1
  popularity: number; // 0-1
  rarity: number; // 0-1
  trend: "increasing" | "stable" | "decreasing";
  lastUpdated: Date;
}

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["hard", "soft", "technical", "behavioral", "leadership"]),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  parentSkillIds: z.array(z.string()),
  childSkillIds: z.array(z.string()),
  relatedSkillIds: z.array(z.string()),
  technologies: z.array(z.string()),
  industries: z.array(z.string()),
  estimatedSalary: z.number(),
  demand: z.number(),
  growth: z.number(),
  automationRisk: z.number(),
  learningTime: z.number(),
  prerequisites: z.array(z.string()),
  difficulty: z.number(),
  popularity: z.number(),
  rarity: z.number(),
  trend: z.enum(["increasing", "stable", "decreasing"]),
  lastUpdated: z.date(),
});

// ============================================================================
// JOB
// ============================================================================

export interface Job {
  id: string;
  title: string;
  category: string;
  industry: string;
  level: "entry" | "junior" | "mid" | "senior" | "lead" | "manager" | "executive";
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  certifications: string[];
  salaryRange: { min: number; max: number; average: number };
  demand: number; // 0-1
  growth: number; // 0-1
  automationRisk: number; // 0-1
  relatedJobIds: string[];
  careerPathways: string[];
  companies: string[];
  locations: string[];
  remoteFriendly: boolean;
  educationRequirements: string[];
  experienceRequirements: number; // years
  trend: "increasing" | "stable" | "decreasing";
  lastUpdated: Date;
}

export const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  industry: z.string(),
  level: z.enum(["entry", "junior", "mid", "senior", "lead", "manager", "executive"]),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  technologies: z.array(z.string()),
  certifications: z.array(z.string()),
  salaryRange: z.object({ min: z.number(), max: z.number(), average: z.number() }),
  demand: z.number(),
  growth: z.number(),
  automationRisk: z.number(),
  relatedJobIds: z.array(z.string()),
  careerPathways: z.array(z.string()),
  companies: z.array(z.string()),
  locations: z.array(z.string()),
  remoteFriendly: z.boolean(),
  educationRequirements: z.array(z.string()),
  experienceRequirements: z.number(),
  trend: z.enum(["increasing", "stable", "decreasing"]),
  lastUpdated: z.date(),
});

// ============================================================================
// COMPANY
// ============================================================================

export interface Company {
  id: string;
  name: string;
  industry: string;
  sector: string;
  size: "startup" | "small" | "medium" | "large" | "enterprise";
  locations: string[];
  technologies: string[];
  culture: string[];
  values: string[];
  hiringStatus: "hiring" | "not_hiring" | "limited";
  salaryRange: { min: number; max: number; average: number };
  benefits: string[];
  remotePolicy: "on_site" | "hybrid" | "remote" | "flexible";
  similarCompanyIds: string[];
  jobOpenings: string[];
  reputation: number; // 0-1
  growth: number; // 0-1
  stability: number; // 0-1
  lastUpdated: Date;
}

export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string(),
  sector: z.string(),
  size: z.enum(["startup", "small", "medium", "large", "enterprise"]),
  locations: z.array(z.string()),
  technologies: z.array(z.string()),
  culture: z.array(z.string()),
  values: z.array(z.string()),
  hiringStatus: z.enum(["hiring", "not_hiring", "limited"]),
  salaryRange: z.object({ min: z.number(), max: z.number(), average: z.number() }),
  benefits: z.array(z.string()),
  remotePolicy: z.enum(["on_site", "hybrid", "remote", "flexible"]),
  similarCompanyIds: z.array(z.string()),
  jobOpenings: z.array(z.string()),
  reputation: z.number(),
  growth: z.number(),
  stability: z.number(),
  lastUpdated: z.date(),
});

// ============================================================================
// INDUSTRY
// ============================================================================

export interface Industry {
  id: string;
  name: string;
  sector: string;
  technologies: string[];
  skills: string[];
  jobs: string[];
  companies: string[];
  growth: number; // 0-1
  stability: number; // 0-1
  demand: number; // 0-1
  automationImpact: number; // 0-1
  salaryAverage: number;
  trend: "increasing" | "stable" | "decreasing";
  lastUpdated: Date;
}

export const IndustrySchema = z.object({
  id: z.string(),
  name: z.string(),
  sector: z.string(),
  technologies: z.array(z.string()),
  skills: z.array(z.string()),
  jobs: z.array(z.string()),
  companies: z.array(z.string()),
  growth: z.number(),
  stability: z.number(),
  demand: z.number(),
  automationImpact: z.number(),
  salaryAverage: z.number(),
  trend: z.enum(["increasing", "stable", "decreasing"]),
  lastUpdated: z.date(),
});

// ============================================================================
// CERTIFICATION
// ============================================================================

export interface Certification {
  id: string;
  name: string;
  provider: string;
  category: string;
  skills: string[];
  jobs: string[];
  industries: string[];
  difficulty: number; // 0-1
  duration: number; // months
  cost: number;
  demand: number; // 0-1
  validity: number; // years
  prerequisites: string[];
  salaryImpact: number; // 0-1
  popularity: number; // 0-1
  lastUpdated: Date;
}

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  category: z.string(),
  skills: z.array(z.string()),
  jobs: z.array(z.string()),
  industries: z.array(z.string()),
  difficulty: z.number(),
  duration: z.number(),
  cost: z.number(),
  demand: z.number(),
  validity: z.number(),
  prerequisites: z.array(z.string()),
  salaryImpact: z.number(),
  popularity: z.number(),
  lastUpdated: z.date(),
});

// ============================================================================
// KNOWLEDGE GRAPH
// ============================================================================

export interface KnowledgeGraph {
  nodes: {
    skills: Map<string, Skill>;
    jobs: Map<string, Job>;
    companies: Map<string, Company>;
    industries: Map<string, Industry>;
    certifications: Map<string, Certification>;
  };
  edges: {
    skillToSkill: Map<string, string[]>; // skillId -> relatedSkillIds
    skillToJob: Map<string, string[]>; // skillId -> jobIds
    jobToCompany: Map<string, string[]>; // jobId -> companyIds
    companyToIndustry: Map<string, string[]>; // companyId -> industryIds
    skillToCertification: Map<string, string[]>; // skillId -> certificationIds
  };
  lastUpdated: Date;
}

export const KnowledgeGraphSchema = z.object({
  nodes: z.object({
    skills: z.any(), // Map serialization handled separately
    jobs: z.any(),
    companies: z.any(),
    industries: z.any(),
    certifications: z.any(),
  }),
  edges: z.object({
    skillToSkill: z.any(),
    skillToJob: z.any(),
    jobToCompany: z.any(),
    companyToIndustry: z.any(),
    skillToCertification: z.any(),
  }),
  lastUpdated: z.date(),
});

// ============================================================================
// WORLD MODEL QUERY
// ============================================================================

export interface WorldModelQuery {
  type: "skill" | "job" | "company" | "industry" | "certification" | "relation" | "pathway";
  params: Record<string, unknown>;
}

export const WorldModelQuerySchema = z.object({
  type: z.enum(["skill", "job", "company", "industry", "certification", "relation", "pathway"]),
  params: z.record(z.string(), z.unknown()),
});

// ============================================================================
// WORLD MODEL RESULT
// ============================================================================

export interface WorldModelResult<T> {
  success: boolean;
  data: T | null;
  confidence: number; // 0-1
  sources: string[];
  reasoning: string;
  timestamp: Date;
}

export const WorldModelResultSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  confidence: z.number(),
  sources: z.array(z.string()),
  reasoning: z.string(),
  timestamp: z.date(),
});

// ============================================================================
// WORLD MODEL CONFIG
// ============================================================================

export interface WorldModelConfig {
  updateInterval: number; // hours
  dataSources: string[];
  confidenceThreshold: number;
  enableCaching: boolean;
  cacheDuration: number; // minutes
  maxNodes: number;
  maxEdges: number;
}

export const WorldModelConfigSchema = z.object({
  updateInterval: z.number(),
  dataSources: z.array(z.string()),
  confidenceThreshold: z.number(),
  enableCaching: z.boolean(),
  cacheDuration: z.number(),
  maxNodes: z.number(),
  maxEdges: z.number(),
});

export const defaultWorldModelConfig: WorldModelConfig = {
  updateInterval: 24,
  dataSources: ["internal", "external"],
  confidenceThreshold: 0.7,
  enableCaching: true,
  cacheDuration: 60,
  maxNodes: 10000,
  maxEdges: 50000,
};
