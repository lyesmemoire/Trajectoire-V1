// @ts-nocheck
import { z } from "zod";

export const JobExtractionSchema = z.object({
  job_title: z.string().min(1).max(200),
  company: z.string().max(200).nullable(),

  must_have: z.object({
    hard_skills: z.array(z.string()).min(1).max(20),
    experience_years: z.number().int().min(0).nullable(),
    education: z.string().nullable(),
  }),

  nice_to_have: z.object({
    hard_skills: z.array(z.string()).max(10),
    soft_skills: z.array(z.string()).max(8),
  }),

  missions: z.array(z.string()).min(1).max(10),
  contract: z.enum(["CDI", "CDD", "FREELANCE", "STAGE", "ALTERNANCE", "UNKNOWN"]),
  remote: z.enum(["FULL", "PARTIAL", "NONE", "UNKNOWN"]),
});

export type JobExtraction = z.infer<typeof JobExtractionSchema>;

export const SKILL_ALIASES: Record<string, string[]> = {
  AWS: ["Amazon Web Services", "Amazon AWS"],
  GCP: ["Google Cloud", "Google Cloud Platform"],
  Azure: ["Microsoft Azure", "MS Azure"],
  React: ["React.js", "ReactJS", "React JS"],
  "Next.js": ["NextJS", "Next JS"],
  TypeScript: ["TS", "Typescript"],
  PostgreSQL: ["Postgres", "PG"],
  Docker: ["docker-compose", "Docker Compose"],
  Kubernetes: ["K8s", "k8s"],
  "CI/CD": ["Github Actions", "GitLab CI", "Jenkins"],
  "Product Management": ["Product Manager", "PM", "Chef de Produit"],
};

export function normalizeExtractedSkills(skills: string[]): string[] {
  return skills.map((skill) => {
    const normalized = Object.entries(SKILL_ALIASES).find(([, aliases]) =>
      aliases.some((alias) => alias.toLowerCase() === skill.toLowerCase()),
    );
    return normalized ? normalized[0] : skill;
  });
}
