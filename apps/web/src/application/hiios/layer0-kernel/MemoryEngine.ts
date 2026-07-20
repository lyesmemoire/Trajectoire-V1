/**
 * Memory Engine - Layer 0 Kernel
 * Gère la mémoire du candidat selon les spécifications HIIOS v4.0
 */

import {
  Candidate,
  CandidateHistory,
  CurrentInterview,
  Interview,
  Question,
  Hypothesis,
  Turn,
  Skill,
  Timestamp,
  CandidateArchetype,
  SkillGraph,
  GrowthProfile,
  Evidence,
  Contradiction,
  BiasEvent,
} from "../interfaces/IHIIOSKernel";

export class MemoryEngine {
  private static instance: MemoryEngine;
  private candidateMemory: Map<string, Candidate>;

  private constructor() {
    this.candidateMemory = new Map();
  }

  static getInstance(): MemoryEngine {
    if (!MemoryEngine.instance) {
      MemoryEngine.instance = new MemoryEngine();
    }
    return MemoryEngine.instance;
  }

  /**
   * Crée un nouveau candidat en mémoire
   */
  createCandidate(
    id: string,
    sessionId: string,
    archetype: CandidateArchetype
  ): Candidate {
    const now: Timestamp = Date.now();

    const candidate: Candidate = {
      id,
      sessionId,
      createdAt: now,
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
      archetype,
      skillGraph: this.initializeSkillGraph(archetype),
      growthProfile: this.initializeGrowthProfile(archetype),
    };

    this.candidateMemory.set(id, candidate);
    return candidate;
  }

  /**
   * Récupère un candidat par son ID
   */
  getCandidate(candidateId: string): Candidate | null {
    return this.candidateMemory.get(candidateId) || null;
  }

  /**
   * Met à jour partiellement un candidat
   */
  updateCandidate(candidateId: string, update: Partial<Candidate>): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    // Fusionner les mises à jour
    if (update.history) {
      candidate.history = { ...candidate.history, ...update.history };
    }
    if (update.currentInterview) {
      candidate.currentInterview = {
        ...candidate.currentInterview,
        ...update.currentInterview,
      };
    }
    if (update.archetype) {
      candidate.archetype = update.archetype;
    }
    if (update.skillGraph) {
      candidate.skillGraph = update.skillGraph;
    }
    if (update.growthProfile) {
      candidate.growthProfile = update.growthProfile;
    }

    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Récupère la timeline complète d'un candidat
   */
  getTimeline(candidateId: string): Turn[] {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    return candidate.currentInterview.timeline;
  }

  /**
   * Ajoute un tour à la timeline
   * Règle : Chaque tour met à jour la mémoire
   */
  addTurn(candidateId: string, turn: Turn): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    // Ajouter le tour à la timeline
    candidate.currentInterview.timeline.push(turn);

    // Mettre à jour le tour actuel
    candidate.currentInterview.currentTurn = turn.id;

    // Mettre à jour l'état de l'entretien
    candidate.currentInterview.state = turn.interviewState;

    // Mettre à jour le topic actuel
    candidate.currentInterview.currentTopic = turn.questionAsked.interviewState;

    // Incrémenter le total des tours dans l'historique
    candidate.history.totalTurns++;

    // Mettre à jour la confidence map
    turn.confidenceDelta.forEach((delta, hypothesisId) => {
      const currentConfidence = candidate.currentInterview.confidenceMap.get(hypothesisId) || 0;
      candidate.currentInterview.confidenceMap.set(hypothesisId, currentConfidence + delta);
    });

    // Horodater la mise à jour
    turn.timestamp = Date.now();

    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Initialise le graphe de compétences basé sur l'archétype
   */
  private initializeSkillGraph(archetype: CandidateArchetype): SkillGraph {
    const skillGraph: SkillGraph = {
      nodes: new Map(),
      edges: new Map(),
    };

    // Initialiser les nœuds de compétences avec les base rates de l'archétype
    archetype.baseRates.forEach((baseRate, skill) => {
      skillGraph.nodes.set(skill, {
        id: skill,
        name: skill,
        weight: 1.0,
        confidence: baseRate,
        children: [],
      });
    });

    return skillGraph;
  }

  /**
   * Initialise le profil de croissance
   */
  private initializeGrowthProfile(archetype: CandidateArchetype): GrowthProfile {
    const growthProfile: GrowthProfile = {
      id: `growth_${Date.now()}`,
      skills: new Map(),
    };

    // Initialiser les compétences avec leur niveau actuel et cible
    archetype.baseRates.forEach((baseRate, skill) => {
      growthProfile.skills.set(skill, {
        current: baseRate,
        target: Math.min(1.0, baseRate + 0.2), // Cible : +20%
        trajectory: 0.1, // Trajectoire de croissance
      });
    });

    return growthProfile;
  }

