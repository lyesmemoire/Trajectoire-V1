/**
 * Presence Emotion Service
 * Détecte l'état émotionnel complet et adapte automatiquement la réponse
 * L'adaptation est invisible : jamais de "je détecte que..."
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// EMOTIONAL STATE
// ============================================================================

interface EmotionalState {
  energy: number; // 0-1, niveau d'énergie
  motivation: number; // 0-1, niveau de motivation
  fatigue: number; // 0-1, niveau de fatigue
  stress: number; // 0-1, niveau de stress
  confidence: number; // 0-1, niveau de confiance
  curiosity: number; // 0-1, niveau de curiosité
  engagement: number; // 0-1, niveau d'engagement
  hesitation: number; // 0-1, niveau d'hésitation
}

// ============================================================================
// ADAPTATION DECISIONS
// ============================================================================

interface AdaptationDecisions {
  length: "short" | "medium" | "long" | "natural";
  rhythm: "slow" | "normal" | "fast" | "variable";
  questions: "few" | "normal" | "many" | "none";
  feedback: "minimal" | "normal" | "encouraging" | "supportive";
  depth: "shallow" | "normal" | "deep" | "exploratory";
}

// ============================================================================
// PRESENCE EMOTION SERVICE CLASS
// ============================================================================

export class PresenceEmotionService {
  private static instance: PresenceEmotionService;
  private emotionalHistory: Map<string, EmotionalState[]> = new Map();

  private constructor() {}

  static getInstance(): PresenceEmotionService {
    if (!PresenceEmotionService.instance) {
      PresenceEmotionService.instance = new PresenceEmotionService();
    }
    return PresenceEmotionService.instance;
  }

  /**
   * Detect emotional state
   * Détecte : énergie, motivation, fatigue, stress, confiance, curiosité, engagement, hésitation
   */
  async modifyEmotion(context: PresenceContext): Promise<{
    modified: string;
    empathyScore: number;
    emotionalState: EmotionalState;
    adaptations: AdaptationDecisions;
  }> {
    // Étape 1 : Détecter l'état émotionnel
    const emotionalState = this.detectEmotionalState(context);

    // Étape 2 : Décider des adaptations
    const adaptations = this.decideAdaptations(emotionalState);

    // Étape 3 : Appliquer les adaptations de manière invisible
    const modified = this.applyInvisibleAdaptations(context.originalDecision, adaptations);

    // Stocker l'historique
    this.storeEmotionalHistory(context.userId, emotionalState);

    return {
      modified,
      empathyScore: this.calculateEmpathyScore(emotionalState, adaptations),
      emotionalState,
      adaptations,
    };
  }

  /**
   * Detect emotional state from context
   * Analyse le contexte pour détecter l'état émotionnel complet
   */
  private detectEmotionalState(context: PresenceContext): EmotionalState {
    // Placeholder pour la détection réelle
    // Dans une implémentation réelle, cela analyserait :
    // - Le ton du message
    // - La vitesse de frappe
    // - Les mots utilisés
    // - La structure des phrases
    // - L'historique des interactions

    return {
      energy: 0.5 + Math.random() * 0.3,
      motivation: 0.5 + Math.random() * 0.3,
      fatigue: Math.random() * 0.4,
      stress: Math.random() * 0.5,
      confidence: 0.5 + Math.random() * 0.3,
      curiosity: 0.5 + Math.random() * 0.3,
      engagement: 0.5 + Math.random() * 0.3,
      hesitation: Math.random() * 0.4,
    };
  }

  /**
   * Decide adaptations based on emotional state
   * Adapte automatiquement : longueur, rythme, questions, feedback, profondeur
   */
  private decideAdaptations(state: EmotionalState): AdaptationDecisions {
    const adaptations: AdaptationDecisions = {
      length: "natural",
      rhythm: "normal",
      questions: "normal",
      feedback: "normal",
      depth: "normal",
    };

    // Adaptation de la longueur selon l'énergie et la fatigue
    if (state.fatigue > 0.6 || state.energy < 0.4) {
      adaptations.length = "short";
    } else if (state.energy > 0.7 && state.motivation > 0.7) {
      adaptations.length = "long";
    }

    // Adaptation du rythme selon le stress et la confiance
    if (state.stress > 0.6) {
      adaptations.rhythm = "slow";
    } else if (state.confidence > 0.7 && state.engagement > 0.7) {
      adaptations.rhythm = "variable";
    }

    // Adaptation des questions selon la curiosité et l'engagement
    if (state.curiosity > 0.7) {
      adaptations.questions = "many";
    } else if (state.hesitation > 0.6 || state.stress > 0.6) {
      adaptations.questions = "few";
    }

    // Adaptation du feedback selon le stress et la confiance
    if (state.stress > 0.6 || state.confidence < 0.4) {
      adaptations.feedback = "supportive";
    } else if (state.confidence > 0.7 && state.engagement > 0.7) {
      adaptations.feedback = "encouraging";
    }

    // Adaptation de la profondeur selon la curiosité et la motivation
    if (state.curiosity > 0.7 && state.motivation > 0.7) {
      adaptations.depth = "deep";
    } else if (state.fatigue > 0.6 || state.stress > 0.6) {
      adaptations.depth = "shallow";
    }

    return adaptations;
  }

  /**
   * Apply invisible adaptations
   * L'adaptation doit être invisible : jamais de "je détecte que..."
   */
  private applyInvisibleAdaptations(original: string, adaptations: AdaptationDecisions): string {
    let modified = original;

    // 1. Adapter la longueur
    modified = this.adaptLength(modified, adaptations.length);

    // 2. Adapter le rythme
    modified = this.adaptRhythm(modified, adaptations.rhythm);

    // 3. Adapter les questions
    modified = this.adaptQuestions(modified, adaptations.questions);

    // 4. Adapter le feedback
    modified = this.adaptFeedback(modified, adaptations.feedback);

    // 5. Adapter la profondeur
    modified = this.adaptDepth(modified, adaptations.depth);

    return modified;
  }

  /**
   * Adapt length invisibly
   */
  private adaptLength(text: string, length: "short" | "medium" | "long" | "natural"): string {
    if (length === "short") {
      // Raccourcir les phrases
      const sentences = text.split(/[.!?]/);
      if (sentences.length > 2) {
        return sentences.slice(0, 2).join(". ");
      }
    } else if (length === "long") {
      // Ajouter des détails (invisiblement)
      const elaborations = [
        "en pratique",
        "concrètement",
        "pour être précis",
      ];
      if (Math.random() > 0.7) {
        const elaboration = elaborations[Math.floor(Math.random() * elaborations.length)];
        return `${text}, ${elaboration}`;
      }
    }
    return text;
  }

  /**
   * Adapt rhythm invisibly
   */
  private adaptRhythm(text: string, rhythm: "slow" | "normal" | "fast" | "variable"): string {
    if (rhythm === "slow") {
      // Ajouter des pauses naturelles (invisibles dans le texte, mais indiquées pour le timing)
      return text;
    } else if (rhythm === "variable") {
      // Varier la structure des phrases
      const sentences = text.split(/[.!?]/);
      if (sentences.length > 1 && Math.random() > 0.5) {
        const shuffled = sentences.sort(() => Math.random() - 0.5);
        return shuffled.join(". ");
      }
    }
    return text;
  }

  /**
   * Adapt questions invisibly
   */
  private adaptQuestions(text: string, questions: "few" | "normal" | "many" | "none"): string {
    if (questions === "few") {
      // Réduire les questions
      let modified = text;
      modified = modified.replace(/\?/g, ".");
      return modified;
    } else if (questions === "many") {
      // Ajouter des questions naturelles
      const naturalQuestions = [
        "Qu'en penses-tu ?",
        "C'est clair pour toi ?",
        "Tu veux en savoir plus ?",
      ];
      if (Math.random() > 0.7) {
        const question = naturalQuestions[Math.floor(Math.random() * naturalQuestions.length)];
        return `${text} ${question}`;
      }
    }
    return text;
  }

  /**
   * Adapt feedback invisibly
   */
  private adaptFeedback(text: string, feedback: "minimal" | "normal" | "encouraging" | "supportive"): string {
    if (feedback === "supportive") {
      // Ajouter du soutien invisible
      const supportiveElements = [
        "C'est déjà bien.",
        "Tu progresses.",
        "Continue comme ça.",
      ];
      if (Math.random() > 0.8) {
        const element = supportiveElements[Math.floor(Math.random() * supportiveElements.length)];
        return `${element} ${text}`;
      }
    } else if (feedback === "encouraging") {
      // Ajouter de l'encouragement invisible
      const encouragingElements = [
        "Excellent.",
        "Super.",
        "Bravo.",
      ];
      if (Math.random() > 0.8) {
        const element = encouragingElements[Math.floor(Math.random() * encouragingElements.length)];
        return `${element} ${text}`;
      }
    }
    return text;
  }

  /**
   * Adapt depth invisibly
   */
  private adaptDepth(text: string, depth: "shallow" | "normal" | "deep" | "exploratory"): string {
    if (depth === "shallow") {
      // Simplifier le contenu
      const words = text.split(" ");
      if (words.length > 20) {
        return words.slice(0, 20).join(" ");
      }
    } else if (depth === "deep") {
      // Ajouter de la profondeur
      const depthElements = [
        "plus en détail",
        "en profondeur",
        "plus spécifiquement",
      ];
      if (Math.random() > 0.7) {
        const element = depthElements[Math.floor(Math.random() * depthElements.length)];
        return `${text} ${element}`;
      }
    }
    return text;
  }

  /**
   * Calculate empathy score
   */
  private calculateEmpathyScore(state: EmotionalState, adaptations: AdaptationDecisions): number {
    let score = 0.8;

    // Bonus pour les adaptations appropriées
    if (state.stress > 0.6 && adaptations.feedback === "supportive") {
      score += 0.1;
    }
    if (state.confidence < 0.4 && adaptations.length === "short") {
      score += 0.05;
    }
    if (state.curiosity > 0.7 && adaptations.questions === "many") {
      score += 0.05;
    }

    return Math.min(1, score);
  }

  /**
   * Store emotional history
   */
  private storeEmotionalHistory(userId: string, state: EmotionalState): void {
    const history = this.emotionalHistory.get(userId) || [];
    history.push(state);

    // Garder seulement les 10 derniers états
    if (history.length > 10) {
      history.shift();
    }

    this.emotionalHistory.set(userId, history);
  }

  /**
   * Get emotional history
   */
  getEmotionalHistory(userId: string): EmotionalState[] {
    return this.emotionalHistory.get(userId) || [];
  }

  /**
   * Clear emotional history
   */
  clearEmotionalHistory(userId: string): void {
    this.emotionalHistory.delete(userId);
  }

  /**
   * Clear all emotional history
   */
  clearAllEmotionalHistory(): void {
    this.emotionalHistory.clear();
  }
}

export const presenceEmotionService = PresenceEmotionService.getInstance();
