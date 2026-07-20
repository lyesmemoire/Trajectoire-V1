/**
 * Emotional Signature Service
 * Système invisible chargé de faire vivre une progression émotionnelle au candidat
 * Ne génère jamais de texte, influence uniquement la dynamique émotionnelle
 */

// ============================================================================
// EMOTIONAL STATE ENUM
// ============================================================================

export enum EmotionalState {
  WELCOME = "WELCOME",
  SAFETY = "SAFETY",
  CHALLENGE = "CHALLENGE",
  CONSTRUCTIVE_DOUBT = "CONSTRUCTIVE_DOUBT",
  BREAKTHROUGH = "BREAKTHROUGH",
  PRIDE = "PRIDE",
  PROJECTION = "PROJECTION",
}

// ============================================================================
// EMOTIONAL STATE CONFIGURATION
// ============================================================================

interface EmotionalStateConfig {
  psychologicalObjective: string;
  averageDuration: number; // en minutes
  entryConditions: {
    minConfidence: number;
    maxStress: number;
    minResponseQuality: number;
  };
  exitConditions: {
    minConfidence: number;
    maxStress: number;
    minResponseQuality: number;
  };
  expectedConfidence: number; // 0-1
  acceptableStress: number; // 0-1
  conversationalStyle: "warm" | "analytical" | "challenging" | "supportive" | "inspiring";
  rhythm: "slow" | "normal" | "fast" | "variable";
  empathyLevel: number; // 0-1
  demandLevel: number; // 0-1
}

// ============================================================================
// EMOTIONAL TRANSITION
// ============================================================================

interface EmotionalTransition {
  from: EmotionalState;
  to: EmotionalState;
  reason: string;
  timestamp: Date;
}

// ============================================================================
// RECRUITER POSTURE
// ============================================================================

interface RecruiterPosture {
  reassuring: number; // 0-1
  demanding: number; // 0-1
  analytical: number; // 0-1
  benevolent: number; // 0-1
  curious: number; // 0-1
}

// ============================================================================
// EMOTIONAL INFLUENCE
// ============================================================================

interface EmotionalInfluence {
  conversationEngine: {
    tone: string;
    complexity: number;
  };
  recruiterPersona: RecruiterPosture;
  reasoning: {
    depth: number;
    creativity: number;
  };
  memory: {
    recallDepth: number;
    referenceFrequency: number;
  };
  tone: {
    warmth: number;
    formality: number;
  };
  followUp: {
    persistence: number;
    adaptability: number;
  };
  coaching: {
    guidanceLevel: number;
    autonomyLevel: number;
  };
  feedback: {
    positivity: number;
    constructiveness: number;
  };
  aios: {
    adaptationSpeed: number;
    sensitivity: number;
  };
}

// ============================================================================
// EMOTIONAL SIGNATURE SERVICE CLASS
// ============================================================================

export class EmotionalSignatureService {
  private static instance: EmotionalSignatureService;
  private currentState: Map<string, EmotionalState> = new Map();
  private transitionHistory: Map<string, EmotionalTransition[]> = new Map();
  private initialConfidence: Map<string, number> = new Map();
  private stateConfigurations: Map<EmotionalState, EmotionalStateConfig> = new Map();

  private constructor() {
    this.initializeStateConfigurations();
  }

  static getInstance(): EmotionalSignatureService {
    if (!EmotionalSignatureService.instance) {
      EmotionalSignatureService.instance = new EmotionalSignatureService();
    }
    return EmotionalSignatureService.instance;
  }

