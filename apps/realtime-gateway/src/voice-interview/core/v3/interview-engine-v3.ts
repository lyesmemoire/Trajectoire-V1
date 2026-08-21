// @ts-nocheck
import { evaluateBluff } from "./bluff-detector.js";
import { evaluateConsistencyGap } from "./integrity-detector.js";
import { evaluateHRNarrative } from "./hr-narrative-evaluator.js";
import { evaluateTechDirector } from "./tech-director-evaluator.js";
import { evaluatePressure } from "./pressure-evaluator.js";
import { evaluateLeadership } from "./leadership-evaluator.js";
import { determineAdaptiveNextMove, AdaptiveControllerInput } from "./adaptive-controller.js";
// Meta-brain integration (mode shadow - palier 1 / pilotage - palier 2)
import { 
  runUnifiedEvaluation, 
  runMetaDecision, 
  runMultiEngineQuestionGenerator,
  extractLegacySignalsRudimentary
} from "../meta/index.js";

export interface ClaimFocus {
  claimId: string;
  claimText: string;
  source: "CV" | "WeakZone" | "Retest";
  timesTested: number;
  lastTestedTurn: number;
}

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
  flaggedWeakZones: ClaimFocus[];
  retestedClaims: string[];
  maxPressureLevel?: number;
  errorOccurred?: boolean;
  timeoutOccurred?: boolean;
  phase1Scores?: unknown;
  phase2Scores?: unknown;
  phase3Scores?: unknown;
  phase4Scores?: unknown;
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

