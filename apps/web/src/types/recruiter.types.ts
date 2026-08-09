export interface Skill {
  name: string;
  type: string;
  level?: string;
  skillId?: string;
  confidence?: number;
}

export interface Entity {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
}

export interface Relationship {
  id: string;
  from: string;
  to: string;
  type: string;
  attributes: Record<string, unknown>;
}

export interface SemanticGraph {
  nodes: unknown[];
  edges: unknown[];
}

export interface KnowledgeGraph {
  entities: Entity[];
  attributes: unknown[];
  relationships: Relationship[];
  semanticGraph: SemanticGraph;
  metadata?: any;
}

export interface CandidateProfile {
  profileId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  experiences: unknown[];
  education: unknown[];
  skills: Skill[];
  certifications: unknown[];
  languages: unknown[];
  profileScores: {
    experienceCount: number;
    educationCount: number;
    skillCount: number;
    certificationCount: number;
    languageCount: number;
    overallScore: number;
  };
}

export interface JobProfile {
  profileId: string;
  job: {
    title: string;
    family: string;
    seniority: string;
    location: string;
    remoteWork: boolean;
    contractType: string;
  };
  requiredSkills: Skill[];
  preferredSkills: Skill[];
  softSkills: Skill[];
  languages: unknown[];
  certifications: unknown[];
  metadata: unknown;
}

export interface ScoreDimension {
  name: string;
  score: number;
  weight: number;
}

export interface MatchingReport {
  summary: string;
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
  };
  scores: {
    global: number;
    dimensions: ScoreDimension[];
  };
  strengths: string[];
  weaknesses: string[];
  missingSkills: any[];
  transferableSkills: any[];
  recommendations: string[];
  generatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  data: unknown;
}

export interface MatchingResponse {
  success: boolean;
  data: MatchingReport;
}
