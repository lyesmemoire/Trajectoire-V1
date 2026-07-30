/**
 * Interview State Machine - Layer 4
 * Machine d'états d'entretien selon les spécifications HIIOS v4.0
 * Machine vivante : non-linéaire
 */

import {
  InterviewState,
  Candidate,
} from "../interfaces/IHIIOSKernel";
import { logInfo } from "@/lib/logger/Logger";

// ============================================================================
// ÉTATS DE LA MACHINE D'ÉTATS
// ============================================================================

export enum DetailedInterviewState {
  CALIBRATION = "CALIBRATION",      // ÉTAT 0
  EXPLORATION = "EXPLORATION",      // ÉTAT 1
  PRECISION = "PRECISION",          // ÉTAT 2
  JUSTIFICATION = "JUSTIFICATION",  // ÉTAT 3
  CONTRADICTION = "CONTRADICTION",  // ÉTAT 4
  PRESSION = "PRESSION",            // ÉTAT 5
  REFLEXION = "REFLEXION",          // ÉTAT 6
}

export interface StateInfo {
  id: number;
  name: DetailedInterviewState;
  objective: string;
  technique: string;
  duration: string;
  exitCondition: string;
}

export interface TransitionRule {
  from: DetailedInterviewState;
  to: DetailedInterviewState;
  condition: string;
  mandatory: boolean;
}

export class InterviewStateMachine {
  private static instance: InterviewStateMachine;

  private constructor() {}

  static getInstance(): InterviewStateMachine {
    if (!InterviewStateMachine.instance) {
      InterviewStateMachine.instance = new InterviewStateMachine();
    }
    return InterviewStateMachine.instance;
  }

  /**
   * Obtient les informations sur un état
   */
  getStateInfo(state: DetailedInterviewState): StateInfo {
    const states: Record<DetailedInterviewState, StateInfo> = {
      [DetailedInterviewState.CALIBRATION]: {
        id: 0,
        name: DetailedInterviewState.CALIBRATION,
        objective: "Identifier archétype · Calibrer posture initiale",
        technique: "Questions d'ouverture · Écoute maximale",
        duration: "2 à 3 tours maximum",
        exitCondition: "Archétype → Memory.archetype",
      },
      [DetailedInterviewState.EXPLORATION]: {
        id: 1,
        name: DetailedInterviewState.EXPLORATION,
        objective: "Ouvrir l'espace · Laisser émerger",
        technique: "Questions ouvertes · Écoute maximale",
        duration: "Variable",
        exitCondition: "Au moins un exemple concret · Premières hypothèses",
      },
      [DetailedInterviewState.PRECISION]: {
        id: 2,
        name: DetailedInterviewState.PRECISION,
        objective: "Isoler la contribution individuelle",
        technique: "Qu'avez-vous réellement fait, vous ?",
        duration: "Variable",
        exitCondition: "Rôle exact documenté · Preuves initiales",
      },
      [DetailedInterviewState.JUSTIFICATION]: {
        id: 3,
        name: DetailedInterviewState.JUSTIFICATION,
        objective: "Tester la pensée derrière l'action",
        technique: "Pourquoi ce choix-là ?",
        duration: "Variable",
        exitCondition: "Raisonnement explicite ou absence documentée",
      },
      [DetailedInterviewState.CONTRADICTION]: {
        id: 4,
        name: DetailedInterviewState.CONTRADICTION,
        objective: "Tester la flexibilité cognitive",
        technique: "Contradiction Engine activé",
        duration: "Variable",
        exitCondition: "Hypothèses confirmées ou révisées",
      },
      [DetailedInterviewState.PRESSION]: {
        id: 5,
        name: DetailedInterviewState.PRESSION,
        objective: "Tester résilience · Leadership · Gestion du conflit",
        technique: "Questions de pression · Empathie compensatrice",
        duration: "Variable",
        exitCondition: "Comportement sous pression documenté",
      },
      [DetailedInterviewState.REFLEXION]: {
        id: 6,
        name: DetailedInterviewState.REFLEXION,
        objective: "Tester maturité · Humilité · Apprentissage",
        technique: "Avec le recul, referiez-vous la même chose ?",
        duration: "Variable",
        exitCondition: "Niveau de maturité réflexive documenté",
      },
    };

    return states[state];
  }