export function initInterviewV3(input: { context: unknown, targetRole?: string }) {
  const question = `Bonjour, je suis le Directeur des Ressources Humaines. PrÃ©sentez-moi votre trajectoire en 2 minutes.`;
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

function selectRelevantClaim(state: InterviewStateV3, context: unknown) {
  const weakClaims = state.flaggedWeakZones.filter(c => c.timesTested < 2);
  if (weakClaims.length > 0 && weakClaims[0]) {
    const claim = weakClaims[0];
    claim.timesTested += 1;
    claim.lastTestedTurn = state.turnCount;
    return claim.claimText;
  }

  if (state.phase === "Phase2" && context.cv_strengths && context.cv_strengths.length > 0) {
    return context.cv_strengths[state.turnCount % context.cv_strengths.length];
  }
  return "General coherence";
}

function updateTrend(previousTrend: string, newScore: number): "Stable" | "Increasing" | "Critical" {
  // Realistic calibration: less aggressive trend detection
  if (newScore > 7 && previousTrend === "Increasing") return "Critical";
  if (newScore > 6.5) return "Increasing";
  return "Stable";
}

interface ComputeRiskInputs {
  previousRisk: number;
  consistencyGapScore: number;
  bluffScore: number;
  technicalDepthScore: number;
  quantificationDepthScore: number;
  careerMaturityScore: number;
  cvClaimImpactLevel: "High" | "Normal";
}

function computeIntegrityRisk({
  previousRisk, consistencyGapScore, bluffScore, technicalDepthScore, quantificationDepthScore, careerMaturityScore, cvClaimImpactLevel
}: ComputeRiskInputs) {
  const ConsistencyRisk = consistencyGapScore / 10;
  const BluffRisk = bluffScore / 10;
  const TechnicalDeficit = 1 - (technicalDepthScore / 10);
  const QuantificationDeficit = 1 - (quantificationDepthScore / 10);
  const MaturityDeficit = 1 - (careerMaturityScore / 10);

  // RÃ©alisme ModÃ©rÃ© Exigeant calibration
  let raw =
      (0.28 * ConsistencyRisk) +
      (0.22 * BluffRisk) +
      (0.20 * TechnicalDeficit) +
      (0.15 * QuantificationDeficit) +
      (0.15 * MaturityDeficit);

  // Amplification mesurÃ©e (pas destructrice)
  if (ConsistencyRisk > 0.7 && BluffRisk > 0.7) raw += 0.10;
  if (TechnicalDeficit > 0.7 && cvClaimImpactLevel === "High") raw += 0.10;
  if (QuantificationDeficit > 0.8) raw += 0.08;

  const finalRisk = (0.6 * previousRisk) + (0.4 * raw);
  return Math.min(Math.max(finalRisk, 0), 1);
}

function addToAverage(avg: number, count: number, val: number) {
  return ((avg * count) + val) / (count + 1);
}

/**
 * Mappe les phases V3 vers les phases du meta-brain.
 * Phase1 (HR narrative) â†’ "hr"
 * Phase2 (Tech Director) â†’ "tech"
 * Phase3 (Pressure) â†’ "pressure"
 * Phase4 (Leadership) â†’ "leadership"
 */
function mapV3PhaseToMeta(phase: "Phase1" | "Phase2" | "Phase3" | "Phase4"): "hr" | "tech" | "pressure" | "leadership" | "wrap" {
  switch (phase) {
    case "Phase1": return "hr";
    case "Phase2": return "tech";
    case "Phase3": return "pressure";
    case "Phase4": return "leadership";
    default: return "wrap";
  }
}

/**
 * Mappe les phases du meta-brain vers les phases V3 (mapping inverse).
 * "hr" â†’ Phase1
 * "tech" â†’ Phase2
 * "pressure" â†’ Phase3
 * "leadership" â†’ Phase4
 * "wrap" â†’ Phase4 (fin)
 */
function mapMetaPhaseToV3(phase: "hr" | "tech" | "pressure" | "leadership" | "wrap"): "Phase1" | "Phase2" | "Phase3" | "Phase4" {
  switch (phase) {
    case "hr": return "Phase1";
    case "tech": return "Phase2";
    case "pressure": return "Phase3";
    case "leadership": return "Phase4";
    case "wrap": return "Phase4";
    default: return "Phase2";
  }
}

import { detectIntent } from "../intent-detector.js";
import { handlePilotCommand, extractPilotAction } from "../strategies/pilot-commands.js";

export async function nextV3Step(state: InterviewStateV3, transcript: string) {
  // 0) DÃ©tection d'intention (interception des commandes de pilotage)
  const intent = detectIntent(transcript);
  const pilotAction = extractPilotAction(intent);

  if (pilotAction) {
    const result = handlePilotCommand(pilotAction, state.lastQuestion);
    
    console.info("[interview-engine-v3] pilot_command_handled", {
      phase: state.phase,
      command: pilotAction
    });

    return {
      question: result.speakText ?? "",
      updatedState: state, // Pas de mutation pour ne pas fausser l'historique
      evaluationScore: 100 - (state.integrityRiskIndex * 100), // Score neutre (maintien)
      finished: !!result.finished,
    };
  }

  state.history.push({ role: "user", content: transcript });
  state.turnCount += 1;

  if (state.turnCount === 3 && state.phase === "Phase1") {
    state.phase = "Phase2";
  } else if (state.turnCount === 6 && state.phase === "Phase2") {
    const shouldEnterPhase3 = 
      state.integrityRiskIndex > 0.6 ||
      state.consistencyGapTrend === "Increasing" ||
      state.bluffTrend === "Increasing" ||
      (state.techCount > 0 && (state.avgTech / state.techCount) < 6);

    if (shouldEnterPhase3) {
      state.phase = "Phase3";
    } else {
      state.phase = "Phase4"; // Skip to Phase 4 if solid
    }
  } else if (state.turnCount === 8 && state.phase === "Phase3") {
    state.phase = "Phase4";
  }

  const activeClaim = selectRelevantClaim(state, state.context);
  
  // 1. Parallel evaluations
  const [bluffEval, consistencyEval] = await Promise.all([
    evaluateBluff(state.lastQuestion, transcript),
    evaluateConsistencyGap(activeClaim, transcript)
  ]);

  let techScore = 10;
  let quantScore = 10;
  let maturityScore = 10;
  let alignScore = 10;
  let commScore = 10 - bluffEval.bluff_score; // rough estimate for comm

  if (state.phase === "Phase1") {
    const hrEval = await evaluateHRNarrative(state.lastQuestion, transcript);
    state.phase1Scores = hrEval;
    maturityScore = hrEval.career_maturity_score;
    alignScore = hrEval.strategic_alignment_score;
    commScore = hrEval.clarity_score;
    techScore = 10; 
    quantScore = 10; 
  } else if (state.phase === "Phase2") {
    const techEval = await evaluateTechDirector(state.lastQuestion, transcript);
    state.phase2Scores = techEval;
    techScore = techEval.technical_depth_score;
    quantScore = techEval.quantification_depth_score;
    maturityScore = techEval.operational_clarity_score;
    alignScore = techEval.architectural_thinking_score;
    commScore = 10 - bluffEval.bluff_score;
  } else if (state.phase === "Phase3") {
    const pressureEval = await evaluatePressure(state.lastQuestion, transcript);
    state.phase3Scores = pressureEval;
    
    commScore = pressureEval.recovery_clarity_score;
    alignScore = pressureEval.contradiction_coherence_score;
    techScore = pressureEval.stress_precision_score;
    quantScore = pressureEval.stress_precision_score;
    maturityScore = pressureEval.pressure_stability_score;
  } else if (state.phase === "Phase4") {
    const leadershipEval = await evaluateLeadership(state.lastQuestion, transcript);
    state.phase4Scores = leadershipEval;

    commScore = leadershipEval.executive_presence_score;
    alignScore = leadershipEval.strategic_thinking_score;
    techScore = 10;
    quantScore = 10;
    maturityScore = leadershipEval.organizational_impact_score;
  }

  // Averages
  state.avgTech = addToAverage(state.avgTech, state.techCount, techScore); state.techCount++;
  state.avgComm = addToAverage(state.avgComm, state.commCount, commScore); state.commCount++;
  state.avgAlign = addToAverage(state.avgAlign, state.alignCount, alignScore); state.alignCount++;
  state.avgQuant = addToAverage(state.avgQuant, state.quantCount, quantScore); state.quantCount++;

  state.integrityRiskIndex = computeIntegrityRisk({
    previousRisk: state.integrityRiskIndex,
    consistencyGapScore: consistencyEval.consistency_gap_score,
    bluffScore: bluffEval.bluff_score,
    technicalDepthScore: techScore,
    quantificationDepthScore: quantScore,
    careerMaturityScore: maturityScore,
    cvClaimImpactLevel: "High" 
  });

  state.bluffTrend = updateTrend(state.bluffTrend, bluffEval.bluff_score);
  state.consistencyGapTrend = updateTrend(state.consistencyGapTrend, consistencyEval.consistency_gap_score);

  if (consistencyEval.consistency_gap_score > 6 && !state.flaggedWeakZones.find(z => z.claimText === activeClaim)) {
    state.flaggedWeakZones.push({
      claimId: `claim_${Date.now()}`,
      claimText: activeClaim,
      source: "WeakZone",
      timesTested: 0,
      lastTestedTurn: state.turnCount
    });
  }

  const controllerInput: AdaptiveControllerInput = {
    phase: state.phase,
    last_question: state.lastQuestion,
    last_response_summary: consistencyEval.explanation_summary,
    scores: {
      technical_depth_score: techScore,
      quantification_depth_score: quantScore,
      consistency_gap_score: consistencyEval.consistency_gap_score,
      bluff_score: bluffEval.bluff_score,
      career_maturity_score: maturityScore,
      strategic_alignment_score: alignScore,
      clarity_score: commScore
    },
    cumulative_state: {
      integrity_risk_index: state.integrityRiskIndex,
      consistency_gap_trend: state.consistencyGapTrend,
      bluff_trend: state.bluffTrend,
      pressure_level: state.pressureLevel,
      retested_claims: state.retestedClaims,
      flagged_weak_zones: state.flaggedWeakZones.map(z => z.claimText)
    },
    interview_context: state.context
  };

  const decision = await determineAdaptiveNextMove(controllerInput);

  let finalAction = decision.decision.escalation_action;

  // Pressure stabilization: prevent toxic loops
  // After 2 consecutive turns at level 5, force cooldown to level 3
  if (state.pressureLevel === 5 && state.lastAction === "IncreasePressure" && finalAction === "IncreasePressure") {
    finalAction = "Continue";
  }

  // Progressive pressure capping for realism
  let newPressure = decision.decision.new_pressure_level;
  // Level 4 only if serious inconsistency, level 5 only for flagrant contradictions
  if (state.integrityRiskIndex <= 0.4) newPressure = Math.min(newPressure, 3);
  else if (state.integrityRiskIndex <= 0.6) newPressure = Math.min(newPressure, 4);

  state.pressureLevel = newPressure;
  state.lastAction = finalAction;
  state.lastQuestion = decision.next_question.question_text;
  
  if (decision.updated_internal_flags.retested_claim) {
    state.retestedClaims.push(decision.updated_internal_flags.retested_claim);
  }

  // Record timelines
  state.integrityRiskTimeline.push(state.integrityRiskIndex);
  state.pressureTimeline.push(state.pressureLevel);

  // === META-BRAIN SHADOW MODE (PALIER 1) / PILOTAGE (PALIER 2) ===
  // Le meta-brain tourne en parallÃ¨le. 
  // USE_META_BRAIN=true : pilote les questions
  // USE_META_BRAIN=false ou undefined : mode shadow (log seulement)
  const USE_META_BRAIN = process.env.USE_META_BRAIN === "true";
  
  try {
    // Construire un snapshot RecruiterMind minimal depuis l'Ã©tat V3
    const recruiterMindSnapshot = {
      trust: Math.max(0, 1 - state.integrityRiskIndex),
      suspicion: state.integrityRiskIndex,
      engagement: Math.max(0, 1 - (state.turnCount * 0.1)),
      pressure_level: state.pressureLevel / 5,
      fatigue: Math.min(state.turnCount * 0.1, 1),
      confidence: (state.avgTech + state.avgComm + state.avgAlign) / 3 / 10,
      momentum: 0
    };

    // PALIER 3 : Extraire les signaux V1/V2 rudimentaires depuis V3
    // Mapping progressif pour lier les 3 cerveaux
    const avgV3Score = (state.avgTech + state.avgComm + state.avgAlign) / 3;
    const legacySignals = extractLegacySignalsRudimentary(avgV3Score, state.integrityRiskIndex);

    // Ã‰valuation unifiÃ©e (V3 + V1/V2 rudimentaires pour l'instant)
    const unified = await runUnifiedEvaluation({
      candidate_answer: transcript,
      v1_signals: legacySignals.v1_signals, // Palier 3 : signaux V1 rudimentaires
      v2_signals: legacySignals.v2_signals, // Palier 3 : signaux V2 rudimentaires
      v3_signals: {
        bluff_score: bluffEval.bluff_score,
        vagueness_level: bluffEval.vagueness_level,
        integrity_risk_index: state.integrityRiskIndex,
        leadership_signal: state.phase === "Phase4" ? commScore : undefined
      },
      recruiter_mind_snapshot: recruiterMindSnapshot
    });

    // DÃ©cision mÃ©ta
    const metaDecision = await runMetaDecision({
      unified_signals: unified,
      recruiter_mind_snapshot: recruiterMindSnapshot,
      interview_state: {
        current_phase: mapV3PhaseToMeta(state.phase),
        current_pressure_level: state.pressureLevel,
        profile_level: "senior", // Ã  configurer selon le candidat
        turn_count: state.turnCount,
        max_turns: 10
      }
    });

    // GÃ©nÃ©ration de question multi-moteur
    const metaQuestion = await runMultiEngineQuestionGenerator({
      job_context: {
        job_title: state.targetRole ?? "Senior Engineer",
        job_requirements: Array.isArray((state.context as any)?.job_requirements) 
          ? (state.context as any).job_requirements 
          : []
      },
      candidate_profile: {
        cv_summary: (state.context as any)?.cv_summary ?? "",
        key_strengths: Array.isArray((state.context as any)?.strengths) 
          ? (state.context as any).strengths 
          : [],
        key_gaps: Array.isArray((state.context as any)?.gaps) 
          ? (state.context as any).gaps 
          : []
      },
      interview_state: {
        current_phase: metaDecision.meta_decision.target_phase,
        current_pressure_level: metaDecision.meta_decision.target_pressure_level,
        profile_level: "senior",
        turn_count: state.turnCount,
        max_turns: 10
      },
      meta_decision: metaDecision.meta_decision,
      engine_routing: metaDecision.engine_routing,
      unified_signals: unified,
      candidate_recent_answers: state.history.slice(-3).map(h => ({
        question: h.role === "assistant" ? h.content : "",
        answer: h.role === "user" ? h.content : "",
        timestamp: new Date().toISOString()
      }))
    });

    if (USE_META_BRAIN) {
      // PALIER 2 : Le meta-brain pilote les questions
      // Met Ã  jour state.phase / pressure avec les cibles mÃ©ta
      state.phase = mapMetaPhaseToV3(metaDecision.meta_decision.target_phase);
      state.pressureLevel = metaDecision.meta_decision.target_pressure_level;
      state.lastQuestion = metaQuestion.next_question.question_text;
      
      console.log(JSON.stringify({
        meta_brain_pilot: {
          turn: state.turnCount,
          phase: state.phase,
          pressureLevel: state.pressureLevel,
          unified,
          metaDecision,
          metaQuestion: {
            question_text: metaQuestion.next_question.question_text,
            interviewer_role: metaQuestion.next_question.interviewer_role,
            tone: metaQuestion.next_question.tone,
            primary_goal: metaQuestion.question_intent.primary_goal
          }
        }
      }));
    } else {
      // PALIER 1 : LOG seulement, on n'utilise pas encore metaQuestion
      console.log(JSON.stringify({
        meta_brain_shadow: {
          turn: state.turnCount,
          phase: state.phase,
          unified,
          metaDecision,
          metaQuestion: {
            question_text: metaQuestion.next_question.question_text,
            interviewer_role: metaQuestion.next_question.interviewer_role,
            tone: metaQuestion.next_question.tone,
            primary_goal: metaQuestion.question_intent.primary_goal
          }
        }
      }));
    }
  } catch (error) {
    console.error("[meta-brain] Error:", error);
    // Ne pas bloquer le flux V3 en cas d'erreur du meta-brain
    // En mode pilotage, on fallback sur la logique V3 existante
  }
  // === END META-BRAIN MODE ===

  // Calibration Instrumentation Log
  console.log(JSON.stringify({
    turn: state.turnCount,
    phase: state.phase,
    pressureLevel: state.pressureLevel,
    scores: {
      technicalDepth: techScore,
      quantificationDepth: quantScore,
      consistencyGap: consistencyEval.consistency_gap_score,
      bluffScore: bluffEval.bluff_score,
    },
    integrity: {
      index: state.integrityRiskIndex,
    },
    escalation: finalAction
  }));

  const isFinished = state.turnCount >= 10 || 
                     (finalAction === "AdvancePhase" && state.phase === "Phase4");

  if (!isFinished) {
    state.history.push({ role: "assistant", content: state.lastQuestion });
  }

  return {
    question: isFinished ? "Merci pour cet entretien. L'Ã©valuation est terminÃ©e." : state.lastQuestion,
    updatedState: state,
    evaluationScore: 100 - (state.integrityRiskIndex * 100),
    finished: isFinished,
    phase1Scores: state.phase1Scores,
    phase2Scores: state.phase2Scores,
    finalScores: {
      integrityRisk: state.integrityRiskIndex > 0.8 ? "Critical" : state.integrityRiskIndex > 0.6 ? "High" : state.integrityRiskIndex > 0.3 ? "Moderate" : "Low",
      consistencyGap: consistencyEval.consistency_gap_score,
      quantificationDepth: quantScore,
      jobAlignment: alignScore
    }
  };
}
