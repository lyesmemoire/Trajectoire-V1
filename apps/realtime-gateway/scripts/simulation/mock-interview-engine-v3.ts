/**
 * Mock V3 interview engine for simulation without LLM dependency
 * Uses heuristic evaluators instead of LLM calls
 */

import {
  evaluateBluff,
  evaluateConsistencyGap,
  evaluateHRNarrative,
  evaluateTechDirector,
  evaluatePressure,
  evaluateLeadership
} from "./mock-evaluators.js";

export interface InterviewStateV3 {
  context: unknown;
  targetRole?: string;
  turnCount: number;
  history: Array<{ role: "assistant" | "user", content: string }>;
  phase: "Phase1" | "Phase2" | "Phase3" | "Phase4";
  pressureLevel: number;
  integrityRiskIndex: number;
  consistencyGapTrend: "Stable" | "Increasing" | "Critical";
  bluffTrend: "Stable" | "Increasing" | "Critical";
  flaggedWeakZones: Array<{ claimId: string; claimText: string; source: string; timesTested: number; lastTestedTurn: number }>;
  retestedClaims: string[];
  maxPressureLevel?: number;
  errorOccurred?: boolean;
  timeoutOccurred?: boolean;
  phase1Scores?: { overall_score: number };
  phase2Scores?: { overall_score: number };
  phase3Scores?: { overall_score: number };
  phase4Scores?: { strategic_thinking_score: number; conflict_leadership_score: number; organizational_impact_score: number };
  lastQuestion: string;
  lastAction?: string;
  avgTech: number;
  avgComm: number;
  avgAlign: number;
  avgQuant: number;
  techCount: number;
  commCount: number;
  alignCount: number;
  quantCount: number;
  integrityRiskTimeline: number[];
  pressureTimeline: number[];
}

const PHASE_QUESTIONS = {
  Phase1: [
    "Bonjour, je suis le Directeur des Ressources Humaines. Présentez-moi votre trajectoire en 2 minutes.",
    "Qu'est-ce qui vous motive à changer de poste maintenant ?",
    "Comment décririez-vous votre style de travail et votre approche des défis ?"
  ],
  Phase2: [
    "Parlez-moi d'un projet technique complexe que vous avez mené.",
    "Comment avez-vous géré les problèmes de performance dans vos systèmes ?",
    "Quelle est votre approche pour l'architecture logicielle ?"
  ],
  Phase3: [
    "Décrivez une situation où vous avez dû prendre une décision difficile sous pression.",
    "Comment gérez-vous les conflits techniques au sein de l'équipe ?",
    "Parlez-moi d'un échec et de ce que vous en avez appris."
  ],
  Phase4: [
    "Comment alignez-vous les objectifs techniques avec la stratégie business ?",
    "Décrivez votre expérience dans la gestion d'équipes pluridisciplinaires.",
    "Quelle est votre vision du leadership technique dans notre organisation ?"
  ]
};

export function initInterviewV3(input: { context: unknown, targetRole?: string }) {
  const question = PHASE_QUESTIONS.Phase1[0];
  const state: InterviewStateV3 = {
    context: input.context,
    turnCount: 0,
    history: [{ role: "assistant", content: question }],
    phase: "Phase1",
    pressureLevel: 1,
    integrityRiskIndex: 0,
    consistencyGapTrend: "Stable",
    bluffTrend: "Stable",
    flaggedWeakZones: [],
    retestedClaims: [],
    lastQuestion: question,
    avgTech: 0, avgComm: 0, avgAlign: 0, avgQuant: 0,
    techCount: 0, commCount: 0, alignCount: 0, quantCount: 0,
    integrityRiskTimeline: [],
    pressureTimeline: []
  };
  if (input.targetRole) state.targetRole = input.targetRole;

  return { state, question };
}

function updateTrend(previousTrend: string, newScore: number): "Stable" | "Increasing" | "Critical" {
  if (newScore > 7 && previousTrend === "Increasing") return "Critical";
  if (newScore > 6.5) return "Increasing";
  return "Stable";
}

function addToAverage(avg: number, count: number, val: number) {
  return ((avg * count) + val) / (count + 1);
}

