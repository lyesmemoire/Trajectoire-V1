// @ts-nocheck
import { aiOrchestrator } from "../../ai/AIOrchestrator";
import { dailyCoachV1 } from "../../ai/Prompts/daily-coach-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

export interface DailyCoachInput {
  candidateProfile: string;
  strengths: string[];
  weaknesses: string[];
  careerLevel: string;
  experience: string;
  currentGoals: string[];
  recentProgress: string;
  overallScore: number;
  previousScore: number;
  scoreChange: number;
  recommendedSkills: string[];
  recommendedInterviews: string[];
  recentInsights: string[];
  weeklySummary: string;
}

export interface DailyCoachOutput {
  personalizedMessage: string;
  dailyObjective: string;
  dailyExercise: string;
  skillToWorkOn: string;
  recommendedInterview: string;
  progressSinceYesterday: string;
  personalizedEncouragement: string;
  goalReminder: string;
  weeklySummary: string;
}

export class DailyCoachAIEngine {
  static async generateDailyCoach(input: DailyCoachInput): Promise<DailyCoachOutput> {
    // Check if we have a recent analysis in Brain
    const inputHash = JSON.stringify(input);
    const promptId = "daily-coach";
    
    // Brain only retrieves, Engine decides
    const existingAnalysis = candidateAIBrain.findAnalysis(promptId, inputHash);
    
    if (existingAnalysis) {
      // Engine decides: is this analysis still valid?
      const ageInDays = (Date.now() - existingAnalysis.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      
      // Decision: reuse if less than 1 day old
      if (ageInDays < 1 && existingAnalysis.output) {
        return existingAnalysis.output as DailyCoachOutput;
      }
    }

    // Generate new analysis with historical context
    const brainInsights = candidateAIBrain.getInsights();
    const brainGoals = candidateAIBrain.getGoals();
    const brainObservations = candidateAIBrain.getObservations();
    
    const historicalInsights = brainInsights.slice(0, 5).map(i => i.description);
    const previousGoals = brainGoals.filter(g => g.status === "achieved").map(g => g.description);
    const currentGoals = brainGoals.filter(g => g.status === "in_progress").map(g => g.description);
    const recentObservations = brainObservations.slice(0, 10).map(o => `${o.type}: ${JSON.stringify(o.data).substring(0, 50)}...`);

    const result = await aiOrchestrator.execute<DailyCoachOutput>(
      dailyCoachV1,
      {
        candidateProfile: input.candidateProfile,
        strengths: input.strengths.join(", "),
        weaknesses: input.weaknesses.join(", "),
        careerLevel: input.careerLevel,
        experience: input.experience,
        currentGoals: input.currentGoals.join(", "),
        recentProgress: input.recentProgress,
        overallScore: input.overallScore.toString(),
        previousScore: input.previousScore.toString(),
        scoreChange: input.scoreChange.toString(),
        recommendedSkills: input.recommendedSkills.join(", "),
        recommendedInterviews: input.recommendedInterviews.join(", "),
        recentInsights: input.recentInsights.join(", "),
        weeklySummary: input.weeklySummary,
        historicalInsights: historicalInsights.join(", "),
        previousGoals: previousGoals.join(", "),
        currentBrainGoals: currentGoals.join(", "),
        recentObservations: recentObservations.join(", "),
      },
      {
        provider: "openai",
        model: "gpt-4-turbo",
        promptId: "daily-coach",
        promptVersion: "v1",
        temperature: 0.7,
        maxTokens: 800,
      }
    );

    if (!result.success || !result.data) {
      throw new Error(`Failed to generate daily coach: ${result.error}`);
    }

    // Store analysis in Brain history
    candidateAIBrain.addHistoryEntry({
      promptId,
      promptVersion: "v1",
      input: JSON.parse(JSON.stringify(input)) as Record<string, unknown>,
      output: result.data,
      timestamp: new Date(),
      metrics: {
        latency: result.metrics?.latency || 0,
        tokens: {
          prompt: result.metrics?.promptTokens || 0,
          completion: result.metrics?.completionTokens || 0,
          total: result.metrics?.totalTokens || 0,
        },
        cost: result.metrics?.cost || 0,
        retryCount: 0,
      },
      status: "success",
    });

    return result.data;
  }
}
