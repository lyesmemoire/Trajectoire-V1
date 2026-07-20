/**
 * Presence Trust Service
 * Le candidat doit sentir que le recruteur est cohérent
 * Vérifie contradictions, changements de ton, questions déjà posées, avis incohérents, répétitions
 * Corrige automatiquement si nécessaire
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// COHERENCE CHECK RESULT
// ============================================================================

interface CoherenceCheckResult {
  hasContradictions: boolean;
  hasToneChange: boolean;
  hasDuplicateQuestions: boolean;
  hasInconsistentOpinions: boolean;
  hasRepetitions: boolean;
  overallCoherence: number; // 0-1
  issues: string[];
}

// ============================================================================
// PRESENCE TRUST SERVICE CLASS
// ============================================================================

export class PresenceTrustService {
  private static instance: PresenceTrustService;
  private conversationHistory: Map<string, {
    responses: string[];
    questions: string[];
    opinions: string[];
    tone: string;
  }> = new Map();

  private constructor() {}

  static getInstance(): PresenceTrustService {
    if (!PresenceTrustService.instance) {
      PresenceTrustService.instance = new PresenceTrustService();
    }
    return PresenceTrustService.instance;
  }

  /**
   * Modify with coherence check and auto-correction
   * Vérifie la cohérence et corrige automatiquement si nécessaire
   */
  async modifyTrust(context: PresenceContext): Promise<{
    modified: string;
    trustScore: number;
    coherenceCheck: CoherenceCheckResult;
    corrected: boolean;
  }> {
    // Étape 1 : Analyser la cohérence de la réponse
    const coherenceCheck = this.checkCoherence(context);

    // Étape 2 : Corriger automatiquement si nécessaire
    let modified = context.originalDecision;
    let corrected = false;

    if (coherenceCheck.overallCoherence < 0.8) {
      modified = this.autoCorrect(context.originalDecision, coherenceCheck);
      corrected = true;
    }

    // Étape 3 : Stocker la réponse dans l'historique
    this.storeInHistory(context, modified);

    return {
      modified,
      trustScore: this.calculateTrustScore(coherenceCheck, corrected),
      coherenceCheck,
      corrected,
    };
  }

  /**
   * Check coherence of response
   * Vérifie contradictions, changements de ton, questions déjà posées, avis incohérents, répétitions
   */
  private checkCoherence(context: PresenceContext): CoherenceCheckResult {
    const history = this.conversationHistory.get(context.userId) || {
      responses: [],
      questions: [],
      opinions: [],
      tone: "neutral",
    };

    const issues: string[] = [];
    let hasContradictions = false;
    let hasToneChange = false;
    let hasDuplicateQuestions = false;
    let hasInconsistentOpinions = false;
    let hasRepetitions = false;

    // Vérifier les contradictions
    const contradictions = this.detectContradictions(context.originalDecision, history.responses);
    if (contradictions.length > 0) {
      hasContradictions = true;
      issues.push(...contradictions);
    }

    // Vérifier les changements de ton
    const currentTone = this.detectTone(context.originalDecision);
    if (currentTone !== history.tone && history.responses.length > 0) {
      hasToneChange = true;
      issues.push(`Changement de ton détecté: ${history.tone} → ${currentTone}`);
    }

    // Vérifier les questions déjà posées
    const questions = this.extractQuestions(context.originalDecision);
    const duplicateQuestions = questions.filter(q => history.questions.includes(q));
    if (duplicateQuestions.length > 0) {
      hasDuplicateQuestions = true;
      issues.push(`Questions déjà posées: ${duplicateQuestions.join(", ")}`);
    }

    // Vérifier les avis incohérents
    const opinions = this.extractOpinions(context.originalDecision);
    const inconsistentOpinions = this.detectInconsistentOpinions(opinions, history.opinions);
    if (inconsistentOpinions.length > 0) {
      hasInconsistentOpinions = true;
      issues.push(...inconsistentOpinions);
    }

    // Vérifier les répétitions
    const repetitions = this.detectRepetitions(context.originalDecision, history.responses);
    if (repetitions.length > 0) {
      hasRepetitions = true;
      issues.push(...repetitions);
    }

    // Calculer le score de cohérence global
    const overallCoherence = this.calculateOverallCoherence(
      hasContradictions,
      hasToneChange,
      hasDuplicateQuestions,
      hasInconsistentOpinions,
      hasRepetitions
    );

    return {
      hasContradictions,
      hasToneChange,
      hasDuplicateQuestions,
      hasInconsistentOpinions,
      hasRepetitions,
      overallCoherence,
      issues,
    };
  }

  /**
   * Detect contradictions
   */
  private detectContradictions(current: string, previousResponses: string[]): string[] {
    const contradictions: string[] = [];
    const contradictoryPhrases = [
      ["oui", "non"],
      ["c'est vrai", "c'est faux"],
      ["je suis d'accord", "je ne suis pas d'accord"],
      ["c'est important", "ce n'est pas important"],
      ["tu devrais", "tu ne devrais pas"],
    ];

    contradictoryPhrases.forEach(([phrase1, phrase2]) => {
      const hasPhrase1 = current.toLowerCase().includes(phrase1);
      const hasPhrase2InPrevious = previousResponses.some(r => r.toLowerCase().includes(phrase2));
      
      if (hasPhrase1 && hasPhrase2InPrevious) {
        contradictions.push(`Contradiction détectée: "${phrase2}" vs "${phrase1}"`);
      }
    });

    return contradictions;
  }

  /**
   * Detect tone
   */
  private detectTone(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("super") || lowerText.includes("excellent") || lowerText.includes("bravo")) {
      return "enthusiastic";
    }
    if (lowerText.includes("attention") || lowerText.includes("important") || lowerText.includes("sérieux")) {
      return "serious";
    }
    if (lowerText.includes("désolé") || lowerText.includes("pardon") || lowerText.includes("regret")) {
      return "apologetic";
    }
    
    return "neutral";
  }

  /**
   * Extract questions
   */
  private extractQuestions(text: string): string[] {
    const questions: string[] = [];
    const sentences = text.split(/[.!?]/);
    
    sentences.forEach(sentence => {
      if (sentence.includes("?")) {
        questions.push(sentence.trim());
      }
    });
    
    return questions;
  }

  /**
   * Extract opinions
   */
  private extractOpinions(text: string): string[] {
    const opinions: string[] = [];
    const opinionPatterns = [
      /je pense que (.+)/gi,
      /je crois que (.+)/gi,
      /à mon avis (.+)/gi,
      /selon moi (.+)/gi,
    ];

    opinionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        opinions.push(...matches);
      }
    });

    return opinions;
  }

  /**
   * Detect inconsistent opinions
   */
  private detectInconsistentOpinions(currentOpinions: string[], previousOpinions: string[]): string[] {
    const inconsistencies: string[] = [];
    
    // Placeholder pour la détection réelle d'incohérences
    // Dans une implémentation réelle, cela utiliserait NLP pour comparer les opinions
    
    return inconsistencies;
  }

  /**
   * Detect repetitions
   */
  private detectRepetitions(current: string, previousResponses: string[]): string[] {
    const repetitions: string[] = [];
    const words = current.split(" ");
    
    previousResponses.forEach(response => {
      const previousWords = response.split(" ");
      const commonWords = words.filter(word => previousWords.includes(word));
      
      if (commonWords.length > words.length * 0.5) {
        repetitions.push(`Répétition détectée avec une réponse précédente`);
      }
    });

    return repetitions;
  }

  /**
   * Calculate overall coherence
   */
  private calculateOverallCoherence(
    hasContradictions: boolean,
    hasToneChange: boolean,
    hasDuplicateQuestions: boolean,
    hasInconsistentOpinions: boolean,
    hasRepetitions: boolean
  ): number {
    let score = 1.0;

    if (hasContradictions) score -= 0.3;
    if (hasToneChange) score -= 0.1;
    if (hasDuplicateQuestions) score -= 0.15;
    if (hasInconsistentOpinions) score -= 0.2;
    if (hasRepetitions) score -= 0.1;

    return Math.max(0, score);
  }

  /**
   * Auto-correct response
   * Corrige automatiquement la réponse si nécessaire
   */
  private autoCorrect(original: string, coherenceCheck: CoherenceCheckResult): string {
    let corrected = original;

    // Corriger les contradictions
    if (coherenceCheck.hasContradictions) {
      corrected = this.correctContradictions(corrected);
    }

    // Corriger les répétitions
    if (coherenceCheck.hasRepetitions) {
      corrected = this.correctRepetitions(corrected);
    }

    // Corriger les questions dupliquées
    if (coherenceCheck.hasDuplicateQuestions) {
      corrected = this.correctDuplicateQuestions(corrected);
    }

    return corrected;
  }

  /**
   * Correct contradictions
   */
  private correctContradictions(text: string): string {
    // Placeholder pour la correction réelle des contradictions
    // Dans une implémentation réelle, cela utiliserait NLP pour reformuler
    return text;
  }

  /**
   * Correct repetitions
   */
  private correctRepetitions(text: string): string {
    // Placeholder pour la correction réelle des répétitions
    // Dans une implémentation réelle, cela utiliserait NLP pour varier le vocabulaire
    return text;
  }

  /**
   * Correct duplicate questions
   */
  private correctDuplicateQuestions(text: string): string {
    // Supprimer les questions dupliquées
    const sentences = text.split(/[.!?]/);
    const uniqueSentences = new Set(sentences);
    return Array.from(uniqueSentences).join(". ");
  }

  /**
   * Calculate trust score
   */
  private calculateTrustScore(coherenceCheck: CoherenceCheckResult, corrected: boolean): number {
    let score = coherenceCheck.overallCoherence;

    // Bonus pour la correction automatique
    if (corrected) {
      score += 0.1;
    }

    return Math.min(1, score);
  }

  /**
   * Store response in history
   */
  private storeInHistory(context: PresenceContext, modified: string): void {
    const history = this.conversationHistory.get(context.userId) || {
      responses: [],
      questions: [],
      opinions: [],
      tone: "neutral",
    };

    history.responses.push(modified);
    history.questions.push(...this.extractQuestions(modified));
    history.opinions.push(...this.extractOpinions(modified));
    history.tone = this.detectTone(modified);

    // Garder seulement les 20 dernières réponses
    if (history.responses.length > 20) {
      history.responses.shift();
      history.questions = history.questions.slice(-20);
      history.opinions = history.opinions.slice(-20);
    }

    this.conversationHistory.set(context.userId, history);
  }

  /**
   * Get conversation history
   */
  getConversationHistory(userId: string): {
    responses: string[];
    questions: string[];
    opinions: string[];
    tone: string;
  } | null {
    return this.conversationHistory.get(userId) || null;
  }

  /**
   * Clear user history
   */
  clearUserHistory(userId: string): void {
    this.conversationHistory.delete(userId);
  }

  /**
   * Clear all history
   */
  clearAllHistory(): void {
    this.conversationHistory.clear();
  }
}

export const presenceTrustService = PresenceTrustService.getInstance();
