/**
 * Presence Silence Service
 * Le silence fait partie de la conversation
 * Les pauses sont simulées uniquement lorsque cela améliore l'expérience
 * Jamais aléatoires
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// SILENCE DECISION
// ============================================================================

interface SilenceDecision {
  action: "speak" | "breathe" | "continue" | "reformulate" | "wait";
  duration?: number; // en secondes
  reason: string;
  improvesExperience: boolean;
}

// ============================================================================
// PRESENCE SILENCE SERVICE CLASS
// ============================================================================

export class PresenceSilenceService {
  private static instance: PresenceSilenceService;
  private conversationState: Map<string, {
    lastAction: string;
    lastActionTime: Date;
    consecutivePauses: number;
    userEngagement: number;
  }> = new Map();

  private constructor() {}

  static getInstance(): PresenceSilenceService {
    if (!PresenceSilenceService.instance) {
      PresenceSilenceService.instance = new PresenceSilenceService();
    }
    return PresenceSilenceService.instance;
  }

  /**
   * Modify with silence decisions
   * Le système décide quand ne rien dire, laisser respirer, enchaîner, reformuler, attendre
   */
  async modifySilence(context: PresenceContext): Promise<{
    modified: string;
    silenceScore: number;
    silenceDecision: SilenceDecision;
  }> {
    // Étape 1 : Analyser l'état de la conversation
    const conversationState = this.getConversationState(context);

    // Étape 2 : Décider de l'action de silence
    const silenceDecision = this.decideSilenceAction(context, conversationState);

    // Étape 3 : Appliquer la décision de silence
    const modified = this.applySilenceDecision(context.originalDecision, silenceDecision);

    // Étape 4 : Mettre à jour l'état de la conversation
    this.updateConversationState(context, silenceDecision);

    return {
      modified,
      silenceScore: this.calculateSilenceScore(silenceDecision),
      silenceDecision,
    };
  }

  /**
   * Get conversation state
   */
  private getConversationState(context: PresenceContext): {
    lastAction: string;
    lastActionTime: Date;
    consecutivePauses: number;
    userEngagement: number;
  } {
    const state = this.conversationState.get(context.userId) || {
      lastAction: "speak",
      lastActionTime: new Date(),
      consecutivePauses: 0,
      userEngagement: 0.5,
    };
    return state;
  }

  /**
   * Decide silence action
   * Décisions basées sur le contexte, jamais aléatoires
   */
  private decideSilenceAction(
    context: PresenceContext,
    state: { lastAction: string; lastActionTime: Date; consecutivePauses: number; userEngagement: number }
  ): SilenceDecision {
    const textLength = context.originalDecision.length;
    const timeSinceLastAction = Date.now() - state.lastActionTime.getTime();
    const isComplexResponse = textLength > 200;
    const isSimpleResponse = textLength < 50;

    // Décision 1 : Laisser respirer après une réponse complexe
    if (isComplexResponse && state.lastAction === "speak" && state.consecutivePauses < 2) {
      return {
        action: "breathe",
        duration: 2, // 2 secondes de pause
        reason: "Laisser respirer après une réponse complexe",
        improvesExperience: true,
      };
    }

    // Décision 2 : Enchaîner si l'utilisateur est engagé
    if (state.userEngagement > 0.7 && timeSinceLastAction < 5000) {
      return {
        action: "continue",
        reason: "Enchaîner car l'utilisateur est engagé",
        improvesExperience: true,
      };
    }

    // Décision 3 : Reformuler si la réponse est simple
    if (isSimpleResponse && state.lastAction === "speak") {
      return {
        action: "reformulate",
        reason: "Reformuler pour enrichir la réponse simple",
        improvesExperience: true,
      };
    }

    // Décision 4 : Attendre si l'utilisateur semble réfléchir
    if (state.userEngagement < 0.4 && timeSinceLastAction > 10000) {
      return {
        action: "wait",
        duration: 3, // 3 secondes d'attente
        reason: "Attendre que l'utilisateur réfléchisse",
        improvesExperience: true,
      };
    }

    // Décision par défaut : Parler
    return {
      action: "speak",
      reason: "Parler normalement",
      improvesExperience: true,
    };
  }

  /**
   * Apply silence decision
   */
  private applySilenceDecision(original: string, decision: SilenceDecision): string {
    switch (decision.action) {
      case "speak":
        return original;

      case "breathe":
        // Ajouter un indicateur de pause (sera géré par le timing)
        return `${original} [pause: ${decision.duration}s]`;

      case "continue":
        {
          // Ajouter un élément de continuation
          const continuations = [
            "Et puis...",
            "Ensuite...",
            "De plus...",
          ];
          if (Math.random() > 0.5) {
            const continuation = continuations[Math.floor(Math.random() * continuations.length)];
            return `${original} ${continuation}`;
          }
          return original;
        }

      case "reformulate":
        {
          // Ajouter une reformulation
          const reformulations = [
            "En d'autres termes...",
            "Pour le dire autrement...",
            "C'est-à-dire...",
          ];
          const reformulation = reformulations[Math.floor(Math.random() * reformulations.length)];
          return `${reformulation} ${original}`;
        }

      case "wait":
        // Ajouter un indicateur d'attente (sera géré par le timing)
        return `[wait: ${decision.duration}s] ${original}`;

      default:
        return original;
    }
  }

  /**
   * Calculate silence score
   */
  private calculateSilenceScore(decision: SilenceDecision): number {
    if (!decision.improvesExperience) return 0.5;

    let score = 0.8;

    // Bonus pour les décisions appropriées
    if (decision.action === "breathe") {
      score += 0.1;
    }
    if (decision.action === "wait") {
      score += 0.05;
    }
    if (decision.action === "reformulate") {
      score += 0.05;
    }

    return Math.min(1, score);
  }

  /**
   * Update conversation state
   */
  private updateConversationState(context: PresenceContext, decision: SilenceDecision): void {
    const state = this.getConversationState(context);
    state.lastAction = decision.action;
    state.lastActionTime = new Date();

    if (decision.action === "breathe" || decision.action === "wait") {
      state.consecutivePauses++;
    } else {
      state.consecutivePauses = 0;
    }

    // Simuler l'engagement utilisateur (placeholder)
    state.userEngagement = 0.5 + Math.random() * 0.3;

    this.conversationState.set(context.userId, state);
  }

  /**
   * Get conversation state for user
   */
  getConversationStateForUser(userId: string): {
    lastAction: string;
    lastActionTime: Date;
    consecutivePauses: number;
    userEngagement: number;
  } | null {
    return this.conversationState.get(userId) || null;
  }

  /**
   * Clear user conversation state
   */
  clearUserState(userId: string): void {
    this.conversationState.delete(userId);
  }

  /**
   * Clear all conversation states
   */
  clearAllStates(): void {
    this.conversationState.clear();
  }
}

export const presenceSilenceService = PresenceSilenceService.getInstance();
