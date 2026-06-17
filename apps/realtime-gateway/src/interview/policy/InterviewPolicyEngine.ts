// apps/realtime-gateway/src/interview/policy/InterviewPolicyEngine.ts

import type { InterviewState } from "../models/InterviewState";
import { INTERVIEW_CONFIG } from "../config/config";
import { isExpired } from "./expiration";

export type PolicyResult = {
  allowed: boolean;
  reason?: string;
  code?: string;
};

export class InterviewPolicyEngine {
  static maxQuestions(state: InterviewState): PolicyResult {
    const questionEvents = state.events.filter(
      (e) => e.type === "question_asked",
    );
    if (questionEvents.length >= INTERVIEW_CONFIG.MAX_QUESTIONS) {
      return {
        allowed: false,
        code: "MAX_QUESTIONS",
        reason: "Maximum question count reached",
      };
    }
    return { allowed: true };
  }

  static timeout(state: InterviewState): PolicyResult {
    if (isExpired(state)) {
      return {
        allowed: false,
        code: "SESSION_TIMEOUT",
        reason: "Interview session has expired",
      };
    }
    return { allowed: true };
  }

  static topicFatigue(
    state: InterviewState,
    currentTopicDepth: number,
  ): PolicyResult {
    if (currentTopicDepth > INTERVIEW_CONFIG.MAX_TOPIC_DEPTH) {
      return {
        allowed: false,
        code: "TOPIC_FATIGUE",
        reason: "Maximum depth for this topic reached, transition required",
      };
    }
    return { allowed: true };
  }

  // Example placeholder for consecutive hard questions check
  static maxConsecutiveHardQuestions(state: InterviewState): PolicyResult {
    // Logic to inspect last N questions...
    return { allowed: true };
  }

  // Example placeholder for confidence escalation
  static confidenceCheck(state: InterviewState): PolicyResult {
    // Logic to check candidate confidence metrics...
    return { allowed: true };
  }

  // General entry point for checking if we can proceed to next question
  static canAskQuestion(
    state: InterviewState,
    currentTopicDepth: number = 0,
  ): PolicyResult {
    const maxQ = this.maxQuestions(state);
    if (!maxQ.allowed) return maxQ;

    const tOut = this.timeout(state);
    if (!tOut.allowed) return tOut;

    const fatigue = this.topicFatigue(state, currentTopicDepth);
    if (!fatigue.allowed) return fatigue;

    // Evaluate anti-hallucination/claim validation policies here in future

    return { allowed: true };
  }

  static shouldEndInterview(state: InterviewState): PolicyResult {
    if (isExpired(state)) {
      return { allowed: true, code: "EXPIRED", reason: "Time expired" };
    }

    const questionEvents = state.events.filter(
      (e) => e.type === "question_asked",
    );
    if (questionEvents.length >= INTERVIEW_CONFIG.MAX_QUESTIONS) {
      return {
        allowed: true,
        code: "MAX_QUESTIONS",
        reason: "Max questions asked",
      };
    }

    return { allowed: false };
  }
}
