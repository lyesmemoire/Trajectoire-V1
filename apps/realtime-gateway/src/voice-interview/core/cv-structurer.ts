import { z } from "zod";
import { callLlmStrict, clampScore } from "./llm-strict.js";

const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration_months: z.number().min(0),
  bullet_count: z.number().min(0),
  quantified_bullets_ratio: z.number().min(0).max(1),
  action_verb_density: z.number().min(0).max(1),
  impact_orientation_score: z.number().min(0).max(10),
  technical_depth_score: z.number().min(0).max(10),
  leadership_signals: z.array(z.string()),
  bullet_quality_distribution: z.object({
    weak: z.number().min(0),
    average: z.number().min(0),
    strong: z.number().min(0),
  }),
});

export const CvStructurerSchema = z.object({
  profile_summary_present: z.boolean(),
  total_experiences: z.number().min(0),
  career_progression: z.object({
    is_logical: z.boolean(),
    promotion_signals: z.array(z.string()),
    inconsistencies: z.array(z.string()),
  }),
  experiences: z.array(ExperienceSchema),
  skills_section_quality: z.number().min(0).max(10),
  education_strength: z.number().min(0).max(10),
  career_gaps_detected: z.array(z.string()),
  overall_structural_coherence_score: z.number().min(0).max(10),
  global_quantification_ratio: z.number().min(0).max(1),
});

export type StructuredCV = z.infer<typeof CvStructurerSchema>;

const SYSTEM_PROMPT = `You are a factual data extraction engine for a top-tier consulting firm.
Your goal is to extract strictly objective data from the provided CV.

CRITICAL RULES:
- Extract ONLY what is explicitly written. Never infer, assume, or hallucinate.
- Never infer quantified results if not explicitly present in the text.
- If a bullet point says "managed a team" with no numbers, that is NOT a quantified bullet.
- A weak CV must produce low scores (2-4 range). Do NOT be generous.
- An internship of 1 month is NOT meaningful experience.
- Listing skills without evidence is NOT technical depth.
- bullet_quality_distribution: Classify bullet points into:
  - "weak": just responsibilities, no context or impact (e.g. "Made a website")
  - "average": some context but no metrics (e.g. "Developed frontend using React")
  - "strong": clear impact with metrics (e.g. "Reduced load time by 45%, saving $2M/year")
- global_quantification_ratio: ratio of ALL bullet points across the CV that contain explicit numerical metrics (0.0 to 1.0).
- overall_structural_coherence_score: A CV with 1 experience and no details should score below 3.0.
- All scores must be between 0.0 and 10.0.`;

const SCHEMA_DESCRIPTION = `
{
  "profile_summary_present": boolean,
  "total_experiences": number,
  "career_progression": {
    "is_logical": boolean,
    "promotion_signals": string[],
    "inconsistencies": string[]
  },
  "experiences": [
    {
      "company": string,
      "role": string,
      "duration_months": number,
      "bullet_count": number,
      "quantified_bullets_ratio": number (0.0 - 1.0),
      "action_verb_density": number (0.0 - 1.0),
      "impact_orientation_score": number (0 - 10),
      "technical_depth_score": number (0 - 10),
      "leadership_signals": string[],
      "bullet_quality_distribution": {
        "weak": number,
        "average": number,
        "strong": number
      }
    }
  ],
  "skills_section_quality": number (0 - 10),
  "education_strength": number (0 - 10),
  "career_gaps_detected": string[],
  "overall_structural_coherence_score": number (0 - 10),
  "global_quantification_ratio": number (0.0 - 1.0)
}
`;

export async function extractStructuredCV(cvText: string): Promise<StructuredCV> {
  const userPrompt = `Extract structural data from the following CV:\n\n${cvText}`;
  
  const rawData = await callLlmStrict(
    SYSTEM_PROMPT,
    userPrompt,
    CvStructurerSchema,
    SCHEMA_DESCRIPTION
  );

  // Backend deterministic clamp enforcement
  rawData.overall_structural_coherence_score = clampScore(rawData.overall_structural_coherence_score, 0, 10);
  rawData.skills_section_quality = clampScore(rawData.skills_section_quality, 0, 10);
  rawData.education_strength = clampScore(rawData.education_strength, 0, 10);

  rawData.experiences.forEach(exp => {
    exp.impact_orientation_score = clampScore(exp.impact_orientation_score, 0, 10);
    exp.technical_depth_score = clampScore(exp.technical_depth_score, 0, 10);
  });

  return rawData;
}
