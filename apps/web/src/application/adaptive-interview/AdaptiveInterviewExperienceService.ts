/**
 * Adaptive Interview Experience Service
 * Real-time adaptive interview experience
 */

import {
  RecruiterAdaptationState,
  UserResponseAnalysis,
  AdaptationTrigger,
  AdaptationAction,
  RealTimeUpdate,
  AdaptiveInterviewConfig,
  defaultAdaptiveInterviewConfig,
} from "./interfaces/IAdaptiveInterviewExperience";
import { userPersonalizationEngine } from "../adaptive-intelligence/UserPersonalizationEngine";
import { decisionPolicyEngine } from "../adaptive-intelligence/DecisionPolicyEngine";
import { feedbackLearningEngine } from "../adaptive-intelligence/FeedbackLearningEngine";

// ============================================================================
// ADAPTIVE INTERVIEW EXPERIENCE SERVICE CLASS
// ============================================================================

export class AdaptiveInterviewExperienceService {
  private static instance: AdaptiveInterviewExperienceService;
  private config: AdaptiveInterviewConfig;
  private sessionStates: Map<string, RecruiterAdaptationState> = new Map();
  private responseHistory: Map<string, UserResponseAnalysis[]> = new Map();
  private adaptationHistory: Map<string, AdaptationAction[]> = new Map();
  private lastAdaptationTime: Map<string, Date> = new Map();

  private constructor() {
    this.config = defaultAdaptiveInterviewConfig;
  }

