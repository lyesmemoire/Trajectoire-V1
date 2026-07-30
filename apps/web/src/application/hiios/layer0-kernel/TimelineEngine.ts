
/**
 * Timeline Engine - Layer 0 Kernel
 * Moteur de timeline selon les spécifications HIIOS v4.0
 */

import {
  Turn,
  Evidence,
  Contradiction,
  BiasEvent,
  HypothesisUpdate,
  Observation,
  TechniqueUsed,
  InterviewState,
  EvidenceType,
  EvidenceReliability,
  EvidenceDirection,
  ContradictionType,
  ContradictionSeverity,
  ContradictionResolution,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

export class TimelineEngine {
  private static instance: TimelineEngine;

  private constructor() {}

  static getInstance(): TimelineEngine {
    if (!TimelineEngine.instance) {
      TimelineEngine.instance = new TimelineEngine();
    }
    return TimelineEngine.instance;
  }

  /**
   * Crée un nouveau tour
   */
  createTurn(
    id: number,
    interviewState: InterviewState,
    questionAsked: any,
    candidateResponse: string
  ): Turn {
    const turn: Turn = {
      id,
      timestamp: Date.now(),
      interviewState,
      questionAsked,
      candidateResponse,
      observations: [],
      hypothesesUpdated: [],
      evidenceAdded: [],
      contradictionsFound: [],
      biasEvents: [],
      confidenceDelta: new Map(),
      communicationTechnique: { name: "Standard", effectiveness: 0.5 },
      empathyLevel: 0.5,
      pressureLevel: 0.5,
    };

    return turn;
  }

  /**
   * Ajoute une observation à un tour
   */
  addObservation(turn: Turn, observation: Observation): void {
    turn.observations.push(observation);
  }

  /**
   * Ajoute une mise à jour d'hypothèse à un tour
   */
  addHypothesisUpdate(turn: Turn, update: HypothesisUpdate): void {
    turn.hypothesesUpdated.push(update);
  }

  /**
   * Ajoute une preuve à un tour
   */
  addEvidence(turn: Turn, evidence: Evidence): void {
    turn.evidenceAdded.push(evidence);
  }

  /**
   * Ajoute une contradiction à un tour
   */
  addContradiction(turn: Turn, contradiction: Contradiction): void {
    turn.contradictionsFound.push(contradiction);
  }

  /**
   * Ajoute un événement de biais à un tour
   */
  addBiasEvent(turn: Turn, biasEvent: BiasEvent): void {
    turn.biasEvents.push(biasEvent);
  }

  /**
   * Ajoute un delta de confiance à un tour
   */
  addConfidenceDelta(turn: Turn, hypothesisId: string, delta: number): void {
    turn.confidenceDelta.set(hypothesisId, delta);
  }

  /**
   * Met à jour la technique de communication d'un tour
   */
  updateCommunicationTechnique(turn: Turn, technique: TechniqueUsed): void {
    turn.communicationTechnique = technique;
  }

  /**
   * Met à jour le niveau d'empathie d'un tour
   */
  updateEmpathyLevel(turn: Turn, level: number): void {
    turn.empathyLevel = Math.max(0, Math.min(1, level));
  }

  /**
   * Met à jour le niveau de pression d'un tour
   */
  updatePressureLevel(turn: Turn, level: number): void {
    turn.pressureLevel = Math.max(0, Math.min(1, level));
  }

  /**
   * Obtient un tour par son ID
   */
  getTurn(timeline: Turn[], turnId: number): Turn | null {
    return timeline.find((t) => t.id === turnId) || null;
  }

  /**
   * Obtient les tours dans un intervalle
   */
  getTurnsInRange(timeline: Turn[], start: number, end: number): Turn[] {
    return timeline.filter((t) => t.id >= start && t.id <= end);
  }

  /**
   * Obtient les tours par état d'entretien
   */
  getTurnsByState(timeline: Turn[], state: InterviewState): Turn[] {
    return timeline.filter((t) => t.interviewState === state);
  }

  /**
   * Explique pourquoi le système pense ce qu'il pense
   * Règle : Le système peut toujours expliquer pourquoi il pense ce qu'il pense
   * en remontant la timeline complète
   */
  explainDecision(timeline: Turn[], hypothesisId: string): string {
    let explanation = `EXPLICATION DE LA DÉCISION POUR HYPOTHÈSE ${hypothesisId}\n\n`;
    explanation += `TIMELINE COMPLÈTE :\n\n`;

    timeline.forEach((turn) => {
      const update = turn.hypothesesUpdated.find((u) => u.hypothesisId === hypothesisId);
      if (update) {
        explanation += `Tour ${turn.id} [${turn.interviewState}] :\n`;
        explanation += `  - Posterior : ${(update.oldPosterior * 100).toFixed(1)}% → ${(update.newPosterior * 100).toFixed(1)}%\n`;
        explanation += `  - Delta : ${(update.delta * 100).toFixed(1)}%\n`;

        if (turn.evidenceAdded.length > 0) {
          explanation += `  - Preuves ajoutées :\n`;
          turn.evidenceAdded.forEach((e) => {
            explanation += `    * ${e.rawContent} (${e.direction})\n`;
          });
        }

        if (turn.contradictionsFound.length > 0) {
          explanation += `  - Contradictions trouvées :\n`;
          turn.contradictionsFound.forEach((c) => {
            explanation += `    * ${c.type} : impact ${(c.bayesianImpact * 100).toFixed(1)}%\n`;
          });
        }

        if (turn.biasEvents.length > 0) {
          explanation += `  - Biais détectés :\n`;
          turn.biasEvents.forEach((b) => {
            explanation += `    * ${b.biasType} : pénalité ${(b.confidencePenalty * 100).toFixed(1)}%\n`;
          });
        }

        explanation += `\n`;
      }
    });

    return explanation;
  }

  /**
   * Résume la timeline
   */
  summarizeTimeline(timeline: Turn[]): string {
    if (timeline.length === 0) {
      return "Timeline vide";
    }

    let summary = `RÉSUMÉ DE LA TIMELINE\n`;
    summary += `Nombre de tours : ${timeline.length}\n`;
    summary += `Premier tour : ${timeline[0].id}\n`;
    summary += `Dernier tour : ${timeline[timeline.length - 1].id}\n\n`;

    summary += `États d'entretien :\n`;
    const states = new Map<InterviewState, number>();
    timeline.forEach((t) => {
      const count = states.get(t.interviewState) || 0;
      states.set(t.interviewState, count + 1);
    });

    states.forEach((count, state) => {
      summary += `  - ${state} : ${count} tours\n`;
    });

    summary += `\nStatistiques globales :\n`;
    const totalEvidence = timeline.reduce((sum, t) => sum + t.evidenceAdded.length, 0);
    const totalContradictions = timeline.reduce((sum, t) => sum + t.contradictionsFound.length, 0);
    const totalBiases = timeline.reduce((sum, t) => sum + t.biasEvents.length, 0);

    summary += `  - Preuves totales : ${totalEvidence}\n`;
    summary += `  - Contradictions totales : ${totalContradictions}\n`;
    summary += `  - Biais totaux : ${totalBiases}\n`;

    return summary;
  }

  /**
   * Identifie les tours avec des contradictions
   */
  findContradictionTurns(timeline: Turn[]): Turn[] {
    return timeline.filter((t) => t.contradictionsFound.length > 0);
  }

  /**
   * Identifie les tours avec des biais
   */
  findBiasTurns(timeline: Turn[]): Turn[] {
    return timeline.filter((t) => t.biasEvents.length > 0);
  }

  /**
   * Identifie les tours avec beaucoup de preuves
   */
  findEvidenceRichTurns(timeline: Turn[], threshold: number = 3): Turn[] {
    return timeline.filter((t) => t.evidenceAdded.length >= threshold);
  }

  /**
   * Calcule la progression moyenne de confiance
   */
  calculateAverageConfidenceProgression(timeline: Turn[]): number {
    if (timeline.length === 0) {
      return 0;
    }

    let totalDelta = 0;
    let count = 0;

    timeline.forEach((turn) => {
      turn.confidenceDelta.forEach((delta) => {
        totalDelta += delta;
        count++;
      });
    });

    return count > 0 ? parseFloat((totalDelta / count).toFixed(3)) : 0;
  }

  /**
   * Identifie les moments clés de la timeline
   */
  identifyKeyMoments(timeline: Turn[]): string[] {
    const keyMoments: string[] = [];

    timeline.forEach((turn) => {
      const moments: string[] = [];

      // Contradictions
      if (turn.contradictionsFound.length > 0) {
        moments.push(`Tour ${turn.id} : Contradiction détectée`);
      }

      // Biais
      if (turn.biasEvents.length > 0) {
        moments.push(`Tour ${turn.id} : Biais détecté`);
      }

      // Changement d'état
      if (turn.id > 0) {
        const previousTurn = timeline[turn.id - 1];
        if (previousTurn && previousTurn.interviewState !== turn.interviewState) {
          moments.push(`Tour ${turn.id} : Changement d'état (${previousTurn.interviewState} → ${turn.interviewState})`);
        }
      }

      // Preuves multiples
      if (turn.evidenceAdded.length >= 3) {
        moments.push(`Tour ${turn.id} : Plusieurs preuves (${turn.evidenceAdded.length})`);
      }

      keyMoments.push(...moments);
    });

    return keyMoments;
  }

  /**
   * Exporte la timeline en format JSON
   */
  exportToJSON(timeline: Turn[]): string {
    return JSON.stringify(timeline, null, 2);
  }

  /**
   * Exemple opérationnel selon les spécifications
   */
  operationalExample(): void {
    const timeline: Turn[] = [];

    // Tour 1
    const turn1 = this.createTurn(1, "EXPLORATION", {
      id: "Q_1",
      text: "Racontez-moi une situation où vous avez pris une décision difficile",
    }, "J'ai pris la décision de licencier un collaborateur sous-performant.");

    this.addObservation(turn1, {
      id: "O_1",
      type: "CITATION",
      content: "J'ai pris la décision de licencier un collaborateur",
      timestamp: Date.now(),
    });

    this.addEvidence(turn1, {
      id: "E_1",
      turn: 1,
      timestamp: Date.now(),
      type: EvidenceType.CITATION,
      rawContent: "J'ai pris la décision de licencier un collaborateur",
      weight: 0.18,
      reliability: EvidenceReliability.HIGH,
      context: "État 1",
      skillsImpacted: ["LEADERSHIP"],
      hypothesesImpacted: [],
      direction: EvidenceDirection.CONFIRMS,
      biasCheck: { hasBias: false },
    });

    this.addHypothesisUpdate(turn1, {
      hypothesisId: "H_lead_17",
      oldPosterior: 0.45,
      newPosterior: 0.53,
      delta: 0.08,
    });

    this.addConfidenceDelta(turn1, "H_lead_17", 0.08);

    timeline.push(turn1);

    // Tour 3
    const turn3 = this.createTurn(3, "PRESSION", {
      id: "Q_3",
      text: "Comment avez-vous géré la réaction de l'équipe ?",
    }, "L'équipe a été surprise mais a compris la décision.");

    this.addContradiction(turn3, {
      id: "C_1",
      hypothesisId: "H_lead_17",
      evidenceId: "E_3",
      type: ContradictionType.DIRECT,
      severity: ContradictionSeverity.MEDIUM,
      bayesianImpact: -0.15,
      resolution: ContradictionResolution.PENDING,
    });

    this.addHypothesisUpdate(turn3, {
      hypothesisId: "H_lead_17",
      oldPosterior: 0.53,
      newPosterior: 0.41,
      delta: -0.12,
    });

    this.addConfidenceDelta(turn3, "H_lead_17", -0.12);

    timeline.push(turn3);

    logInfo("=== Timeline créée ===");
    logInfo(this.summarizeTimeline(timeline));

    logInfo("\n=== Explication de la décision ===");
    logInfo(this.explainDecision(timeline, "H_lead_17"));

    logInfo("\n=== Moments clés ===");
    logInfo(this.identifyKeyMoments(timeline).join("\n"));
  }
}

export const timelineEngine = TimelineEngine.getInstance();