export async function nextV3Step(state: InterviewStateV3, transcript: string) {
  state.turnCount++;
  state.history.push({ role: "user", content: transcript });
  
  const question = state.lastQuestion;
  const context = state.context as Record<string, unknown>;
  const cv = (context.cv_strengths as string[] | undefined)?.[0] || "";
  
  // Evaluate based on current phase
  let techScore = 5, commScore = 5, alignScore = 5, quantScore = 5;
  
  if (state.phase === "Phase1") {
    const hrEval = await evaluateHRNarrative(transcript);
    state.phase1Scores = { overall_score: hrEval.overall_score };
    commScore = hrEval.clarity_score;
    alignScore = hrEval.structure_score;
  } else if (state.phase === "Phase2") {
    const techEval = await evaluateTechDirector(question, transcript);
    state.phase2Scores = { overall_score: techEval.overall_score };
    techScore = techEval.technical_depth_score;
    quantScore = techEval.precision_score;
  } else if (state.phase === "Phase3") {
    const pressureEval = await evaluatePressure(transcript);
    state.phase3Scores = { overall_score: pressureEval.pressure_score };
    // Increase pressure based on hesitation
    if (pressureEval.pressure_score > 5) {
      state.pressureLevel = Math.min(5, state.pressureLevel + 1);
    }
  } else if (state.phase === "Phase4") {
    const leadEval = await evaluateLeadership(transcript);
    state.phase4Scores = {
      strategic_thinking_score: leadEval.strategic_thinking_score,
      conflict_leadership_score: leadEval.conflict_leadership_score,
      organizational_impact_score: leadEval.organizational_impact_score
    };
    alignScore = leadEval.strategic_thinking_score;
  }
  
  // Bluff and consistency evaluation (all phases)
  const bluffEval = await evaluateBluff(question, transcript);
  const consistencyEval = await evaluateConsistencyGap(question, transcript, cv);
  
  // Update averages
  state.avgTech = addToAverage(state.avgTech, state.techCount, techScore);
  state.avgComm = addToAverage(state.avgComm, state.commCount, commScore);
  state.avgAlign = addToAverage(state.avgAlign, state.alignCount, alignScore);
  state.avgQuant = addToAverage(state.avgQuant, state.quantCount, quantScore);
  state.techCount++;
  state.commCount++;
  state.alignCount++;
  state.quantCount++;
  
  // Update trends
  state.bluffTrend = updateTrend(state.bluffTrend, bluffEval.bluff_score);
  state.consistencyGapTrend = updateTrend(state.consistencyGapTrend, 10 - consistencyEval.consistency_score);
  
  // Compute integrity risk
  const consistencyRisk = consistencyEval.consistency_score / 10;
  const bluffRisk = bluffEval.bluff_score / 10;
  const technicalDeficit = 1 - (techScore / 10);
  const quantificationDeficit = 1 - (quantScore / 10);
  
  const rawRisk = (0.28 * consistencyRisk) + (0.22 * bluffRisk) + (0.20 * technicalDeficit) + (0.15 * quantificationDeficit) + (0.15 * 0.3);
  state.integrityRiskIndex = (0.6 * state.integrityRiskIndex) + (0.4 * rawRisk);
  state.integrityRiskIndex = Math.min(Math.max(state.integrityRiskIndex, 0), 1);
  
  state.integrityRiskTimeline.push(state.integrityRiskIndex);
  state.pressureTimeline.push(state.pressureLevel);
  
  // Flag weak zones if bluff detected
  if (bluffEval.verdict === "Likely Bluff") {
    state.flaggedWeakZones.push({
      claimId: `weak_${state.turnCount}`,
      claimText: transcript.substring(0, 50) + "...",
      source: "WeakZone",
      timesTested: 1,
      lastTestedTurn: state.turnCount
    });
  }
  
  // Phase progression
  let nextQuestion = "";
  let action = "continue";
  
  const turnsInPhase = state.turnCount % 3;
  if (turnsInPhase === 2) {
    // Move to next phase
    const phases: Array<"Phase1" | "Phase2" | "Phase3" | "Phase4"> = ["Phase1", "Phase2", "Phase3", "Phase4"];
    const currentIdx = phases.indexOf(state.phase);
    if (currentIdx < phases.length - 1) {
      state.phase = phases[currentIdx + 1];
      nextQuestion = PHASE_QUESTIONS[state.phase][0];
      action = `phase_transition_to_${state.phase}`;
    } else {
      nextQuestion = "Merci pour cet entretien. Avez-vous des questions ?";
      action = "finish";
    }
  } else {
    // Next question in current phase
    const phaseQuestions = PHASE_QUESTIONS[state.phase];
    nextQuestion = phaseQuestions[Math.min(turnsInPhase + 1, phaseQuestions.length - 1)];
  }
  
  state.lastQuestion = nextQuestion;
  state.lastAction = action;
  state.history.push({ role: "assistant", content: nextQuestion });
  
  const finished = action === "finish" || state.turnCount >= 10;
  
  return {
    question: nextQuestion,
    updatedState: state,
    evaluationScore: (techScore + commScore + alignScore + quantScore) / 4,
    finished
  };
}