  /**
   * Obtient les règles de transition
   */
  getTransitionRules(): TransitionRule[] {
    return [
      { from: DetailedInterviewState.CALIBRATION, to: DetailedInterviewState.EXPLORATION, condition: "Toujours. Sans exception.", mandatory: true },
      { from: DetailedInterviewState.EXPLORATION, to: DetailedInterviewState.PRECISION, condition: "Quand un exemple concret est posé", mandatory: false },
      { from: DetailedInterviewState.PRECISION, to: DetailedInterviewState.JUSTIFICATION, condition: "Quand la contribution individuelle est isolée", mandatory: false },
      { from: DetailedInterviewState.JUSTIFICATION, to: DetailedInterviewState.CONTRADICTION, condition: "Quand le raisonnement est explicité OU son absence documentée", mandatory: false },
      { from: DetailedInterviewState.CONTRADICTION, to: DetailedInterviewState.PRESSION, condition: "Quand Contradiction Engine a été activé ET Principe d'Or vérifié ET tous les BiasEvents résolus", mandatory: false },
      { from: DetailedInterviewState.PRESSION, to: DetailedInterviewState.REFLEXION, condition: "Quand le comportement sous pression est documenté", mandatory: false },
      { from: DetailedInterviewState.EXPLORATION, to: DetailedInterviewState.EXPLORATION, condition: "Quand un sujet est épuisé. Nouveau cycle sur nouveau territoire", mandatory: false },
      { from: DetailedInterviewState.PRESSION, to: DetailedInterviewState.PRECISION, condition: "Si contradiction majeure remet en question une conclusion", mandatory: false },
    ];
  }

  /**
   * Vérifie le Principe d'Or
   * Règle : pressure_level ≤ empathy_level + 0.10
   */
  checkGoldenRule(candidate: Candidate): { respects: boolean; pressureLevel: number; empathyLevel: number; delta: number } {
    const lastTurn = candidate.currentInterview.timeline[candidate.currentInterview.timeline.length - 1];
    
    if (!lastTurn) {
      return { respects: true, pressureLevel: 0, empathyLevel: 0.7, delta: 0 };
    }

    const pressureLevel = lastTurn.pressureLevel;
    const empathyLevel = lastTurn.empathyLevel;
    const delta = pressureLevel - (empathyLevel + 0.10);
    const respects = pressureLevel <= empathyLevel + 0.10;

    return { respects, pressureLevel, empathyLevel, delta };
  }

  /**
   * Détermine le prochain état selon les règles de transition
   */
  determineNextState(candidate: Candidate): DetailedInterviewState {
    const currentState = this.mapToDetailedState(candidate.currentInterview.state);
    const goldenRule = this.checkGoldenRule(candidate);
    const biasEvents = candidate.currentInterview.biasLog;
    const unresolvedBiases = biasEvents.filter((b) => !b.resolved);

    // Vérifier le Principe d'Or
    if (!goldenRule.respects) {
      // Bloquer la transition vers l'état supérieur
      // Action obligatoire : technique de régulation empathique
      return currentState;
    }

    // Vérifier les biais non résolus
    if (unresolvedBiases.length > 0 && currentState !== DetailedInterviewState.EXPLORATION) {
      // Retourner à EXPLORATION pour résoudre les biais
      return DetailedInterviewState.EXPLORATION;
    }

    // Appliquer les règles de transition
    switch (currentState) {
      case DetailedInterviewState.CALIBRATION:
        // 0 → 1 : Toujours. Sans exception.
        return DetailedInterviewState.EXPLORATION;

      case DetailedInterviewState.EXPLORATION:
        // 1 → 2 : Quand un exemple concret est posé
        if (candidate.currentInterview.evidenceStore.length >= 1) {
          return DetailedInterviewState.PRECISION;
        }
        // X → 1 : Quand un sujet est épuisé
        return DetailedInterviewState.EXPLORATION;

      case DetailedInterviewState.PRECISION:
        // 2 → 3 : Quand la contribution individuelle est isolée
        if (candidate.currentInterview.evidenceStore.length >= 2) {
          return DetailedInterviewState.JUSTIFICATION;
        }
        return DetailedInterviewState.PRECISION;

      case DetailedInterviewState.JUSTIFICATION:
        {
          // 3 → 4 : Quand le raisonnement est explicité OU son absence documentée
          const highConfidenceHypotheses = candidate.currentInterview.activeHypotheses.filter(
            (h) => h.confidence >= 0.60
          );
          if (highConfidenceHypotheses.length > 0) {
            return DetailedInterviewState.CONTRADICTION;
          }
          return DetailedInterviewState.JUSTIFICATION;
        }

      case DetailedInterviewState.CONTRADICTION:
        // 4 → 5 : Quand Contradiction Engine a été activé ET Principe d'Or vérifié ET tous les BiasEvents résolus
        if (goldenRule.respects && unresolvedBiases.length === 0) {
          return DetailedInterviewState.PRESSION;
        }
        return DetailedInterviewState.CONTRADICTION;

      case DetailedInterviewState.PRESSION:
        {
          // 5 → 6 : Quand le comportement sous pression est documenté
          if (candidate.currentInterview.currentTurn >= 10) {
            return DetailedInterviewState.REFLEXION;
          }
          // X → X-1 : Si contradiction majeure remet en question une conclusion
          const majorContradiction = candidate.currentInterview.contradictionLog.find(
            (c) => c.severity === "HIGH" && c.resolution === "PENDING"
          );
          if (majorContradiction) {
            return DetailedInterviewState.PRECISION;
          }
        }
        return DetailedInterviewState.PRESSION;

      case DetailedInterviewState.REFLEXION:
        // État final
        return DetailedInterviewState.REFLEXION;

      default:
        return DetailedInterviewState.EXPLORATION;
    }
  }

