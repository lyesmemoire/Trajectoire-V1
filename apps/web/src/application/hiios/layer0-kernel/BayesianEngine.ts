/**
 * Bayesian Engine - Layer 0 Kernel
 * Moteur probabiliste bayésien selon les spécifications HIIOS v4.0
 */

import {
  Hypothesis,
  Evidence,
  Contradiction,
  BiasEvent,
  BiasType,
  HypothesisStatus,
  EvidenceType,
  EvidenceReliability,
  EvidenceDirection,
  ContradictionType,
  ContradictionSeverity,
  ContradictionResolution,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

export class BayesianEngine {
  private static instance: BayesianEngine;

  private constructor() {}

  static getInstance(): BayesianEngine {
    if (!BayesianEngine.instance) {
      BayesianEngine.instance = new BayesianEngine();
    }
    return BayesianEngine.instance;
  }

  /**
   * Calcule le posterior selon la formule bayésienne
   * P(H|E) = P(E|H) × P(H) / P(E)
   */
  calculatePosterior(
    prior: number,
    likelihood: number,
    evidenceProbability: number
  ): number {
    if (evidenceProbability === 0) {
      return prior; // Éviter la division par zéro
    }

    const posterior = (likelihood * prior) / evidenceProbability;

    // S'assurer que le posterior est entre 0 et 1
    return Math.max(0, Math.min(1, posterior));
  }

  /**
   * Met à jour la confiance d'une hypothèse avec une nouvelle preuve
   * Selon les règles HIIOS v4.0
   */
  updateHypothesisConfidence(
    hypothesis: Hypothesis,
    evidence: Evidence,
    contradiction?: Contradiction,
    biasEvent?: BiasEvent
  ): number {
    let posterior = hypothesis.posterior;

    // Appliquer la preuve
    if (evidence.direction === "CONFIRMS") {
      // Calculer le likelihood basé sur le poids de la preuve
      const likelihood = 1.0 + (evidence.weight * 0.5);
      const evidenceProbability = 1.0 + (evidence.weight * 0.3);
      
      posterior = this.calculatePosterior(
        posterior,
        likelihood,
        evidenceProbability
      );

      // Ajouter la preuve à la liste des preuves pour
      hypothesis.evidenceFor.push(evidence);
    } else if (evidence.direction === "INFIRMS") {
      // Calculer le likelihood pour une preuve contraire
      const likelihood = 1.0 - (evidence.weight * 0.5);
      const evidenceProbability = 1.0 - (evidence.weight * 0.3);
      
      posterior = this.calculatePosterior(
        posterior,
        likelihood,
        evidenceProbability
      );

      // Ajouter la preuve à la liste des preuves contre
      hypothesis.evidenceAgainst.push(evidence);
    }

    // Appliquer la contradiction si présente
    if (contradiction) {
      posterior = posterior + contradiction.bayesianImpact;
      hypothesis.contradictions.push(contradiction);
    }

    // Appliquer la pénalité de biais si présente
    if (biasEvent && !biasEvent.resolved) {
      posterior = posterior - biasEvent.confidencePenalty;
    }

    // Appliquer la règle : aucun posterior ne peut atteindre 1.00
    posterior = Math.min(0.99, posterior);

    // Appliquer la règle : aucun posterior ne peut être inférieur à 0.00
    posterior = Math.max(0.01, posterior);

    // Mettre à jour l'hypothèse
    hypothesis.posterior = posterior;
    hypothesis.confidence = posterior;

    return posterior;
  }

  /**
   * Calcule le likelihood pour une preuve donnée
   * Basé sur le type de preuve et sa fiabilité
   */
  calculateLikelihood(evidence: Evidence): number {
    let baseLikelihood = 1.0;

    // Ajuster selon le type de preuve
    switch (evidence.type) {
      case "CITATION":
        baseLikelihood = 1.0 + (evidence.weight * 0.6);
        break;
      case "PATTERN":
        baseLikelihood = 1.0 + (evidence.weight * 0.5);
        break;
      case "BEHAVIOR":
        baseLikelihood = 1.0 + (evidence.weight * 0.4);
        break;
      case "ABSENCE":
        baseLikelihood = 1.0 + (evidence.weight * 0.2);
        break;
    }

    // Ajuster selon la fiabilité
    switch (evidence.reliability) {
      case "HIGH":
        baseLikelihood *= 1.2;
        break;
      case "MEDIUM":
        baseLikelihood *= 1.0;
        break;
      case "LOW":
        baseLikelihood *= 0.8;
        break;
    }

    return baseLikelihood;
  }

  /**
   * Calcule la probabilité de la preuve (normalisation)
   */
  calculateEvidenceProbability(evidence: Evidence): number {
    let baseProbability = 1.0;

    // Ajuster selon le type de preuve
    switch (evidence.type) {
      case "CITATION":
        baseProbability = 1.0 + (evidence.weight * 0.4);
        break;
      case "PATTERN":
        baseProbability = 1.0 + (evidence.weight * 0.35);
        break;
      case "BEHAVIOR":
        baseProbability = 1.0 + (evidence.weight * 0.3);
        break;
      case "ABSENCE":
        baseProbability = 1.0 + (evidence.weight * 0.15);
        break;
    }

    return baseProbability;
  }

  /**
   * Applique la règle : un prior ne peut jamais être supérieur à 0.60
   * sans au moins deux preuves indépendantes convergentes
   */
  validatePrior(hypothesis: Hypothesis): boolean {
    // Si le prior est inférieur ou égal à 0.60, c'est valide
    if (hypothesis.prior <= 0.60) {
      return true;
    }

    // Si le prior est supérieur à 0.60, vérifier qu'il y a au moins
    // deux preuves indépendantes convergentes
    const convergentEvidence = hypothesis.evidenceFor.filter(
      (e) => e.direction === "CONFIRMS" && e.reliability === "HIGH"
    );

    return convergentEvidence.length >= 2;
  }

  /**
   * Calcule l'impact bayésien d'une contradiction
   * Selon les règles HIIOS v4.0
   */
  calculateContradictionImpact(contradiction: Contradiction): number {
    let impact = 0.0;

    switch (contradiction.severity) {
      case "LOW":
        impact = -0.05;
        break;
      case "MEDIUM":
        impact = -0.15;
        break;
      case "HIGH":
        impact = -0.25;
        break;
      case "FATAL":
        impact = -0.50;
        break;
    }

    return impact;
  }

  /**
   * Calcule la pénalité de biais selon le type de biais
   * Selon les règles HIIOS v4.0
   */
  calculateBiasPenalty(biasType: BiasType): number {
    switch (biasType) {
      case BiasType.HALO_EFFECT:
        return -0.15;
      case BiasType.SIMILARITY_BIAS:
        return -0.12;
      case BiasType.CONFIRMATION_BIAS:
        return -0.18;
      case BiasType.ANCHORING:
        return -0.10;
      case BiasType.CONTRAST_EFFECT:
        return -0.08;
      case BiasType.ATTRIBUTION_ERROR:
        return -0.12;
      default:
        return -0.10;
    }
  }

  /**
   * Vérifie si une hypothèse peut être confirmée
   * Selon les règles HIIOS v4.0
   */
  canConfirmHypothesis(hypothesis: Hypothesis): boolean {
    // Posterior doit être ≥ 0.75
    if (hypothesis.posterior < 0.75) {
      return false;
    }

    // Minimum 3 preuves
    if (hypothesis.evidenceFor.length < 3) {
      return false;
    }

    // Biais vérifié (résolu)
    const hasUnresolvedBias = hypothesis.contradictions.some(
      (c) => c.resolution === "UNRESOLVED"
    );

    if (hasUnresolvedBias) {
      return false;
    }

    return true;
  }

  /**
   * Vérifie si une hypothèse peut être infirmée
   * Selon les règles HIIOS v4.0
   */
  canInfirmHypothesis(hypothesis: Hypothesis): boolean {
    // Posterior doit être ≤ 0.20
    if (hypothesis.posterior > 0.20) {
      return false;
    }

    // Au moins une contradiction forte
    const hasStrongContradiction = hypothesis.contradictions.some(
      (c) => c.severity === "HIGH" || c.severity === "FATAL"
    );

    return hasStrongContradiction;
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const hypothesis: Hypothesis = {
      id: "H_lead_17",
      label: "Leadership fort sous pression",
      skillNode: "LEADERSHIP",
      status: HypothesisStatus.ACTIVE,
      prior: 0.45,
      posterior: 0.45,
      evidenceFor: [],
      evidenceAgainst: [],
      contradictions: [],
      openQuestions: [],
      createdAtTurn: 1,
      lastUpdated: 1,
      confidence: 0.45,
    };

    // Evidence 1 : décision assumée sous pression
    const evidence1: Evidence = {
      id: "E_1",
      turn: 3,
      timestamp: Date.now(),
      type: EvidenceType.CITATION,
      rawContent: "J'ai pris la décision malgré l'opposition de l'équipe",
      weight: 0.18,
      reliability: EvidenceReliability.HIGH,
      context: "État 3 - Pression",
      skillsImpacted: ["LEADERSHIP"],
      hypothesesImpacted: ["H_lead_17"],
      direction: EvidenceDirection.CONFIRMS,
      biasCheck: { hasBias: false },
    };

    // Evidence 2 : équipe alignée malgré désaccord
    const evidence2: Evidence = {
      id: "E_2",
      turn: 5,
      timestamp: Date.now(),
      type: EvidenceType.BEHAVIOR,
      rawContent: "L'équipe a suivi ma direction",
      weight: 0.07,
      reliability: EvidenceReliability.MEDIUM,
      context: "État 2 - Exploration",
      skillsImpacted: ["LEADERSHIP"],
      hypothesesImpacted: ["H_lead_17"],
      direction: EvidenceDirection.CONFIRMS,
      biasCheck: { hasBias: false },
    };

    // Contradiction : refus d'assumer un échec d'équipe
    const contradiction: Contradiction = {
      id: "C_1",
      hypothesisId: "H_lead_17",
      evidenceId: "E_3",
      type: ContradictionType.DIRECT,
      severity: ContradictionSeverity.MEDIUM,
      bayesianImpact: -0.15,
      resolution: ContradictionResolution.PENDING,
    };

    // Bias : Halo Effect détecté
    const biasEvent: BiasEvent = {
      id: "B_1",
      turn: 7,
      biasType: BiasType.HALO_EFFECT,
      trigger: "Candidat se concentre uniquement sur les succès",
      affectedHypothesis: "H_lead_17",
      confidencePenalty: -0.05,
      mandatoryAction: "Question de faiblesse sur le point fort détecté",
      resolved: false,
    };

    // Mettre à jour avec evidence1
    this.updateHypothesisConfidence(hypothesis, evidence1);
    logInfo(`Après evidence1: ${hypothesis.posterior.toFixed(2)}`);

    // Mettre à jour avec evidence2
    this.updateHypothesisConfidence(hypothesis, evidence2);
    logInfo(`Après evidence2: ${hypothesis.posterior.toFixed(2)}`);

    // Appliquer la contradiction
    this.updateHypothesisConfidence(hypothesis, evidence2, contradiction);
    logInfo(`Après contradiction: ${hypothesis.posterior.toFixed(2)}`);

    // Appliquer la pénalité de biais
    this.updateHypothesisConfidence(hypothesis, evidence2, contradiction, biasEvent);
    logInfo(`Après biais: ${hypothesis.posterior.toFixed(2)}`);

    // Résultat attendu : 0.50
    logInfo(`Confiance finale : ${(hypothesis.posterior * 100).toFixed(0)}%`);
  }
}

export const bayesianEngine = BayesianEngine.getInstance();
