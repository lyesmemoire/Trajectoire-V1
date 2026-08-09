import { z } from "zod";
export declare const JobExtractionSchema: z.ZodObject<{
    job_title: z.ZodString;
    company: z.ZodNullable<z.ZodString>;
    must_have: z.ZodObject<{
        hard_skills: z.ZodArray<z.ZodString, "many">;
        experience_years: z.ZodNullable<z.ZodNumber>;
        education: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        hard_skills: string[];
        experience_years: number | null;
        education: string | null;
    }, {
        hard_skills: string[];
        experience_years: number | null;
        education: string | null;
    }>;
    nice_to_have: z.ZodObject<{
        hard_skills: z.ZodArray<z.ZodString, "many">;
        soft_skills: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        hard_skills: string[];
        soft_skills: string[];
    }, {
        hard_skills: string[];
        soft_skills: string[];
    }>;
    missions: z.ZodArray<z.ZodString, "many">;
    contract: z.ZodEnum<["CDI", "CDD", "FREELANCE", "STAGE", "ALTERNANCE", "UNKNOWN"]>;
    remote: z.ZodEnum<["FULL", "PARTIAL", "NONE", "UNKNOWN"]>;
}, "strip", z.ZodTypeAny, {
    job_title: string;
    company: string | null;
    must_have: {
        hard_skills: string[];
        experience_years: number | null;
        education: string | null;
    };
    nice_to_have: {
        hard_skills: string[];
        soft_skills: string[];
    };
    missions: string[];
    contract: "UNKNOWN" | "CDI" | "CDD" | "FREELANCE" | "STAGE" | "ALTERNANCE";
    remote: "UNKNOWN" | "FULL" | "PARTIAL" | "NONE";
}, {
    job_title: string;
    company: string | null;
    must_have: {
        hard_skills: string[];
        experience_years: number | null;
        education: string | null;
    };
    nice_to_have: {
        hard_skills: string[];
        soft_skills: string[];
    };
    missions: string[];
    contract: "UNKNOWN" | "CDI" | "CDD" | "FREELANCE" | "STAGE" | "ALTERNANCE";
    remote: "UNKNOWN" | "FULL" | "PARTIAL" | "NONE";
}>;
export type JobExtraction = z.infer<typeof JobExtractionSchema>;
export declare const SKILL_ALIASES: Record<string, string[]>;
export declare function normalizeExtractedSkills(skills: string[]): string[];
//# sourceMappingURL=job-extraction.schema.d.ts.map