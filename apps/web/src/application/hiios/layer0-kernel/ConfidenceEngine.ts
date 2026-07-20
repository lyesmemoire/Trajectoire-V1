/**
 * Confidence Engine - Layer 0 Kernel
 * Moteur de confiance selon les spécifications HIIOS v4.0
 */

import {
  Hypothesis,
  ConfidenceLevel,
  getConfidenceLevel,
  HypothesisStatus,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

export class ConfidenceEngine {
  private static instance: ConfidenceEngine;

  private constructor() {}

  static getInstance(): ConfidenceEngine {
    if (!ConfidenceEngine.instance) {
      ConfidenceEngine.instance = new ConfidenceEngine();
    }
    return ConfidenceEngine.instance;
  }

  /**
   * Calcule la confiance d'une hypothèse
   * Règle : La confiance est un calcul, jamais une impression
   */
  calculateConfidence(hypothesis: Hypothesis): number {
    // La confiance est égale au posterior
    return hypothesis.posterior;
  }

  /**
   * Détermine le niveau de confiance d'une hypothèse
   * Selon les règles HIIOS v4.0
   */
  getConfidenceLevel(hypothesis: Hypothesis): ConfidenceLevel {
    return getConfidenceLevel(hypothesis.confidence);
  }

  /**
   * Vérifie si une conclusion est possible
   * Selon les règles HIIOS v4.0
   */
  canConclude(hypothesis: Hypothesis): boolean {
    const level = this.getConfidenceLevel(hypothesis);

    // TRÈS FAIBLE [0.00 — 0.39] : Interdiction de conclure
    if (level === ConfidenceLevel.VERY_LOW) {
      return false;
    }

    // FAIBLE [0.40 — 0.59] : Interdiction de conclure
    if (level === ConfidenceLevel.LOW) {
      return false;
    }

    // MODÉRÉE [0.60 — 0.74] : Interdiction de conclure
    if (level === ConfidenceLevel.MODERATE) {
      return false;
    }

    // ÉLEVÉE [0.75 — 0.89] : Conclusion possible
    if (level === ConfidenceLevel.HIGH) {
      return true;
    }

    // TRÈS ÉLEVÉE [0.90 — 1.00] : Conclusion possible
    if (level === ConfidenceLevel.VERY_HIGH) {
      return true;
    }

    return false;
  }

  /**
   * Génère les informations manquantes pour une hypothèse
   * Selon les règles HIIOS v4.0
   */
  identifyMissingInformation(hypothesis: Hypothesis): string[] {
    const level = this.getConfidenceLevel(hypothesis);
    const missing: string[] = [];

    // FAIBLE [0.40 — 0.59] : Identifier les informations manquantes
    if (level === ConfidenceLevel.LOW) {
      if (hypothesis.evidenceFor.length < 2) {
        missing.push("Besoin de plus de preuves convergentes");
      }
      if (hypothesis.evidenceAgainst.length === 0) {
        missing.push("Besoin de tester contre des preuves contraires");
      }
    }

    // MODÉRÉE [0.60 — 0.74] : Activer le Contradiction Engine
    if (level === ConfidenceLevel.MODERATE) {
      if (hypothesis.contradictions.length === 0) {
        missing.push("Besoin de tester sous contradiction");
      }
    }

    return missing;
  }

  /**
   * Génère une question de réduction d'incertitude
   * Selon les règles HIIOS v4.0
   */
  generateUncertaintyReductionQuestion(hypothesis: Hypothesis): string {
    const level = this.getConfidenceLevel(hypothesis);

    if (level === ConfidenceLevel.LOW) {
      return `Pouvez-vous me donner un autre exemple de ${hypothesis.skillNode.toLowerCase()} ?`;
    }

    if (level === ConfidenceLevel.MODERATE) {
      return `Y a-t-il des situations où votre ${hypothesis.skillNode.toLowerCase()} a été moins efficace ?`;
    }

    return "Pouvez-vous me donner plus de détails ?";
  }

  /**
   * Nomme les zones résiduelles d'incertitude
   * Selon les règles HIIOS v4.0
   */
  identifyResidualUncertainty(hypothesis: Hypothesis): string[] {
    const uncertainty: string[] = [];

    // Toujours nommer l'incertitude résiduelle
    if (hypothesis.confidence < 1.00) {
      uncertainty.push(
        `Confidence à ${(hypothesis.confidence * 100).toFixed(1)}% - Incertitude résiduelle de ${((1 - hypothesis.confidence) * 100).toFixed(1)}%`
      );
    }

    // Identifier les domaines non testés
    if (hypothesis.contradictions.length === 0) {
      uncertainty.push("Non testé sous contradiction");
    }

    // Identifier les contextes non explorés
    if (hypothesis.evidenceFor.length < 3) {
      uncertainty.push("Preuves insuffisantes pour une conclusion définitive");
    }

    return uncertainty;
  }

  /**
   * Vérifie si une hypothèse peut atteindre un niveau de confiance très élevé
   * Règle : Interdit sans 5+ preuves indépendantes + 2+ contradictions échouées
   */
  canReachVeryHigh(hypothesis: Hypothesis): boolean {
    // Minimum 5 preuves indépendantes
    if (hypothesis.evidenceFor.length < 5) {
      return false;
    }

    // Minimum 2 contradictions échouées (c'est-à-dire qui ont renforcé l'hypothèse)
    const failedContradictions = hypothesis.contradictions.filter(
      (c) => c.resolution === "EXPLORED" && c.bayesianImpact >= 0
    );

    if (failedContradictions.length < 2) {
      return false;
    }

    return true;
  }

  /**
   * Applique la règle : Jamais 1.00
   */
  enforceMaximumConfidence(hypothesis: Hypothesis): void {
    // Jamais 1.00. Jamais.
    if (hypothesis.confidence >= 0.99) {
      hypothesis.confidence = 0.99;
      hypothesis.posterior = 0.99;
    }
  }

  /**
   * Applique la règle : L'incertitude résiduelle est toujours honnête
   */
  ensureHonestUncertainty(hypothesis: Hypothesis): void {
    // Si une hypothèse n'a pas assez de preuves, réduire la confiance
    if (hypothesis.evidenceFor.length < 2 && hypothesis.confidence > 0.60) {
      hypothesis.confidence = 0.60;
      hypothesis.posterior = 0.60;
    }

    // Si une hypothèse n'a pas été testée sous contradiction, réduire la confiance
    if (hypothesis.contradictions.length === 0 && hypothesis.confidence > 0.75) {
      hypothesis.confidence = 0.75;
      hypothesis.posterior = 0.75;
    }
  }

  /**
   * Calcule la confiance moyenne d'un groupe d'hypothèses
   */
  calculateAverageConfidence(hypotheses: Hypothesis[]): number {
    if (hypotheses.length === 0) {
      return 0;
    }

    const total = hypotheses.reduce((sum, h) => sum + h.confidence, 0);
    return parseFloat((total / hypotheses.length).toFixed(2));
  }

  /**
   * Identifie l'hypothèse la plus confidente
   */
  getMostConfidentHypothesis(hypotheses: Hypothesis[]): Hypothesis | null {
    if (hypotheses.length === 0) {
      return null;
    }

    return hypotheses.reduce((max, h) => (h.confidence > max.confidence ? h : max));
  }

  /**
   * Filtre les hypothèses par niveau de confiance
   */
  filterByConfidenceLevel(
    hypotheses: Hypothesis[],
    level: ConfidenceLevel
  ): Hypothesis[] {
    return hypotheses.filter((h) => this.getConfidenceLevel(h) === level);
  }

  /**
   * Filtre les hypothèses conclues
   */
  getConcludableHypotheses(hypotheses: Hypothesis[]): Hypothesis[] {
    return hypotheses.filter((h) => this.canConclude(h));
  }

  /**
   * Filtre les hypothèses non conclues
   */
  getNonConcludableHypotheses(hypotheses: Hypothesis[]): Hypothesis[] {
    return hypotheses.filter((h) => !this.canConclude(h));
  }

  /**
   * Explique le niveau de confiance d'une hypothèse
   */
  explainConfidenceLevel(hypothesis: Hypothesis): string {
    const level = this.getConfidenceLevel(hypothesis);
    const confidence = (hypothesis.confidence * 100).toFixed(1);

    let explanation = `NIVEAU DE CONFIANCE : ${level}\n`;
    explanation += `Confidence : ${confidence}%\n\n`;

    switch (level) {
      case ConfidenceLevel.VERY_LOW:
        explanation += `Observation unique. Aucune preuve convergente.\n`;
        explanation += `→ Interdiction de conclure. Exploration obligatoire.`;
        break;
      case ConfidenceLevel.LOW:
        explanation += `Hypothèse active. Preuves partielles.\n`;
        explanation += `→ Identifier les informations manquantes.\n`;
        explanation += `→ Générer une question de réduction d'incertitude.`;
        break;
      case ConfidenceLevel.MODERATE:
        explanation += `Plusieurs observations convergentes.\n`;
        explanation += `→ Activer le Contradiction Engine.\n`;
        explanation += `→ Tester contre au moins une preuve contraire.`;
        break;
      case ConfidenceLevel.HIGH:
        explanation += `Pattern confirmé. Testé sous contradiction.\n`;
        explanation += `→ Conclusion possible.\n`;
        explanation += `→ Nommer les zones résiduelles d'incertitude.`;
        break;
      case ConfidenceLevel.VERY_HIGH:
        explanation += `Pattern fortement confirmé. Testé sous contradiction multiple.\n`;
        explanation += `→ Conclusion possible.\n`;
        explanation += `→ Toujours nommer l'incertitude résiduelle.\n`;
        explanation += `→ Jamais 1.00. Jamais.`;
        break;
    }

    return explanation;
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const hypothesis1: Hypothesis = {
      id: "H_1",
      label: "Leadership fort",
      skillNode: "LEADERSHIP",
      status: HypothesisStatus.ACTIVE,
      prior: 0.30,
      posterior: 0.35,
      evidenceFor: [],
      evidenceAgainst: [],
      contradictions: [],
      openQuestions: [],
      createdAtTurn: 1,
      lastUpdated: 1,
      confidence: 0.35,
    };

    const hypothesis2: Hypothesis = {
      id: "H_2",
      label: "Leadership fort",
      skillNode: "LEADERSHIP",
      status: HypothesisStatus.ACTIVE,
      prior: 0.50,
      posterior: 0.68,
      evidenceFor: [],
      evidenceAgainst: [],
      contradictions: [],
      openQuestions: [],
      createdAtTurn: 1,
      lastUpdated: 1,
      confidence: 0.68,
    };

    const hypothesis3: Hypothesis = {
      id: "H_3",
      label: "Leadership fort",
      skillNode: "LEADERSHIP",
      status: HypothesisStatus.ACTIVE,
      prior: 0.70,
      posterior: 0.78,
      evidenceFor: [],
      evidenceAgainst: [],
      contradictions: [],
      openQuestions: [],
      createdAtTurn: 1,
      lastUpdated: 1,
      confidence: 0.78,
    };

    logInfo("=== Hypothèse 1 ===");
    logInfo(this.explainConfidenceLevel(hypothesis1));
    logInfo(`Peut conclure : ${this.canConclude(hypothesis1)}`);

    logInfo("\n=== Hypothèse 2 ===");
    logInfo(this.explainConfidenceLevel(hypothesis2));
    logInfo(`Peut conclure : ${this.canConclude(hypothesis2)}`);

    logInfo("\n=== Hypothèse 3 ===");
    logInfo(this.explainConfidenceLevel(hypothesis3));
    logInfo(`Peut conclure : ${this.canConclude(hypothesis3)}`);
  }
}

export const confidenceEngine = ConfidenceEngine.getInstance();