  /**
   * Initialize state configurations
   */
  private initializeStateConfigurations(): void {
    this.stateConfigurations.set(EmotionalState.WELCOME, {
      psychologicalObjective: "Créer un climat de confiance et d'ouverture",
      averageDuration: 5,
      entryConditions: {
        minConfidence: 0,
        maxStress: 1,
        minResponseQuality: 0,
      },
      exitConditions: {
        minConfidence: 0.4,
        maxStress: 0.6,
        minResponseQuality: 0.3,
      },
      expectedConfidence: 0.5,
      acceptableStress: 0.5,
      conversationalStyle: "warm",
      rhythm: "slow",
      empathyLevel: 0.9,
      demandLevel: 0.2,
    });

    this.stateConfigurations.set(EmotionalState.SAFETY, {
      psychologicalObjective: "Établir un environnement sécurisant pour l'expression",
      averageDuration: 10,
      entryConditions: {
        minConfidence: 0.3,
        maxStress: 0.7,
        minResponseQuality: 0.2,
      },
      exitConditions: {
        minConfidence: 0.5,
        maxStress: 0.5,
        minResponseQuality: 0.4,
      },
      expectedConfidence: 0.6,
      acceptableStress: 0.4,
      conversationalStyle: "supportive",
      rhythm: "normal",
      empathyLevel: 0.85,
      demandLevel: 0.3,
    });

    this.stateConfigurations.set(EmotionalState.CHALLENGE, {
      psychologicalObjective: "Stimuler la réflexion et la résolution de problèmes",
      averageDuration: 15,
      entryConditions: {
        minConfidence: 0.5,
        maxStress: 0.5,
        minResponseQuality: 0.4,
      },
      exitConditions: {
        minConfidence: 0.4,
        maxStress: 0.7,
        minResponseQuality: 0.5,
      },
      expectedConfidence: 0.5,
      acceptableStress: 0.6,
      conversationalStyle: "challenging",
      rhythm: "variable",
      empathyLevel: 0.6,
      demandLevel: 0.7,
    });

    this.stateConfigurations.set(EmotionalState.CONSTRUCTIVE_DOUBT, {
      psychologicalObjective: "Encourager la remise en question constructive",
      averageDuration: 10,
      entryConditions: {
        minConfidence: 0.4,
        maxStress: 0.7,
        minResponseQuality: 0.5,
      },
      exitConditions: {
        minConfidence: 0.5,
        maxStress: 0.6,
        minResponseQuality: 0.6,
      },
      expectedConfidence: 0.55,
      acceptableStress: 0.5,
      conversationalStyle: "analytical",
      rhythm: "slow",
      empathyLevel: 0.7,
      demandLevel: 0.6,
    });

    this.stateConfigurations.set(EmotionalState.BREAKTHROUGH, {
      psychologicalObjective: "Faciliter la prise de conscience et l'apprentissage",
      averageDuration: 8,
      entryConditions: {
        minConfidence: 0.5,
        maxStress: 0.6,
        minResponseQuality: 0.6,
      },
      exitConditions: {
        minConfidence: 0.7,
        maxStress: 0.4,
        minResponseQuality: 0.7,
      },
      expectedConfidence: 0.75,
      acceptableStress: 0.4,
      conversationalStyle: "inspiring",
      rhythm: "normal",
      empathyLevel: 0.8,
      demandLevel: 0.5,
    });

    this.stateConfigurations.set(EmotionalState.PRIDE, {
      psychologicalObjective: "Renforcer la confiance et la valorisation des acquis",
      averageDuration: 7,
      entryConditions: {
        minConfidence: 0.7,
        maxStress: 0.4,
        minResponseQuality: 0.7,
      },
      exitConditions: {
        minConfidence: 0.8,
        maxStress: 0.3,
        minResponseQuality: 0.8,
      },
      expectedConfidence: 0.85,
      acceptableStress: 0.3,
      conversationalStyle: "warm",
      rhythm: "normal",
      empathyLevel: 0.9,
      demandLevel: 0.3,
    });

    this.stateConfigurations.set(EmotionalState.PROJECTION, {
      psychologicalObjective: "Ouvrir sur les perspectives futures et la motivation",
      averageDuration: 5,
      entryConditions: {
        minConfidence: 0.8,
        maxStress: 0.3,
        minResponseQuality: 0.8,
      },
      exitConditions: {
        minConfidence: 0.9,
        maxStress: 0.2,
        minResponseQuality: 0.9,
      },
      expectedConfidence: 0.95,
      acceptableStress: 0.2,
      conversationalStyle: "inspiring",
      rhythm: "fast",
      empathyLevel: 0.85,
      demandLevel: 0.2,
    });
  }

