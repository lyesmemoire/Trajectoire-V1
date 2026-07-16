import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { recruiterNotesV1 } from "../../ai/Prompts/recruiter-notes-v1";

/**
 * Recruiter Notes AI Engine
 *
 * Orchestrates AI-powered recruiter notes generation using AIOrchestrator.
 */

export interface RecruiterNotesInput {
  transcript: string;
  candidateBackground: string;
  observations: string;
}

export class RecruiterNotesAIEngine {
  /**
   * Generate recruiter notes using AI
   */
  static async generateRecruiterNotes(input: RecruiterNotesInput) {
    const promptTemplate = recruiterNotesV1.system || recruiterNotesV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase(promptTemplate);

    const request: IntelligenceRequest = {
      id: `recruiter-notes-${Date.now()}`,
      type: "recruiter-notes",
      input: input as unknown as Record<string, unknown>,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          transcript: input.transcript,
          candidateBackground: input.candidateBackground,
          observations: input.observations,
        },
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 2000,
        timeout: 30000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error(`Recruiter notes generation failed: ${result.error}`);
    }

    return result.output;
  }
}
