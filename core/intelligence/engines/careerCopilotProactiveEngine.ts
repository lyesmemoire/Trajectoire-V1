import { intelligenceCoreModule } from "../../../lib/intelligence-core";
import { IntelligenceRequest } from "../../../lib/intelligence-core";
import { EventPublisher } from "../../../lib/intelligence-runtime/application/EventPublisher";
import { careerCopilotProactiveV1 } from "../../ai/Prompts/career-copilot-proactive-v1";
import { candidateAIBrain } from "../../ai/brain/CandidateAIBrain";

export interface ProactiveInput {
  candidateGraph: any;
}

export interface Initiative {
  type: "celebrate" | "warn" | "remind" | "encourage" | "challenge" | "advise";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  justification: string;
  dataUsed: string[];
  proposedAction: string;
}

export interface ProactiveOutput {
  initiatives: Initiative[];
}

/**
 * Career Copilot Proactive Engine
 * 
 * Generates proactive initiatives based on candidate evolution.
 * Reuses existing AIOrchestrator and CandidateAIBrain.
 */
export class CareerCopilotProactiveEngine {
  /**
   * Generate proactive initiatives
   */
  static async generateInitiatives(input: ProactiveInput): Promise<ProactiveOutput> {
    // Extract data from CandidateGraph
    const candidateProfile = {
      name: input.candidateGraph.identity?.name || "Candidat",
      currentRole: input.candidateGraph.career?.currentRole || "Non défini",
      careerLevel: input.candidateGraph.career?.careerLevel || "mid",
      overallScore: input.candidateGraph.overallScore || 0,
    };

    // Extract historical observations from Brain
    const historicalObservations = candidateAIBrain.getObservations()
      .slice(0, 15)
      .map(obs => `${obs.type}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

    // Extract recent insights from Brain
    const recentInsights = candidateAIBrain.getInsights()
      .slice(0, 5)
      .map(insight => insight.description);

    // Extract current goals from Brain
    const currentGoals = candidateAIBrain.getGoals()
      .map(g => `${g.status}: ${g.description} (target: ${g.target}, current: ${g.current})`);

    // Extract previous initiatives from Brain to avoid repetition
    const previousInitiatives = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "career-copilot-proactive")
      .slice(-5)
      .map(obs => `${obs.timestamp.toISOString()}: ${JSON.stringify(obs.data).substring(0, 100)}...`);

    // Extract previous recommendations for continuity
    const previousRecs = candidateAIBrain.getObservations()
      .filter(obs => obs.source === "recommendations" || obs.source === "career-copilot-conversation")
      .slice(-5)
      .map(obs => JSON.stringify(obs.data).substring(0, 100) + "...");

    // Derive candidate adaptive profile from Brain data
    const allObservations = candidateAIBrain.getObservations();
    const allInsights = candidateAIBrain.getInsights();
    const allGoals = candidateAIBrain.getGoals();
    const conversationObservations = allObservations.filter(obs => obs.source === "career-copilot-conversation");

    // Autonomy level: based on number of questions asked and complexity
    const autonomyLevel = conversationObservations.length > 10 ? "high" : conversationObservations.length > 5 ? "medium" : "low";

    // Need for explanations: based on question complexity and follow-up questions
    const explanationNeed = conversationObservations.length > 5 ? "low" : "high";

    // Progression pace: based on number of observations (proxy for activity)
    const progressionPace = allObservations.length > 10 ? "fast" : allObservations.length > 5 ? "moderate" : "slow";

    // Confidence level: based on overall score
    const confidenceLevel = input.candidateGraph.overallScore > 75 ? "high" : input.candidateGraph.overallScore > 50 ? "medium" : "low";

    // Usage frequency: based on observation frequency
    const recentObservations = allObservations.filter(obs => {
      const daysSince = (Date.now() - obs.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince < 7;
    });
    const usageFrequency = recentObservations.length > 10 ? "daily" : recentObservations.length > 5 ? "weekly" : "occasional";

    // Motivation level: based on goal completion rate
    const completedGoals = allGoals.filter(g => g.status === "achieved").length;
    const totalGoals = allGoals.length;
    const motivationLevel = totalGoals > 0 && completedGoals / totalGoals > 0.7 ? "high" : totalGoals > 0 && completedGoals / totalGoals > 0.4 ? "medium" : "low";

    // Recommendation follow-through: based on action taken after recommendations
    const recommendationObservations = allObservations.filter(obs => obs.source === "recommendations");
    const followThrough = recommendationObservations.length > 0 ? "high" : "unknown";

    // Best-responding advice: based on insights with high confidence
    const highConfidenceInsights = allInsights.filter(i => i.confidence > 0.8);
    const bestAdvice = highConfidenceInsights.length > 0 ? highConfidenceInsights[0]?.description || "None identified" : "None identified";

    // Extract recent events from Brain
    const recentEvents = candidateAIBrain.getObservations()
      .slice(0, 10)
      .map(obs => `${obs.type} at ${obs.timestamp.toISOString()}`);

    // Format CandidateGraph data
    const candidateGraphData = `
Overall Score: ${input.candidateGraph.overallScore || 0}/100
Communication: ${input.candidateGraph.communication?.score || 0}/100
Leadership: ${input.candidateGraph.leadership?.score || 0}/100
Confidence: ${input.candidateGraph.confidence || 0}/100
Structure: ${input.candidateGraph.structure?.score || 0}/100
Impact: ${input.candidateGraph.impact?.score || 0}/100

Progress: ${input.candidateGraph.progress?.timeline?.length || 0} interviews completed
Change: ${input.candidateGraph.progress?.change || 0}
Trend: ${input.candidateGraph.progress?.trend || "stable"}

Strengths: ${(input.candidateGraph.strengths || []).map((s: any) => s.description).join(", ")}
Weaknesses: ${(input.candidateGraph.weaknesses || []).map((w: any) => w.description).join(", ")}

Recommended Skills: ${(input.candidateGraph.recommendedSkills || []).map((s: any) => s.title).join(", ")}
Recommended Interviews: ${(input.candidateGraph.recommendedInterviews || []).map((i: any) => i.title).join(", ")}

Risks: ${(input.candidateGraph.riskAnalysis?.risks || []).map((r: any) => r.description).join(", ")}
Employability: ${input.candidateGraph.employability?.overall || 0}/100
`;

    const promptTemplate = careerCopilotProactiveV1.system || careerCopilotProactiveV1.user;
    const intelligenceUseCase = intelligenceCoreModule.createUseCase<ProactiveOutput>(promptTemplate);

    const request: IntelligenceRequest<ProactiveOutput> = {
      id: `career-copilot-proactive-${Date.now()}`,
      type: "career-copilot-proactive",
      input: input as unknown as ProactiveOutput,
      context: {
        candidateProfile: {},
        historicalObservations: [],
        currentGoals: [],
        recentInsights: [],
        engineContext: {
          candidateProfile,
          previousInitiatives: previousInitiatives,
          previousRecommendations: previousRecs,
          recentEvents: recentEvents,
        },
      },
      options: {
        provider: "openai",
        model: "gpt-4-turbo",
        temperature: 0.7,
        maxTokens: 1500,
      },
    };

    const result = await intelligenceUseCase.execute(request);

    if (!result.success || !result.output) {
      throw new Error("Failed to generate proactive initiatives");
    }

    const output = result.output as ProactiveOutput;

    // Save initiatives to Brain as observations
    if (output.initiatives && output.initiatives.length > 0) {
      for (const initiative of output.initiatives) {
        candidateAIBrain.addObservation({
          timestamp: new Date(),
          source: "career-copilot-proactive",
          type: "general",
          data: {
            initiativeType: initiative.type,
            priority: initiative.priority,
            title: initiative.title,
            message: initiative.message,
            justification: initiative.justification,
            dataUsed: initiative.dataUsed,
            proposedAction: initiative.proposedAction,
          },
          confidence: 0.9,
        });
      }

      // Publish initiative event via EventPublisher
      const eventPublisher = new EventPublisher();
      eventPublisher.publish("observation_created", {
        source: "career-copilot-proactive",
        observationType: "general",
        data: {
          initiatives: output.initiatives,
        },
        confidence: 0.9,
      });
    }

    return output;
  }
}
