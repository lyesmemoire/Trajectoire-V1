import { z } from "zod";

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

export const ExperienceSchema = z.object({
  id: z.string().uuid().optional(),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  id: z.string().uuid().optional(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
});

export const SkillSchema = z.object({
  category: z.string().optional(),
  items: z.array(z.string()),
});

export const ParsedCVSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().optional(),
  experiences: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type ParsedCV = z.infer<typeof ParsedCVSchema>;

export const JobSchema = z.object({
  title: z.string().describe("Titre du poste"),
  mustHaveHardSkills: z.array(z.string()).describe("Compétences techniques obligatoires ou fortement recommandées"),
  mustHaveSoftSkills: z.array(z.string()).describe("Savoir-être et compétences comportementales attendues"),
  coreMissions: z.array(z.string()).describe("Missions principales du poste"),
});

export type JobTarget = z.infer<typeof JobSchema>;

export interface AlignmentScore {
  overallMatch: number; // 0 to 100
  foundSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  narrativeSynthesis: string;
}

export const InterviewPreparationSchema = z.object({
  questions: z.array(z.string()).length(3),
  rationale: z.string().min(10),
  focusAreas: z
    .array(z.enum(["vulnerability", "technical_depth", "behavioral"]))
    .length(3),
});

export type InterviewPreparation = z.infer<typeof InterviewPreparationSchema>;