  /**
   * Initialize user session
   */
  initializeUser(userId: string, initialConfidence: number): void {
    this.currentState.set(userId, EmotionalState.WELCOME);
    this.initialConfidence.set(userId, initialConfidence);
    this.transitionHistory.set(userId, []);
  }

  /**
   * Determine current emotional state
   * Décide automatiquement dans quel état émotionnel se trouve le candidat
   */
  determineEmotionalState(
    userId: string,
    metrics: {
      confidence: number;
      stress: number;
      responseQuality: number;
      fatigue: number;
      rhythm: number;
      engagement: number;
      progression: number;
    }
  ): EmotionalState {
    const currentState = this.currentState.get(userId) || EmotionalState.WELCOME;
    const currentConfig = this.stateConfigurations.get(currentState);

    if (!currentConfig) {
      return EmotionalState.WELCOME;
    }

    // Vérifier si les conditions de sortie sont remplies
    const canExit = this.checkExitConditions(metrics, currentConfig);

    if (!canExit) {
      return currentState;
    }

    // Déterminer le prochain état
    const nextState = this.determineNextState(currentState, metrics);

    // Enregistrer la transition
    this.recordTransition(userId, currentState, nextState, metrics);

    // Mettre à jour l'état
    this.currentState.set(userId, nextState);

    return nextState;
  }

  /**
   * Check exit conditions
   */
  private checkExitConditions(
    metrics: {
      confidence: number;
      stress: number;
      responseQuality: number;
    },
    config: EmotionalStateConfig
  ): boolean {
    return (
      metrics.confidence >= config.exitConditions.minConfidence &&
      metrics.stress <= config.exitConditions.maxStress &&
      metrics.responseQuality >= config.exitConditions.minResponseQuality
    );
  }

  /**
   * Determine next state
   * Peut avancer, revenir, ralentir, accélérer (mais jamais sauter plusieurs étapes)
   */
  private determineNextState(
    currentState: EmotionalState,
    metrics: {
      confidence: number;
      stress: number;
      responseQuality: number;
      fatigue: number;
      rhythm: number;
      engagement: number;
      progression: number;
    }
  ): EmotionalState {
    const states = Object.values(EmotionalState);
    const currentIndex = states.indexOf(currentState);

    // Si la progression est forte et le stress faible, avancer
    if (metrics.progression > 0.7 && metrics.stress < 0.4 && metrics.confidence > 0.6) {
      if (currentIndex < states.length - 1) {
        return states[currentIndex + 1];
      }
    }

    // Si le stress est trop élevé ou la confiance trop faible, revenir
    if (metrics.stress > 0.7 || metrics.confidence < 0.3) {
      if (currentIndex > 0) {
        return states[currentIndex - 1];
      }
    }

    // Si la fatigue est élevée, ralentir
    if (metrics.fatigue > 0.6) {
      if (currentIndex > 0) {
        return states[currentIndex - 1];
      }
    }

    // Si l'engagement est faible, revenir
    if (metrics.engagement < 0.4) {
      if (currentIndex > 0) {
        return states[currentIndex - 1];
      }
    }

    // Sinon, rester dans l'état actuel
    return currentState;
  }

  /**
   * Record transition
   */
  private recordTransition(
    userId: string,
    from: EmotionalState,
    to: EmotionalState,
    metrics: {
      confidence: number;
      stress: number;
      responseQuality: number;
    }
  ): void {
    const history = this.transitionHistory.get(userId) || [];
    const transition: EmotionalTransition = {
      from,
      to,
      reason: `Confidence: ${metrics.confidence}, Stress: ${metrics.stress}, Quality: ${metrics.responseQuality}`,
      timestamp: new Date(),
    };
    history.push(transition);
    this.transitionHistory.set(userId, history);
  }

