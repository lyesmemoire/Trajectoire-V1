/**
 * Contradiction Engine - Layer 0 Kernel
 * Moteur de contradiction selon les spécifications HIIOS v4.0
 */

import {
  Contradiction,
  ContradictionType,
  ContradictionSeverity,
  ContradictionResolution,
  Hypothesis,
  Evidence,
  HypothesisStatus,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

export class ContradictionEngine {
  private static instance: ContradictionEngine;

  private constructor() {}

  static getInstance(): ContradictionEngine {
    if (!ContradictionEngine.instance) {
      ContradictionEngine.instance = new ContradictionEngine();
    }
    return ContradictionEngine.instance;
  }

  /**
   * Génère automatiquement une contradiction pour une hypothèse
   * Principe fondateur : Le système ne cherche pas une preuve, il cherche la meilleure preuve contraire
   */
  generateContradiction(hypothesis: Hypothesis): Contradiction | null {
    // Générer une question qui pourrait détruire l'hypothèse
    const contradictionQuestion = this.generateContradictionQuestion(hypothesis);

    if (!contradictionQuestion) {
      return null;
    }

    const contradiction: Contradiction = {
      id: `C_${hypothesis.id}_${Date.now()}`,
      hypothesisId: hypothesis.id,
      evidenceId: "",
      type: ContradictionType.IMPLICIT,
      severity: ContradictionSeverity.MEDIUM,
      bayesianImpact: -0.15,
      resolution: ContradictionResolution.PENDING,
    };

    return contradiction;
  }

  /**
   * Génère une question de contradiction pour une hypothèse
   */
  private generateContradictionQuestion(hypothesis: Hypothesis): string | null {
    const skill = hypothesis.skillNode;

    // Générer des questions de contradiction spécifiques au skill
    const contradictionQuestions: Record<string, string[]> = {
      LEADERSHIP: [
        "Racontez-moi une situation où votre équipe a refusé votre décision.",
        "Parlez-moi d'un moment où vous avez dû suivre une décision avec laquelle vous n'étiez pas d'accord.",
        "Décrivez une situation où votre leadership a échoué.",
      ],
      COMMUNICATION: [
        "Racontez-moi une situation où votre communication a créé un malentendu.",
        "Parlez-moi d'un moment où vous n'avez pas réussi à vous faire comprendre.",
        "Décrivez une situation où vous avez dû communiquer une mauvaise nouvelle.",
      ],
      EXECUTION: [
        "Racontez-moi un projet que vous n'avez pas réussi à livrer à temps.",
        "Parlez-moi d'une situation où vous avez dû changer de stratégie en cours de route.",
        "Décrivez un échec dans votre parcours professionnel.",
      ],
      INTELLIGENCE_EMOTIONNELLE: [
        "Racontez-moi une situation où vous avez perdu votre sang-froid.",
        "Parlez-moi d'un moment où vous n'avez pas réussi à gérer vos émotions.",
        "Décrivez une situation où vous avez eu du mal à comprendre les émotions de quelqu'un.",
      ],
    };

    const questions = contradictionQuestions[skill] || [
      "Racontez-moi une situation qui contredirait ce que vous venez de dire.",
    ];

    // Retourner une question aléatoire
    return questions[Math.floor(Math.random() * questions.length)];
  }

  /**
   * Traite la réponse du candidat à une question de contradiction
   */
  processContradictionResponse(
    contradiction: Contradiction,
    response: string,
    hypothesis: Hypothesis
  ): ContradictionResolution {
    // Analyser la réponse
    const responseAnalysis = this.analyzeResponse(response, hypothesis);

    if (responseAnalysis.destroysHypothesis) {
      // La réponse détruit l'hypothèse
      contradiction.resolution = ContradictionResolution.EXPLORED;
      contradiction.severity = ContradictionSeverity.FATAL;
      contradiction.bayesianImpact = -0.50;
      hypothesis.posterior = Math.max(0.01, hypothesis.posterior - 0.50);
      hypothesis.confidence = hypothesis.posterior;
    } else if (responseAnalysis.reinforcesHypothesis) {
      // La réponse renforce l'hypothèse
      contradiction.resolution = ContradictionResolution.EXPLORED;
      contradiction.severity = ContradictionSeverity.LOW;
      contradiction.bayesianImpact = 0.0;
      // Le poids de la preuve est multiplié par 1.4
      hypothesis.evidenceFor.forEach((e) => {
        e.weight = Math.min(0.90, e.weight * 1.4);
      });
    } else {
      // La réponse est ambiguë
      contradiction.resolution = ContradictionResolution.PENDING;
      // Générer une nouvelle question de contradiction
      return ContradictionResolution.PENDING;
    }

    return contradiction.resolution;
  }

  /**
   * Analyse une réponse à une question de contradiction
   */
  private analyzeResponse(
    response: string,
    hypothesis: Hypothesis
  ): { destroysHypothesis: boolean; reinforcesHypothesis: boolean } {
    const responseLower = response.toLowerCase();

    // Mots-clés de destruction
    const destructionKeywords = [
      "non",
      "jamais",
      "pas du tout",
      "c'est faux",
      "je n'ai pas",
      "échec",
      "refusé",
      "impossible",
    ];

    // Mots-clés de renforcement
    const reinforcementKeywords = [
      "oui",
      "c'est vrai",
      "effectivement",
      "j'ai réussi",
      "j'ai assumé",
      "j'ai géré",
      "j'ai surmonté",
    ];

    const hasDestruction = destructionKeywords.some((keyword) =>
      responseLower.includes(keyword)
    );
    const hasReinforcement = reinforcementKeywords.some((keyword) =>
      responseLower.includes(keyword)
    );

    if (hasDestruction && !hasReinforcement) {
      return { destroysHypothesis: true, reinforcesHypothesis: false };
    } else if (hasReinforcement && !hasDestruction) {
      return { destroysHypothesis: false, reinforcesHypothesis: true };
    }

    return { destroysHypothesis: false, reinforcesHypothesis: false };
  }

  /**
   * Détecte une contradiction dans une preuve
   */
  detectContradictionInEvidence(
    evidence: Evidence,
    hypothesis: Hypothesis
  ): Contradiction | null {
    // Vérifier si la preuve contredit l'hypothèse
    if (evidence.direction === "INFIRMS") {
      const contradiction: Contradiction = {
        id: `C_${hypothesis.id}_${evidence.id}`,
        hypothesisId: hypothesis.id,
        evidenceId: evidence.id,
        type: ContradictionType.DIRECT,
        severity: this.determineSeverity(evidence.weight),
        bayesianImpact: -evidence.weight,
        resolution: ContradictionResolution.PENDING,
      };

      return contradiction;
    }

    return null;
  }

  /**
   * Détecte une rupture de pattern
   */
  detectPatternBreak(
    previousEvidences: Evidence[],
    newEvidence: Evidence
  ): Contradiction | null {
    // Vérifier si la nouvelle preuve rompt le pattern
    if (previousEvidences.length < 2) {
      return null;
    }

    const allConfirm = previousEvidences.every((e) => e.direction === "CONFIRMS");
    const newInfirm = newEvidence.direction === "INFIRMS";

    if (allConfirm && newInfirm) {
      const contradiction: Contradiction = {
        id: `C_pattern_${Date.now()}`,
        hypothesisId: "",
        evidenceId: newEvidence.id,
        type: ContradictionType.PATTERN_BREAK,
        severity: ContradictionSeverity.HIGH,
        bayesianImpact: -0.25,
        resolution: ContradictionResolution.PENDING,
      };

      return contradiction;
    }

    return null;
  }

  /**
   * Détermine la sévérité d'une contradiction
   */
  private determineSeverity(evidenceWeight: number): ContradictionSeverity {
    if (evidenceWeight >= 0.70) {
      return ContradictionSeverity.FATAL;
    } else if (evidenceWeight >= 0.50) {
      return ContradictionSeverity.HIGH;
    } else if (evidenceWeight >= 0.30) {
      return ContradictionSeverity.MEDIUM;
    } else {
      return ContradictionSeverity.LOW;
    }
  }

  /**
   * Résout une contradiction
   */
  resolveContradiction(
    contradiction: Contradiction,
    resolution: ContradictionResolution
  ): void {
    contradiction.resolution = resolution;
  }

  /**
   * Explique une contradiction
   */
  explainContradiction(contradiction: Contradiction): string {
    let explanation = `CONTRADICTION ${contradiction.id}\n`;
    explanation += `Type : ${contradiction.type}\n`;
    explanation += `Sévérité : ${contradiction.severity}\n`;
    explanation += `Impact bayésien : ${(contradiction.bayesianImpact * 100).toFixed(1)}%\n`;
    explanation += `Résolution : ${contradiction.resolution}\n`;

    return explanation;
  }

  /**
   * Filtre les contradictions par sévérité
   */
  filterBySeverity(
    contradictions: Contradiction[],
    severity: ContradictionSeverity
  ): Contradiction[] {
    return contradictions.filter((c) => c.severity === severity);
  }

  /**
   * Filtre les contradictions non résolues
   */
  getUnresolvedContradictions(contradictions: Contradiction[]): Contradiction[] {
    return contradictions.filter((c) => c.resolution === ContradictionResolution.PENDING);
  }

  /**
   * Filtre les contradictions fatales
   */
  getFatalContradictions(contradictions: Contradiction[]): Contradiction[] {
    return this.filterBySeverity(contradictions, ContradictionSeverity.FATAL);
  }

  /**
   * Calcule l'impact total des contradictions
   */
  calculateTotalImpact(contradictions: Contradiction[]): number {
    return contradictions.reduce((total, c) => total + c.bayesianImpact, 0);
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
      prior: 0.50,
      posterior: 0.50,
      evidenceFor: [],
      evidenceAgainst: [],
      contradictions: [],
      openQuestions: [],
      createdAtTurn: 1,
      lastUpdated: 1,
      confidence: 0.50,
    };

    // Générer une contradiction
    const contradiction = this.generateContradiction(hypothesis);

    if (contradiction) {
      logInfo(`Contradiction générée : ${contradiction.id}`);
      logInfo(`Sévérité : ${contradiction.severity}`);
      logInfo(`Impact : ${(contradiction.bayesianImpact * 100).toFixed(1)}%`);

      // Simuler une réponse qui détruit l'hypothèse
      const response = "Non, je n'ai jamais assumé une décision sous pression.";
      const resolution = this.processContradictionResponse(
        contradiction,
        response,
        hypothesis
      );

      logInfo(`Résolution : ${resolution}`);
      logInfo(`Posterior après : ${(hypothesis.posterior * 100).toFixed(0)}%`);
    }
  }
}

export const contradictionEngine = ContradictionEngine.getInstance();
