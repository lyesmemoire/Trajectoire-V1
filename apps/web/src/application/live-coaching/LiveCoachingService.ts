/**
 * Live Coaching Service
 * Invisible coaching during simulation
 */

import {
  CoachingType,
  LiveCoachingMessage,
  CoachingTrigger,
  CoachingSessionState,
  LiveCoachingConfig,
  defaultLiveCoachingConfig,
} from "./interfaces/ILiveCoaching";
import { userPersonalizationEngine } from "../adaptive-intelligence/UserPersonalizationEngine";
import { adaptiveInterviewExperienceService } from "../adaptive-interview/AdaptiveInterviewExperienceService";

// ============================================================================
// LIVE COACHING SERVICE CLASS
// ============================================================================

export class LiveCoachingService {
  private static instance: LiveCoachingService;
  private config: LiveCoachingConfig;
  private sessionStates: Map<string, CoachingSessionState> = new Map();

  private constructor() {
    this.config = defaultLiveCoachingConfig;
  }

  static getInstance(): LiveCoachingService {
    if (!LiveCoachingService.instance) {
      LiveCoachingService.instance = new LiveCoachingService();
    }
    return LiveCoachingService.instance;
  }

  /**
   * Set configuration
   */
  setConfig(config: Partial<LiveCoachingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Initialize coaching session
   */
  initializeSession(sessionId: string, userId: string): CoachingSessionState {
    const state: CoachingSessionState = {
      sessionId,
      userId,
      startTime: new Date(),
      messagesSent: 0,
      lastMessageTime: new Date(),
      triggersDetected: [],
      messagesDelivered: [],
      currentIntensity: 0.5,
      userEngagement: 0.5,
    };

    this.sessionStates.set(sessionId, state);
    return state;
  }

  /**
   * Process coaching triggers and generate messages
   */
  async processCoaching(
    sessionId: string,
    userId: string,
    stress: number,
    confidence: number,
    responseTime: number,
    silenceDuration: number,
    repetitions: number,
    structure: "good" | "fair" | "poor"
  ): Promise<LiveCoachingMessage[]> {
    if (!this.config.enabled) {
      return [];
    }

    const state = this.sessionStates.get(sessionId);
    if (!state) {
      return [];
    }

    // Check if max messages reached
    if (state.messagesSent >= this.config.maxMessagesPerSession) {
      return [];
    }

    // Check minimum interval
    const timeSinceLastMessage = Date.now() - state.lastMessageTime.getTime();
    if (timeSinceLastMessage < this.config.minIntervalBetweenMessages * 1000) {
      return [];
    }

    // Detect triggers
    const triggers = this.detectTriggers(stress, confidence, responseTime, silenceDuration, repetitions, structure);
    state.triggersDetected.push(...triggers);

    // Generate coaching messages
    const messages = this.generateCoachingMessages(sessionId, triggers, state);

    // Update state
    messages.forEach(message => {
      state.messagesDelivered.push(message);
      state.messagesSent++;
      state.lastMessageTime = new Date();
    });

    // Update intensity based on triggers
    state.currentIntensity = this.calculateIntensity(triggers, state.currentIntensity);

    this.sessionStates.set(sessionId, state);

    return messages;
  }

  /**
   * Detect coaching triggers
   */
  private detectTriggers(
    stress: number,
    confidence: number,
    responseTime: number,
    silenceDuration: number,
    repetitions: number,
    structure: "good" | "fair" | "poor"
  ): CoachingTrigger[] {
    const triggers: CoachingTrigger[] = [];

    // High stress trigger
    if (stress > this.config.stressThreshold) {
      triggers.push({
        id: `trigger_stress_${Date.now()}`,
        type: "high_stress",
        severity: stress > 0.8 ? "high" : "medium",
        value: stress,
        threshold: this.config.stressThreshold,
        context: { stress },
        timestamp: new Date(),
      });
    }

    // Low confidence trigger
    if (confidence < this.config.confidenceThreshold) {
      triggers.push({
        id: `trigger_confidence_${Date.now()}`,
        type: "low_confidence",
        severity: confidence < 0.3 ? "high" : "medium",
        value: confidence,
        threshold: this.config.confidenceThreshold,
        context: { confidence },
        timestamp: new Date(),
      });
    }

    // Silence trigger
    if (silenceDuration > this.config.silenceThreshold) {
      triggers.push({
        id: `trigger_silence_${Date.now()}`,
        type: "silence",
        severity: silenceDuration > 20 ? "high" : "medium",
        value: silenceDuration,
        threshold: this.config.silenceThreshold,
        context: { silenceDuration },
        timestamp: new Date(),
      });
    }

    // Repetition trigger
    if (repetitions > this.config.repetitionThreshold) {
      triggers.push({
        id: `trigger_repetition_${Date.now()}`,
        type: "repetition",
        severity: repetitions > 5 ? "high" : "medium",
        value: repetitions,
        threshold: this.config.repetitionThreshold,
        context: { repetitions },
        timestamp: new Date(),
      });
    }

    // Poor structure trigger
    if (structure === "poor") {
      triggers.push({
        id: `trigger_structure_${Date.now()}`,
        type: "poor_structure",
        severity: "medium",
        value: 0,
        threshold: 0,
        context: { structure },
        timestamp: new Date(),
      });
    }

    // Long response time trigger
    if (responseTime > this.config.responseTimeThreshold) {
      triggers.push({
        id: `trigger_response_time_${Date.now()}`,
        type: "long_response_time",
        severity: responseTime > 30 ? "high" : "medium",
        value: responseTime,
        threshold: this.config.responseTimeThreshold,
        context: { responseTime },
        timestamp: new Date(),
      });
    }

    // Success trigger (low stress, high confidence)
    if (stress < 0.3 && confidence > 0.8) {
      triggers.push({
        id: `trigger_success_${Date.now()}`,
        type: "success",
        severity: "low",
        value: confidence,
        threshold: 0.8,
        context: { stress, confidence },
        timestamp: new Date(),
      });
    }

    return triggers;
  }

  /**
   * Generate coaching messages
   */
  private generateCoachingMessages(
    sessionId: string,
    triggers: CoachingTrigger[],
    state: CoachingSessionState
  ): LiveCoachingMessage[] {
    const messages: LiveCoachingMessage[] = [];

    triggers.forEach(trigger => {
      const message = this.generateMessageForTrigger(trigger, sessionId, state);
      if (message) {
        messages.push(message);
      }
    });

    return messages;
  }

  /**
   * Generate message for trigger
   */
  private generateMessageForTrigger(
    trigger: CoachingTrigger,
    sessionId: string,
    state: CoachingSessionState
  ): LiveCoachingMessage | null {
    let message: LiveCoachingMessage | null = null;

    switch (trigger.type) {
      case "high_stress":
        message = this.generateStressCoaching(trigger, sessionId);
        break;
      case "low_confidence":
        message = this.generateConfidenceCoaching(trigger, sessionId);
        break;
      case "silence":
        message = this.generateSilenceCoaching(trigger, sessionId);
        break;
      case "repetition":
        message = this.generateRepetitionCoaching(trigger, sessionId);
        break;
      case "poor_structure":
        message = this.generateStructureCoaching(trigger, sessionId);
        break;
      case "long_response_time":
        message = this.generateResponseTimeCoaching(trigger, sessionId);
        break;
      case "success":
        message = this.generateSuccessCoaching(trigger, sessionId);
        break;
    }

    return message;
  }

  /**
   * Generate stress coaching
   */
  private generateStressCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "Prenez une profonde respiration. Vous allez bien.",
      "Ralentissez un peu. Il n'y a pas de pression.",
      "Concentrez-vous sur une chose à la fois.",
      "Vous êtes préparé. Faites confiance à vos connaissances.",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "breathing",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "high",
      urgency: trigger.severity,
      displayDuration: 5,
      position: "top",
      style: trigger.severity === "high" ? "urgent" : "subtle",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Generate confidence coaching
   */
  private generateConfidenceCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "Vous avez les compétences nécessaires.",
      "Chaque réponse est une opportunité d'apprendre.",
      "Soyez vous-même. C'est votre plus grande force.",
      "Prenez votre temps pour formuler votre réponse.",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "confidence",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "medium",
      urgency: trigger.severity,
      displayDuration: 4,
      position: "bottom",
      style: "subtle",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Generate silence coaching
   */
  private generateSilenceCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "C'est normal de prendre du temps pour réfléchir.",
      "Organisez vos idées avant de répondre.",
      "Une pause réfléchie montre du professionnalisme.",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "reminder",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "low",
      urgency: "low",
      displayDuration: 3,
      position: "side",
      style: "subtle",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Generate repetition coaching
   */
  private generateRepetitionCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "Essayez de varier votre vocabulaire.",
      "Utilisez des exemples concrets pour illustrer.",
      "Structurez votre réponse avec des points clés.",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "tip",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "medium",
      urgency: "medium",
      displayDuration: 4,
      position: "bottom",
      style: "subtle",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Generate structure coaching
   */
  private generateStructureCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "Commencez par une réponse directe, puis développez.",
      "Utilisez la méthode STAR: Situation, Tâche, Action, Résultat.",
      "Structurez en 2-3 points clés maximum.",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "structure",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "medium",
      urgency: "medium",
      displayDuration: 5,
      position: "top",
      style: "prominent",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Generate response time coaching
   */
  private generateResponseTimeCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "Ne vous inquiétez pas du temps. La qualité compte plus.",
      "Prenez le temps de bien formuler votre pensée.",
      "Une réponse réfléchie vaut mieux qu'une réponse hâtive.",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "encouragement",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "low",
      urgency: "low",
      displayDuration: 3,
      position: "side",
      style: "subtle",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Generate success coaching
   */
  private generateSuccessCoaching(trigger: CoachingTrigger, sessionId: string): LiveCoachingMessage {
    const messages = [
      "Excellent ! Continuez comme ça.",
      "Vous êtes sur la bonne voie.",
      "Très bonne réponse !",
      "Votre confiance se voit. Bravo !",
    ];

    return {
      id: `coaching_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      type: "encouragement",
      content: messages[Math.floor(Math.random() * messages.length)],
      priority: "low",
      urgency: "low",
      displayDuration: 3,
      position: "bottom",
      style: "subtle",
      trigger: trigger.id,
      timestamp: new Date(),
      dismissed: false,
    };
  }

  /**
   * Calculate coaching intensity
   */
  private calculateIntensity(triggers: CoachingTrigger[], currentIntensity: number): number {
    if (triggers.length === 0) {
      return Math.max(0.3, currentIntensity - 0.05); // Gradually decrease
    }

    const highSeverityCount = triggers.filter(t => t.severity === "high").length;
    const mediumSeverityCount = triggers.filter(t => t.severity === "medium").length;

    let newIntensity = currentIntensity;
    newIntensity += highSeverityCount * 0.15;
    newIntensity += mediumSeverityCount * 0.08;

    return Math.min(1, Math.max(0.3, newIntensity));
  }

  /**
   * Dismiss message
   */
  dismissMessage(sessionId: string, messageId: string): void {
    const state = this.sessionStates.get(sessionId);
    if (!state) return;

    const message = state.messagesDelivered.find(m => m.id === messageId);
    if (message) {
      message.dismissed = true;
    }

    this.sessionStates.set(sessionId, state);
  }

  /**
   * Get session state
   */
  getSessionState(sessionId: string): CoachingSessionState | null {
    return this.sessionStates.get(sessionId) || null;
  }

  /**
   * Get session messages
   */
  getSessionMessages(sessionId: string): LiveCoachingMessage[] {
    const state = this.sessionStates.get(sessionId);
    return state ? state.messagesDelivered : [];
  }

  /**
   * Clear session
   */
  clearSession(sessionId: string): void {
    this.sessionStates.delete(sessionId);
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    messageTypeDistribution: Record<string, number>;
    averageIntensity: number;
  } {
    const totalSessions = this.sessionStates.size;
    const allStates = Array.from(this.sessionStates.values());
    const totalMessages = allStates.reduce((sum, state) => sum + state.messagesSent, 0);
    const averageMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

    const messageTypeDistribution: Record<string, number> = {};
    allStates.forEach(state => {
      state.messagesDelivered.forEach(message => {
        messageTypeDistribution[message.type] = (messageTypeDistribution[message.type] || 0) + 1;
      });
    });

    const averageIntensity = allStates.length > 0
      ? allStates.reduce((sum, state) => sum + state.currentIntensity, 0) / allStates.length
      : 0;

    return {
      totalSessions,
      totalMessages,
      averageMessagesPerSession,
      messageTypeDistribution,
      averageIntensity,
    };
  }
}

export const liveCoachingService = LiveCoachingService.getInstance();
