// @ts-nocheck
import { CandidateProfile } from "../types";
import { JobOfferGraph } from "../profile/JobOfferGraph";
import { MatchingCoreOutput } from "./careerCopilotMatchingIntelligenceEngine";
import { TransferableSkillsOutput } from "./careerCopilotTransferableSkillsIntelligenceEngine";
import { GapIntelligenceOutput } from "./careerCopilotGapIntelligenceEngine";
import { InterviewPreparationContext } from "./careerCopilotInterviewPreparationEngine";
import { VoiceInterviewContext } from "./careerCopilotVoiceInterviewEngine";
import { VoiceSessionContext } from "../session/VoiceSessionManager";
import { LiveAnswerAnalysisContext } from "./careerCopilotLiveInterviewAnalysisEngine";

/**
 * Live Coaching Intelligence Engine
 * 
 * Responsibilities:
 * - Decide in real-time if the candidate needs coaching
 * - Generate appropriate coaching hints
 * - Provide actionable coaching messages
 * - NO question generation, NO interview piloting, NO response analysis, NO final report generation
 * - ONLY coaching decision and generation with explainability
 */

export interface Explainability {
  source: string;
  proof: string;
  confidence: number;
  explanation: string;
  reasoning: string;
  consultedIntelligences: string[];
  limitations: string[];
}

export interface CoachingHint {
  type: "Micro Hint" | "Reminder" | "STAR Reminder" | "Evidence Reminder" | "Confidence Reminder" | "Business Reminder" | "Leadership Reminder" | "Example Reminder" | "Structure Reminder" | "Time Reminder" | "Closing Reminder";
  message: string;
  priority: "critical" | "high" | "medium" | "low";
  urgency: "immediate" | "soon" | "later";
  timing: "now" | "after response" | "next question";
  why: string;
  expectedBenefit: string;
  riskIfIgnored: string;
  confidence: number;
  explainability: Explainability;
}

export interface CoachingHistoryEntry {
  timestamp: string;
  type: string;
  message: string;
  delivered: boolean;
  effectiveness: number;
}

export interface CoachingMetadata {
  sessionId: string;
  questionId: string;
  responseId: string;
  coachingGeneratedAt: string;
  explainability: Explainability;
}

export interface LiveCoachingContext {
  coachingNeeded: boolean;
  coachingPriority: "critical" | "high" | "medium" | "low";
  recommendedHint: CoachingHint | null;
  recommendedTiming: "now" | "after response" | "next question";
  recommendedMessage: string;
  coachingHistory: CoachingHistoryEntry[];
  interventionReason: string;
  expectedImprovement: string;
  confidence: number;
  metadata: CoachingMetadata;
}

export class CareerCopilotLiveCoachingIntelligenceEngine {
  /**
   * Decide if coaching is needed and generate coaching hint
   */
  static decideCoaching(
    candidateProfile: CandidateProfile,
    jobOfferGraph: JobOfferGraph,
    matchingCoreContext: MatchingCoreOutput,
    transferableSkillsContext: TransferableSkillsOutput,
    gapContext: GapIntelligenceOutput,
    interviewPreparationContext: InterviewPreparationContext,
    voiceInterviewContext: VoiceInterviewContext,
    voiceSessionContext: VoiceSessionContext,
    liveAnswerAnalysisContext: LiveAnswerAnalysisContext
  ): LiveCoachingContext {
    const sessionId = voiceSessionContext.sessionId;
    const questionId = voiceInterviewContext.currentQuestion?.id || "unknown";
    const responseId = liveAnswerAnalysisContext.analysisMetadata.responseId;
    const coachingGeneratedAt = new Date(0).toISOString(); // Fixed date for determinism

    // Decide if coaching is needed based on analysis
    const coachingDecision = this.decideCoachingNeeded(liveAnswerAnalysisContext);
    
    if (!coachingDecision.needed) {
      return {
        coachingNeeded: false,
        coachingPriority: "low",
        recommendedHint: null,
        recommendedTiming: "next question",
        recommendedMessage: "",
        coachingHistory: [],
        interventionReason: "No coaching needed based on analysis",
        expectedImprovement: "",
        confidence: 90,
        metadata: {
          sessionId,
          questionId,
          responseId,
          coachingGeneratedAt,
          explainability: {
            source: "Live Coaching Intelligence",
            proof: "Analysis shows no coaching needed",
            confidence: 90,
            explanation: "Response quality is sufficient, no coaching needed",
            reasoning: "Based on live answer analysis scores",
            consultedIntelligences: ["Live Interview Analysis"],
            limitations: ["Coaching decision based on analysis scores only"]
          }
        }
      };
    }

    // Generate coaching hint
    const coachingHint = this.generateCoachingHint(liveAnswerAnalysisContext, coachingDecision.issue);

    return {
      coachingNeeded: true,
      coachingPriority: coachingDecision.priority,
      recommendedHint: coachingHint,
      recommendedTiming: coachingHint.timing,
      recommendedMessage: coachingHint.message,
      coachingHistory: [],
      interventionReason: coachingDecision.reason,
      expectedImprovement: coachingDecision.expectedImprovement,
      confidence: coachingHint.confidence,
      metadata: {
        sessionId,
        questionId,
        responseId,
        coachingGeneratedAt,
        explainability: {
          source: "Live Coaching Intelligence",
          proof: `Coaching generated for ${coachingDecision.issue}`,
          confidence: coachingHint.confidence,
          explanation: `Coaching generated to address ${coachingDecision.issue}`,
          reasoning: `Based on live answer analysis and coaching decision`,
          consultedIntelligences: [
            "Live Interview Analysis",
            "Interview Preparation Intelligence",
            "Gap Intelligence"
          ],
          limitations: ["Coaching based on analysis scores only"]
        }
      }
    };
  }

