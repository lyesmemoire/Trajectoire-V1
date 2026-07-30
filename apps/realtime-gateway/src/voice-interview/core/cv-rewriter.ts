import { z } from "zod";
import { callLlmStrict, getEngineMetadata, type EngineMetadata } from "./llm-strict.js";
import type { FinalCabinetCvReport } from "./cv-diagnostic.js";

// ─── Zod Schema (Phase 2 — Executive Rewrite Engine) ───────────

export const CvRewriteSchema = z.object({
  executive_profile_rewritten: z.string(),
  experiences_rewritten: z.array(z.object({
    company: z.string(),
    role: z.string(),
    bullets_rewritten: z.array(z.string())
  })),
  skills_restructured: z.object({
    core_technical: z.array(z.string()),
    architecture: z.array(z.string()),
    tools_and_platforms: z.array(z.string()),
    soft_skills: z.array(z.string())
  }),
  improvement_summary: z.object({
    structural_improvements: z.array(z.string()),
    impact_enhancements: z.array(z.string()),
    positioning_adjustments: z.array(z.string())
  })
});

export type CvRewriteData = z.infer<typeof CvRewriteSchema>;

export interface FinalExecutiveRewriteReport extends CvRewriteData {
  metadata: EngineMetadata;
}

// ─── Hardened System Prompt ────────────────────────────────────

const REWRITE_SYSTEM_PROMPT = `You are an elite executive resume writer at a top-tier consulting firm.
Your task is to rewrite the candidate's CV to maximize strategic impact, executive presence, and market competitiveness, based on a factual structural diagnostic.

CRITICAL RULES FOR REWRITING (CABINET GRADE):
1. STRICT FACTUAL INTEGRITY: NEVER fabricate metrics, numbers, percentages, or achievements.
2. NO HALLUCINATION: Do not invent skills, tools, or experiences not explicitly present in the original CV.
3. TONE CONSISTENCY RULE:
   - Do not exaggerate seniority.
   - Do not escalate titles implicitly.
   - Do not reframe mid-level experience as senior-level leadership.
   - If impact is weak, do not attempt to artificially elevate it.
   - Improve structure and clarity without overstating scope.
   - Maintain strict proportionality between wording and actual evidence.
4. ACTION-ORIENTED STRUCTURE: Every bullet MUST begin with a strong action verb and follow the "Action + Scope + Impact" pattern (where impact is known).
5. DENSIFY STRATEGIC CLARITY: Remove weak, task-based descriptions (e.g., "Responsible for", "Helped with"). Replace them with ownership-driven language (e.g., "Architected", "Spearheaded", "Delivered") ONLY if the scope justifies it.

Output STRICT JSON matching the provided schema.`;

const SCHEMA_DESCRIPTION = `
{
  "executive_profile_rewritten": string,
  "experiences_rewritten": [
    {
      "company": string,
      "role": string,
      "bullets_rewritten": string[]
    }
  ],
  "skills_restructured": {
    "core_technical": string[],
    "architecture": string[],
    "tools_and_platforms": string[],
    "soft_skills": string[]
  },
  "improvement_summary": {
    "structural_improvements": string[],
    "impact_enhancements": string[],
    "positioning_adjustments": string[]
  }
}
`;

// ─── Hallucination Guards ──────────────────────────────────────

/**
 * Extracts all numbers from a string.
 */
function extractNumbers(text: string): string[] {
  const matches = text.match(/\d+(?:\.\d+)?/g) || [];
  return matches;
}

/**
 * Checks if the rewritten CV introduces numbers not present in the original CV.
 */
export function detectNewNumbers(originalCV: string, rewrittenCVString: string): { hasNewNumbers: boolean, inventedNumbers: string[] } {
  const originalNumbers = new Set(extractNumbers(originalCV));
  const rewrittenNumbers = extractNumbers(rewrittenCVString);

  const inventedNumbers = rewrittenNumbers.filter(num => !originalNumbers.has(num));

  return {
    hasNewNumbers: inventedNumbers.length > 0,
    inventedNumbers: Array.from(new Set(inventedNumbers))
  };
}

