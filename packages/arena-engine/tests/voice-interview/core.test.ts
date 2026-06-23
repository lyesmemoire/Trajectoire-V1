/**
 * Tests P3.1 — Voice Interview Brain (core pur + session manager).
 * 100% déterministe, sans infra.
 */
import { describe, it, expect } from "vitest";
import {
  createInitialState,
  nextPhase,
  averageScore,
  applyPatch,
  isFinished,
} from "@/apps/realtime-gateway/src/voice-interview/core/state";
import { evaluateTranscript } from "@/apps/realtime-gateway/src/voice-interview/core/evaluation";
import { generateQuestion } from "@/apps/realtime-gateway/src/voice-interview/core/question-generator";
import {
  nextStep,
  openingStep,
} from "@/apps/realtime-gateway/src/voice-interview/core/interview-engine";
import { SessionManager } from "@/apps/realtime-gateway/src/voice-interview/sessions/session-manager";

const STRONG =
  "Dans le cadre d'un projet client, ma mission était de réduire les délais. " +
  "J'ai mis en place une nouvelle architecture et organisé l'équipe. " +
  "Résultat : nous avons réduit le temps de livraison de 30% en 3 mois.";

describe("state", () => {
  it("crée un état initial valide", () => {
    const s = createInitialState({ jobGap: "node" });
    expect(s.phase).toBe("intro");
    expect(s.jobGap).toBe("node");
    expect(s.askedQuestions).toEqual([]);
  });
  it("avance les phases jusqu'à wrap (terminal)", () => {
    expect(nextPhase("intro")).toBe("deep");
    expect(nextPhase("deep")).toBe("pressure");
    expect(nextPhase("pressure")).toBe("wrap");
    expect(nextPhase("wrap")).toBe("wrap");
  });
  it("applyPatch est immuable", () => {
    const s = createInitialState();
    const s2 = applyPatch(s, { phase: "deep" });
    expect(s.phase).toBe("intro");
    expect(s2.phase).toBe("deep");
  });
  it("moyenne des scores", () => {
    const s = applyPatch(createInitialState(), { scoreSignals: [40, 60, 80] });
    expect(averageScore(s)).toBe(60);
  });
});

describe("evaluation", () => {
  it("note une réponse forte STAR > 80", () => {
    const e = evaluateTranscript(STRONG, "architecture");
    expect(e.score).toBeGreaterThanOrEqual(80);
    expect(e.level).toBe("fort");
    expect(e.star.result).toBe(true);
    expect(e.quantified).toBe(true);
  });
  it("note une réponse vide à 0", () => {
    expect(evaluateTranscript("").score).toBe(0);
  });
});

describe("question-generator", () => {
  it("génère une question contenant le gap", () => {
    const q = generateQuestion({ phase: "deep", gap: "Docker", askedQuestions: [] });
    expect(q).toContain("Docker");
  });
  it("ne répète pas une question déjà posée", () => {
    const first = generateQuestion({ phase: "intro", gap: "node", askedQuestions: [] });
    const second = generateQuestion({
      phase: "intro",
      gap: "node",
      askedQuestions: [first],
    });
    expect(second).not.toBe(first);
  });
});

describe("interview-engine", () => {
  it("openingStep pose une première question", () => {
    const { question, updatedState } = openingStep(createInitialState({ jobGap: "node" }));
    expect(question.length).toBeGreaterThan(0);
    expect(updatedState.askedQuestions).toHaveLength(1);
  });
  it("réponse forte -> move-on + avance de phase", () => {
    const s = createInitialState({ jobGap: "architecture" });
    const r = nextStep(s, STRONG);
    expect(r.feedbackSignal).toBe("move-on");
    expect(r.updatedState.phase).toBe("deep");
  });
  it("réponse faible -> probe + reste en phase", () => {
    const s = createInitialState({ jobGap: "node" });
    const r = nextStep(s, "J'ai fait des trucs.");
    expect(r.feedbackSignal).toBe("probe");
    expect(r.updatedState.phase).toBe("intro");
  });
  it("est déterministe", () => {
    const s = createInitialState({ jobGap: "node" });
    expect(nextStep(s, STRONG).nextQuestion).toBe(nextStep(s, STRONG).nextQuestion);
  });
  it("clôture après MAX_TURNS", () => {
    let s = createInitialState({ jobGap: "node" });
    for (let i = 0; i < 8; i++) s = nextStep(s, "réponse").updatedState;
    expect(isFinished(s)).toBe(true);
  });
});

describe("SessionManager", () => {
  it("crée, lit, met à jour, supprime", () => {
    const mgr = new SessionManager();
    const s = mgr.createSession({ jobGap: "node" });
    expect(mgr.getSession(s.id)).toBeDefined();
    const patched = applyPatch(s.state, { phase: "deep" });
    mgr.updateSession(s.id, patched);
    expect(mgr.getSession(s.id)?.state.phase).toBe("deep");
    expect(mgr.deleteSession(s.id)).toBe(true);
    expect(mgr.getSession(s.id)).toBeUndefined();
  });
  it("expire les sessions via TTL (horloge injectée)", () => {
    let now = 1000;
    const mgr = new SessionManager({ ttlMs: 100, clock: () => now });
    const s = mgr.createSession();
    now = 1200; // > ttl
    expect(mgr.getSession(s.id)).toBeUndefined();
    expect(mgr.size()).toBe(0);
  });
});
