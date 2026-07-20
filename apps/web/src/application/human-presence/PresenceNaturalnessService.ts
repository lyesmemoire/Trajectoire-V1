/**
 * Presence Naturalness Service
 * Calcule un Presence Score mesurant ce que ressentira le candidat
 * Réécrit automatiquement si le score est inférieur au seuil
 * Le candidat ne doit jamais recevoir une réponse qui ressemble à celle d'un assistant IA
 */

import { PresenceContext } from "./interfaces/IHumanPresenceService";

// ============================================================================
// PRESENCE SCORE CRITERIA
// ============================================================================

interface PresenceScoreCriteria {
  naturalConversation: number; // 0-1, conversation naturelle
  fluidity: number; // 0-1, fluidité
  coherence: number; // 0-1, cohérence
  naturalMemory: number; // 0-1, mémoire naturelle
  noRepetition: number; // 0-1, absence de répétition
  noAIJargon: number; // 0-1, absence de jargon IA
  noGPTStructure: number; // 0-1, absence de structure GPT
  noUselessLists: number; // 0-1, absence de listes inutiles
  formulationVariation: number; // 0-1, variation des formulations
}

// ============================================================================
// PRESENCE SCORE RESULT
// ============================================================================

interface PresenceScoreResult {
  overallScore: number; // 0-1
  criteria: PresenceScoreCriteria;
  threshold: number; // seuil minimum
  passed: boolean;
  issues: string[];
}

// ============================================================================
// PRESENCE NATURALNESS SERVICE CLASS
// ============================================================================

export class PresenceNaturalnessService {
  private static instance: PresenceNaturalnessService;
  private readonly THRESHOLD = 0.75; // seuil minimum de naturalité

  private constructor() {}

  static getInstance(): PresenceNaturalnessService {
    if (!PresenceNaturalnessService.instance) {
      PresenceNaturalnessService.instance = new PresenceNaturalnessService();
    }
    return PresenceNaturalnessService.instance;
  }

  /**
   * Modify with presence score calculation and auto-rewrite
   * Calcule le Presence Score et réécrit automatiquement si nécessaire
   */
  async modifyNaturalness(context: PresenceContext): Promise<{
    modified: string;
    naturalnessScore: number;
    presenceScoreResult: PresenceScoreResult;
    rewritten: boolean;
  }> {
    // Étape 1 : Calculer le Presence Score
    const presenceScoreResult = this.calculatePresenceScore(context.originalDecision);

    // Étape 2 : Réécrire automatiquement si le score est inférieur au seuil
    let modified = context.originalDecision;
    let rewritten = false;

    if (!presenceScoreResult.passed) {
      modified = this.autoRewrite(context.originalDecision, presenceScoreResult);
      rewritten = true;

      // Recalculer le score après réécriture
      const newScoreResult = this.calculatePresenceScore(modified);
      presenceScoreResult.overallScore = newScoreResult.overallScore;
      presenceScoreResult.criteria = newScoreResult.criteria;
      presenceScoreResult.passed = newScoreResult.passed;
      presenceScoreResult.issues = newScoreResult.issues;
    }

    return {
      modified,
      naturalnessScore: presenceScoreResult.overallScore,
      presenceScoreResult,
      rewritten,
    };
  }

  /**
   * Calculate presence score
   * Mesure ce que ressentira le candidat
   */
  private calculatePresenceScore(text: string): PresenceScoreResult {
    const criteria: PresenceScoreCriteria = {
      naturalConversation: this.checkNaturalConversation(text),
      fluidity: this.checkFluidity(text),
      coherence: this.checkCoherence(text),
      naturalMemory: this.checkNaturalMemory(text),
      noRepetition: this.checkNoRepetition(text),
      noAIJargon: this.checkNoAIJargon(text),
      noGPTStructure: this.checkNoGPTStructure(text),
      noUselessLists: this.checkNoUselessLists(text),
      formulationVariation: this.checkFormulationVariation(text),
    };

    const overallScore = this.calculateOverallScore(criteria);
    const passed = overallScore >= this.THRESHOLD;
    const issues = this.identifyIssues(criteria);

    return {
      overallScore,
      criteria,
      threshold: this.THRESHOLD,
      passed,
      issues,
    };
  }