  /**
   * Ajoute une preuve au store de preuves
   */
  addEvidence(candidateId: string, evidence: Evidence): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    candidate.currentInterview.evidenceStore.push(evidence);
    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Ajoute une hypothèse active
   */
  addHypothesis(candidateId: string, hypothesis: Hypothesis): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    candidate.currentInterview.activeHypotheses.push(hypothesis);
    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Met à jour le statut d'une hypothèse
   */
  updateHypothesisStatus(
    candidateId: string,
    hypothesisId: string,
    status: string
  ): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    const hypothesis = candidate.currentInterview.activeHypotheses.find(
      (h: Hypothesis) => h.id === hypothesisId
    );

    if (hypothesis) {
      hypothesis.status = status as any;
      hypothesis.lastUpdated = candidate.currentInterview.currentTurn;
      this.candidateMemory.set(candidateId, candidate);
    }
  }

  /**
   * Ajoute un événement de biais au log
   */
  addBiasEvent(candidateId: string, biasEvent: BiasEvent): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    candidate.currentInterview.biasLog.push(biasEvent);
    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Ajoute une contradiction au log
   */
  addContradiction(candidateId: string, contradiction: Contradiction): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    candidate.currentInterview.contradictionLog.push(contradiction);
    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Met à jour la confidence d'une compétence
   */
  updateSkillConfidence(candidateId: string, skill: Skill, delta: number): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    const skillNode = candidate.skillGraph.nodes.get(skill);
    if (skillNode) {
      skillNode.confidence = Math.max(0, Math.min(1, skillNode.confidence + delta));
      candidate.skillGraph.nodes.set(skill, skillNode);
      this.candidateMemory.set(candidateId, candidate);
    }
  }

  /**
   * Finalise l'entretien actuel et l'ajoute à l'historique
   */
  finalizeInterview(candidateId: string): void {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    const interview: Interview = {
      id: `interview_${Date.now()}`,
      date: Date.now(),
      turns: candidate.currentInterview.currentTurn,
      finalState: candidate.currentInterview.state,
    };

    candidate.history.interviews.push(interview);

    // Déplacer les hypothèses abandonnées
    candidate.currentInterview.activeHypotheses.forEach((h: Hypothesis) => {
      if (h.status === "SUSPENDED" || h.status === "INFIRMED") {
        candidate.history.abandonedHypotheses.push(h);
      }
    });

    // Réinitialiser l'entretien actuel pour le prochain
    candidate.currentInterview = {
      state: "EXPLORATION",
      currentTopic: "INTRODUCTION",
      currentTurn: 0,
      timeline: [],
      activeHypotheses: [],
      evidenceStore: [],
      contradictionLog: [],
      biasLog: [],
      confidenceMap: new Map(),
    };

    this.candidateMemory.set(candidateId, candidate);
  }

  /**
   * Nettoie la mémoire d'un candidat
   */
  clearCandidate(candidateId: string): void {
    this.candidateMemory.delete(candidateId);
  }

  /**
   * Explique pourquoi le système pense ce qu'il pense
   * en remontant la timeline complète
   */
  explainReasoning(candidateId: string, hypothesisId: string): string {
    const candidate = this.candidateMemory.get(candidateId);
    if (!candidate) {
      throw new Error(`Candidate ${candidateId} not found`);
    }

    const hypothesis = candidate.currentInterview.activeHypotheses.find(
      (h: Hypothesis) => h.id === hypothesisId
    );

    if (!hypothesis) {
      return `Hypothesis ${hypothesisId} not found`;
    }

    let explanation = `HYPOTHÈSE : ${hypothesis.label}\n`;
    explanation += `Confidence actuelle : ${(hypothesis.confidence * 100).toFixed(1)}%\n\n`;
    explanation += `PRIOR : ${(hypothesis.prior * 100).toFixed(1)}%\n`;
    explanation += `Preuves pour :\n`;

    hypothesis.evidenceFor.forEach((evidence: Evidence) => {
      explanation += `  - Tour ${evidence.turn} : ${evidence.rawContent} (+${(evidence.weight * 100).toFixed(1)}%)\n`;
    });

    explanation += `\nPreuves contre :\n`;
    hypothesis.evidenceAgainst.forEach((evidence: Evidence) => {
      explanation += `  - Tour ${evidence.turn} : ${evidence.rawContent} (-${(evidence.weight * 100).toFixed(1)}%)\n`;
    });

    explanation += `\nContradictions :\n`;
    hypothesis.contradictions.forEach((contradiction: Contradiction) => {
      explanation += `  - ${contradiction.type} : impact ${(contradiction.bayesianImpact * 100).toFixed(1)}%\n`;
    });

    return explanation;
  }
}

export const memoryEngine = MemoryEngine.getInstance();
