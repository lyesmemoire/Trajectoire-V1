// apps/realtime-gateway/src/interview/models/CandidateProfile.ts

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "cloud"
  | "mobile"
  | "database"
  | "ai"
  | "softskill";

export interface Skill {
  name: string;
  level?: SkillLevel;
  years?: number;
  confidence?: number;
  lastUsedYear?: number;
  category?: SkillCategory;
  validated?: boolean;
  priority?: number;
}

export interface Project {
  name: string;
  description?: string;
  technologies: string[];
  duration?: string;
  impact?: string;
  complexity?: "low" | "medium" | "high";
  role?: "individual" | "team" | "lead";
}

export interface Experience {
  company: string;
  role: string;
  start: string;
  end?: string;
  description?: string;
  teamSize?: number;
  management?: boolean;
  technologies?: string[];
  industry?: string;
}

export interface Education {
  institution: string;
  degree: string;
  start: string;
  end?: string;
  field?: string;
}

export type Seniority = "junior" | "mid" | "senior" | "lead";

export interface CandidateProfile {
  id: string;
  fullName: string;
  title?: string;
  seniority?: Seniority;
  yearsExperience?: number;
  targetRole?: string;
  currentLocation?: string;
  targetSalary?: number;
  availability?: string;
  preferredLanguage?: string;
  skills: Skill[];
  normalizedSkills?: string[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  certifications?: string[];
  languages: string[];
  domainExpertise?: string[];
  strengths?: string[];
  weaknesses?: string[];
  riskFlags?: string[];
  communicationProfile?: {
    verbosity?: number;
    clarity?: number;
    confidence?: number;
  };
  parsedMetadata?: {
    source?: "pdf" | "docx" | "manual";
    parsedAt?: number;
    parserVersion?: string;
  };
}