// ─── Credibility Pass ──────────────────────────────────────────

const CredibilitySchema = z.object({
  is_credible: z.boolean(),
  fabricated_claims: z.array(z.string()),
  explanation: z.string()
});

const CREDIBILITY_SYSTEM_PROMPT = `You are a strict compliance auditor at a consulting firm.
Compare the Original CV with the Rewritten CV.
Your ONLY goal is to detect if the Rewritten CV introduces any fabricated achievements, unrealistic claims, or exaggerated seniority not supported by the original CV.
If you detect ANY fabrication or unrealistic escalation, set is_credible to false.`;

async function performCredibilityPass(originalCV: string, rewrittenData: CvRewriteData): Promise<z.infer<typeof CredibilitySchema>> {
  const userPrompt = `
ORIGINAL CV:
${originalCV}

REWRITTEN CV:
${JSON.stringify(rewrittenData, null, 2)}

Does the rewritten CV introduce fabricated achievements, invented numbers, or unrealistic claims?`;

  return callLlmStrict(
    CREDIBILITY_SYSTEM_PROMPT,
    userPrompt,
    CredibilitySchema,
    `{ "is_credible": boolean, "fabricated_claims": string[], "explanation": string }`,
    1 // Less retries for the auditor
  );
}

// ─── Main Orchestration Function ───────────────────────────────

export async function generateExecutiveRewrite(rawCV: string, cabinetReport: FinalCabinetCvReport, targetRole: string, maxRetries = 2): Promise<FinalExecutiveRewriteReport> {
  let attempt = 0;
  let lastRewrite: CvRewriteData | null = null;
  let feedback = "";

  while (attempt <= maxRetries) {
    const userPrompt = `
TARGET ROLE: ${targetRole}

ORIGINAL CV:
${rawCV}

CABINET DIAGNOSTIC (Use this to address weaknesses and close gaps):
${JSON.stringify({
  market_positioning: cabinetReport.market_positioning,
  critical_weaknesses: cabinetReport.critical_weaknesses,
  impact_analysis: cabinetReport.impact_analysis
}, null, 2)}
${feedback ? `\nPREVIOUS ATTEMPT FAILED VALIDATION:\n${feedback}` : ""}

Rewrite the CV strictly following the rules.`;

    // 1. Generate Rewrite
    const rewrittenData = await callLlmStrict(
      REWRITE_SYSTEM_PROMPT,
      userPrompt,
      CvRewriteSchema,
      SCHEMA_DESCRIPTION
    );

    lastRewrite = rewrittenData;
    const rewrittenString = JSON.stringify(rewrittenData);

    // 2. Hallucination Guard: Number Detection
    const numberCheck = detectNewNumbers(rawCV, rewrittenString);
    if (numberCheck.hasNewNumbers) {
      console.warn(`[cv-rewriter] Attempt ${attempt + 1}: Detected hallucinated numbers: ${numberCheck.inventedNumbers.join(", ")}`);
      feedback = `CRITICAL ERROR: You fabricated the following numbers which are NOT in the original CV: ${numberCheck.inventedNumbers.join(", ")}. DO NOT INVENT METRICS.`;
      attempt++;
      continue;
    }

    // 3. Credibility Pass: Secondary LLM Check
    const credibilityCheck = await performCredibilityPass(rawCV, rewrittenData);
    if (!credibilityCheck.is_credible) {
      console.warn(`[cv-rewriter] Attempt ${attempt + 1}: Credibility Pass Failed: ${credibilityCheck.explanation}`);
      feedback = `CRITICAL ERROR: The credibility auditor rejected your rewrite due to fabricated or exaggerated claims: ${credibilityCheck.fabricated_claims.join("; ")}. FIX THIS.`;
      attempt++;
      continue;
    }

    // Passed all guards
    return {
      ...rewrittenData,
      metadata: getEngineMetadata()
    };
  }

  throw new Error(`Failed to generate a credible, hallucination-free rewrite after ${maxRetries + 1} attempts.`);
}