  /**
   * Decide if coaching is needed
   */
  private static decideCoachingNeeded(liveAnswerAnalysisContext: LiveAnswerAnalysisContext): {
    needed: boolean;
    priority: "critical" | "high" | "medium" | "low";
    issue: string;
    reason: string;
    expectedImprovement: string;
  } {
    const { overallQuality, answerCompleteness, evidenceScore, starCompliance, missingElements, risksDetected } = liveAnswerAnalysisContext;

    // Critical issues that require immediate coaching
    if (overallQuality.score < 40) {
      return {
        needed: true,
        priority: "critical",
        issue: "Poor overall quality",
        reason: "Response quality is below acceptable threshold",
        expectedImprovement: "Improve overall response quality"
      };
    }

    if (answerCompleteness.score < 40) {
      return {
        needed: true,
        priority: "critical",
        issue: "Incomplete response",
        reason: "Response is incomplete and missing key elements",
        expectedImprovement: "Provide a more complete response"
      };
    }

    // High priority issues
    if (evidenceScore.score < 50) {
      return {
        needed: true,
        priority: "high",
        issue: "Lack of evidence",
        reason: "Response lacks concrete evidence and examples",
        expectedImprovement: "Provide specific evidence and examples"
      };
    }

    if (starCompliance.score < 50) {
      return {
        needed: true,
        priority: "high",
        issue: "No STAR structure",
        reason: "Response does not follow STAR structure",
        expectedImprovement: "Structure response using STAR method"
      };
    }

    // Medium priority issues
    if (missingElements.length > 2) {
      return {
        needed: true,
        priority: "medium",
        issue: "Multiple missing elements",
        reason: `Response is missing ${missingElements.length} important elements`,
        expectedImprovement: "Address missing elements in response"
      };
    }

    if (risksDetected.length > 0) {
      return {
        needed: true,
        priority: "medium",
        issue: "Risks detected",
        reason: "Response contains potential risks",
        expectedImprovement: "Mitigate identified risks"
      };
    }

    // Low priority issues
    if (overallQuality.score < 60) {
      return {
        needed: true,
        priority: "low",
        issue: "Below average quality",
        reason: "Response quality is below average",
        expectedImprovement: "Improve response quality"
      };
    }

    // No coaching needed
    return {
      needed: false,
      priority: "low",
      issue: "",
      reason: "",
      expectedImprovement: ""
    };
  }