  static getInstance(): AdaptiveInterviewExperienceService {
    if (!AdaptiveInterviewExperienceService.instance) {
      AdaptiveInterviewExperienceService.instance = new AdaptiveInterviewExperienceService();
    }
    return AdaptiveInterviewExperienceService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<AdaptiveInterviewConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize session
   */
  initializeSession(
    sessionId: string,
    userId: string,
    initialState?: Partial<RecruiterAdaptationState>
  ): RecruiterAdaptationState {
    // Get user personalization
    const userMatrix = userPersonalizationEngine.getMatrix(userId);
    const personalizedFactors = userMatrix ? userPersonalizationEngine.getPersonalizedFactors(userId) : null;

    // Determine initial state based on user profile
    const state: RecruiterAdaptationState = {
      personality: initialState?.personality || this.determineInitialPersonality(userMatrix),
      level: initialState?.level || this.determineInitialLevel(userMatrix),
      speed: initialState?.speed || "normal",
      interruptions: initialState?.interruptions || "occasional",
      empathy: initialState?.empathy ?? (personalizedFactors?.feedbackWeight || 0.5),
      aggressiveness: initialState?.aggressiveness ?? (personalizedFactors?.challengeWeight || 0.3),
      traps: initialState?.traps ?? 0.2,
      tone: initialState?.tone || "formal",
    };

    this.sessionStates.set(sessionId, state);
    this.responseHistory.set(sessionId, []);
    this.adaptationHistory.set(sessionId, []);
    this.lastAdaptationTime.set(sessionId, new Date());

    return state;
  }

  /**
   * Determine initial personality based on user profile
   */
  private determineInitialPersonality(userMatrix: any): "friendly" | "professional" | "challenging" | "supportive" {
    if (!userMatrix) return "professional";

    const openness = userMatrix.personality?.openness || 0.5;
    const neuroticism = userMatrix.personality?.neuroticism || 0.5;

    if (neuroticism > 0.7) return "supportive";
    if (openness > 0.7) return "friendly";
    if (openness < 0.3) return "challenging";

    return "professional";
  }

  /**
   * Determine initial level based on user profile
   */
  private determineInitialLevel(userMatrix: any): "beginner" | "intermediate" | "advanced" | "expert" {
    if (!userMatrix) return "intermediate";

    const skillLevel = userMatrix.experience?.skillLevel || 0.5;

    if (skillLevel < 0.3) return "beginner";
    if (skillLevel < 0.6) return "intermediate";
    if (skillLevel < 0.8) return "advanced";

    return "expert";
  }

  /**
   * Process user response and adapt
   */
  async processResponse(
    sessionId: string,
    userId: string,
    response: string,
    responseTime: number,
    currentStress: number,
    currentConfidence: number,
    currentFatigue: number
  ): Promise<RealTimeUpdate> {
    // Analyze response
    const analysis = this.analyzeResponse(sessionId, response, responseTime, currentConfidence);

    // Store response
    const history = this.responseHistory.get(sessionId) || [];
    history.push(analysis);
    this.responseHistory.set(sessionId, history);

    // Detect triggers
    const triggers = this.detectTriggers(analysis, currentStress, currentConfidence, currentFatigue);

    // Generate adaptation actions
    const adaptationActions = this.generateAdaptationActions(sessionId, triggers, userId);

    // Apply adaptations
    const updatedState = this.applyAdaptations(sessionId, adaptationActions);

    // Update engines
    const updatedEngines = await this.updateEngines(sessionId, userId, analysis, updatedState);

    // Record feedback
    this.recordFeedback(sessionId, userId, analysis, updatedState);

    const realTimeUpdate: RealTimeUpdate = {
      sessionId,
      responseAnalysis: analysis,
      adaptationActions,
      updatedEngines,
      timestamp: new Date(),
    };

    return realTimeUpdate;
  }

  /**
   * Analyze user response
   */
  private analyzeResponse(
    sessionId: string,
    response: string,
    responseTime: number,
    currentConfidence: number
  ): UserResponseAnalysis {
    const hesitations = this.countHesitations(response);
    const structure = this.analyzeStructure(response);
    const sentiment = this.analyzeSentiment(response);
    const errors = this.detectErrors(response);
    const keywords = this.extractKeywords(response);
    const quality = this.calculateQuality(response, hesitations, structure, errors);
    const confidence = this.calculateResponseConfidence(response, currentConfidence, responseTime);

    return {
      responseId: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      timestamp: new Date(),
      responseTime,
      content: response,
      quality,
      confidence,
      errors,
      hesitations,
      structure,
      sentiment,
      keywords,
    };
  }

  /**
   * Count hesitations in response
   */
  private countHesitations(response: string): number {
    const hesitationPatterns = ["...", "um", "uh", "eh", "like"];
    let count = 0;

    hesitationPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, "gi");
      const matches = response.match(regex);
      if (matches) {
        count += matches.length;
      }
    });

    return count;
  }

  /**
   * Analyze response structure
   */
  private analyzeStructure(response: string): "good" | "fair" | "poor" {
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);

    if (sentences.length < 2) return "poor";
    if (sentences.length < 4) return "fair";
    return "good";
  }

  /**
   * Analyze sentiment
   */
  private analyzeSentiment(response: string): "positive" | "neutral" | "negative" {
    const positiveWords = ["good", "great", "excellent", "happy", "confident", "sure"];
    const negativeWords = ["bad", "difficult", "hard", "struggle", "unsure", "nervous"];

    const lowerResponse = response.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerResponse.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerResponse.includes(word)).length;

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  /**
   * Detect errors in response
   */
  private detectErrors(response: string): string[] {
    const errors: string[] = [];

    // Check for very short responses
    if (response.length < 20) {
      errors.push("response_too_short");
    }

    // Check for repetitive words
    const words = response.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(wordCounts).forEach(([word, count]) => {
      if (count > 3 && word.length > 2) {
        errors.push(`repetition_${word}`);
      }
    });

    return errors;
  }

  /**
   * Extract keywords from response
   */
  private extractKeywords(response: string): string[] {
    const commonWords = ["the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just"];

    const words = response.toLowerCase().split(/\s+/);
    return words.filter(word => word.length > 3 && !commonWords.includes(word));
  }

  /**
   * Calculate response quality
   */
  private calculateQuality(
    response: string,
    hesitations: number,
    structure: "good" | "fair" | "poor",
    errors: string[]
  ): number {
    let quality = 0.5;

    // Structure impact
    if (structure === "good") quality += 0.2;
    else if (structure === "fair") quality += 0.1;
    else quality -= 0.1;

    // Hesitation impact
    quality -= hesitations * 0.02;

    // Error impact
    quality -= errors.length * 0.05;

    // Length impact
    if (response.length > 100) quality += 0.1;
    else if (response.length < 30) quality -= 0.1;

    return Math.max(0, Math.min(1, quality));
  }

  /**
   * Calculate response confidence
   */
  private calculateResponseConfidence(
    response: string,
    currentConfidence: number,
    responseTime: number
  ): number {
    let confidence = currentConfidence;

    // Response time impact
    if (responseTime > 30) confidence -= 0.1;
    if (responseTime < 5) confidence -= 0.05;

    // Length impact
    if (response.length < 20) confidence -= 0.1;

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Detect adaptation triggers
   */
  private detectTriggers(
    analysis: UserResponseAnalysis,
    stress: number,
    confidence: number,
    fatigue: number
  ): AdaptationTrigger[] {
    const triggers: AdaptationTrigger[] = [];

    // Stress trigger
    if (stress > this.config.stressThreshold) {
      triggers.push({
        id: `trigger_stress_${Date.now()}`,
        type: "stress",
        severity: stress > 0.8 ? "high" : "medium",
        value: stress,
        threshold: this.config.stressThreshold,
        timestamp: new Date(),
      });
    }

    // Confidence trigger
    if (confidence < this.config.confidenceThreshold) {
      triggers.push({
        id: `trigger_confidence_${Date.now()}`,
        type: "confidence",
        severity: confidence < 0.3 ? "high" : "medium",
        value: confidence,
        threshold: this.config.confidenceThreshold,
        timestamp: new Date(),
      });
    }

    // Fatigue trigger
    if (fatigue > this.config.fatigueThreshold) {
      triggers.push({
        id: `trigger_fatigue_${Date.now()}`,
        type: "fatigue",
        severity: fatigue > 0.8 ? "high" : "medium",
        value: fatigue,
        threshold: this.config.fatigueThreshold,
        timestamp: new Date(),
      });
    }

    // Error trigger
    if (analysis.errors.length > this.config.errorThreshold) {
      triggers.push({
        id: `trigger_error_${Date.now()}`,
        type: "error",
        severity: analysis.errors.length > 5 ? "high" : "medium",
        value: analysis.errors.length,
        threshold: this.config.errorThreshold,
        timestamp: new Date(),
      });
    }

    // Success trigger
    if (analysis.quality > this.config.successThreshold) {
      triggers.push({
        id: `trigger_success_${Date.now()}`,
        type: "success",
        severity: "medium",
        value: analysis.quality,
        threshold: this.config.successThreshold,
        timestamp: new Date(),
      });
    }

    // Hesitation trigger
    if (analysis.hesitations > this.config.hesitationThreshold) {
      triggers.push({
        id: `trigger_hesitation_${Date.now()}`,
        type: "hesitation",
        severity: analysis.hesitations > 10 ? "high" : "medium",
        value: analysis.hesitations,
        threshold: this.config.hesitationThreshold,
        timestamp: new Date(),
      });
    }

    // Silence trigger (response time)
    if (analysis.responseTime > this.config.silenceThreshold) {
      triggers.push({
        id: `trigger_silence_${Date.now()}`,
        type: "silence",
        severity: analysis.responseTime > 20 ? "high" : "medium",
        value: analysis.responseTime,
        threshold: this.config.silenceThreshold,
        timestamp: new Date(),
      });
    }

    return triggers;
  }

  /**
   * Generate adaptation actions
   */
  private generateAdaptationActions(
    sessionId: string,
    triggers: AdaptationTrigger[],
    userId: string
  ): AdaptationAction[] {
    const actions: AdaptationAction[] = [];
    const currentState = this.sessionStates.get(sessionId);
    if (!currentState) return actions;

    // Check minimum adaptation interval
    const lastAdaptation = this.lastAdaptationTime.get(sessionId);
    if (lastAdaptation) {
      const timeSinceLastAdaptation = Date.now() - lastAdaptation.getTime();
      if (timeSinceLastAdaptation < this.config.minAdaptationInterval * 1000) {
        return actions;
      }
    }

    triggers.forEach(trigger => {
      const action = this.generateActionForTrigger(trigger, currentState, userId);
      if (action) {
        actions.push(action);
      }
    });

    return actions;
  }

  /**
   * Generate action for trigger
   */
  private generateActionForTrigger(
    trigger: AdaptationTrigger,
    currentState: RecruiterAdaptationState,
    userId: string
  ): AdaptationAction | null {
    let action: AdaptationAction | null = null;

    switch (trigger.type) {
      case "stress":
        action = this.adaptForStress(trigger, currentState);
        break;
      case "confidence":
        action = this.adaptForConfidence(trigger, currentState);
        break;
      case "fatigue":
        action = this.adaptForFatigue(trigger, currentState);
        break;
      case "error":
        action = this.adaptForErrors(trigger, currentState);
        break;
      case "success":
        action = this.adaptForSuccess(trigger, currentState);
        break;
      case "hesitation":
        action = this.adaptForHesitation(trigger, currentState);
        break;
      case "silence":
        action = this.adaptForSilence(trigger, currentState);
        break;
    }

    return action;
  }

  /**
   * Adapt for stress
   */
  private adaptForStress(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.personality;
    const newValue = "supportive";

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "personality",
      previousValue,
      newValue,
      reason: `High stress detected (${(trigger.value * 100).toFixed(0)}%), switching to supportive personality`,
      timestamp: new Date(),
    };
  }

  /**
   * Adapt for low confidence
   */
  private adaptForConfidence(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.level;
    const newValue = "beginner";

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "level",
      previousValue,
      newValue,
      reason: `Low confidence detected (${(trigger.value * 100).toFixed(0)}%), reducing difficulty`,
      timestamp: new Date(),
    };
  }

  /**
   * Adapt for fatigue
   */
  private adaptForFatigue(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.speed;
    const newValue = "slow";

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "speed",
      previousValue,
      newValue,
      reason: `High fatigue detected (${(trigger.value * 100).toFixed(0)}%), slowing down`,
      timestamp: new Date(),
    };
  }

  /**
   * Adapt for errors
   */
  private adaptForErrors(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.interruptions;
    const newValue = "rare";

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "interruption",
      previousValue,
      newValue,
      reason: `Multiple errors detected (${trigger.value}), reducing interruptions`,
      timestamp: new Date(),
    };
  }

  /**
   * Adapt for success
   */
  private adaptForSuccess(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.level;
    const newValue = currentState.level === "beginner" ? "intermediate" : 
                      currentState.level === "intermediate" ? "advanced" : "expert";

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "level",
      previousValue,
      newValue,
      reason: `High quality response (${(trigger.value * 100).toFixed(0)}%), increasing difficulty`,
      timestamp: new Date(),
    };
  }

  /**
   * Adapt for hesitation
   */
  private adaptForHesitation(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.empathy;
    const newValue = Math.min(1, currentState.empathy + 0.2);

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "empathy",
      previousValue,
      newValue,
      reason: `Hesitations detected (${trigger.value}), increasing empathy`,
      timestamp: new Date(),
    };
  }

  /**
   * Adapt for silence
   */
  private adaptForSilence(trigger: AdaptationTrigger, currentState: RecruiterAdaptationState): AdaptationAction {
    const previousValue = currentState.interruptions;
    const newValue = "frequent";

    return {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggerId: trigger.id,
      type: "interruption",
      previousValue,
      newValue,
      reason: `Long silence detected (${trigger.value}s), increasing interruptions`,
      timestamp: new Date(),
    };
  }

  /**
   * Apply adaptations to state
   */
  private applyAdaptations(sessionId: string, actions: AdaptationAction[]): RecruiterAdaptationState {
    const state = this.sessionStates.get(sessionId);
    if (!state) return this.getDefaultState();

    actions.forEach(action => {
      switch (action.type) {
        case "personality":
          state.personality = action.newValue;
          break;
        case "level":
          state.level = action.newValue;
          break;
        case "speed":
          state.speed = action.newValue;
          break;
        case "interruption":
          state.interruptions = action.newValue;
          break;
        case "empathy":
          state.empathy = action.newValue;
          break;
        case "aggressiveness":
          state.aggressiveness = action.newValue;
          break;
        case "traps":
          state.traps = action.newValue;
          break;
        case "tone":
          state.tone = action.newValue;
          break;
      }
    });

    this.sessionStates.set(sessionId, state);
    this.lastAdaptationTime.set(sessionId, new Date());

    return state;
  }

  /**
   * Update engines in real-time
   */
  private async updateEngines(
    sessionId: string,
    userId: string,
    analysis: UserResponseAnalysis,
    state: RecruiterAdaptationState
  ): Promise<string[]> {
    const updatedEngines: string[] = [];

    // Update user personalization
    userPersonalizationEngine.createOrUpdateMatrix(userId, {
      history: {
        recentPerformance: analysis.quality,
        performanceTrend: analysis.quality > 0.7 ? "improving" : analysis.quality < 0.4 ? "declining" : "stable",
        engagementLevel: analysis.confidence,
        consistency: analysis.structure === "good" ? 0.8 : 0.5,
        preferredActivities: [],
        avoidedActivities: [],
      },
    });

    updatedEngines.push("UserPersonalizationEngine");

    // Record feedback for learning
    feedbackLearningEngine.recordFeedback(
      sessionId,
      sessionId,
      analysis.quality > 0.6 ? "positive" : analysis.quality < 0.4 ? "negative" : "neutral",
      analysis.quality * 10,
      `Response quality: ${(analysis.quality * 100).toFixed(0)}%`,
      {
        actionType: "interview_response",
        difficulty: state.level,
        stress: analysis.confidence < 0.5 ? "high" : "low",
      }
    );

    updatedEngines.push("FeedbackLearningEngine");

    return updatedEngines;
  }

  /**
   * Record feedback
   */
  private recordFeedback(
    sessionId: string,
    userId: string,
    analysis: UserResponseAnalysis,
    state: RecruiterAdaptationState
  ): void {
    // Feedback is already recorded in updateEngines
  }

  /**
   * Get session state
   */
  getSessionState(sessionId: string): RecruiterAdaptationState | null {
    return this.sessionStates.get(sessionId) || null;
  }

  /**
   * Get response history
   */
  getResponseHistory(sessionId: string): UserResponseAnalysis[] {
    return this.responseHistory.get(sessionId) || [];
  }

  /**
   * Get adaptation history
   */
  getAdaptationHistory(sessionId: string): AdaptationAction[] {
    return this.adaptationHistory.get(sessionId) || [];
  }

  /**
   * Get default state
   */
  private getDefaultState(): RecruiterAdaptationState {
    return {
      personality: "professional",
      level: "intermediate",
      speed: "normal",
      interruptions: "occasional",
      empathy: 0.5,
      aggressiveness: 0.3,
      traps: 0.2,
      tone: "formal",
    };
  }

  /**
   * Clear session
   */
  clearSession(sessionId: string): void {
    this.sessionStates.delete(sessionId);
    this.responseHistory.delete(sessionId);
    this.adaptationHistory.delete(sessionId);
    this.lastAdaptationTime.delete(sessionId);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalSessions: number;
    totalResponses: number;
    totalAdaptations: number;
    averageResponseQuality: number;
    averageResponseTime: number;
    adaptationDistribution: Record<string, number>;
  } {
    const totalSessions = this.sessionStates.size;
    const totalResponses = Array.from(this.responseHistory.values()).reduce((sum, history) => sum + history.length, 0);
    const totalAdaptations = Array.from(this.adaptationHistory.values()).reduce((sum, history) => sum + history.length, 0);

    const allResponses = Array.from(this.responseHistory.values()).flat();
    const averageResponseQuality = allResponses.length > 0
      ? allResponses.reduce((sum, r) => sum + r.quality, 0) / allResponses.length
      : 0;

    const averageResponseTime = allResponses.length > 0
      ? allResponses.reduce((sum, r) => sum + r.responseTime, 0) / allResponses.length
      : 0;

    const adaptationDistribution: Record<string, number> = {};
    const allAdaptations = Array.from(this.adaptationHistory.values()).flat();
    allAdaptations.forEach(adaptation => {
      adaptationDistribution[adaptation.type] = (adaptationDistribution[adaptation.type] || 0) + 1;
    });

    return {
      totalSessions,
      totalResponses,
      totalAdaptations,
      averageResponseQuality,
      averageResponseTime,
      adaptationDistribution,
    };
  }
}

export const adaptiveInterviewExperienceService = AdaptiveInterviewExperienceService.getInstance();
