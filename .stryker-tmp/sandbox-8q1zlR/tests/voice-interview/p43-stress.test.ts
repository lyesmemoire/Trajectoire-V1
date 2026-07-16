/**
 * Tests P4.3 — Stress-test systémique (boucle fermée seedée).
 * Vérifie que les MÉTRIQUES FORMELLES de stabilité tiennent sur un échantillon.
 * (Échantillon réduit ici pour la CI ; le rapport complet tourne sur 1000.)
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import {
  linearSlope,
  variance,
  oscillationEnergy,
  STABILITY_THRESHOLDS,
} from "@/apps/realtime-gateway/src/voice-interview/stress/metrics";
import {
  runStress,
  runOneInterview,
} from "@/apps/realtime-gateway/src/voice-interview/stress/run-stress";
import { ARCHETYPES } from "@/apps/realtime-gateway/src/voice-interview/stress/synthetic-candidate";

describe("P4.3 — métriques (sanity math)", () => {
  it("linearSlope détecte une tendance", () => {
    expect(linearSlope([0, 1, 2, 3, 4])).toBeCloseTo(1, 5);
    expect(linearSlope([5, 5, 5, 5])).toBeCloseTo(0, 5);
  });
  it("variance et oscillation cohérentes", () => {
    expect(variance([2, 2, 2])).toBe(0);
    expect(oscillationEnergy([0, 1, 0, 1])).toBeCloseTo(1, 5);
    expect(oscillationEnergy([3, 3, 3])).toBe(0);
  });
});

describe("P4.3 — déterminisme de la boucle fermée", () => {
  it("même seed + archétype → trajectoire identique", () => {
    const a = runOneInterview(123, "bluffer");
    const b = runOneInterview(123, "bluffer");
    expect(a.trajectory).toEqual(b.trajectory);
    expect(a.metrics).toEqual(b.metrics);
  });
});

describe("P4.3 — stabilité sous charge (échantillon 150)", () => {
  const result = runStress(150, 1);

  it("0 violation de bornes (Mind + Simulation)", () => {
    expect(result.totalBoundViolations).toBe(0);
  });

  it("pas de drift divergent (suspicion & pression)", () => {
    expect(result.maxAbsDriftSuspicion).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxAbsDrift);
    expect(result.maxAbsDriftPressure).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxAbsDrift);
  });

  it("oscillation UX bornée (anti-saccade)", () => {
    expect(result.maxOscToneShift).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxOscToneShift);
    expect(result.maxOscInterruption).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxOscInterruption);
    expect(result.maxOscSilence).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxOscSilence);
  });

  it("enveloppe : la dispersion n'explose pas", () => {
    expect(result.maxEnvelopeRatioFinite).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxEnvelopeRatio);
  });

  it("path dependency : seeds adjacents cohérents (pas de chaos)", () => {
    expect(result.maxPathDistance).toBeLessThanOrEqual(STABILITY_THRESHOLDS.maxPathDistance);
  });

  it("couvre tous les archétypes", () => {
    const used = new Set(result.runs.map((r) => r.archetype));
    for (const a of ARCHETYPES) expect(used.has(a)).toBe(true);
  });
});
