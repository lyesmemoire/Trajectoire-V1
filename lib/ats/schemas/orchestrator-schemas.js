import { z } from "zod";
export const JobOfferSchema = z.object({
    required: z.array(z.string().max(100)).max(50),
});
// Since parseCVSkills returns an array directly, we use z.array
export const CVSkillsSchema = z.array(z.string().max(100)).max(100);
export const JobIntelligenceSchema = z.object({
    title: z.string().max(200),
    hard_skills: z.array(z.string().max(100)).max(50),
    seniority: z.string().max(100),
    min_years: z.number().min(0).max(50),
});
export const AdvancedCVSchema = z.object({
    hard_skills: z.array(z.string().max(100)).max(100),
    seniority: z.number().min(0).max(100),
    leadership_score: z.number().min(0).max(100),
    impact_metrics_score: z.number().min(0).max(100),
    years_experience: z.number().min(0).max(50),
});
export const RecruiterFeedbackSchema = z.object({
    concerns: z.array(z.string().max(500)).max(15),
    strengths: z.array(z.string().max(500)).max(15),
    rewrites: z.array(z.object({
        original: z.string().max(1000),
        improved: z.string().max(1000),
    })).max(15),
});
//# sourceMappingURL=orchestrator-schemas.js.map