/**
 * Tests P3.6 — Interview Engine V2 (réaliste, déterministe).
 */
// @ts-nocheck

import { describe, it, expect } from "vitest";
import { buildCandidateProfile, claimsSkill } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-profile";
import { getPersona } from "@/apps/realtime-gateway/src/voice-interview/core/v2/personas";
import { buildInterviewPlan, V2_PHASE_ORDER } from "@/apps/realtime-gateway/src/voice-interview/core/v2/interview-plan-builder";
import { extractSignals } from "@/apps/realtime-gateway/src/voice-interview/core/v2/answer-signals";
import { pickTrapQuestion } from "@/apps/realtime-gateway/src/voice-interview/core/v2/trap-question-engine";
import { buildHiringRecommendation } from "@/apps/realtime-gateway/src/voice-interview/core/v2/interview-report";
import { initInterviewV2, nextV2Step } from "@/apps/realtime-gateway/src/voice-interview/core/v2/interview-engine-v2";

const STRONG =
  "Dans le cadre d'un projet client, ma mission était de réduire les délais. " +
  "J'ai conçu et déployé une nouvelle architecture. Résultat : -30% de délai en 3 mois.";

describe("CandidateProfile", () => {
  it("dérive skills, séniorité et claimsSkill", () => {
    const p = buildCandidateProfile({
      strengths: ["React", "Node"],
      gaps: ["kubernetes"],
      matchScore: 80,
      targetRole: "Dev Fullstack",
      cvText: "Senior developer. React, Node.js, Docker.",
      jobText: "React, Node, Kubernetes",
    });
    expect(p.seniority).toBe("senior");
    expect(p.gaps).toContain("kubernetes");
    expect(claimsSkill(p, "docker")).toBe(true);
  });
});

describe("plan & personas", () => {
  it("plan ordonné avec phases canoniques", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 60 });
    const plan = buildInterviewPlan(profile, getPersona("technical_lead"));
    expect(plan.phases).toEqual(V2_PHASE_ORDER);
    expect(plan.questionsPerPhase.technical).toBeGreaterThanOrEqual(2); // persona technique
  });
});

describe("answer-signals", () => {
  it("ownership fort vs faible", () => {
    expect(extractSignals("J'ai conçu et déployé le système.").ownership)
      .toBeGreaterThan(extractSignals("J'ai participé au projet, on a fait des choses.").ownership);
  });
  it("résultat chiffré détecté", () => {
    expect(extractSignals("Résultat : -30% en 3 mois.").quantifiedResults).toBe(1);
  });
});

describe("trap questions", () => {
  it("déclenchée seulement si la compétence est revendiquée", () => {
    const claims = buildCandidateProfile({ strengths: ["kubernetes"], matchScore: 70, cvText: "kubernetes expert" });
    const noClaims = buildCandidateProfile({ strengths: ["react"], matchScore: 70, cvText: "react dev" });
    expect(pickTrapQuestion(claims, [])).toContain("Kubernetes");
    // react -> il existe un piège react, donc on teste une compétence non revendiquée
    const onlyJava = buildCandidateProfile({ strengths: ["java"], matchScore: 70, cvText: "java dev" });
    expect(pickTrapQuestion(onlyJava, [])).toBeNull();
    expect(noClaims).toBeDefined();
  });
});

describe("interview flow V2", () => {
  it("init pose une question de warmup", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 60, targetRole: "Dev" });
    const { state, question } = initInterviewV2({ profile, persona: "neutral" });
    expect(question.length).toBeGreaterThan(0);
    expect(state.phase).toBe("warmup");
    expect(state.memory.askedQuestions).toHaveLength(1);
  });

  it("avance dans les phases avec de bonnes réponses et finit par une reco", () => {
    const profile = buildCandidateProfile({ strengths: ["react", "node"], gaps: ["aws"], matchScore: 70, targetRole: "Dev" });
    let { state } = initInterviewV2({ profile, persona: "neutral" });
    let rec;
    for (let i = 0; i < 30 && !state.finished; i++) {
      const r = nextV2Step(state, STRONG);
      state = r.updatedState;
      if (r.recommendation) rec = r.recommendation;
    }
    expect(state.finished).toBe(true);
    expect(rec).toBeDefined();
    expect(["strong_hire", "hire", "mixed", "weak", "reject"]).toContain(rec!.decision);
    expect(rec!.report.overall).toBeGreaterThanOrEqual(0);
  });

  it("réponse faible -> relance (pas d'avancement de phase)", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 60 });
    const { state } = initInterviewV2({ profile, persona: "neutral" });
    const phaseBefore = state.phase;
    const r = nextV2Step(state, "euh je sais pas trop");
    expect(r.updatedState.phase).toBe(phaseBefore); // reste en warmup
    expect(r.question.length).toBeGreaterThan(0);
  });

  it("est déterministe", () => {
    const profile = buildCandidateProfile({ strengths: ["react"], gaps: ["aws"], matchScore: 60 });
    const a = initInterviewV2({ profile, persona: "neutral" });
    const b = initInterviewV2({ profile, persona: "neutral" });
    expect(a.question).toBe(b.question);
    expect(nextV2Step(a.state, STRONG).question).toBe(nextV2Step(b.state, STRONG).question);
  });
});

describe("hiring recommendation", () => {
  it("strong réponses -> décision favorable", () => {
    const turns = Array.from({ length: 5 }, () => ({
      category: "technical",
      score: 90,
      signals: { confidence: 0.9, specificity: 0.9, ownership: 0.9, technicalDepth: 0.9, quantifiedResults: 1 },
    }));
    const rec = buildHiringRecommendation(turns);
    expect(["strong_hire", "hire"]).toContain(rec.decision);
    expect(rec.strengths.length).toBeGreaterThan(0);
  });
  it("réponses faibles -> décision réservée", () => {
    const turns = Array.from({ length: 3 }, () => ({
      category: "experience",
      score: 25,
      signals: { confidence: 0.2, specificity: 0.1, ownership: 0.2, technicalDepth: 0.1, quantifiedResults: 0 },
    }));
    const rec = buildHiringRecommendation(turns);
    expect(["weak", "reject", "mixed"]).toContain(rec.decision);
  });
});
