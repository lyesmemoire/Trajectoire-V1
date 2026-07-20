import AIClient from "../client";
import { AI_MODELS } from "../models";
import { CV_SYSTEM_PROMPT, CV_ANALYSIS_PROMPT } from "../prompts/cv";
import { RetryManager } from "../retry/RetryManager";
import { CVAnalysisSchema, CVSkillsSchema } from "../schemas/cv.schema";
import { ValidationError, ExternalServiceError } from "@/core/errors";

/**
 * CV Analysis Service
 * Handles CV analysis using AI
 * Returns JSON without writing to database
 */

export interface CVAnalysisInput {
  cv: string;
  jobTitle: string;
  jobDescription?: string;
  userContext?: string;
  sessionId?: string;
  userId?: string;
}

export interface CVAnalysisResult {
  overallScore: number;
  atsScore: number;
  skills: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

export class CVService {
  /**
   * Analyze a CV for a specific job position
   * @param input - CV analysis input data
   * @returns CV analysis result
   */
  public static async analyzeCV(input: CVAnalysisInput): Promise<CVAnalysisResult> {
    const client = AIClient.getInstance();
    const sessionId = input.sessionId || "default";
    const userId = input.userId;

    const systemPrompt = CV_SYSTEM_PROMPT;
    const analysisPrompt = CV_ANALYSIS_PROMPT(
      input.jobTitle,
      input.jobDescription || "No job description provided"
    );

    const fullPrompt = `${systemPrompt}

CV Content:
${input.cv}

${input.userContext ? `User Context: ${input.userContext}` : ''}`;

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.CV_ANALYSIS,
          messages: [
            { role: "system", content: fullPrompt },
            { role: "user", content: analysisPrompt },
          ],
          temperature: 0.3,
          responseFormat: { type: "json_object" },
        });

        // Validate with Zod
        const parsed = JSON.parse(response.content);
        const validated = CVAnalysisSchema.safeParse(parsed);
        if (!validated.success) {
          throw new ValidationError(`Validation failed: ${validated.error.message}`);
        }

        return validated.data;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "CV analysis failed", "CVService");
    }

    return result.data;
  }

  /**
   * Extract skills from a CV
   * @param cv - CV content
   * @param sessionId - Optional session ID for tracking
   * @param userId - Optional user ID for tracking
   * @returns Extracted skills
   */
  public static async extractSkills(
    cv: string,
    sessionId?: string,
    userId?: string
  ): Promise<{
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  }> {
    const client = AIClient.getInstance();
    const actualSessionId = sessionId || "default";

    const startTime = Date.now();

    const result = await RetryManager.execute(
      async () => {
        const response = await client.chatCompletion({
          model: AI_MODELS.CV_ANALYSIS,
          messages: [
            {
              role: "system",
              content: "Extract all technical and soft skills from this CV. Categorize them as technical, soft, tools, and languages. Respond in JSON format.",
            },
            { role: "user", content: cv },
          ],
          temperature: 0.2,
          responseFormat: { type: "json_object" },
        });

        // Validate with Zod
        const parsed = JSON.parse(response.content);
        const validated = CVSkillsSchema.safeParse(parsed);
        if (!validated.success) {
          throw new ValidationError(`Validation failed: ${validated.error.message}`);
        }

        return validated.data;
      },
      { maxRetries: 3, initialDelay: 2000 }
    );

    if (!result.success || !result.data) {
      throw new ExternalServiceError(result.error || "Skills extraction failed", "CVService");
    }

    return result.data;
  }
}
