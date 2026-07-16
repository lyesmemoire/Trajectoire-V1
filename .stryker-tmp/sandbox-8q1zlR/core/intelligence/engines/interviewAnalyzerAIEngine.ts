// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { interviewAnalysisV1 } from "../../ai/Prompts/interview-analysis-v1";
import { communicationAnalysisV1 } from "../../ai/Prompts/communication-analysis-v1";
import { leadershipAnalysisV1 } from "../../ai/Prompts/leadership-analysis-v1";
import { eventBus } from "../../ai/events/EventBus";
import { InterviewAnalyzedEvent, ObservationCreatedEvent } from "../../ai/events/BrainEvents";

/**
 * Interview Analyzer AI Engine
 *
 * Orchestrates AI-powered interview analysis using AIOrchestrator.
 * Replaces mock generation with real AI analysis.
 */

export interface InterviewAnalysisInput {
  transcript: string;
  context: string;
}

export interface InterviewAnalysisOutput {
  overallScore: number;
  dimensions: {
    communication: { score: number; strengths: string[]; weaknesses: string[]; feedback: string };
    leadership: { score: number; strengths: string[]; weaknesses: string[]; feedback: string };
    confidence: { score: number; strengths: string[]; weaknesses: string[]; feedback: string };
    structure: { score: number; strengths: string[]; weaknesses: string[]; feedback: string };
    impact: { score: number; strengths: string[]; weaknesses: string[]; feedback: string };
    synthesis: { score: number; strengths: string[]; weaknesses: string[]; feedback: string };
  };
  keyMoments: {
    bestMoment: string;
    worstMoment: string;
    improvementAreas: string[];
  };
  recommendations: string[];
  nextSteps: string[];
}

export class InterviewAnalyzerAIEngine {
  /**
   * Analyze interview using AI
   */
  static async analyzeInterview(input: InterviewAnalysisInput, interviewId: string): Promise<InterviewAnalysisOutput> {
    const result = await aiOrchestrator.execute<InterviewAnalysisOutput>(
      interviewAnalysisV1,
      {
        transcript: input.transcript,
        context: input.context,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "interview-analysis",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Interview analysis failed: ${result.error}`);
    }

    // Publish event to event bus
    await eventBus.publish<InterviewAnalyzedEvent>({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: "interview_analyzed",
      payload: {
        interviewId,
        transcript: input.transcript,
        analysis: result.data,
        metrics: {
          latency: result.metrics?.latency || 0,
          tokens: result.metrics?.totalTokens || 0,
          cost: result.metrics?.cost || 0,
        },
      },
    });

    // Publish observation_created event for CandidateAIBrain
    await eventBus.publish<ObservationCreatedEvent>({
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: "observation_created",
      payload: {
        source: "interview-analysis",
        observationType: "interview",
        data: {
          overallScore: result.data.overallScore,
          dimensions: result.data.dimensions,
          keyMoments: result.data.keyMoments,
          recommendations: result.data.recommendations,
        },
        confidence: 0.8,
        metadata: {
          interviewId,
          context: input.context,
        },
      },
    });

    return result.data;
  }

  /**
   * Analyze communication using AI
   */
  static async analyzeCommunication(input: { context: string; content: string }) {
    const result = await aiOrchestrator.execute(
      communicationAnalysisV1,
      {
        context: input.context,
        content: input.content,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "communication-analysis",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Communication analysis failed: ${result.error}`);
    }

    return result.data;
  }

  /**
   * Analyze leadership using AI
   */
  static async analyzeLeadership(input: { context: string; evidence: string }) {
    const result = await aiOrchestrator.execute(
      leadershipAnalysisV1,
      {
        context: input.context,
        evidence: input.evidence,
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "leadership-analysis",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Leadership analysis failed: ${result.error}`);
    }

    return result.data;
  }

  /**
   * Map AI analysis to legacy format for backward compatibility
   */
  static mapToLegacyFormat(aiOutput: InterviewAnalysisOutput): {
    questionAnalysis: Array<{
      id: string;
      question: string;
      responseSummary: string;
      positives: string[];
      weaknesses: string[];
      recruiterThoughts: string;
      recruiterExpectations: string;
      score: number;
    }>;
    timeline: Array<{
      id: string;
      timestamp: number;
      type: "positive" | "negative" | "neutral";
      description: string;
      impact: "low" | "medium" | "high";
    }>;
    starAnalysis: Array<{
      questionId: string;
      situation: { present: boolean; quality: number; feedback: string };
      task: { present: boolean; quality: number; feedback: string };
      action: { present: boolean; quality: number; feedback: string };
      result: { present: boolean; quality: number; feedback: string };
      overallScore: number;
    }>;
    languageAnalysis: {
      fillerWords: { count: number; frequency: "low" | "medium" | "high"; examples: string[] };
      repetitions: { count: number; frequency: "low" | "medium" | "high"; examples: string[] };
      clarity: { score: number; feedback: string };
      sentenceLength: { average: number; variance: number; feedback: string };
      vocabulary: { diversity: number; sophistication: number; feedback: string };
      persuasion: { score: number; feedback: string };
      fluency: { score: number; feedback: string };
    };
    postureAnalysis: {
      confidence: { score: number; feedback: string };
      calmness: { score: number; feedback: string };
      leadership: { score: number; feedback: string };
      energy: { score: number; feedback: string };
      impact: { score: number; feedback: string };
      presence: { score: number; feedback: string };
    };
  } {
    // This is a simplified mapping - in production, you'd want more sophisticated mapping
    return {
      questionAnalysis: [],
      timeline: [],
      starAnalysis: [],
      languageAnalysis: {
        fillerWords: { count: 0, frequency: "low", examples: [] },
        repetitions: { count: 0, frequency: "low", examples: [] },
        clarity: { score: aiOutput.dimensions.communication.score, feedback: aiOutput.dimensions.communication.feedback },
        sentenceLength: { average: 15, variance: 5, feedback: "Well-balanced sentences" },
        vocabulary: { diversity: aiOutput.dimensions.communication.score, sophistication: aiOutput.dimensions.communication.score, feedback: "Professional vocabulary" },
        persuasion: { score: aiOutput.dimensions.impact.score, feedback: aiOutput.dimensions.impact.feedback },
        fluency: { score: aiOutput.dimensions.communication.score, feedback: aiOutput.dimensions.communication.feedback },
      },
      postureAnalysis: {
        confidence: { score: aiOutput.dimensions.confidence.score, feedback: aiOutput.dimensions.confidence.feedback },
        calmness: { score: aiOutput.dimensions.confidence.score, feedback: aiOutput.dimensions.confidence.feedback },
        leadership: { score: aiOutput.dimensions.leadership.score, feedback: aiOutput.dimensions.leadership.feedback },
        energy: { score: aiOutput.dimensions.impact.score, feedback: aiOutput.dimensions.impact.feedback },
        impact: { score: aiOutput.dimensions.impact.score, feedback: aiOutput.dimensions.impact.feedback },
        presence: { score: aiOutput.dimensions.confidence.score, feedback: aiOutput.dimensions.confidence.feedback },
      },
    };
  }
}