  /**
   * Met à jour l'état d'entretien d'un candidat
   */
  updateInterviewState(candidate: Candidate): void {
    const nextState = this.determineNextState(candidate);
    const mappedState = this.mapFromDetailedState(nextState);
    candidate.currentInterview.state = mappedState;
  }

  /**
   * Mappe l'état InterviewState vers DetailedInterviewState
   */
  private mapToDetailedState(state: InterviewState): DetailedInterviewState {
    const mapping: Record<InterviewState, DetailedInterviewState> = {
      "INTRODUCTION": DetailedInterviewState.CALIBRATION,
      "EXPLORATION": DetailedInterviewState.EXPLORATION,
      "RAPPORT": DetailedInterviewState.EXPLORATION,
      "PRESSION": DetailedInterviewState.PRESSION,
      "CHALLENGE": DetailedInterviewState.CONTRADICTION,
      "CONTRADICTION": DetailedInterviewState.CONTRADICTION,
      "SYNTHESIS": DetailedInterviewState.REFLEXION,
      "CONCLUSION": DetailedInterviewState.REFLEXION,
    };

    return mapping[state] || DetailedInterviewState.EXPLORATION;
  }

  /**
   * Mappe DetailedInterviewState vers InterviewState
   */
  private mapFromDetailedState(state: DetailedInterviewState): InterviewState {
    const mapping: Record<DetailedInterviewState, InterviewState> = {
      [DetailedInterviewState.CALIBRATION]: "INTRODUCTION",
      [DetailedInterviewState.EXPLORATION]: "EXPLORATION",
      [DetailedInterviewState.PRECISION]: "EXPLORATION",
      [DetailedInterviewState.JUSTIFICATION]: "EXPLORATION",
      [DetailedInterviewState.CONTRADICTION]: "CONTRADICTION",
      [DetailedInterviewState.PRESSION]: "PRESSION",
      [DetailedInterviewState.REFLEXION]: "SYNTHESIS",
    };

    return mapping[state] || "EXPLORATION";
  }

  /**
   * Vérifie si une transition est valide
   */
  isValidTransition(from: DetailedInterviewState, to: DetailedInterviewState): boolean {
    const rules = this.getTransitionRules();
    return rules.some((rule) => rule.from === from && rule.to === to);
  }

  /**
   * Obtient les transitions possibles depuis un état
   */
  getPossibleTransitions(from: DetailedInterviewState): DetailedInterviewState[] {
    const rules = this.getTransitionRules();
    const possible = rules.filter((rule) => rule.from === from).map((rule) => rule.to);
    return possible;
  }

  /**
   * Explique pourquoi une transition est bloquée
   */
  explainBlockedTransition(candidate: Candidate, to: DetailedInterviewState): string {
    const currentState = this.mapToDetailedState(candidate.currentInterview.state);
    const goldenRule = this.checkGoldenRule(candidate);
    const biasEvents = candidate.currentInterview.biasLog;
    const unresolvedBiases = biasEvents.filter((b) => !b.resolved);

    let explanation = `TRANSITION BLOQUÉE : ${currentState} → ${to}\n\n`;

    // Vérifier le Principe d'Or
    if (!goldenRule.respects) {
      explanation += `PRINCIPE D'OR VIOLÉ\n`;
      explanation += `pressure_level (${goldenRule.pressureLevel.toFixed(2)}) > empathy_level + 0.10 (${(goldenRule.empathyLevel + 0.10).toFixed(2)})\n`;
      explanation += `Delta : ${goldenRule.delta.toFixed(2)}\n`;
      explanation += `\n→ Action obligatoire : technique de régulation empathique`;
      return explanation;
    }

    // Vérifier les biais
    if (unresolvedBiases.length > 0) {
      explanation += `BIAIS NON RÉSOLUS (${unresolvedBiases.length}) :\n`;
      unresolvedBiases.forEach((b) => {
        explanation += `  - ${b.biasType} : ${b.mandatoryAction}\n`;
      });
      explanation += `\n→ Résoudre les biais avant de progresser`;
      return explanation;
    }

    explanation += `Transition non valide depuis l'état ${currentState}`;
    return explanation;
  }