  /**
   * Generate coaching hint based on issue
   */
  private static generateCoachingHint(
    liveAnswerAnalysisContext: LiveAnswerAnalysisContext,
    issue: string
  ): CoachingHint {
    const { missingElements, risksDetected } = liveAnswerAnalysisContext;

    let type: CoachingHint["type"] = "Reminder";
    let message = "";
    let priority: CoachingHint["priority"] = "medium";
    let urgency: CoachingHint["urgency"] = "soon";
    let timing: CoachingHint["timing"] = "after response";
    let why = "";
    let expectedBenefit = "";
    let riskIfIgnored = "";
    let confidence = 75;

    switch (issue) {
      case "Poor overall quality":
        type = "Structure Reminder";
        message = "Essayez de structurer votre réponse de manière plus claire et organisée.";
        priority = "critical";
        urgency = "immediate";
        timing = "now";
        why = "Overall quality is poor, needs immediate improvement";
        expectedBenefit = "Improved clarity and organization of response";
        riskIfIgnored = "Poor quality response may negatively impact interview outcome";
        confidence = 85;
        break;

      case "Incomplete response":
        type = "Reminder";
        message = "Pourriez-vous développer davantage votre réponse pour couvrir tous les aspects de la question ?";
        priority = "critical";
        urgency = "immediate";
        timing = "now";
        why = "Response is incomplete and missing key elements";
        expectedBenefit = "More complete and comprehensive response";
        riskIfIgnored = "Incomplete response may leave key points unaddressed";
        confidence = 85;
        break;

      case "Lack of evidence":
        type = "Evidence Reminder";
        message = "Pourriez-vous donner un exemple concret ou une preuve spécifique pour illustrer votre point ?";
        priority = "high";
        urgency = "soon";
        timing = "after response";
        why = "Response lacks concrete evidence and examples";
        expectedBenefit = "More credible and convincing response";
        riskIfIgnored = "Lack of evidence may reduce credibility";
        confidence = 80;
        break;

      case "No STAR structure":
        type = "STAR Reminder";
        message = "Essayez de structurer votre réponse en utilisant la méthode STAR : Situation, Tâche, Action, Résultat.";
        priority = "high";
        urgency = "soon";
        timing = "after response";
        why = "Response does not follow STAR structure";
        expectedBenefit = "Better structured and more impactful response";
        riskIfIgnored = "Lack of structure may make response harder to follow";
        confidence = 80;
        break;

      case "Multiple missing elements":
        type = "Reminder";
        message = `Vous avez oublié de mentionner : ${missingElements.slice(0, 2).join(", ")}.`;
        priority = "medium";
        urgency = "soon";
        timing = "after response";
        why = `Response is missing ${missingElements.length} important elements`;
        expectedBenefit = "More complete response addressing all key points";
        riskIfIgnored = "Missing elements may leave gaps in evaluation";
        confidence = 75;
        break;

      case "Risks detected":
        type = "Reminder";
        message = `Attention aux points suivants : ${risksDetected.slice(0, 2).join(", ")}.`;
        priority = "medium";
        urgency = "soon";
        timing = "after response";
        why = "Response contains potential risks";
        expectedBenefit = "Mitigation of identified risks";
        riskIfIgnored = "Risks may negatively impact evaluation";
        confidence = 75;
        break;

      case "Below average quality":
        type = "Micro Hint";
        message = "Vous pourriez améliorer votre réponse en ajoutant plus de détails.";
        priority = "low";
        urgency = "later";
        timing = "next question";
        why = "Response quality is below average";
        expectedBenefit = "Improved response quality";
        riskIfIgnored = "Below average response may not fully demonstrate capabilities";
        confidence = 70;
        break;

      default:
        type = "Reminder";
        message = "Continuez comme ça, vous êtes sur la bonne voie.";
        priority = "low";
        urgency = "later";
        timing = "next question";
        why = "General encouragement";
        expectedBenefit = "Maintain positive momentum";
        riskIfIgnored = "None";
        confidence = 65;
    }

    return {
      type,
      message,
      priority,
      urgency,
      timing,
      why,
      expectedBenefit,
      riskIfIgnored,
      confidence,
      explainability: {
        source: "Live Coaching Intelligence",
        proof: `Coaching generated for ${issue}`,
        confidence,
        explanation: `Coaching message to address ${issue}`,
        reasoning: `Based on issue type and analysis scores`,
        consultedIntelligences: ["Live Interview Analysis"],
        limitations: ["Coaching based on analysis scores only"]
      }
    };
  }
}