  /**
   * Check natural conversation
   */
  private checkNaturalConversation(text: string): number {
    let score = 1.0;

    // Pénaliser les phrases trop formelles
    const formalPhrases = ["en tant que", "je suis un", "en tant qu'assistant"];
    formalPhrases.forEach(phrase => {
      if (text.toLowerCase().includes(phrase)) {
        score -= 0.3;
      }
    });

    // Pénaliser les transitions robotiques
    const roboticTransitions = ["en conclusion", "en résumé", "pour conclure"];
    roboticTransitions.forEach(transition => {
      if (text.toLowerCase().includes(transition)) {
        score -= 0.2;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check fluidity
   */
  private checkFluidity(text: string): number {
    let score = 1.0;

    // Pénaliser les phrases trop courtes
    const sentences = text.split(/[.!?]/);
    const shortSentences = sentences.filter(s => s.trim().length < 5);
    if (shortSentences.length > sentences.length * 0.5) {
      score -= 0.2;
    }

    // Pénaliser les phrases trop longues
    const longSentences = sentences.filter(s => s.trim().length > 50);
    if (longSentences.length > sentences.length * 0.3) {
      score -= 0.15;
    }

    return Math.max(0, score);
  }

  /**
   * Check coherence
   */
  private checkCoherence(text: string): number {
    let score = 1.0;

    // Pénaliser les incohérences logiques
    const contradictions = ["oui et non", "vrai et faux", "d'accord et pas d'accord"];
    contradictions.forEach(contradiction => {
      if (text.toLowerCase().includes(contradiction)) {
        score -= 0.3;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check natural memory
   */
  private checkNaturalMemory(text: string): number {
    let score = 1.0;

    // Pénaliser les références artificielles
    const artificialReferences = ["comme je l'ai mentionné précédemment", "comme discuté plus tôt"];
    artificialReferences.forEach(reference => {
      if (text.toLowerCase().includes(reference)) {
        score -= 0.2;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check no repetition
   */
  private checkNoRepetition(text: string): number {
    let score = 1.0;

    const words = text.toLowerCase().split(/\s+/);
    const wordCounts = new Map<string, number>();

    words.forEach(word => {
      if (word.length > 3) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    });

    // Pénaliser les mots répétés plus de 3 fois
    wordCounts.forEach((count, word) => {
      if (count > 3) {
        score -= 0.1;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check no AI jargon
   */
  private checkNoAIJargon(text: string): number {
    let score = 1.0;

    const aiJargon = [
      "intelligence artificielle",
      "machine learning",
      "algorithme",
      "traitement du langage naturel",
      "modèle de langage",
      "IA",
      "LLM",
    ];

    aiJargon.forEach(term => {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        score -= 0.15;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Check no GPT structure
   */
  private checkNoGPTStructure(text: string): number {
    let score = 1.0;

    // Pénaliser les structures typiques de GPT
    const gptStructures = [
      /^voici .+/i,
      /^voici quelques .+/i,
      /^voici plusieurs .+/i,
      /^les points suivants .+/i,
      /^les étapes suivantes .+/i,
    ];

    gptStructures.forEach(pattern => {
      if (pattern.test(text.trim())) {
        score -= 0.25;
      }
    });

    // Pénaliser les énumérations numérotées
    if (/^\d+\./.test(text)) {
      score -= 0.2;
    }

    return Math.max(0, score);
  }

  /**
   * Check no useless lists
   */
  private checkNoUselessLists(text: string): number {
    let score = 1.0;

    // Pénaliser les listes à puces
    if (text.includes("•") || text.includes("- ") || text.includes("* ")) {
      score -= 0.15;
    }

    // Pénaliser les énumérations
    if (/premier|deuxième|troisième/i.test(text)) {
      score -= 0.1;
    }

    return Math.max(0, score);
  }

  /**
   * Check formulation variation
   */
  private checkFormulationVariation(text: string): number {
    let score = 1.0;

    const sentences = text.split(/[.!?]/);
    const sentenceStarters = sentences.map(s => {
      const words = s.trim().split(/\s+/);
      return words.length > 0 ? words[0].toLowerCase() : "";
    });

    // Pénaliser si trop de phrases commencent par le même mot
    const starterCounts = new Map<string, number>();
    sentenceStarters.forEach(starter => {
      if (starter.length > 0) {
        starterCounts.set(starter, (starterCounts.get(starter) || 0) + 1);
      }
    });

    starterCounts.forEach((count, starter) => {
      if (count > 2) {
        score -= 0.1;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(criteria: PresenceScoreCriteria): number {
    const weights = {
      naturalConversation: 0.15,
      fluidity: 0.1,
      coherence: 0.1,
      naturalMemory: 0.1,
      noRepetition: 0.15,
      noAIJargon: 0.15,
      noGPTStructure: 0.1,
      noUselessLists: 0.05,
      formulationVariation: 0.1,
    };

    let weightedScore = 0;
    weightedScore += criteria.naturalConversation * weights.naturalConversation;
    weightedScore += criteria.fluidity * weights.fluidity;
    weightedScore += criteria.coherence * weights.coherence;
    weightedScore += criteria.naturalMemory * weights.naturalMemory;
    weightedScore += criteria.noRepetition * weights.noRepetition;
    weightedScore += criteria.noAIJargon * weights.noAIJargon;
    weightedScore += criteria.noGPTStructure * weights.noGPTStructure;
    weightedScore += criteria.noUselessLists * weights.noUselessLists;
    weightedScore += criteria.formulationVariation * weights.formulationVariation;

    return weightedScore;
  }

  /**
   * Identify issues
   */
  private identifyIssues(criteria: PresenceScoreCriteria): string[] {
    const issues: string[] = [];

    if (criteria.naturalConversation < 0.7) {
      issues.push("Conversation peu naturelle");
    }
    if (criteria.fluidity < 0.7) {
      issues.push("Fluidité insuffisante");
    }
    if (criteria.coherence < 0.7) {
      issues.push("Cohérence faible");
    }
    if (criteria.naturalMemory < 0.7) {
      issues.push("Mémoire peu naturelle");
    }
    if (criteria.noRepetition < 0.7) {
      issues.push("Répétitions détectées");
    }
    if (criteria.noAIJargon < 0.7) {
      issues.push("Jargon IA détecté");
    }
    if (criteria.noGPTStructure < 0.7) {
      issues.push("Structure GPT détectée");
    }
    if (criteria.noUselessLists < 0.7) {
      issues.push("Listes inutiles détectées");
    }
    if (criteria.formulationVariation < 0.7) {
      issues.push("Variation de formulation insuffisante");
    }

    return issues;
  }

  /**
   * Auto-rewrite response
   * Réécrit automatiquement la réponse pour améliorer le score
   */
  private autoRewrite(original: string, scoreResult: PresenceScoreResult): string {
    let rewritten = original;

    // Corriger les problèmes de conversation naturelle
    if (scoreResult.criteria.naturalConversation < 0.7) {
      rewritten = this.fixNaturalConversation(rewritten);
    }

    // Corriger les problèmes de fluidité
    if (scoreResult.criteria.fluidity < 0.7) {
      rewritten = this.fixFluidity(rewritten);
    }

    // Corriger les problèmes de jargon IA
    if (scoreResult.criteria.noAIJargon < 0.7) {
      rewritten = this.fixAIJargon(rewritten);
    }

    // Corriger les problèmes de structure GPT
    if (scoreResult.criteria.noGPTStructure < 0.7) {
      rewritten = this.fixGPTStructure(rewritten);
    }

    // Corriger les problèmes de listes
    if (scoreResult.criteria.noUselessLists < 0.7) {
      rewritten = this.fixUselessLists(rewritten);
    }

    // Corriger les problèmes de répétition
    if (scoreResult.criteria.noRepetition < 0.7) {
      rewritten = this.fixRepetition(rewritten);
    }

    return rewritten;
  }

  /**
   * Fix natural conversation
   */
  private fixNaturalConversation(text: string): string {
    let fixed = text;

    // Remplacer les phrases formelles
    fixed = fixed.replace(/en tant que/gi, "comme");
    fixed = fixed.replace(/je suis un/gi, "je suis");
    fixed = fixed.replace(/en conclusion/gi, "en gros");
    fixed = fixed.replace(/en résumé/gi, "bref");

    return fixed;
  }

  /**
   * Fix fluidity
   */
  private fixFluidity(text: string): string {
    // Placeholder pour la correction réelle de fluidité
    // Dans une implémentation réelle, cela utiliserait NLP
    return text;
  }

  /**
   * Fix AI jargon
   */
  private fixAIJargon(text: string): string {
    let fixed = text;

    // Remplacer le jargon IA
    fixed = fixed.replace(/intelligence artificielle/gi, "l'IA");
    fixed = fixed.replace(/machine learning/gi, "l'apprentissage automatique");
    fixed = fixed.replace(/traitement du langage naturel/gi, "la compréhension du langage");

    return fixed;
  }

  /**
   * Fix GPT structure
   */
  private fixGPTStructure(text: string): string {
    let fixed = text;

    // Supprimer les structures "Voici..."
    fixed = fixed.replace(/^voici .+/gi, "");
    fixed = fixed.replace(/^voici quelques .+/gi, "");
    fixed = fixed.replace(/^voici plusieurs .+/gi, "");

    // Supprimer les numérotations
    fixed = fixed.replace(/^\d+\.\s*/gm, "");

    return fixed.trim();
  }

  /**
   * Fix useless lists
   */
  private fixUselessLists(text: string): string {
    let fixed = text;

    // Supprimer les puces
    fixed = fixed.replace(/[•\-*]\s*/g, "");

    // Remplacer les énumérations par du texte
    fixed = fixed.replace(/premier/gi, "d'abord");
    fixed = fixed.replace(/deuxième/gi, "ensuite");
    fixed = fixed.replace(/troisième/gi, "enfin");

    return fixed;
  }

  /**
   * Fix repetition
   */
  private fixRepetition(text: string): string {
    // Placeholder pour la correction réelle des répétitions
    // Dans une implémentation réelle, cela utiliserait NLP pour varier le vocabulaire
    return text;
  }
}

export const presenceNaturalnessService = PresenceNaturalnessService.getInstance();