  /**
   * Obtient l'historique des états d'entretien
   */
  getStateHistory(candidate: Candidate): string {
    let history = `HISTORIQUE DES ÉTATS D'ENTRETIEN\n\n`;

    const timeline = candidate.currentInterview.timeline;
    const states = new Map<DetailedInterviewState, number>();

    timeline.forEach((turn) => {
      const state = this.mapToDetailedState(turn.interviewState);
      const count = states.get(state) || 0;
      states.set(state, count + 1);
    });

    states.forEach((count, state) => {
      const stateInfo = this.getStateInfo(state);
      history += `${state} (État ${stateInfo.id}) : ${count} tours\n`;
    });

    return history;
  }

  /**
   * Calcule la progression de l'entretien
   */
  calculateProgress(candidate: Candidate): number {
    const currentState = this.mapToDetailedState(candidate.currentInterview.state);
    const stateInfo = this.getStateInfo(currentState);
    const totalStates = 7;

    return parseFloat(((stateInfo.id / totalStates) * 100).toFixed(0));
  }

  /**
   * Estime le nombre de tours restants
   */
  estimateRemainingTurns(candidate: Candidate): number {
    const currentState = this.mapToDetailedState(candidate.currentInterview.state);
    const stateInfo = this.getStateInfo(currentState);
    const remainingStates = 7 - stateInfo.id - 1;

    // Estimer 3 tours par état restant
    return remainingStates * 3;
  }

  /**
   * Vérifie si l'entretien peut être finalisé
   */
  canFinalizeInterview(candidate: Candidate): boolean {
    // Vérifier que tous les biais sont résolus
    const biasEvents = candidate.currentInterview.biasLog;
    const unresolvedBiases = biasEvents.filter((b) => !b.resolved);

    if (unresolvedBiases.length > 0) {
      return false;
    }

    // Vérifier que l'état est REFLEXION
    const currentState = this.mapToDetailedState(candidate.currentInterview.state);
    if (currentState !== DetailedInterviewState.REFLEXION) {
      return false;
    }

    // Vérifier le Principe d'Or
    const goldenRule = this.checkGoldenRule(candidate);
    if (!goldenRule.respects) {
      return false;
    }

    return true;
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
        state: "INTRODUCTION",
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
        nodes: new Map(),
        edges: new Map(),
      },
      growthProfile: {
        id: "GROWTH_001",
        skills: new Map(),
      },
    };

    logInfo("=== État actuel ===");
    const currentState = this.mapToDetailedState(candidate.currentInterview.state);
    logInfo(currentState);
    const stateInfo = this.getStateInfo(currentState);
    logInfo(`État ${stateInfo.id} : ${stateInfo.objective}`);

    logInfo("\n=== Principe d'Or ===");
    const goldenRule = this.checkGoldenRule(candidate);
    logInfo(`Respecté : ${goldenRule.respects ? "Oui" : "Non"}`);
    logInfo(`Pressure level : ${goldenRule.pressureLevel.toFixed(2)}`);
    logInfo(`Empathy level : ${goldenRule.empathyLevel.toFixed(2)}`);
    logInfo(`Delta : ${goldenRule.delta.toFixed(2)}`);

    logInfo("\n=== Prochain état ===");
    const nextState = this.determineNextState(candidate);
    logInfo(nextState);

    logInfo("\n=== Transitions possibles ===");
    logInfo(this.getPossibleTransitions(currentState).join(", "));

    logInfo("\n=== Progression ===");
    logInfo(`${this.calculateProgress(candidate)}%`);

    logInfo("\n=== Tours restants estimés ===");
    logInfo(String(this.estimateRemainingTurns(candidate)));

    logInfo("\n=== Peut finaliser ===");
    logInfo(this.canFinalizeInterview(candidate) ? "Oui" : "Non");

    logInfo("\n=== Règles de transition ===");
    this.getTransitionRules().forEach((rule) => {
      const mandatory = rule.mandatory ? "[OBLIGATOIRE]" : "";
      logInfo(`${rule.from} → ${rule.to} : ${rule.condition} ${mandatory}`);
    });
  }
}

export const interviewStateMachine = InterviewStateMachine.getInstance();
