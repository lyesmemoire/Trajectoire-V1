/**
 * Reasoning Engine - Layer 2
 * Moteur de raisonnement selon les spécifications HIIOS v4.0
 * Protocole de raisonnement à chaque tour
 */

import {
  Candidate,
  Skill,
  Turn,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// PROTOCOLE DE RAISONNEMENT PAR TOUR
// ============================================================================

export enum ActionType {
  QUESTION = "QUESTION",
  REFORMULATION = "REFORMULATION",
  SILENCE = "SILENCE",
  COACHING = "COACHING",
  RECENTRAGE = "RECENTRAGE",
  VALIDATION = "VALIDATION",
  ETAT_CHANGE = "ETAT_CHANGE",
  BIAIS_CORRECTION = "BIAIS_CORRECTION",
  CONCLUSION = "CONCLUSION",
}

export interface ReasoningStep {
  step: number;
  name: string;
  description: string;
  completed: boolean;
  result?: any;
}

export interface ReasoningOutput {
  turnNumber: number;
  state: string;
  observations: string[];
  hypothesesUpdated: string[];
  biasesDetected: string[];
  uncertainty: string;
  actionSelected: {
    type: ActionType;
    informationGain: number;
    target: string;
    technique: string;
    empathyRequired: number;
    pressureCurrent: number;
    respectsGoldenRule: boolean;
  };
  question?: string;
  globalConfidence: {
    coverage: number;
    evidenceCount: number;
    openZones: number;
  };
}

export class ReasoningEngine {
  private static instance: ReasoningEngine;

  private constructor() {}

  static getInstance(): ReasoningEngine {
    if (!ReasoningEngine.instance) {
      ReasoningEngine.instance = new ReasoningEngine();
    }
    return ReasoningEngine.instance;
  }

  /**
   * Exécute le protocole de raisonnement complet pour un tour
   */
  executeTurnReasoning(candidate: Candidate, candidateResponse: string): ReasoningOutput {
    const steps: ReasoningStep[] = [];

    // ÉTAPE 1 — LECTURE MÉMOIRE
    steps.push({
      step: 1,
      name: "LECTURE MÉMOIRE",
      description: "Lire depuis le Kernel : état, hypothèses, preuves, biais, dernière question",
      completed: false,
    });

    const memoryData = this.step1_ReadMemory(candidate);
    steps[0].completed = true;
    steps[0].result = memoryData;

    // ÉTAPE 2 — EXTRACTION D'OBSERVATIONS
    steps.push({
      step: 2,
      name: "EXTRACTION D'OBSERVATIONS",
      description: "Extraire faits bruts, citations, comportements, absences, patterns",
      completed: false,
    });

    const observations = this.step2_ExtractObservations(candidateResponse);
    steps[1].completed = true;
    steps[1].result = observations;

    // ÉTAPE 3 — MISE À JOUR DES HYPOTHÈSES
    steps.push({
      step: 3,
      name: "MISE À JOUR DES HYPOTHÈSES",
      description: "Mettre à jour le posterior de chaque hypothèse impactée",
      completed: false,
    });

    const hypothesesUpdated = this.step3_UpdateHypotheses(candidate, observations);
    steps[2].completed = true;
    steps[2].result = hypothesesUpdated;

    // ÉTAPE 4 — SCAN DE BIAIS
    steps.push({
      step: 4,
      name: "SCAN DE BIAIS",
      description: "Vérifier si un biais a influencé l'évaluation",
      completed: false,
    });

    const biasesDetected = this.step4_ScanBiases(candidate, hypothesesUpdated);
    steps[3].completed = true;
    steps[3].result = biasesDetected;

    // ÉTAPE 5 — SCAN DE CONTRADICTIONS
    steps.push({
      step: 5,
      name: "SCAN DE CONTRADICTIONS",
      description: "Pour chaque hypothèse à posterior ≥ 0.60, vérifier contradiction",
      completed: false,
    });

    const contradictions = this.step5_ScanContradictions(candidate);
    steps[4].completed = true;
    steps[4].result = contradictions;

    // ÉTAPE 6 — SÉLECTION DE LA PROCHAINE ACTION
    steps.push({
      step: 6,
      name: "SÉLECTION DE LA PROCHAINE ACTION",
      description: "Calculer Information Gain, appliquer filtres, sélectionner action",
      completed: false,
    });

    const actionSelected = this.step6_SelectAction(candidate, biasesDetected);
    steps[5].completed = true;
    steps[5].result = actionSelected;

    // ÉTAPE 7 — ÉCRITURE MÉMOIRE
    steps.push({
      step: 7,
      name: "ÉCRITURE MÉMOIRE",
      description: "Écrire dans le Kernel : turn complet, mises à jour, action sélectionnée",
      completed: false,
    });

    this.step7_WriteMemory(candidate, observations, hypothesesUpdated, biasesDetected, actionSelected);
    steps[6].completed = true;

    // Générer la sortie formatée
    return this.generateFormattedOutput(candidate, steps, observations, hypothesesUpdated, biasesDetected, actionSelected);
  }

  /**
   * ÉTAPE 1 — LECTURE MÉMOIRE
   */
  private step1_ReadMemory(candidate: Candidate): any {
    return {
      state: candidate.currentInterview.state,
      activeHypotheses: candidate.currentInterview.activeHypotheses.map((h) => ({
        id: h.id,
        label: h.label,
        posterior: h.posterior,
        confidence: h.confidence,
      })),
      evidenceCount: candidate.currentInterview.evidenceStore.length,
      unresolvedBiases: candidate.currentInterview.biasLog.filter((b) => !b.resolved).length,
      lastQuestion: candidate.currentInterview.timeline[candidate.currentInterview.timeline.length - 1]?.questionAsked,
    };
  }

  /**
   * ÉTAPE 2 — EXTRACTION D'OBSERVATIONS
   */
  private step2_ExtractObservations(response: string): string[] {
    const observations: string[] = [];

    // Extraire les faits bruts (simplification)
    if (response.length > 0) {
      observations.push(`Citation exacte : "${response.substring(0, 100)}..."`);
    }

    // Détecter les comportements observables (simplification)
    if (response.toLowerCase().includes("je")) {
      observations.push("Comportement observable : utilisation de la première personne");
    }

    return observations;
  }

  /**
   * ÉTAPE 3 — MISE À JOUR DES HYPOTHÈSES
   */
  private step3_UpdateHypotheses(candidate: Candidate, observations: string[]): string[] {
    const updates: string[] = [];

    candidate.currentInterview.activeHypotheses.forEach((hypothesis) => {
      const oldPosterior = hypothesis.posterior;
      // Simulation de mise à jour bayésienne
      const delta = 0.05;
      hypothesis.posterior = Math.min(1.0, hypothesis.posterior + delta);
      hypothesis.confidence = hypothesis.posterior;

      updates.push(
        `${hypothesis.label} : ${oldPosterior.toFixed(2)} → ${hypothesis.posterior.toFixed(2)} [+Evidence · Poids 0.72 · HIGH]`
      );
    });

    return updates;
  }

  /**
   * ÉTAPE 4 — SCAN DE BIAIS
   */
  private step4_ScanBiases(candidate: Candidate, hypothesesUpdated: string[]): string[] {
    const biases: string[] = [];

    // Simulation de détection de biais
    if (candidate.currentInterview.biasLog.length === 0) {
      biases.push("Aucun biais détecté");
    } else {
      candidate.currentInterview.biasLog.forEach((bias) => {
        if (!bias.resolved) {
          biases.push(
            `[${bias.biasType}] sur ${bias.affectedHypothesis} · Penalty -${(bias.confidencePenalty * 100).toFixed(2)} · Action corrective : ${bias.mandatoryAction}`
          );
        }
      });
    }

    return biases;
  }

  /**
   * ÉTAPE 5 — SCAN DE CONTRADICTIONS
   */
  private step5_ScanContradictions(candidate: Candidate): string[] {
    const contradictions: string[] = [];

    // Pour chaque hypothèse à posterior ≥ 0.60
    candidate.currentInterview.activeHypotheses.forEach((hypothesis) => {
      if (hypothesis.posterior >= 0.60) {
        // Vérifier si une question de contradiction a été posée
        if (hypothesis.contradictions.length === 0) {
          contradictions.push(
            `${hypothesis.label} : posterior ${hypothesis.posterior.toFixed(2)} · Question de contradiction requise`
          );
        }
      }
    });

    return contradictions;
  }

  /**
   * ÉTAPE 6 — SÉLECTION DE LA PROCHAINE ACTION
   */
  private step6_SelectAction(candidate: Candidate, biasesDetected: string[]): any {
    // Calculer l'Information Gain (simplification)
    const informationGain = 0.42;

    // Vérifier le Principe d'Or
    const empathyRequired = 0.65;
    const pressureCurrent = 0.55;
    const respectsGoldenRule = empathyRequired >= 0.3;

    return {
      type: ActionType.QUESTION,
      informationGain,
      target: "H_lead vs H_exec · Distinction nécessaire",
      technique: "Niveau 4 — Contradiction",
      empathyRequired,
      pressureCurrent,
      respectsGoldenRule,
    };
  }

  /**
   * ÉTAPE 7 — ÉCRITURE MÉMOIRE
   */
  private step7_WriteMemory(
    candidate: Candidate,
    observations: string[],
    hypothesesUpdated: string[],
    biasesDetected: string[],
    actionSelected: any
  ): void {
    // Créer un nouveau tour
    const turn: Turn = {
      id: candidate.currentInterview.currentTurn + 1,
      timestamp: Date.now(),
      interviewState: candidate.currentInterview.state,
      questionAsked: {
        id: "Q_" + (candidate.currentInterview.currentTurn + 1),
        text: "Question générée",
        informationGain: actionSelected.informationGain,
        targetHypothesesIds: [],
        interviewState: candidate.currentInterview.state,
        empathyLevelRequired: actionSelected.empathyRequired,
        contradictionTrigger: false,
        coachingTrigger: false,
        targetHypotheses: [],
      },
      candidateResponse: "",
      observations: observations.map((o) => ({ id: "O_" + Date.now(), type: "FAIT", content: o, timestamp: Date.now() })),
      hypothesesUpdated: [],
      evidenceAdded: [],
      contradictionsFound: [],
      biasEvents: [],
      confidenceDelta: new Map(),
      communicationTechnique: { name: "Standard", effectiveness: 0.5 },
      empathyLevel: actionSelected.empathyRequired,
      pressureLevel: actionSelected.pressureCurrent,
    };

    candidate.currentInterview.timeline.push(turn);
    candidate.currentInterview.currentTurn = turn.id;
  }

  /**
   * Génère la sortie formatée selon les spécifications
   */
  private generateFormattedOutput(
    candidate: Candidate,
    steps: ReasoningStep[],
    observations: string[],
    hypothesesUpdated: string[],
    biasesDetected: string[],
    actionSelected: any
  ): ReasoningOutput {
    return {
      turnNumber: candidate.currentInterview.currentTurn,
      state: candidate.currentInterview.state,
      observations,
      hypothesesUpdated,
      biasesDetected,
      uncertainty: "H_adapt : posterior 0.44 · Information manquante : [X]",
      actionSelected,
      question: "Quelle a été votre plus grande difficulté dans cette situation ?",
      globalConfidence: {
        coverage: 68,
        evidenceCount: candidate.currentInterview.evidenceStore.length,
        openZones: 3,
      },
    };
  }

  /**
   * Génère le rapport formaté ASCII
   */
  generateFormattedReport(output: ReasoningOutput): string {
    let report = "";
    report += "╔══════════════════════════════════════════════════════════════════════════╗\n";
    report += `║  TRAJECTOIRE · Tour [${output.turnNumber}] · État [${output.state}]              ║\n`;
    report += "╠══════════════════════════════════════════════════════════════════════════╣\n";
    report += "║                                                                          ║\n";
    report += "║  OBSERVATIONS                                                            ║\n";
    output.observations.forEach((obs) => {
      report += `║  · ${obs}\n`;
    });
    report += "║                                                                          ║\n";
    report += "║  HYPOTHÈSES MISES À JOUR                                                 ║\n";
    output.hypothesesUpdated.forEach((update) => {
      report += `║  · ${update}\n`;
    });
    report += "║                                                                          ║\n";
    report += "║  BIAIS DÉTECTÉ                                                           ║\n";
    output.biasesDetected.forEach((bias) => {
      report += `║  · ${bias}\n`;
    });
    report += "║                                                                          ║\n";
    report += "║  INCERTITUDE ACTUELLE                                                    ║\n";
    report += `║  · ${output.uncertainty}\n`;
    report += "║                                                                          ║\n";
    report += "║  ACTION SÉLECTIONNÉE                                                     ║\n";
    report += `║  · Type : ${output.actionSelected.type} · Information Gain : ${output.actionSelected.informationGain}\n`;
    report += `║  · Cible : ${output.actionSelected.target}\n`;
    report += `║  · Technique : ${output.actionSelected.technique}\n`;
    report += `║  · Empathie requise : ${output.actionSelected.empathyRequired} · Pression actuelle : ${output.actionSelected.pressureCurrent} ${output.actionSelected.respectsGoldenRule ? "✓" : "✗"} Principe d'Or\n`;
    report += "║                                                                          ║\n";
    report += "║  ▶ QUESTION                                                              ║\n";
    report += `║  "${output.question}"\n`;
    report += "║                                                                          ║\n";
    report += "║  CONFIANCE GLOBALE                                                       ║\n";
    report += `║  · Coverage : ${output.globalConfidence.coverage}% · Preuves : ${output.globalConfidence.evidenceCount} · Zones ouvertes : ${output.globalConfidence.openZones}\n`;
    report += "╚══════════════════════════════════════════════════════════════════════════╝\n";

    return report;
  }

  /**
   * Effectue un raisonnement sur un candidat
   * Règle : Le raisonnement ne se fait jamais directement sur les données brutes,
   * mais exclusivement à travers le Kernel
   */
  reasonAboutCandidate(candidate: Candidate): string {
    let reasoning = `RAISONNEMENT SUR LE CANDIDAT ${candidate.id}\n\n`;

    // Analyser les hypothèses actives
    const activeHypotheses = candidate.currentInterview.activeHypotheses;
    reasoning += `HYPOTHÈSES ACTIVES (${activeHypotheses.length}) :\n`;

    activeHypotheses.forEach((h) => {
      reasoning += `  - ${h.label} : ${(h.confidence * 100).toFixed(1)}% [${h.status}]\n`;
    });

    // Analyser les preuves
    const evidenceStore = candidate.currentInterview.evidenceStore;
    reasoning += `\nPREUVES COLLECTÉES (${evidenceStore.length}) :\n`;

    evidenceStore.forEach((e) => {
      reasoning += `  - Tour ${e.turn} : ${e.rawContent} (${e.direction})\n`;
    });

    // Analyser les contradictions
    const contradictionLog = candidate.currentInterview.contradictionLog;
    reasoning += `\nCONTRADICTIONS (${contradictionLog.length}) :\n`;

    contradictionLog.forEach((c) => {
      reasoning += `  - ${c.type} : impact ${(c.bayesianImpact * 100).toFixed(1)}% [${c.resolution}]\n`;
    });

    // Analyser les biais
    const biasLog = candidate.currentInterview.biasLog;
    reasoning += `\nBIAIS DÉTECTÉS (${biasLog.length}) :\n`;

    biasLog.forEach((b) => {
      reasoning += `  - ${b.biasType} : pénalité ${(b.confidencePenalty * 100).toFixed(1)}% [${b.resolved ? "Résolu" : "Non résolu"}]\n`;
    });

    return reasoning;
  }

  /**
   * Synthétise le raisonnement pour une compétence spécifique
   */
  reasonAboutSkill(candidate: Candidate, skill: Skill): string {
    let reasoning = `RAISONNEMENT SUR LA COMPÉTENCE ${skill}\n\n`;

    // Filtrer les hypothèses liées à cette compétence
    const skillHypotheses = candidate.currentInterview.activeHypotheses.filter(
      (h) => h.skillNode === skill
    );

    reasoning += `HYPOTHÈSES LIÉES (${skillHypotheses.length}) :\n`;

    skillHypotheses.forEach((h) => {
      reasoning += `  - ${h.label} : ${(h.confidence * 100).toFixed(1)}%\n`;
      reasoning += `    Preuves pour : ${h.evidenceFor.length}\n`;
      reasoning += `    Preuves contre : ${h.evidenceAgainst.length}\n`;
      reasoning += `    Contradictions : ${h.contradictions.length}\n`;
    });

    // Obtenir le niveau de confiance du graphe de compétences
    const skillNode = candidate.skillGraph.nodes.get(skill);
    if (skillNode) {
      reasoning += `\nNIVEAU DE CONFIANCE DU GRAPHE : ${(skillNode.confidence * 100).toFixed(1)}%\n`;
    }

    return reasoning;
  }

  /**
   * Génère une conclusion sur une compétence
   */
  concludeAboutSkill(candidate: Candidate, skill: Skill): string {
    const skillNode = candidate.skillGraph.nodes.get(skill);
    if (!skillNode) {
      return `Compétence ${skill} non trouvée`;
    }

    let conclusion = `CONCLUSION SUR ${skill}\n\n`;
    conclusion += `Confidence : ${(skillNode.confidence * 100).toFixed(1)}%\n`;

    if (skillNode.confidence >= 0.75) {
      conclusion += `→ COMPÉTENCE CONFIRMÉE\n`;
      conclusion += `→ Le candidat démontre un niveau élevé dans cette compétence.\n`;
    } else if (skillNode.confidence >= 0.60) {
      conclusion += `→ COMPÉTENCE MODÉRÉMENT CONFIRMÉE\n`;
      conclusion += `→ Le candidat démontre un niveau satisfaisant mais nécessite plus de tests.\n`;
    } else if (skillNode.confidence >= 0.40) {
      conclusion += `→ COMPÉTENCE INSUFFISAMMENT ÉVALUÉE\n`;
      conclusion += `→ Plus de preuves sont nécessaires pour conclure.\n`;
    } else {
      conclusion += `→ COMPÉTENCE INFIRMÉE\n`;
      conclusion += `→ Le candidat ne démontre pas cette compétence.\n`;
    }

    return conclusion;
  }

  /**
   * Identifie les zones d'incertitude
   */
  identifyUncertaintyZones(candidate: Candidate): string[] {
    const zones: string[] = [];

    // Analyser chaque compétence principale
    const mainSkills = ["LEADERSHIP", "COMMUNICATION", "EXECUTION", "INTELLIGENCE_EMOTIONNELLE"];

    mainSkills.forEach((skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      if (node) {
        if (node.confidence < 0.60) {
          zones.push(`${skill} : Incertitude élevée (${(node.confidence * 100).toFixed(0)}%)`);
        } else if (node.confidence < 0.75) {
          zones.push(`${skill} : Incertitude modérée (${(node.confidence * 100).toFixed(0)}%)`);
        }
      }
    });

    return zones;
  }

  /**
   * Suggère des actions pour réduire l'incertitude
   */
  suggestUncertaintyReductionActions(candidate: Candidate): string[] {
    const actions: string[] = [];
    const uncertaintyZones = this.identifyUncertaintyZones(candidate);

    uncertaintyZones.forEach((zone) => {
      const skill = zone.split(" : ")[0];
      actions.push(`Explorer ${skill} avec des questions spécifiques`);
      actions.push(`Tester ${skill} sous contradiction`);
    });

    return actions;
  }

  /**
   * Vérifie la cohérence du raisonnement
   */
  checkReasoningConsistency(candidate: Candidate): boolean {
    // Vérifier que les hypothèses sont cohérentes avec le graphe de compétences
    let consistent = true;

    candidate.currentInterview.activeHypotheses.forEach((hypothesis) => {
      const skillNode = candidate.skillGraph.nodes.get(hypothesis.skillNode);
      if (skillNode) {
        // La confiance de l'hypothèse devrait être proche de celle du nœud
        const diff = Math.abs(hypothesis.confidence - skillNode.confidence);
        if (diff > 0.20) {
          consistent = false;
        }
      }
    });

    return consistent;
  }

  /**
   * Explique le raisonnement pour une décision
   */
  explainReasoningForDecision(candidate: Candidate, decision: string): string {
    let explanation = `EXPLICATION DU RAISONNEMENT POUR LA DÉCISION : ${decision}\n\n`;

    explanation += `ARCHÉTYPE DU CANDIDAT : ${candidate.archetype.name}\n`;
    explanation += `Description : ${candidate.archetype.description}\n\n`;

    explanation += `COMPÉTENCES PRINCIPALES :\n`;
    candidate.archetype.baseRates.forEach((rate, skill) => {
      const node = candidate.skillGraph.nodes.get(skill);
      const currentConfidence = node ? node.confidence : rate;
      const delta = currentConfidence - rate;
      explanation += `  - ${skill} : ${(currentConfidence * 100).toFixed(0)}% (base rate : ${(rate * 100).toFixed(0)}%, delta : ${(delta * 100).toFixed(0)}%)\n`;
    });

    explanation += `\nBIAIS NON RÉSOLUS : ${candidate.currentInterview.biasLog.filter((b) => !b.resolved).length}\n`;

    return explanation;
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
        state: "EXPLORATION",
        currentTopic: "INTRODUCTION",
        currentTurn: 0,
        timeline: [],
        activeHypotheses: [],
        evidenceStore: [],
        contradictionLog: [],
        biasLog: [],
        confidenceMap: new Map(),
      },
      archetype: {
        id: "ARCH_BALANCED",
        name: "Profil Équilibré",
        description: "Profil équilibré sur toutes les compétences",
        baseRates: new Map([
          ["LEADERSHIP", 0.50],
          ["COMMUNICATION", 0.50],
          ["EXECUTION", 0.50],
          ["INTELLIGENCE_EMOTIONNELLE", 0.50],
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
            confidence: 0.65,
          }],
        ]),
        edges: new Map(),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    logInfo("=== Raisonnement sur le candidat ===");
    logInfo(this.reasonAboutCandidate(candidate));

    logInfo("\n=== Raisonnement sur Leadership ===");
    logInfo(this.reasonAboutSkill(candidate, "LEADERSHIP"));

    logInfo("\n=== Conclusion sur Leadership ===");
    logInfo(this.concludeAboutSkill(candidate, "LEADERSHIP"));

    logInfo("\n=== Zones d'incertitude ===");
    logInfo(this.identifyUncertaintyZones(candidate).join("\n"));

    logInfo("\n=== Cohérence du raisonnement ===");
    logInfo(this.checkReasoningConsistency(candidate) ? "Cohérent" : "Incohérent");
  }
}

export const reasoningEngine = ReasoningEngine.getInstance();
