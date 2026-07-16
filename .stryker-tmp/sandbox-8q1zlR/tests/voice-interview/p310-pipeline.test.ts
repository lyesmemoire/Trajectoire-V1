/**
 * Tests P3.10 — Architecture lock & pipeline.
 *  - V2 purifié : nextV2Step ne porte plus d'état simulation.
 *  - Pipeline : runInterviewPipeline orchestre V2 (pur) → simulation (externe).
 *  - Découplage : supprimer le pipeline = V2 marche toujours (les 116 tests V2/sim).
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import { buildCandidateProfile } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-profile";
import {
  initInterviewV2,
  nextV2Step,
  type InterviewStateV2,
} from "@/apps/realtime-gateway/src/voice-interview/core/v2/interview-engine-v2";
import {
  initInterviewPipeline,
  runInterviewPipeline,
} from "@/apps/realtime-gateway/src/voice-interview/core/simulation/pipeline";

const profile = () =>
  buildCandidateProfile({
    strengths: ["react", "node"],
    gaps: ["aws"],
    matchScore: 70,
    targetRole: "Dev",
    cvText: "react node",
  });

const WEAK = "euh je sais pas trop";
const STRONG =
  "Par exemple, dans le cadre d'un projet client important, ma mission était de réduire " +
  "les délais. J'ai conçu et déployé une nouvelle architecture, organisé le travail et " +
  "automatisé le pipeline. Résultat : une réduction de 30% du temps de livraison en 3 mois.";

describe("P3.10 — V2 purifié (verrouillage)", () => {
  it("l'état V2 ne contient plus de champ simulation", () => {
    const { state } = initInterviewV2({ profile: profile(), persona: "neutral" });
    expect((state as InterviewStateV2 & { simulation?: unknown }).simulation).toBeUndefined();
  });
  it("nextV2Step reste déterministe et pur", () => {
    const a = initInterviewV2({ profile: profile(), persona: "neutral" });
    const b = initInterviewV2({ profile: profile(), persona: "neutral" });
    expect(nextV2Step(a.state, WEAK).question).toBe(nextV2Step(b.state, WEAK).question);
  });
});

describe("P3.10 — pipeline orchestrateur", () => {
  it("init expose une question + état { v2, simulation }", () => {
    const { question, state } = initInterviewPipeline({ profile: profile(), persona: "neutral" });
    expect(question.length).toBeGreaterThan(0);
    expect(state.v2).toBeDefined();
    expect(state.simulation).toBeDefined();
  });

  it("runInterviewPipeline fait évoluer la simulation (pression) sur réponse faible", () => {
    const { state } = initInterviewPipeline({ profile: profile(), persona: "neutral" });
    const turn = runInterviewPipeline(state, WEAK);
    expect(turn.state.simulation.pressure.level).toBeGreaterThanOrEqual(
      state.simulation.pressure.level,
    );
    expect(turn.question.length).toBeGreaterThan(0);
    expect(turn.v2).toBeDefined();
  });

  it("façonne la sortie sans changer la décision V2 (substance identique)", () => {
    // Décision V2 brute (sans pipeline)
    const v2 = nextV2Step(initInterviewV2({ profile: profile(), persona: "neutral" }).state, WEAK);
    // Même tour via pipeline
    const piped = runInterviewPipeline(
      initInterviewPipeline({ profile: profile(), persona: "neutral" }).state,
      WEAK,
    );
    const stripped = piped.question
      .replace(/^Soyons direct\. |^Prends ton temps\. /, "")
      .replace(/ \(Sois concis\.\)| Et sois précis\.$/g, "");
    expect(stripped).toContain(v2.question);
  });

  it("accroche cross-session à l'ouverture si historique", () => {
    const { question } = initInterviewPipeline({
      profile: profile(),
      persona: "neutral",
      previousSessions: [{ summary: "x", contradictions: 1, score: 60 }],
    });
    expect(question.toLowerCase()).toContain("dernier");
  });

  it("entretien complet via pipeline -> recruiterReport en fin", () => {
    let state = initInterviewPipeline({ profile: profile(), persona: "neutral" }).state;
    let report;
    for (let i = 0; i < 30; i++) {
      const t = runInterviewPipeline(state, STRONG);
      state = t.state;
      if (t.v2.recruiterReport) report = t.v2.recruiterReport;
      if (t.v2.finished) break;
    }
    expect(report).toBeDefined();
  });
});
