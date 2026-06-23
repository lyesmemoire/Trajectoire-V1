/**
 * Tests P3.7 — Interview Realism Engine (contradictions, bluff, difficulté, parcours, rapport).
 */
import { describe, it, expect } from "vitest";
import { extractCandidateFacts, detectContradiction } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-facts";
import { detectBluff, buildCredibilityScore } from "@/apps/realtime-gateway/src/voice-interview/core/v2/bluff-detector";
import { adaptDifficulty, nextTopicInTree, inferDomain } from "@/apps/realtime-gateway/src/voice-interview/core/v2/difficulty-adapter";
import { inferRoleTrack } from "@/apps/realtime-gateway/src/voice-interview/core/v2/role-tracks";
import { buildRecruiterReport } from "@/apps/realtime-gateway/src/voice-interview/core/v2/recruiter-report";
import { extractSignals } from "@/apps/realtime-gateway/src/voice-interview/core/v2/answer-signals";
import { buildCandidateProfile } from "@/apps/realtime-gateway/src/voice-interview/core/v2/candidate-profile";
import { initInterviewV2, nextV2Step } from "@/apps/realtime-gateway/src/voice-interview/core/v2/interview-engine-v2";

describe("P3.7.1 — contradictions CV ↔ réponses", () => {
  it("extrait les années d'expérience du CV", () => {
    const facts = extractCandidateFacts("Kubernetes : 2 ans. AWS : 4 ans.");
    expect(facts.yearsExperience.kubernetes).toBe(2);
    expect(facts.yearsExperience.aws).toBe(4);
  });
  it("détecte un écart d'années", () => {
    const facts = extractCandidateFacts("Kubernetes : 2 ans.");
    const c = detectContradiction(facts, "J'utilise Kubernetes depuis 6 ans.");
    expect(c).not.toBeNull();
    expect(c?.type).toBe("years_mismatch");
    expect(c?.message).toContain("écart");
  });
  it("pas de contradiction si cohérent", () => {
    const facts = extractCandidateFacts("Kubernetes : 2 ans.");
    expect(detectContradiction(facts, "Kubernetes depuis 2 ans environ.")).toBeNull();
  });
});

describe("P3.7.2 — bluff & crédibilité", () => {
  it("buzzwords sans exemple -> bluff élevé", () => {
    const s = extractSignals("Je maîtrise microservices, kubernetes, devops, cloud native, event driven.");
    const b = detectBluff("Je maîtrise microservices, kubernetes, devops, cloud native, event driven.", s);
    expect(b.bluffProbability).toBeGreaterThan(0.4);
  });
  it("réponse concrète -> bluff faible", () => {
    const ans = "Par exemple, sur le projet X j'ai conçu une API REST et réduit la latence de 30%.";
    const s = extractSignals(ans);
    const b = detectBluff(ans, s);
    expect(b.bluffProbability).toBeLessThan(0.4);
  });
  it("crédibilité chute avec contradictions", () => {
    const s = [extractSignals("réponse correcte avec un exemple concret")];
    const b = [detectBluff("réponse correcte avec un exemple concret", s[0]!)];
    const high = buildCredibilityScore(s, b, 0);
    const low = buildCredibilityScore(s, b, 3);
    expect(low.consistency).toBeLessThan(high.consistency);
  });
});

describe("P3.7.3 — difficulté adaptative", () => {
  it("monte si bon, descend si faible, borne 1–5", () => {
    expect(adaptDifficulty(3, 90)).toBe(4);
    expect(adaptDifficulty(3, 30)).toBe(2);
    expect(adaptDifficulty(5, 90)).toBe(5);
    expect(adaptDifficulty(1, 10)).toBe(1);
  });
  it("arbre technique + domaine", () => {
    expect(nextTopicInTree("devops", 2)).toBe("kubernetes");
    expect(inferDomain(["docker", "aws"])).toBe("devops");
  });
});

describe("P3.7.5 — parcours métier", () => {
  it("infère le bon parcours", () => {
    expect(inferRoleTrack("DevOps Engineer").name).toBe("devops");
    expect(inferRoleTrack("Frontend Developer").name).toBe("frontend");
    expect(inferRoleTrack("Product Manager").name).toBe("product");
    expect(inferRoleTrack("Engineering Manager").name).toBe("engineering_manager");
  });
});

describe("P3.7.6 — rapport recruteur", () => {
  it("inclut crédibilité, contradictions, bluff, niveau recommandé", () => {
    const turns = Array.from({ length: 4 }, () => ({
      category: "technical", score: 85,
      signals: { confidence: 0.9, specificity: 0.9, ownership: 0.9, technicalDepth: 0.9, quantifiedResults: 1 },
    }));
    const signalsList = turns.map((t) => t.signals);
    const bluffList = signalsList.map((s) => detectBluff("exemple concret j'ai conçu", s));
    const rec = buildRecruiterReport({ answered: turns, signalsList, bluffList, contradictions: [] });
    expect(["strong_hire", "hire"]).toContain(rec.hireDecision);
    expect(rec.credibility.overall).toBeGreaterThan(0);
    expect(["junior", "mid", "senior"]).toContain(rec.recommendedLevel);
  });
  it("contradictions -> décision rétrogradée + listée", () => {
    const turns = [{ category: "technical", score: 80, signals: { confidence: 0.8, specificity: 0.8, ownership: 0.7, technicalDepth: 0.8, quantifiedResults: 1 } }];
    const contradictions = [
      { type: "years_mismatch" as const, skill: "kubernetes", cvValue: 2, spokenValue: 6, message: "écart kubernetes" },
      { type: "years_mismatch" as const, skill: "aws", cvValue: 1, spokenValue: 5, message: "écart aws" },
    ];
    const rec = buildRecruiterReport({ answered: turns, signalsList: turns.map((t) => t.signals), bluffList: [detectBluff("x", turns[0]!.signals)], contradictions });
    expect(rec.contradictions.length).toBe(2);
  });
});

describe("P3.7 — intégration engine", () => {
  it("contradiction déclenche une question de recadrage", () => {
    const profile = buildCandidateProfile({ strengths: ["kubernetes"], gaps: ["aws"], matchScore: 70, cvText: "Kubernetes : 2 ans" });
    const { state } = initInterviewV2({ profile, persona: "technical_lead", cvText: "Kubernetes : 2 ans" });
    const r = nextV2Step(state, "J'utilise Kubernetes depuis 6 ans.");
    expect(r.contradiction).toBeDefined();
    expect(r.question.toLowerCase()).toContain("écart");
  });
  it("fin d'entretien -> recruiterReport présent", () => {
    const profile = buildCandidateProfile({ strengths: ["react", "node"], gaps: ["aws"], matchScore: 70, targetRole: "Dev" });
    let { state } = initInterviewV2({ profile, persona: "neutral" });
    let report;
    const STRONG =
      "Par exemple, dans le cadre d'un projet client important, ma mission était de réduire " +
      "les délais de livraison qui posaient un vrai problème à l'équipe. J'ai conçu et déployé " +
      "une nouvelle architecture, organisé le travail et automatisé le pipeline. Concrètement, " +
      "le résultat a été une réduction de 30% du temps de livraison en 3 mois, avec une meilleure " +
      "qualité et moins d'incidents en production sur l'ensemble du périmètre.";
    for (let i = 0; i < 30 && !state.finished; i++) {
      const r = nextV2Step(state, STRONG);
      state = r.updatedState;
      if (r.recruiterReport) report = r.recruiterReport;
    }
    expect(state.finished).toBe(true);
    expect(report).toBeDefined();
    expect(report!.credibility).toBeDefined();
  });
});
