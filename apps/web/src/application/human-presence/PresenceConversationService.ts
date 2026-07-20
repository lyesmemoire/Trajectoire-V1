/**
 * Presence Conversation Service
 * Agit comme un réalisateur de cinéma pour transformer les réponses
 * Ne produit jamais une réponse, transforme uniquement la réponse générée
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// CONVERSATION DIRECTION DECISIONS
// ============================================================================

interface ConversationDirection {
  rhythm: "slow" | "normal" | "fast" | "variable";
  cadence: "steady" | "hesitant" | "enthusiastic" | "calm";
  length: "short" | "medium" | "long" | "natural";
  breathing: number; // 0-1, pauses naturelles
  variation: number; // 0-1, variation dans la structure
  surprise: number; // 0-1, éléments inattendus
  continuity: number; // 0-1, lien avec le contexte précédent
}

// ============================================================================
// PRESENCE CONVERSATION SERVICE CLASS
// ============================================================================

export class PresenceConversationService {
  private static instance: PresenceConversationService;
  private previousResponses: Map<string, string[]> = new Map();
  private previousContexts: Map<string, Record<string, unknown>> = new Map();

  private constructor() {}

  static getInstance(): PresenceConversationService {
    if (!PresenceConversationService.instance) {
      PresenceConversationService.instance = new PresenceConversationService();
    }
    return PresenceConversationService.instance;
  }

  /**
   * Transform response like a film director
   * Décide : rythme, cadence, longueur, respiration, variation, surprise, continuité
   */
  async transformConversation(context: PresenceContext): Promise<{
    modified: string;
    direction: ConversationDirection;
    naturalnessScore: number;
  }> {
    const direction = this.decideDirection(context);
    const transformed = this.applyDirection(context.originalDecision, direction, context);

    // Store for continuity
    this.storeHistory(context, transformed);

    return {
      modified: transformed,
      direction,
      naturalnessScore: this.calculateNaturalnessScore(transformed, direction),
    };
  }

  /**
   * Decide conversation direction
   * Comme un réalisateur décide du ton d'une scène
   */
  private decideDirection(context: PresenceContext): ConversationDirection {
    // Décisions basées sur le contexte et l'historique
    const previousResponses = this.previousResponses.get(context.userId) || [];
    const hasHistory = previousResponses.length > 0;

    return {
      rhythm: this.decideRhythm(context, hasHistory),
      cadence: this.decideCadence(context, hasHistory),
      length: this.decideLength(context, hasHistory),
      breathing: this.decideBreathing(context, hasHistory),
      variation: this.decideVariation(context, hasHistory),
      surprise: this.decideSurprise(context, hasHistory),
      continuity: this.decideContinuity(context, hasHistory),
    };
  }

  private decideRhythm(context: PresenceContext, hasHistory: boolean): "slow" | "normal" | "fast" | "variable" {
    // Variable par défaut pour éviter la monotonie
    if (Math.random() > 0.7) return "variable";
    if (hasHistory && Math.random() > 0.5) return "slow";
    return "normal";
  }

  private decideCadence(context: PresenceContext, hasHistory: boolean): "steady" | "hesitant" | "enthusiastic" | "calm" {
    // Hésitant pour montrer la réflexion
    if (Math.random() > 0.8) return "hesitant";
    if (hasHistory && Math.random() > 0.6) return "calm";
    return "steady";
  }

  private decideLength(context: PresenceContext, hasHistory: boolean): "short" | "medium" | "long" | "natural" {
    // Natural pour éviter les réponses trop courtes ou trop longues
    return "natural";
  }

  private decideBreathing(context: PresenceContext, hasHistory: boolean): number {
    // Respiration naturelle (0.3-0.7)
    return 0.3 + Math.random() * 0.4;
  }

  private decideVariation(context: PresenceContext, hasHistory: boolean): number {
    // Variation pour éviter la monotonie (0.4-0.8)
    return 0.4 + Math.random() * 0.4;
  }

  private decideSurprise(context: PresenceContext, hasHistory: boolean): number {
    // Surprise occasionnelle (0.1-0.4)
    return 0.1 + Math.random() * 0.3;
  }

  private decideContinuity(context: PresenceContext, hasHistory: boolean): number {
    // Continuité forte si historique (0.6-0.9)
    if (hasHistory) return 0.6 + Math.random() * 0.3;
    return 0.3 + Math.random() * 0.3;
  }

  /**
   * Apply direction to response
   * Transforme la réponse selon les décisions du réalisateur
   */
  private applyDirection(
    original: string,
    direction: ConversationDirection,
    context: PresenceContext
  ): string {
    let transformed = original;

    // 1. Supprimer les formulations robotiques
    transformed = this.removeRoboticFormulations(transformed);

    // 2. Éviter les répétitions
    transformed = this.removeRepetitions(transformed);

    // 3. Éviter les listes
    transformed = this.removeLists(transformed);

    // 4. Éviter les phrases identiques
    transformed = this.removeIdenticalPhrases(transformed);

    // 5. Éviter les expressions OpenAI
    transformed = this.removeOpenAIExpressions(transformed);

    // 6. Éviter le langage trop parfait
    transformed = this.imperfectionate(transformed);

    // 7. Appliquer le rythme
    transformed = this.applyRhythm(transformed, direction.rhythm);

    // 8. Appliquer la cadence
    transformed = this.applyCadence(transformed, direction.cadence);

    // 9. Appliquer la respiration
    transformed = this.applyBreathing(transformed, direction.breathing);

    // 10. Appliquer la variation
    transformed = this.applyVariation(transformed, direction.variation);

    // 11. Appliquer la surprise
    transformed = this.applySurprise(transformed, direction.surprise);

    // 12. Appliquer la continuité
    transformed = this.applyContinuity(transformed, direction.continuity, context);

    return transformed;
  }

  /**
   * Remove robotic formulations
   */
  private removeRoboticFormulations(text: string): string {
    const roboticPatterns = [
      /En tant qu'IA/gi,
      /En tant qu'intelligence artificielle/gi,
      /Je suis une IA/gi,
      /Je suis un modèle de langage/gi,
      /En tant qu'assistant/gi,
      /En tant que modèle/gi,
      /Pour répondre à votre question/gi,
      /Pour vous aider/gi,
      /Voici la réponse/gi,
      /Voici les points suivants/gi,
      /En conclusion/gi,
      /En résumé/gi,
      /Pour résumer/gi,
      /En premier lieu/gi,
      /Deuxièmement/gi,
      /Troisièmement/gi,
      /Enfin/gi,
      /Par ailleurs/gi,
      /De plus/gi,
      /En outre/gi,
      /Cependant/gi,
      /Néanmoins/gi,
      /Par conséquent/gi,
      /Par suite/gi,
      /D'une part/gi,
      /D'autre part/gi,
    ];

    let transformed = text;
    roboticPatterns.forEach(pattern => {
      transformed = transformed.replace(pattern, "");
    });

    return transformed;
  }

  /**
   * Remove repetitions
   */
  private removeRepetitions(text: string): string {
    const words = text.split(" ");
    const cleaned: string[] = [];
    let lastWord = "";

    words.forEach(word => {
      if (word.toLowerCase() !== lastWord.toLowerCase()) {
        cleaned.push(word);
        lastWord = word;
      }
    });

    return cleaned.join(" ");
  }

  /**
   * Remove lists
   */
  private removeLists(text: string): string {
    // Supprimer les listes numérotées
    let transformed = text.replace(/\d+\.\s*/g, "");
    // Supprimer les puces
    transformed = transformed.replace(/[-•]\s*/g, "");
    // Supprimer les séparateurs de liste
    transformed = transformed.replace(/;/g, ",");
    return transformed;
  }

  /**
   * Remove identical phrases
   */
  private removeIdenticalPhrases(text: string): string {
    const sentences = text.split(/[.!?]/);
    const uniqueSentences = new Set(sentences);
    return Array.from(uniqueSentences).join(". ");
  }

  /**
   * Remove OpenAI expressions
   */
  private removeOpenAIExpressions(text: string): string {
    const openAIExpressions = [
      /Je comprends votre préoccupation/gi,
      /Je comprends votre point de vue/gi,
      /C'est une excellente question/gi,
      /C'est une très bonne question/gi,
      /Merci pour votre question/gi,
      /Je suis heureux de vous aider/gi,
      /Je suis ravi de vous aider/gi,
      /N'hésitez pas à me poser des questions/gi,
      /Si vous avez d'autres questions/gi,
      /Y a-t-il autre chose/gi,
    ];

    let transformed = text;
    openAIExpressions.forEach(expression => {
      transformed = transformed.replace(expression, "");
    });

    return transformed;
  }

  /**
   * Imperfectionate language
   * Rendre le langage moins parfait
   */
  private imperfectionate(text: string): string {
    const imperfections = [
      { pattern: /très/gi, replacement: "plutôt" },
      { pattern: /extrêmement/gi, replacement: "vraiment" },
      { pattern: /absolument/gi, replacement: "tout à fait" },
      { pattern: /parfaitement/gi, replacement: "bien" },
      { pattern: /exactement/gi, replacement: "précisément" },
      { pattern: /toujours/gi, replacement: "souvent" },
      { pattern: /jamais/gi, replacement: "rarement" },
      { pattern: /tous/gi, replacement: "beaucoup" },
      { pattern: /aucun/gi, replacement: "peu" },
    ];

    let transformed = text;
    imperfections.forEach(({ pattern, replacement }) => {
      if (Math.random() > 0.7) {
        transformed = transformed.replace(pattern, replacement);
      }
    });

    return transformed;
  }

  /**
   * Apply rhythm
   */
  private applyRhythm(text: string, rhythm: "slow" | "normal" | "fast" | "variable"): string {
    // Le rythme est géré par le timing, pas par le texte
    // Ce service peut ajouter des indicateurs de rythme
    if (rhythm === "slow" && Math.random() > 0.8) {
      return `${text}...`;
    }
    return text;
  }

  /**
   * Apply cadence
   */
  private applyCadence(text: string, cadence: "steady" | "hesitant" | "enthusiastic" | "calm"): string {
    const hesitations = ["euh...", "en fait...", "c'est-à-dire...", "comment dire...", "en gros..."];
    
    if (cadence === "hesitant" && Math.random() > 0.7) {
      const hesitation = hesitations[Math.floor(Math.random() * hesitations.length)];
      return `${hesitation} ${text}`;
    }
    
    return text;
  }

  /**
   * Apply breathing
   */
  private applyBreathing(text: string, breathing: number): string {
    // La respiration est gérée par le timing, pas par le texte
    // Ce service peut ajouter des indicateurs de pause
    if (breathing > 0.6 && Math.random() > 0.8) {
      return `${text} [pause]`;
    }
    return text;
  }

  /**
   * Apply variation
   */
  private applyVariation(text: string, variation: number): string {
    // La variation est gérée par la structure de la phrase
    // Ce service peut varier la longueur des phrases
    if (variation > 0.6 && Math.random() > 0.7) {
      const sentences = text.split(/[.!?]/);
      if (sentences.length > 1) {
        // Varier l'ordre des phrases
        const shuffled = sentences.sort(() => Math.random() - 0.5);
        return shuffled.join(". ");
      }
    }
    return text;
  }

  /**
   * Apply surprise
   */
  private applySurprise(text: string, surprise: number): string {
    const surprises = [
      "C'est intéressant...",
      "Ah, je vois...",
      "Hmm, intéressant point de vue...",
      "Je n'y avais pas pensé...",
    ];
    
    if (surprise > 0.3 && Math.random() > 0.8) {
      const surpriseElement = surprises[Math.floor(Math.random() * surprises.length)];
      return `${surpriseElement} ${text}`;
    }
    
    return text;
  }

  /**
   * Apply continuity
   */
  private applyContinuity(text: string, continuity: number, context: PresenceContext): string {
    const continuities = [
      "Comme on disait tout à l'heure...",
      "Je repense à ce que tu disais...",
      "Pour revenir à ce qu'on disait...",
      "Tout à l'heure tu m'as parlé de...",
    ];
    
    if (continuity > 0.6 && Math.random() > 0.7) {
      const continuityElement = continuities[Math.floor(Math.random() * continuities.length)];
      return `${continuityElement} ${text}`;
    }
    
    return text;
  }

  /**
   * Calculate naturalness score
   */
  private calculateNaturalnessScore(transformed: string, direction: ConversationDirection): number {
    let score = 0.8;
    
    // Bonus pour la variation
    score += direction.variation * 0.1;
    
    // Bonus pour la continuité
    score += direction.continuity * 0.05;
    
    // Bonus pour la surprise
    score += direction.surprise * 0.05;
    
    return Math.min(1, score);
  }

  /**
   * Store history for continuity
   */
  private storeHistory(context: PresenceContext, transformed: string): void {
    const history = this.previousResponses.get(context.userId) || [];
    history.push(transformed);
    
    // Garder seulement les 5 dernières réponses
    if (history.length > 5) {
      history.shift();
    }
    
    this.previousResponses.set(context.userId, history);
    this.previousContexts.set(context.userId, context.context);
  }

  /**
   * Clear history
   */
  clearHistory(userId: string): void {
    this.previousResponses.delete(userId);
    this.previousContexts.delete(userId);
  }

  /**
   * Clear all history
   */
  clearAllHistory(): void {
    this.previousResponses.clear();
    this.previousContexts.clear();
  }
}

export const presenceConversationService = PresenceConversationService.getInstance();