  /**
   * Get recruiter posture for current state
   * Le recruteur adapte automatiquement sa posture selon l'état émotionnel
   */
  getRecruiterPosture(userId: string): RecruiterPosture {
    const currentState = this.currentState.get(userId) || EmotionalState.WELCOME;
    const config = this.stateConfigurations.get(currentState);

    if (!config) {
      return {
        reassuring: 0.5,
        demanding: 0.5,
        analytical: 0.5,
        benevolent: 0.5,
        curious: 0.5,
      };
    }

    switch (currentState) {
      case EmotionalState.WELCOME:
        return {
          reassuring: 0.9,
          demanding: 0.2,
          analytical: 0.3,
          benevolent: 0.85,
          curious: 0.7,
        };
      case EmotionalState.SAFETY:
        return {
          reassuring: 0.85,
          demanding: 0.3,
          analytical: 0.4,
          benevolent: 0.9,
          curious: 0.6,
        };
      case EmotionalState.CHALLENGE:
        return {
          reassuring: 0.4,
          demanding: 0.8,
          analytical: 0.7,
          benevolent: 0.5,
          curious: 0.8,
        };
      case EmotionalState.CONSTRUCTIVE_DOUBT:
        return {
          reassuring: 0.5,
          demanding: 0.7,
          analytical: 0.85,
          benevolent: 0.6,
          curious: 0.75,
        };
      case EmotionalState.BREAKTHROUGH:
        return {
          reassuring: 0.6,
          demanding: 0.5,
          analytical: 0.6,
          benevolent: 0.8,
          curious: 0.85,
        };
      case EmotionalState.PRIDE:
        return {
          reassuring: 0.8,
          demanding: 0.3,
          analytical: 0.4,
          benevolent: 0.9,
          curious: 0.7,
        };
      case EmotionalState.PROJECTION:
        return {
          reassuring: 0.7,
          demanding: 0.2,
          analytical: 0.5,
          benevolent: 0.85,
          curious: 0.9,
        };
      default:
        return {
          reassuring: 0.5,
          demanding: 0.5,
          analytical: 0.5,
          benevolent: 0.5,
          curious: 0.5,
        };
    }
  }

  /**
   * Get emotional influence for current state
   * Influence uniquement les autres systèmes, ne génère jamais de texte
   */
  getEmotionalInfluence(userId: string): EmotionalInfluence {
    const currentState = this.currentState.get(userId) || EmotionalState.WELCOME;
    const config = this.stateConfigurations.get(currentState);
    const posture = this.getRecruiterPosture(userId);

    if (!config) {
      return this.getDefaultInfluence();
    }

    return {
      conversationEngine: {
        tone: this.mapConversationalStyle(config.conversationalStyle),
        complexity: config.demandLevel,
      },
      recruiterPersona: posture,
      reasoning: {
        depth: config.demandLevel,
        creativity: currentState === EmotionalState.BREAKTHROUGH ? 0.8 : 0.5,
      },
      memory: {
        recallDepth: currentState === EmotionalState.PROJECTION ? 0.9 : 0.6,
        referenceFrequency: currentState === EmotionalState.SAFETY ? 0.8 : 0.5,
      },
      tone: {
        warmth: config.empathyLevel,
        formality: currentState === EmotionalState.CHALLENGE ? 0.7 : 0.4,
      },
      followUp: {
        persistence: currentState === EmotionalState.CHALLENGE ? 0.8 : 0.5,
        adaptability: currentState === EmotionalState.CONSTRUCTIVE_DOUBT ? 0.9 : 0.6,
      },
      coaching: {
        guidanceLevel: config.demandLevel,
        autonomyLevel: 1 - config.demandLevel,
      },
      feedback: {
        positivity: currentState === EmotionalState.PRIDE ? 0.9 : 0.6,
        constructiveness: currentState === EmotionalState.CONSTRUCTIVE_DOUBT ? 0.9 : 0.7,
      },
      aios: {
        adaptationSpeed: currentState === EmotionalState.CHALLENGE ? 0.8 : 0.5,
        sensitivity: config.empathyLevel,
      },
    };
  }

