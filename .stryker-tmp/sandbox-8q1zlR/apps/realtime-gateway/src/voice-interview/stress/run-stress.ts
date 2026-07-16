/**
 * stress/run-stress.ts — Moteur de stress-test fermé (P4.3).
 *
 * Fait tourner N interviews seedées à travers le PIPELINE RÉEL
 * (V2 → Mind → UX → Governor), enregistre les trajectoires, agrège les métriques.
 * Aucun réseau, aucun transport : test SYSTÉMIQUE de la boucle fermée.
 */
// @ts-nocheck

import {
  initInterviewPipeline,
  runInterviewPipeline,
  type PipelineState,
} from "../core/simulation/pipeline.js";
import { buildCandidateProfile } from "../core/v2/candidate-profile.js";
import { checkMindBounds, checkSimulationBounds } from "../core/simulation/stability.js";
import {
  type Archetype,
  ARCHETYPES,
  syntheticAnswer,
} from "./synthetic-candidate.js";
import {
  type Trajectory,
  type TrajectoryMetrics,
  computeTrajectoryMetrics,
  trajectoryDistance,
} from "./metrics.js";

const MAX_TURNS = 40; // garde-fou anti-boucle infinie

export interface InterviewRun {
  seed: number;
  archetype: Archetype;
  trajectory: Trajectory;
  metrics: TrajectoryMetrics;
  boundViolations: number;
}

/** Joue UNE interview complète (jusqu'à finished ou MAX_TURNS). */
export function runOneInterview(seed: number, archetype: Archetype): InterviewRun {
  const profile = buildCandidateProfile({
    strengths: ["react", "node"],
    gaps: ["aws"],
    matchScore: 60,
    targetRole: "Software Engineer",
  });
  let { state } = initInterviewPipeline({ profile, persona: "neutral" });
  const trajectory: Trajectory = [];
  let boundViolations = 0;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const transcript = syntheticAnswer(archetype, seed, turn);
    const result = runInterviewPipeline(state as PipelineState, transcript);
    trajectory.push({ mind: result.mind, ux: result.ux });

    boundViolations +=
      checkMindBounds(result.mind).length +
      checkSimulationBounds(result.state.simulation).length;

    state = result.state;
    if (result.v2.finished) break;
  }

  return {
    seed,
    archetype,
    trajectory,
    metrics: computeTrajectoryMetrics(trajectory),
    boundViolations,
  };
}

export interface StressResult {
  total: number;
  runs: InterviewRun[];
  totalBoundViolations: number;
  emotionDistribution: Record<string, number>;
  maxAbsDriftSuspicion: number;
  maxAbsDriftPressure: number;
  maxOscToneShift: number;
  maxOscInterruption: number;
  maxOscSilence: number;
  maxEnvelopeRatioFinite: number;
  maxPathDistance: number;
}

/** Lance N interviews (réparties cycliquement sur les archétypes). */
export function runStress(n: number, baseSeed = 1): StressResult {
  const runs: InterviewRun[] = [];
  for (let i = 0; i < n; i++) {
    const archetype = ARCHETYPES[i % ARCHETYPES.length]!;
    runs.push(runOneInterview(baseSeed + i, archetype));
  }

  const emotionDistribution: Record<string, number> = {};
  let totalBoundViolations = 0;
  let maxAbsDriftSuspicion = 0;
  let maxAbsDriftPressure = 0;
  let maxOscToneShift = 0;
  let maxOscInterruption = 0;
  let maxOscSilence = 0;
  let maxEnvelopeRatioFinite = 0;

  for (const r of runs) {
    totalBoundViolations += r.boundViolations;
    const e = r.metrics.finalEmotion;
    emotionDistribution[e] = (emotionDistribution[e] ?? 0) + 1;
    maxAbsDriftSuspicion = Math.max(maxAbsDriftSuspicion, Math.abs(r.metrics.driftSuspicion));
    maxAbsDriftPressure = Math.max(maxAbsDriftPressure, Math.abs(r.metrics.driftPressure));
    maxOscToneShift = Math.max(maxOscToneShift, r.metrics.oscToneShift);
    maxOscInterruption = Math.max(maxOscInterruption, r.metrics.oscInterruption);
    maxOscSilence = Math.max(maxOscSilence, r.metrics.oscSilence);
    if (Number.isFinite(r.metrics.envelopeRatioSuspicion)) {
      maxEnvelopeRatioFinite = Math.max(maxEnvelopeRatioFinite, r.metrics.envelopeRatioSuspicion);
    }
  }

  // Path dependency : distance entre seeds adjacents de même archétype.
  let maxPathDistance = 0;
  for (let i = 0; i + ARCHETYPES.length < runs.length; i++) {
    const a = runs[i]!;
    const b = runs[i + ARCHETYPES.length]!; // même archétype, seed suivant
    maxPathDistance = Math.max(maxPathDistance, trajectoryDistance(a.trajectory, b.trajectory));
  }

  return {
    total: n,
    runs,
    totalBoundViolations,
    emotionDistribution,
    maxAbsDriftSuspicion,
    maxAbsDriftPressure,
    maxOscToneShift,
    maxOscInterruption,
    maxOscSilence,
    maxEnvelopeRatioFinite,
    maxPathDistance,
  };
}
