import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { recruiterQuestionV1 } from "../../ai/Prompts/recruiter-question-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

export interface RecruiterQuestionInput {
  candidateProfile: string;
  strengths: string[];
  weaknesses: string[];
  careerLevel: string;
  experience: string;
  interviewContext: string;
  conversationHistory: string;
  lastCandidateResponse: string;
  difficulty: number;
  interviewType: string;
  targetPosition: string;
  historicalInsights?: string[];
  previousInterviews?: string[];
  knownPatterns?: string[];
}

export interface RecruiterQuestionOutput {
  question: string;
  behavior: "follow_up" | "challenge" | "topic_change" | "inconsistency_check" | "relaunch" | "interruption" | "standard";
  tone: "formal" | "conversational" | "challenging" | "supportive" | "neutral";
  difficulty: number;
  reference?: string;
  reasoning: string;
}

export class RecruiterQuestionAIEngine {
  static async generateQuestion(input: RecruiterQuestionInput): Promise<RecruiterQuestionOutput> {
    // Recruiter questions are always generated fresh as they depend on conversation context
    // But we still pass historical context to make them more informed
    
    const brainInsights = candidateAIBrain.getInsights();
    const brainObservations = candidateAIBrain.getObservations();
    const brainPatterns = candidateAIBrain.getPatterns();
    
    const historicalInsights = brainInsights.slice(0, 5).map(i => i.description);
    const previousInterviews = brainObservations
      .filter(o => o.type === "interview")
      .slice(0, 3)
      .map(o => `${o.source}: ${JSON.stringify(o.data).substring(0, 100)}...`);
    const knownPatterns = brainPatterns.patterns
      .slice(0, 5)
      .map((p: any) => `${p.pattern} (${p.category})`);

    const promptTemplate = recruiterQuestionV1.system || recruiterQuestionV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<RecruiterQuestionOutput>(promptTemplate);

    const request: IntelligenceRequest<RecruiterQuestionOutput> = {
      id: `recruiter-question-${Date.now()}`,
      type: "recruiter-question",
      input: input as unknown as RecruiterQuestionOutput,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          candidateProfile: input.candidateProfile,
          strengths: input.strengths.join(", "),
          weaknesses: input.weaknesses.join(", "),
          careerLevel: input.careerLevel,
          experience: input.experience,
          interviewContext: input.interviewContext,
          conversationHistory: input.conversationHistory,
          lastCandidateResponse: input.lastCandidateResponse,
          difficulty: input.difficulty.toString(),
          interviewType: input.interviewType,
          targetPosition: input.targetPosition,
          historicalInsights: input.historicalInsights?.join(", ") || historicalInsights.join(", "),
          previousInterviews: input.previousInterviews?.join(", ") || previousInterviews.join(", "),
          knownPatterns: input.knownPatterns?.join(", ") || knownPatterns.join(", "),
        },
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.8,
        maxTokens: 500,
        timeout: 30000,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error(`Failed to generate recruiter question: ${result.error}`);
    }

    return result.output as RecruiterQuestionOutput;
  }
}
