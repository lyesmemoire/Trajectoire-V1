/**
 * Decision Engine - Layer 5
 * Moteur de décision selon les spécifications HIIOS v4.0
 * Produit une décision de recrutement fondée sur des preuves calculées
 */

import {
  Candidate,
  Decision,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// TYPES DE DÉCISION
// ============================================================================

export enum HiringRecommendation {
  HIRE = "HIRE",
  NO_HIRE = "NO_HIRE",
  DEFER = "DEFER",
}

export enum RiskType {
  FALSE_POSITIVE = "FALSE_POSITIVE",
  FALSE_NEGATIVE = "FALSE_NEGATIVE",
  INCOMPLETE_EVIDENCE = "INCOMPLETE_EVIDENCE",
  BIAS_RESIDUAL = "BIAS_RESIDUAL",
}

export enum RiskSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface DecisionOutput {
  recommendation: HiringRecommendation;
  confidence: number;
  probabilityOfSuccess: number;
  probabilityOfError: number;
  evidenceCoverage: number;
  remainingUncertainty: number;
  riskMatrix: Map<RiskType, RiskSeverity>;
  strongSignals: string[];
  weakSignals: string[];
  unexploredZones: string[];
  resolvedBiases: string[];
  reasoning: string;
}

export class DecisionEngine {
  private static instance: DecisionEngine;

  private constructor() {}

  static getInstance(): DecisionEngine {
    if (!DecisionEngine.instance) {
      DecisionEngine.instance = new DecisionEngine();
    }
    return DecisionEngine.instance;
  }

  /**
   * Génère une décision de recrutement selon les spécifications HIIOS v4.0
   * Règle : La décision finale est impossible si un BIAS_EVENT reste unresolved
   */
  generateDecision(candidate: Candidate): DecisionOutput | null {
    // Vérifier que tous les biais sont résolus
    const biasEvents = candidate.currentInterview.biasLog;
    const unresolvedBiases = biasEvents.filter((b) => !b.resolved);

    if (unresolvedBiases.length > 0) {
      return null;
    }

    // VARIABLES D'ENTRÉE (lues depuis le Kernel)
    const posteriors = candidate.currentInterview.activeHypotheses.map((h) => h.posterior);
    const evidenceStore = candidate.currentInterview.evidenceStore;
    const contradictionLog = candidate.currentInterview.contradictionLog;
    const biasLog = candidate.currentInterview.biasLog;
    const skillGraph = candidate.skillGraph;
    const openQuestions = candidate.history.openQuestions;

    // OUTPUTS CALCULÉS
    const recommendation = this.calculateRecommendation(candidate);
    const confidence = this.calculateConfidence(candidate);
    const probabilityOfSuccess = this.calculateProbabilityOfSuccess(candidate);
    const probabilityOfError = this.calculateProbabilityOfError(candidate);
    const evidenceCoverage = this.calculateEvidenceCoverage(candidate);
    const remainingUncertainty = 1 - evidenceCoverage;
    const riskMatrix = this.calculateRiskMatrix(candidate);
    const strongSignals = this.extractStrongSignals(candidate);
    const weakSignals = this.extractWeakSignals(candidate);
    const unexploredZones = this.identifyUnexploredZones(candidate);
    const resolvedBiases = this.extractResolvedBiases(candidate);
    const reasoning = this.generateReasoning(candidate, recommendation, confidence, strongSignals, weakSignals, unexploredZones);

    return {
      recommendation,
      confidence,
      probabilityOfSuccess,
      probabilityOfError,
      evidenceCoverage,
      remainingUncertainty,
      riskMatrix,
      strongSignals,
      weakSignals,
      unexploredZones,
      resolvedBiases,
      reasoning,
    };
  }

  /**
   * Calcule la recommandation de recrutement
   */
  private calculateRecommendation(candidate: Candidate): HiringRecommendation {
    const overallScore = this.calculateOverallScore(candidate);

    if (overallScore >= 0.75) {
      return HiringRecommendation.HIRE;
    } else if (overallScore >= 0.50) {
      return HiringRecommendation.DEFER;
    } else {
      return HiringRecommendation.NO_HIRE;
    }
  }

  /**
   * Calcule le score global d'un candidat
   */
  private calculateOverallScore(candidate: Candidate): number {
    const nodes = Array.from(candidate.skillGraph.nodes.values());
    if (nodes.length === 0) {
      return 0;
    }

    const weightedSum = nodes.reduce((sum, node) => sum + node.confidence * node.weight, 0);
    const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);

    return parseFloat((weightedSum / totalWeight).toFixed(2));
  }

  /**
   * Calcule la confiance de la décision
   */
  private calculateConfidence(candidate: Candidate): number {
    const evidenceCount = candidate.currentInterview.evidenceStore.length;
    const hypothesisCount = candidate.currentInterview.activeHypotheses.length;
    const contradictionCount = candidate.currentInterview.contradictionLog.length;

    // Plus de preuves et d'hypothèses = plus de confiance
    let confidence = 0.5;
    confidence += Math.min(0.3, evidenceCount * 0.03);
    confidence += Math.min(0.2, hypothesisCount * 0.04);
    confidence += Math.min(0.1, contradictionCount * 0.05);

    return parseFloat(Math.min(1.0, confidence).toFixed(2));
  }

  /**
   * Calcule la probabilité de succès à 12 mois
   */
  private calculateProbabilityOfSuccess(candidate: Candidate): number {
    const overallScore = this.calculateOverallScore(candidate);
    const confidence = this.calculateConfidence(candidate);

    // Probabilité de succès basée sur le score global et la confiance
    const probability = (overallScore * 0.7) + (confidence * 0.3);

    return parseFloat(probability.toFixed(2));
  }

  /**
   * Calcule la probabilité d'erreur (faux positif + faux négatif)
   */
  private calculateProbabilityOfError(candidate: Candidate): number {
    const confidence = this.calculateConfidence(candidate);
    const evidenceCoverage = this.calculateEvidenceCoverage(candidate);

    // Plus de confiance et de couverture = moins d'erreur
    const errorProbability = (1 - confidence) * 0.5 + (1 - evidenceCoverage) * 0.5;

    return parseFloat(errorProbability.toFixed(2));
  }

  /**
   * Calcule la couverture de preuves (% du Skill Graph couvert)
   */
  private calculateEvidenceCoverage(candidate: Candidate): number {
    const skillNodes = candidate.skillGraph.nodes.size;
    const evidenceCount = candidate.currentInterview.evidenceStore.length;

    if (skillNodes === 0) {
      return 0;
    }

    // Estimation : chaque preuve couvre une compétence
    const coverage = Math.min(1.0, evidenceCount / skillNodes);

    return parseFloat(coverage.toFixed(2));
  }

  /**
   * Calcule la matrice de risques
   */
  private calculateRiskMatrix(candidate: Candidate): Map<RiskType, RiskSeverity> {
    const riskMatrix = new Map<RiskType, RiskSeverity>();

    const confidence = this.calculateConfidence(candidate);
    const evidenceCoverage = this.calculateEvidenceCoverage(candidate);

    // Risque de faux positif
    if (confidence < 0.70) {
      riskMatrix.set(RiskType.FALSE_POSITIVE, RiskSeverity.HIGH);
    } else if (confidence < 0.85) {
      riskMatrix.set(RiskType.FALSE_POSITIVE, RiskSeverity.MEDIUM);
    } else {
      riskMatrix.set(RiskType.FALSE_POSITIVE, RiskSeverity.LOW);
    }

    // Risque de faux négatif
    if (evidenceCoverage < 0.70) {
      riskMatrix.set(RiskType.FALSE_NEGATIVE, RiskSeverity.HIGH);
    } else if (evidenceCoverage < 0.85) {
      riskMatrix.set(RiskType.FALSE_NEGATIVE, RiskSeverity.MEDIUM);
    } else {
      riskMatrix.set(RiskType.FALSE_NEGATIVE, RiskSeverity.LOW);
    }

    // Risque de preuves incomplètes
    if (evidenceCoverage < 0.80) {
      riskMatrix.set(RiskType.INCOMPLETE_EVIDENCE, RiskSeverity.HIGH);
    } else if (evidenceCoverage < 0.90) {
      riskMatrix.set(RiskType.INCOMPLETE_EVIDENCE, RiskSeverity.MEDIUM);
    } else {
      riskMatrix.set(RiskType.INCOMPLETE_EVIDENCE, RiskSeverity.LOW);
    }

    // Risque de biais résiduel
    const biasLog = candidate.currentInterview.biasLog;
    if (biasLog.length > 0) {
      riskMatrix.set(RiskType.BIAS_RESIDUAL, RiskSeverity.MEDIUM);
    } else {
      riskMatrix.set(RiskType.BIAS_RESIDUAL, RiskSeverity.LOW);
    }

    return riskMatrix;
  }

  /**
   * Extrait les signaux forts
   */
  private extractStrongSignals(candidate: Candidate): string[] {
    const strongSignals: string[] = [];

    // Preuves avec poids élevé
    candidate.currentInterview.evidenceStore.forEach((e) => {
      if (e.weight >= 0.70) {
        strongSignals.push(`[Citation exacte · Poids ${e.weight.toFixed(2)} · Tour ${e.turn} · État ${e.context} · ${e.reliability}]`);
      }
    });

    // Hypothèses confirmées sous contradiction
    candidate.currentInterview.activeHypotheses.forEach((h) => {
      if (h.confidence >= 0.70 && h.contradictions.length > 0) {
        strongSignals.push(`[Pattern · Poids ${h.confidence.toFixed(2)} · confirmé sous contradiction]`);
      }
    });

    return strongSignals;
  }

  /**
   * Extrait les signaux faibles
   */
  private extractWeakSignals(candidate: Candidate): string[] {
    const weakSignals: string[] = [];

    // Preuves avec poids faible
    candidate.currentInterview.evidenceStore.forEach((e) => {
      if (e.weight < 0.50) {
        weakSignals.push(`[Observation · Poids ${e.weight.toFixed(2)} · Tour ${e.turn} · ${e.reliability} · non confirmée]`);
      }
    });

    // Absences notables
    const skillNodes = candidate.skillGraph.nodes.size;
    const evidenceCount = candidate.currentInterview.evidenceStore.length;
    if (evidenceCount < skillNodes) {
      weakSignals.push(`[Absence · Poids 0.25 · sujet non abordé · MEDIUM incertitude]`);
    }

    return weakSignals;
  }

  /**
   * Identifie les zones non explorées
   */
  private identifyUnexploredZones(candidate: Candidate): string[] {
    const unexploredZones: string[] = [];

    candidate.skillGraph.nodes.forEach((node, skill) => {
      const hasEvidence = candidate.currentInterview.evidenceStore.some(
        (e) => e.skillsImpacted.includes(skill)
      );

      if (!hasEvidence) {
        const impact = node.confidence >= 0.70 ? "HIGH" : node.confidence >= 0.50 ? "MEDIUM" : "LOW";
        unexploredZones.push(`[Compétence ${skill} · Impact estimé : ${impact} · Raison : non exploré]`);
      }
    });

    return unexploredZones;
  }

  /**
   * Extrait les biais résolus
   */
  private extractResolvedBiases(candidate: Candidate): string[] {
    const resolvedBiases: string[] = [];

    candidate.currentInterview.biasLog.forEach((b) => {
      if (b.resolved) {
        resolvedBiases.push(`${b.biasType} · Tour ${b.turn} · Pénalité -${(b.confidencePenalty * 100).toFixed(2)} · Question corrective posée`);
      }
    });

    return resolvedBiases;
  }

  /**
   * Génère le raisonnement de la décision
   */
  private generateReasoning(
    candidate: Candidate,
    recommendation: HiringRecommendation,
    confidence: number,
    strongSignals: string[],
    weakSignals: string[],
    unexploredZones: string[]
  ): string {
    let reasoning = `La recommandation ${recommendation} repose sur ${strongSignals.length} preuves fortes convergentes sur `;
    
    const highConfidenceHypotheses = candidate.currentInterview.activeHypotheses.filter(
      (h) => h.confidence >= 0.70
    );

    if (highConfidenceHypotheses.length > 0) {
      reasoning += highConfidenceHypotheses.map((h) => `${h.label} atteint ${h.confidence.toFixed(2)}`).join(" et ");
    } else {
      reasoning += "les compétences principales";
    }

    reasoning += `. `;
    
    const contradictions = highConfidenceHypotheses.filter((h) => h.contradictions.length > 0);
    if (contradictions.length > 0) {
      reasoning += `Ces hypothèses ont été confirmées après ${contradictions.length} contradictions échouées. `;
    }

    const evidenceCoverage = this.calculateEvidenceCoverage(candidate);
    reasoning += `L'incertitude résiduelle de ${((1 - evidenceCoverage) * 100).toFixed(0)}% porte sur `;
    
    if (unexploredZones.length > 0) {
      reasoning += unexploredZones.map((z) => z.split("·")[1].trim()).join(", ");
      reasoning += " non exploré";
      if (unexploredZones.length > 1) {
        reasoning += "s";
      }
    } else {
      reasoning += "aucune zone spécifique";
    }

    reasoning += `. `;

    if (recommendation === HiringRecommendation.HIRE) {
      reasoning += "Ce risque est acceptable pour ce poste.";
    } else if (recommendation === HiringRecommendation.DEFER) {
      reasoning += "Un complément d'information est recommandé.";
    } else {
      reasoning += "Ce profil ne correspond pas aux exigences du poste.";
    }

    return reasoning;
  }

  /**
   * Génère le format de décision finale ASCII
   */
  generateFormattedDecision(output: DecisionOutput): string {
    let decision = "";
    decision += "╔══════════════════════════════════════════════════════════════════════════╗\n";
    decision += "║  DÉCISION TRAJECTOIRE                                                   ║\n";
    decision += "╠══════════════════════════════════════════════════════════════════════════╣\n";
    decision += "║                                                                          ║\n";
    decision += `║  RECOMMANDATION       : ${output.recommendation.padEnd(30)} ║\n`;
    decision += `║  CONFIANCE            : ${(output.confidence * 100).toFixed(0)}%${" ".repeat(23)} ║\n`;
    decision += `║  PROBABILITÉ SUCCÈS   : ${(output.probabilityOfSuccess * 100).toFixed(0)}%${" ".repeat(23)} ║\n`;
    decision += `║  RISQUE FAUX POSITIF  : ${(output.probabilityOfError * 100).toFixed(0)}%${" ".repeat(23)} ║\n`;
    decision += `║  RISQUE FAUX NÉGATIF  : ${(output.probabilityOfError * 100).toFixed(0)}%${" ".repeat(23)} ║\n`;
    decision += `║  EVIDENCE COVERAGE    : ${(output.evidenceCoverage * 100).toFixed(0)}%${" ".repeat(23)} ║\n`;
    decision += `║  INCERTITUDE RÉSIDUELLE: ${(output.remainingUncertainty * 100).toFixed(0)}%${" ".repeat(18)} ║\n`;
    decision += "║                                                                          ║\n";
    decision += "║  SIGNAUX FORTS        :                                                  ║\n";
    output.strongSignals.forEach((signal) => {
      decision += `║  · ${signal.substring(0, 65)}${signal.length > 65 ? "..." : ""}\n`;
    });
    decision += "║                                                                          ║\n";
    decision += "║  SIGNAUX FAIBLES      :                                                  ║\n";
    output.weakSignals.forEach((signal) => {
      decision += `║  · ${signal.substring(0, 65)}${signal.length > 65 ? "..." : ""}\n`;
    });
    decision += "║                                                                          ║\n";
    decision += "║  ZONES NON EXPLORÉES  :                                                  ║\n";
    output.unexploredZones.forEach((zone) => {
      decision += `║  · ${zone.substring(0, 65)}${zone.length > 65 ? "..." : ""}\n`;
    });
    decision += "║                                                                          ║\n";
    decision += "║  BIAIS RÉSOLUS        :                                                  ║\n";
    output.resolvedBiases.forEach((bias) => {
      decision += `║  · ${bias.substring(0, 65)}${bias.length > 65 ? "..." : ""}\n`;
    });
    decision += "║                                                                          ║\n";
    decision += "║  RAISONNEMENT         :                                                  ║\n";
    decision += `║  "${output.reasoning.substring(0, 65)}${output.reasoning.length > 65 ? "..." : ""}"\n`;
    decision += "║                                                                          ║\n";
    decision += "╚══════════════════════════════════════════════════════════════════════════╝\n";

    return decision;
  }

  /**
   * Explique une décision
   */
  explainDecision(decision: Decision): string {
    let explanation = `EXPLICATION DE LA DÉCISION\n\n`;

    explanation += `ID : ${decision.id}\n`;
    explanation += `Candidat : ${decision.candidateId}\n`;
    explanation += `Session : ${decision.sessionId}\n`;
    explanation += `Type : ${decision.type}\n`;
    explanation += `Confidence : ${decision.confidence}\n`;
    explanation += `Score global : ${(decision.overallScore * 100).toFixed(1)}%\n\n`;

    explanation += `SCORES PAR COMPÉTENCE :\n`;
    decision.skillScores.forEach((score, skill) => {
      explanation += `  - ${skill} : ${(score * 100).toFixed(1)}%\n`;
    });

    explanation += `\nRAISONNEMENT :\n${decision.reasoning}`;

    return explanation;
  }

  /**
   * Compare deux décisions
   */
  compareDecisions(decision1: Decision, decision2: Decision): string {
    let comparison = `COMPARAISON DE DÉCISIONS\n\n`;

    comparison += `DÉCISION 1 : ${decision1.type} (${(decision1.overallScore * 100).toFixed(1)}%)\n`;
    comparison += `DÉCISION 2 : ${decision2.type} (${(decision2.overallScore * 100).toFixed(1)}%)\n\n`;

    const scoreDiff = decision2.overallScore - decision1.overallScore;
    const diffPercent = (scoreDiff * 100).toFixed(1);
    const sign = scoreDiff >= 0 ? "+" : "";

    comparison += `Différence de score : ${sign}${diffPercent}%\n\n`;

    comparison += `COMPARAISON PAR COMPÉTENCE :\n`;
    decision1.skillScores.forEach((score1: number, skill: string) => {
      const score2 = decision2.skillScores.get(skill) || 0;
      const diff = score2 - score1;
      const diffPercent = (diff * 100).toFixed(1);
      const sign = diff >= 0 ? "+" : "";
      comparison += `  - ${skill} : ${(score1 * 100).toFixed(0)}% vs ${(score2 * 100).toFixed(0)}% (${sign}${diffPercent}%)\n`;
    });

    return comparison;
  }

  /**
   * Vérifie si une décision peut être prise
   */
  canMakeDecision(candidate: Candidate): boolean {
    // Vérifier que tous les biais sont résolus
    const biasEvents = candidate.currentInterview.biasLog;
    const unresolvedBiases = biasEvents.filter((b) => !b.resolved);

    if (unresolvedBiases.length > 0) {
      return false;
    }

    // Vérifier qu'il y a suffisamment de preuves
    if (candidate.currentInterview.evidenceStore.length < 5) {
      return false;
    }

    // Vérifier qu'il y a des hypothèses actives
    if (candidate.currentInterview.activeHypotheses.length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Identifie les facteurs bloquants pour la décision
   */
  identifyBlockingFactors(candidate: Candidate): string[] {
    const factors: string[] = [];

    // Vérifier les biais
    const biasEvents = candidate.currentInterview.biasLog;
    const unresolvedBiases = biasEvents.filter((b) => !b.resolved);

    if (unresolvedBiases.length > 0) {
      factors.push(`${unresolvedBiases.length} biais non résolus`);
    }

    // Vérifier les preuves
    if (candidate.currentInterview.evidenceStore.length < 5) {
      factors.push(`Preuves insuffisantes (${candidate.currentInterview.evidenceStore.length}/5)`);
    }

    // Vérifier les hypothèses
    if (candidate.currentInterview.activeHypotheses.length === 0) {
      factors.push("Aucune hypothèse active");
    }

    return factors;
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const candidate: Candidate = {
      id: "CAND_001",
      sessionId: "SESSION_001",
      createdAt: Date.now(),
      history: {
        interviews: [],
        totalTurns: 0,
        resolvedQuestions: [],
        openQuestions: [],
        abandonedHypotheses: [],
      },
      currentInterview: {
        state: "SYNTHESIS",
        currentTopic: "CONCLUSION",
        currentTurn: 10,
        timeline: [],
        activeHypotheses: [],
        evidenceStore: [],
        contradictionLog: [],
        biasLog: [],
        confidenceMap: new Map(),
      },
      archetype: {
        id: "ARCH_LEADER_EXECUTOR",
        name: "Leader Exécuteur",
        description: "Profil fort en leadership et exécution",
        baseRates: new Map([
          ["LEADERSHIP", 0.75],
          ["EXECUTION", 0.75],
          ["COMMUNICATION", 0.60],
          ["INTELLIGENCE_EMOTIONNELLE", 0.55],
        ]),
      },
      skillGraph: {
        nodes: new Map([
          ["LEADERSHIP", {
            id: "LEADERSHIP",
            name: "Leadership",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.80,
          }],
          ["EXECUTION", {
            id: "EXECUTION",
            name: "Exécution",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.85,
          }],
          ["COMMUNICATION", {
            id: "COMMUNICATION",
            name: "Communication",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.65,
          }],
          ["INTELLIGENCE_EMOTIONNELLE", {
            id: "INTELLIGENCE_EMOTIONNELLE",
            name: "Intelligence Émotionnelle",
            parent: undefined,
            children: [],
            weight: 1.0,
            confidence: 0.60,
          }],
        ]),
        edges: new Map(),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    logInfo("=== Peut prendre une décision ===");
    logInfo(this.canMakeDecision(candidate) ? "Oui" : "Non");

    const decision = this.generateDecision(candidate);

    if (decision) {
      logInfo("\n=== Décision générée ===");
      logInfo(`Recommandation : ${decision.recommendation}`);
      logInfo(`Confidence : ${(decision.confidence * 100).toFixed(0)}%`);
      logInfo(`Probabilité de succès : ${(decision.probabilityOfSuccess * 100).toFixed(0)}%`);
      logInfo(`Probabilité d'erreur : ${(decision.probabilityOfError * 100).toFixed(0)}%`);
      logInfo(`Evidence Coverage : ${(decision.evidenceCoverage * 100).toFixed(0)}%`);
      logInfo(`Incertitude résiduelle : ${(decision.remainingUncertainty * 100).toFixed(0)}%`);

      logInfo("\n=== Format de décision ASCII ===");
      logInfo(this.generateFormattedDecision(decision));
    } else {
      logInfo("\n=== Facteurs bloquants ===");
      logInfo(this.identifyBlockingFactors(candidate).join("\n"));
    }
  }
}

export const decisionEngine = DecisionEngine.getInstance();
