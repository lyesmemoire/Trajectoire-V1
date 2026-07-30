/**
 * Bias Engine - Layer 0 Kernel
 * Moteur de biais actif selon les spécifications HIIOS v4.0
 */

import {
  BiasEvent,
  BiasType,
  Observation,
  Hypothesis,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

export class BiasEngine {
  private static instance: BiasEngine;

  private constructor() {}

  static getInstance(): BiasEngine {
    if (!BiasEngine.instance) {
      BiasEngine.instance = new BiasEngine();
    }
    return BiasEngine.instance;
  }

  /**
   * Détecte un biais dans une observation
   * Principe : Les biais ne sont pas seulement nommés, ils modifient réellement le comportement du moteur
   */
  detectBias(
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const content = observation.content.toLowerCase();

    // Détection du Halo Effect
    const haloBias = this.detectHaloEffect(content, observation, hypothesisId);
    if (haloBias) {
      return haloBias;
    }

    // Détection du Similarity Bias
    const similarityBias = this.detectSimilarityBias(content, observation, hypothesisId);
    if (similarityBias) {
      return similarityBias;
    }

    // Détection du Confirmation Bias
    const confirmationBias = this.detectConfirmationBias(content, observation, hypothesisId);
    if (confirmationBias) {
      return confirmationBias;
    }

    // Détection de l'Anchoring
    const anchoringBias = this.detectAnchoring(content, observation, hypothesisId);
    if (anchoringBias) {
      return anchoringBias;
    }

    // Détection du Contrast Effect
    const contrastBias = this.detectContrastEffect(content, observation, hypothesisId);
    if (contrastBias) {
      return contrastBias;
    }

    // Détection de l'Attribution Error
    const attributionBias = this.detectAttributionError(content, observation, hypothesisId);
    if (attributionBias) {
      return attributionBias;
    }

    return null;
  }

  /**
   * Détection du Halo Effect
   */
  private detectHaloEffect(
    content: string,
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const haloKeywords = [
      "toujours",
      "parfait",
      "excellent",
      "sans défaut",
      "impeccable",
      "flawless",
      "always perfect",
    ];

    const hasHaloEffect = haloKeywords.some((keyword) => content.includes(keyword));

    if (hasHaloEffect) {
      return {
        id: `B_HALO_${Date.now()}`,
        turn: 0,
        biasType: BiasType.HALO_EFFECT,
        trigger: observation.content,
        affectedHypothesis: hypothesisId,
        confidencePenalty: -0.15,
        mandatoryAction: "Question de faiblesse sur le point fort détecté",
        resolved: false,
      };
    }

    return null;
  }

  /**
   * Détection du Similarity Bias
   */
  private detectSimilarityBias(
    content: string,
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const similarityKeywords = [
      "comme moi",
      "semblable à",
      "pareil que",
      "identique à",
      "same as",
      "like me",
      "similar to",
    ];

    const hasSimilarityBias = similarityKeywords.some((keyword) =>
      content.includes(keyword)
    );

    if (hasSimilarityBias) {
      return {
        id: `B_SIMILARITY_${Date.now()}`,
        turn: 0,
        biasType: BiasType.SIMILARITY_BIAS,
        trigger: observation.content,
        affectedHypothesis: hypothesisId,
        confidencePenalty: -0.12,
        mandatoryAction: "Question sur une différence de valeur ou de méthode",
        resolved: false,
      };
    }

    return null;
  }

  /**
   * Détection du Confirmation Bias
   */
  private detectConfirmationBias(
    content: string,
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const confirmationKeywords = [
      "comme je pensais",
      "exactement comme prévu",
      "je savais que",
      "je m'attendais à",
      "as expected",
      "i knew",
      "i thought",
    ];

    const hasConfirmationBias = confirmationKeywords.some((keyword) =>
      content.includes(keyword)
    );

    if (hasConfirmationBias) {
      return {
        id: `B_CONFIRMATION_${Date.now()}`,
        turn: 0,
        biasType: BiasType.CONFIRMATION_BIAS,
        trigger: observation.content,
        affectedHypothesis: hypothesisId,
        confidencePenalty: -0.18,
        mandatoryAction: "Recherche active d'une preuve contraire",
        resolved: false,
      };
    }

    return null;
  }

  /**
   * Détection de l'Anchoring
   */
  private detectAnchoring(
    content: string,
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const anchoringKeywords = [
      "d'abord",
      "au début",
      "initialement",
      "premièrement",
      "first",
      "initially",
      "at first",
    ];

    const hasAnchoring = anchoringKeywords.some((keyword) => content.includes(keyword));

    if (hasAnchoring) {
      return {
        id: `B_ANCHORING_${Date.now()}`,
        turn: 0,
        biasType: BiasType.ANCHORING,
        trigger: observation.content,
        affectedHypothesis: hypothesisId,
        confidencePenalty: -0.10,
        mandatoryAction: "Reformulation complète du profil à mi-entretien",
        resolved: false,
      };
    }

    return null;
  }

  /**
   * Détection du Contrast Effect
   */
  private detectContrastEffect(
    content: string,
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const contrastKeywords = [
      "contrairement à",
      "par rapport à",
      "contrairement au précédent",
      "unlike",
      "compared to",
      "unlike the previous",
    ];

    const hasContrastEffect = contrastKeywords.some((keyword) =>
      content.includes(keyword)
    );

    if (hasContrastEffect) {
      return {
        id: `B_CONTRAST_${Date.now()}`,
        turn: 0,
        biasType: BiasType.CONTRAST_EFFECT,
        trigger: observation.content,
        affectedHypothesis: hypothesisId,
        confidencePenalty: -0.08,
        mandatoryAction: "Évaluation contre le poste pas contre le candidat précédent",
        resolved: false,
      };
    }

    return null;
  }

  /**
   * Détection de l'Attribution Error
   */
  private detectAttributionError(
    content: string,
    observation: Observation,
    hypothesisId: string
  ): BiasEvent | null {
    const attributionKeywords = [
      "c'est sa faute",
      "c'est de sa responsabilité",
      "il a échoué",
      "elle a échoué",
      "his fault",
      "her fault",
      "failed because",
    ];

    const hasAttributionError = attributionKeywords.some((keyword) =>
      content.includes(keyword)
    );

    if (hasAttributionError) {
      return {
        id: `B_ATTRIBUTION_${Date.now()}`,
        turn: 0,
        biasType: BiasType.ATTRIBUTION_ERROR,
        trigger: observation.content,
        affectedHypothesis: hypothesisId,
        confidencePenalty: -0.12,
        mandatoryAction: "Question sur le contexte avant toute conclusion sur la personne",
        resolved: false,
      };
    }

    return null;
  }

  /**
   * Applique la pénalité de biais à une hypothèse
   */
  applyBiasPenalty(hypothesis: Hypothesis, biasEvent: BiasEvent): void {
    hypothesis.posterior = Math.max(
      0.01,
      hypothesis.posterior + biasEvent.confidencePenalty
    );
    hypothesis.confidence = hypothesis.posterior;
  }

  /**
   * Résout un événement de biais
   */
  resolveBias(biasEvent: BiasEvent): void {
    biasEvent.resolved = true;
  }

  /**
   * Génère la question obligatoire de correction
   */
  generateCorrectionQuestion(biasEvent: BiasEvent): string {
    return biasEvent.mandatoryAction;
  }

  /**
   * Vérifie si un biais bloque l'accès à l'État 5 et 6
   * Règle : Un biais non résolu bloque l'accès à l'État 5 et 6
   */
  blocksStateAccess(biasEvents: BiasEvent[]): boolean {
    return biasEvents.some((b) => !b.resolved);
  }

  /**
   * Vérifie si une décision finale est possible
   * Règle : La décision finale est impossible si un BIAS_EVENT reste unresolved
   */
  canFinalizeDecision(biasEvents: BiasEvent[]): boolean {
    return !this.blocksStateAccess(biasEvents);
  }

  /**
   * Filtre les événements de biais par type
   */
  filterByType(biasEvents: BiasEvent[], biasType: BiasType): BiasEvent[] {
    return biasEvents.filter((b) => b.biasType === biasType);
  }

  /**
   * Filtre les événements de biais non résolus
   */
  getUnresolvedBiases(biasEvents: BiasEvent[]): BiasEvent[] {
    return biasEvents.filter((b) => !b.resolved);
  }

  /**
   * Filtre les événements de biais résolus
   */
  getResolvedBiases(biasEvents: BiasEvent[]): BiasEvent[] {
    return biasEvents.filter((b) => b.resolved);
  }

  /**
   * Calcule la pénalité totale de biais
   */
  calculateTotalPenalty(biasEvents: BiasEvent[]): number {
    return biasEvents.reduce((total, b) => {
      if (!b.resolved) {
        return total + b.confidencePenalty;
      }
      return total;
    }, 0);
  }

  /**
   * Compte les événements de biais par type
   */
  countByType(biasEvents: BiasEvent[]): Map<BiasType, number> {
    const counts = new Map<BiasType, number>();

    Object.values(BiasType).forEach((type) => {
      counts.set(type, 0);
    });

    biasEvents.forEach((b) => {
      const current = counts.get(b.biasType) || 0;
      counts.set(b.biasType, current + 1);
    });

    return counts;
  }

  /**
   * Explique un événement de biais
   */
  explainBiasEvent(biasEvent: BiasEvent): string {
    let explanation = `BIAIS DÉTECTÉ : ${biasEvent.biasType}\n`;
    explanation += `Déclencheur : ${biasEvent.trigger}\n`;
    explanation += `Pénalité : ${(biasEvent.confidencePenalty * 100).toFixed(1)}%\n`;
    explanation += `Action obligatoire : ${biasEvent.mandatoryAction}\n`;
    explanation += `Résolu : ${biasEvent.resolved ? "Oui" : "Non"}\n`;

    return explanation;
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const observation: Observation = {
      id: "O_1",
      type: "CITATION",
      content: "Je suis toujours parfait dans mes décisions",
      timestamp: Date.now(),
    };

    const biasEvent = this.detectBias(observation, "H_lead_17");

    if (biasEvent) {
      logInfo(`Biais détecté : ${biasEvent.biasType}`);
      logInfo(`Pénalité : ${(biasEvent.confidencePenalty * 100).toFixed(1)}%`);
      logInfo(`Action obligatoire : ${biasEvent.mandatoryAction}`);

      const correctionQuestion = this.generateCorrectionQuestion(biasEvent);
      logInfo(`Question de correction : ${correctionQuestion}`);
    }
  }
}

export const biasEngine = BiasEngine.getInstance();
