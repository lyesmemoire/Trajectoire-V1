// lib/seo/utils/slug.ts
import { jobs } from "@/lib/seo/data/jobs";
import { companies } from "@/lib/seo/data/companies";

const JOB_SLUGS = new Set(jobs.map((j) => j.id));
const COMPANY_SLUGS = companies
  .map((c) => c.id)
  .sort((a, b) => b.length - a.length);

export interface ParsedInterviewSlug {
  jobSlug: string;
  companySlug: string;
}

export function parseInterviewSlug(slug: string): ParsedInterviewSlug | null {
  for (const companySlug of COMPANY_SLUGS) {
    const suffix = `-${companySlug}`;
    if (slug.endsWith(suffix)) {
      const jobSlug = slug.slice(0, -suffix.length);
      if (JOB_SLUGS.has(jobSlug)) return { jobSlug, companySlug };
    }
  }
  return null;
}

export function buildInterviewSlug(jobSlug: string, companySlug: string, ): string {
  return `${jobSlug}-${companySlug}`;
}

export function isValidInterviewSlug(slug: string): boolean {
  return parseInterviewSlug(slug) !== null;
}