  /**
   * Map conversational style to tone
   */
  private mapConversationalStyle(style: string): string {
    switch (style) {
      case "warm":
        return "chaleureux";
      case "analytical":
        return "analytique";
      case "challenging":
        return "stimulant";
      case "supportive":
        return "supportif";
      case "inspiring":
        return "inspirant";
      default:
        return "neutre";
    }
  }

  /**
   * Get default influence
   */
  private getDefaultInfluence(): EmotionalInfluence {
    return {
      conversationEngine: {
        tone: "neutre",
        complexity: 0.5,
      },
      recruiterPersona: {
        reassuring: 0.5,
        demanding: 0.5,
        analytical: 0.5,
        benevolent: 0.5,
        curious: 0.5,
      },
      reasoning: {
        depth: 0.5,
        creativity: 0.5,
      },
      memory: {
        recallDepth: 0.5,
        referenceFrequency: 0.5,
      },
      tone: {
        warmth: 0.5,
        formality: 0.5,
      },
      followUp: {
        persistence: 0.5,
        adaptability: 0.5,
      },
      coaching: {
        guidanceLevel: 0.5,
        autonomyLevel: 0.5,
      },
      feedback: {
        positivity: 0.5,
        constructiveness: 0.5,
      },
      aios: {
        adaptationSpeed: 0.5,
        sensitivity: 0.5,
      },
    };
  }

  /**
   * Guarantee final positive state
   * Garantit que la dernière émotion ressentie est la confiance retrouvée ou l'envie de progresser
   */
  guaranteeFinalPositiveState(userId: string, currentConfidence: number): EmotionalState {
    const initialConfidence = this.initialConfidence.get(userId) || 0.5;
    const currentState = this.currentState.get(userId) || EmotionalState.WELCOME;

    // Si la confiance a augmenté, garantir un état positif
    if (currentConfidence > initialConfidence) {
      if (currentState !== EmotionalState.PROJECTION && currentState !== EmotionalState.PRIDE) {
        const finalState = EmotionalState.PROJECTION;
        this.currentState.set(userId, finalState);
        return finalState;
      }
    }

    // Si la confiance a diminué, revenir à un état de sécurité
    if (currentConfidence < initialConfidence) {
      if (currentState !== EmotionalState.SAFETY && currentState !== EmotionalState.WELCOME) {
        const finalState = EmotionalState.SAFETY;
        this.currentState.set(userId, finalState);
        return finalState;
      }
    }

    return currentState;
  }

  /**
   * Check confidence progression
   * Vérifie si le candidat quitte avec davantage de confiance professionnelle
   */
  checkConfidenceProgression(userId: string, finalConfidence: number): boolean {
    const initialConfidence = this.initialConfidence.get(userId) || 0.5;
    return finalConfidence > initialConfidence;
  }

  /**
   * Get current state
   */
  getCurrentState(userId: string): EmotionalState | null {
    return this.currentState.get(userId) || null;
  }

  /**
   * Get state configuration
   */
  getStateConfiguration(state: EmotionalState): EmotionalStateConfig | null {
    return this.stateConfigurations.get(state) || null;
  }

  /**
   * Get transition history
   */
  getTransitionHistory(userId: string): EmotionalTransition[] {
    return this.transitionHistory.get(userId) || [];
  }

  /**
   * Clear user session
   */
  clearUserSession(userId: string): void {
    this.currentState.delete(userId);
    this.transitionHistory.delete(userId);
    this.initialConfidence.delete(userId);
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    this.currentState.clear();
    this.transitionHistory.clear();
    this.initialConfidence.clear();
  }
}

export const emotionalSignatureService = EmotionalSignatureService.getInstance();
