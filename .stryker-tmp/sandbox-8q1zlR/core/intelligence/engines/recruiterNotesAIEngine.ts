// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
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
    const result = await aiOrchestrator.execute(
      recruiterNotesV1,
      {
        transcript: input.transcript,
        candidateBackground: input.candidateBackground,
        observations: input.observations,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "recruiter-notes",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Recruiter notes generation failed: ${result.error}`);
    }

    return result.data;
  }
}
