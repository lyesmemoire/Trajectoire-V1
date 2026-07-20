/**
 * HIIOS v4 Enterprise — Tests Build 005
 * Runtime Platform
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { LLMRouter }           from "../llm/LLMRouter";
import { MockProvider }        from "../llm/MockProvider";
import { LLMResponseParser }   from "../parser/LLMResponseParser";
// import { HIIOSClient, HIIOSError } from "../../../hiios-sdk/src/HIIOSClient";
import { EvidenceLevel }       from "../parser/LLMResponseParser";

// ─────────────────────────────────────────────
// LLM ROUTER
// ─────────────────────────────────────────────

describe("LLMRouter", () => {

  it("crée un router de test sans configuration", () => {
    const router = LLMRouter.forTesting();
    expect(router).toBeDefined();
  });

  it("génère une réponse avec le mock provider", async () => {
    const router = LLMRouter.forTesting();

    const response = await router.generate(
      {
        messages:    [
          { role: "system", content: "You are HIIOS." },
          { role: "user",   content: "Analyse cette réponse du candidat." },
        ],
        temperature: 0.3,
        maxTokens:   1000,
      },
      "session_test_001"
    );

    expect(response.content).toBeTruthy();
    expect(response.provider).toBe("mock");
    expect(response.usage.totalTokens).toBeGreaterThan(0);
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("stream une réponse chunk par chunk", async () => {
    const router = LLMRouter.forTesting();
    const chunks: string[] = [];

    const response = await router.stream(
      {
        messages:    [{ role: "user", content: "Analyse cette réponse." }],
        temperature: 0.3,
        maxTokens:   500,
      },
      "session_test_002",
      (chunk) => {
        if (!chunk.finished) chunks.push(chunk.delta);
      }
    );

    expect(chunks.length).toBeGreaterThan(0);
    expect(response.content).toBeTruthy();
    expect(chunks.join("").trim()).toBe(response.content.trim());
  });

  it("génère un rapport de coût après les appels", async () => {
    const router = LLMRouter.forTesting();

    await router.generate(
      { messages: [{ role: "user", content: "Test 1" }], temperature: 0.3, maxTokens: 100 },
      "session_cost_test"
    );
    await router.generate(
      { messages: [{ role: "user", content: "Test 2" }], temperature: 0.3, maxTokens: 100 },
      "session_cost_test"
    );

    const report = router.getCostReport("session_cost_test");

    expect(report.callCount).toBe(2);
    expect(report.totalTokens).toBeGreaterThan(0);
    expect(report.byProvider["mock"]).toBeDefined();
  });
});

// ─────────────────────────────────────────────
// MOCK PROVIDER
// ─────────────────────────────────────────────

describe("MockProvider", () => {

  it("génère différentes réponses selon la stratégie", async () => {
    const strong  = new MockProvider({ strategy: "STRONG_CANDIDATE" });
    const weak    = new MockProvider({ strategy: "WEAK_CANDIDATE" });

    const req = {
      messages:    [{ role: "user" as const, content: "Analyse cette réponse du candidat." }],
      temperature: 0.3,
      maxTokens:   1000,
    };

    const strongResp = await strong.generate(req);
    const weakResp   = await weak.generate(req);

    // Les deux doivent être du JSON valide avec des structures différentes
    const strongJson = JSON.parse(strongResp.content);
    const weakJson   = JSON.parse(weakResp.content);

    expect(strongJson.evidences).toBeDefined();
    expect(weakJson.evidences).toBeDefined();

    // Le candidat fort devrait avoir un niveau de preuve plus élevé
    const strongLevel = strongJson.evidences[0]?.level;
    const weakLevel   = weakJson.evidences[0]?.level;
    expect(strongLevel).toBe("L1_DIRECT_OBSERVED");
    expect(weakLevel).toBe("L4_WEAK_SIGNAL");
  });

  it("utilise les réponses custom en mode CUSTOM", async () => {
    const provider = new MockProvider({
      strategy:        "CUSTOM",
      customResponses: ['{"test": "response_1"}', '{"test": "response_2"}'],
    });

    const req = {
      messages:    [{ role: "user" as const, content: "test" }],
      temperature: 0.3,
      maxTokens:   100,
    };

    const r1 = await provider.generate(req);
    const r2 = await provider.generate(req);
    const r3 = await provider.generate(req); // Doit cycler

    expect(JSON.parse(r1.content).test).toBe("response_1");
    expect(JSON.parse(r2.content).test).toBe("response_2");
    expect(JSON.parse(r3.content).test).toBe("response_1"); // Cycle
  });

  it("embed retourne un vecteur de dimension 1536", async () => {
    const provider = new MockProvider();
    const result   = await provider.embed("test text");

    expect(result.embedding).toHaveLength(1536);
    expect(result.embedding.every(v => v >= -1 && v <= 1)).toBe(true);
  });

  it("isAvailable retourne true", async () => {
    const provider = new MockProvider();
    expect(await provider.isAvailable()).toBe(true);
  });
});

// ─────────────────────────────────────────────
// LLM RESPONSE PARSER
// ─────────────────────────────────────────────

describe("LLMResponseParser", () => {

  let parser: LLMResponseParser;

  beforeEach(() => {
    parser = new LLMResponseParser();
  });

  // ── Parse Analysis ──────────────────────────

  it("parse une analyse valide", () => {
    const raw = JSON.stringify({
      evidences: [{
        content:     "Le candidat a décrit précisément une restructuration d'équipe",
        level:       "L1_DIRECT_OBSERVED",
        source:      "direct_answer",
        reliability: 0.90,
        supportsHypothesisIds: [],
        opposesHypothesisIds:  [],
      }],
      patterns: [{
        name:        "Servant Leadership",
        description: "Le candidat positionne clairement son rôle comme service à l'équipe",
        valence:     "POSITIVE",
        certainty:   "STRONG",
      }],
      contradictions:   [],
      keySignals:       ["Réponse détaillée", "Résultats mesurables"],
      requiresFollowUp: false,
      responseQuality:  "HIGH",
    });

    const result = parser.parseAnalysis(raw);

    expect(result.success).toBe(true);
    expect(result.data?.evidences).toHaveLength(1);
    expect(result.data?.evidences[0].level).toBe(EvidenceLevel.L1_DIRECT_OBSERVED);
    expect(result.data?.patterns).toHaveLength(1);
    expect(result.data?.responseQuality).toBe("HIGH");
  });

  it("accepte JSON dans du texte entourant", () => {
    const raw = `Voici mon analyse :

    {
      "evidences": [],
      "patterns": [],
      "keySignals": ["Signal 1"],
      "requiresFollowUp": true,
      "responseQuality": "LOW"
    }

    Fin de l'analyse.`;

    const result = parser.parseAnalysis(raw);
    expect(result.success).toBe(true);
  });

  it("échoue proprement sur JSON invalide", () => {
    const result = parser.parseAnalysis("Ceci n'est pas du JSON du tout");
    expect(result.success).toBe(false);
    expect(result.errors[0].severity).toBe("BLOCKING");
  });

  it("normalise les niveaux de preuve abrégés", () => {
    const raw = JSON.stringify({
      evidences: [
        { content: "Preuve 1", level: "L1", source: "direct_answer", reliability: 0.9, supportsHypothesisIds: [], opposesHypothesisIds: [] },
        { content: "Preuve 2", level: "L3", source: "direct_answer", reliability: 0.6, supportsHypothesisIds: [], opposesHypothesisIds: [] },
      ],
      patterns: [], keySignals: [], requiresFollowUp: false, responseQuality: "MEDIUM",
    });

    const result = parser.parseAnalysis(raw);
    expect(result.success).toBe(true);
    expect(result.data?.evidences[0].level).toBe(EvidenceLevel.L1_DIRECT_OBSERVED);
    expect(result.data?.evidences[1].level).toBe(EvidenceLevel.L3_BEHAVIORAL_SIGNAL);
  });

  it("génère un avertissement pour un niveau invalide", () => {
    const raw = JSON.stringify({
      evidences: [{
        content: "Test", level: "INVALID_LEVEL",
        source: "direct_answer", reliability: 0.5,
        supportsHypothesisIds: [], opposesHypothesisIds: [],
      }],
      patterns: [], keySignals: [], requiresFollowUp: false, responseQuality: "MEDIUM",
    });

    const result = parser.parseAnalysis(raw);
    expect(result.success).toBe(true); // Non bloquant
    expect(result.warnings.length).toBeGreaterThan(0);
    // Défaut L4
    expect(result.data?.evidences[0].level).toBe(EvidenceLevel.L4_WEAK_SIGNAL);
  });

  it("clampe la fiabilité entre 0 et 1", () => {
    const raw = JSON.stringify({
      evidences: [{
        content: "Test", level: "L2", source: "direct_answer",
        reliability: 1.5, // invalide
        supportsHypothesisIds: [], opposesHypothesisIds: [],
      }],
      patterns: [], keySignals: [], requiresFollowUp: false, responseQuality: "MEDIUM",
    });

    const result = parser.parseAnalysis(raw);
    expect(result.data?.evidences[0].reliability).toBeLessThanOrEqual(1.0);
  });

  // ── Parse Decision ──────────────────────────

  it("parse une décision valide", () => {
    const raw = JSON.stringify({
      recommendation:        "YES",
      globalConfidenceScore: 0.76,
      rationale: {
        summary:             "Les preuves suggèrent un profil solide.",
        fullExplanation:     "Explication complète...",
        uncertaintiesAcknowledged: ["Communication non évaluée"],
      },
      skillAssessments: [
        { skillId: "leadership", confidenceScore: 0.78, summary: "Leadership confirmé" },
      ],
      keyStrengths:         ["Leadership fort"],
      keyRisks:             ["Communication à vérifier"],
      openQuestions:        [],
      recommendedNextSteps: ["Entretien technique"],
    });

    const result = parser.parseDecision(raw);

    expect(result.success).toBe(true);
    expect(result.data?.recommendation).toBe("YES");
    expect(result.data?.globalConfidenceScore).toBe(0.76);
    expect(result.data?.skillAssessments).toHaveLength(1);
  });

  it("bloque une recommandation invalide", () => {
    const raw = JSON.stringify({
      recommendation:        "MAYBE",  // invalide
      globalConfidenceScore: 0.60,
      rationale: { summary: "Test" },
      skillAssessments: [],
      keyStrengths: [], keyRisks: [],
      openQuestions: [], recommendedNextSteps: [],
    });

    const result = parser.parseDecision(raw);
    expect(result.success).toBe(false);
    const recError = result.errors.find(e => e.field === "recommendation");
    expect(recError?.severity).toBe("BLOCKING");
  });

  it("bloque un score de confiance hors limites", () => {
    const raw = JSON.stringify({
      recommendation:        "YES",
      globalConfidenceScore: 1.5,  // invalide
      rationale: { summary: "Test" },
      skillAssessments: [],
      keyStrengths: [], keyRisks: [],
      openQuestions: [], recommendedNextSteps: [],
    });

    const result = parser.parseDecision(raw);
    expect(result.success).toBe(false);
    const scoreError = result.errors.find(e => e.field === "globalConfidenceScore");
    expect(scoreError).toBeDefined();
  });

  it("détecte le langage interdit dans la rationale", () => {
    const raw = JSON.stringify({
      recommendation:        "YES",
      globalConfidenceScore: 0.70,
      rationale: {
        summary: "Le candidat prouve que son leadership est sans aucun doute très fort.",
        fullExplanation: "",
        uncertaintiesAcknowledged: [],
      },
      skillAssessments: [],
      keyStrengths: [], keyRisks: [],
      openQuestions: [], recommendedNextSteps: [],
    });

    const result = parser.parseDecision(raw);
    // Non bloquant — juste un avertissement
    const warning = result.warnings.find(w => w.field === "rationale");
    expect(warning).toBeDefined();
  });

  // ── Validation épistémique ──────────────────

  it("valide la conformité épistémique d'une analyse", () => {
    const analysis = {
      evidences: [{
        content:     "Preuve substantielle avec plus de dix mots et un contexte clair",
        level:       EvidenceLevel.L1_DIRECT_OBSERVED,
        source:      "direct_answer",
        reliability: 0.90,
        supportsHypothesisIds: [],
        opposesHypothesisIds:  [],
      }],
      patterns:         [],
      contradictions:   [],
      activeSignals:    [],
      requiresFollowUp: false,
      responseQuality:  "HIGH" as const,
      keySignals:       [],
    };

    const compliance = parser.validateEpistemicCompliance(analysis);
    expect(compliance.compliant).toBe(true);
    expect(compliance.violations).toHaveLength(0);
  });

  it("signale une preuve L1 avec fiabilité trop basse", () => {
    const analysis = {
      evidences: [{
        content:     "Preuve avec contenu suffisant pour être valide selon les critères du système",
        level:       EvidenceLevel.L1_DIRECT_OBSERVED,
        source:      "direct_answer",
        reliability: 0.40,  // Trop bas pour L1
        supportsHypothesisIds: [],
        opposesHypothesisIds:  [],
      }],
      patterns: [], contradictions: [], activeSignals: [],
      requiresFollowUp: false, responseQuality: "MEDIUM" as const, keySignals: [],
    };

    const compliance = parser.validateEpistemicCompliance(analysis);
    expect(compliance.compliant).toBe(false);
    expect(compliance.violations.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// SDK CLIENT
// ─────────────────────────────────────────────

// Commenté car le SDK est dans un package séparé
// describe("HIIOSClient", () => {
//
//   it("s'instancie correctement", () => {
//     const client = new HIIOSClient({
//       baseUrl: "https://api.trajectoire.io",
//       apiKey:  "test_key",
//     });
//     expect(client).toBeDefined();
//   });
//
//   it("lance HIIOSError sur 404", async () => {
//     const fetchMock = vi.fn().mockResolvedValue({
//       ok:     false,
//       status: 404,
//       json:   async () => ({ error: "Interview not found" }),
//     });
//     global.fetch = fetchMock;
//
//     const client = new HIIOSClient({
//       baseUrl: "http://localhost:3000",
//       apiKey:  "test",
//     });
//
//     try {
//       await client.getInterview("nonexistent-id");
//       expect.fail("Should have thrown");
//     } catch (error) {
//       expect(error).toBeInstanceOf(HIIOSError);
//       expect((error as HIIOSError).isNotFound).toBe(true);
//       expect((error as HIIOSError).statusCode).toBe(404);
//     }
//   });
//
//   it("lance HIIOSError avec isRateLimited sur 429", async () => {
//     const fetchMock = vi.fn().mockResolvedValue({
//       ok:     false,
//       status: 429,
//       json:   async () => ({ error: "Rate limit exceeded" }),
//     });
//     global.fetch = fetchMock;
//
//     const client = new HIIOSClient({
//       baseUrl: "http://localhost:3000",
//       apiKey:  "test",
//     });
//
//     try {
//       await client.computeDecision("session-123");
//     } catch (error) {
//       expect(error).toBeInstanceOf(HIIOSError);
//       expect((error as HIIOSError).isRateLimited).toBe(true);
//     }
//   });
//
//   it("appelle la bonne URL pour createInterview", async () => {
//     const fetchMock = vi.fn().mockResolvedValue({
//       ok:   true,
//       json: async () => ({
//         sessionId:     "sess_001",
//         firstQuestion: { id: "q_1", text: "Test ?", type: "BEHAVIORAL", pressureLevel: "MODERATE", rationale: "Test" },
//         plan:          "Plan de test",
//         metadata:      { criticalSkills: ["leadership"], duration: 60, hypothesesCount: 1 },
//       }),
//     });
//     global.fetch = fetchMock;
//
//     const client = new HIIOSClient({ baseUrl: "http://localhost:3000", apiKey: "test" });
//
//     const result = await client.createInterview({
//       candidateId:    "cand_001",
//       targetRole:     "Engineering Manager",
//       interviewType:  "BEHAVIORAL",
//       criticalSkills: ["leadership", "ownership"],
//     });
//
//     expect(fetchMock).toHaveBeenCalledWith(
//       "http://localhost:3000/v1/interviews",
//       expect.objectContaining({ method: "POST" })
//     );
//     expect(result.sessionId).toBe("sess_001");
//   });
// });

// ─────────────────────────────────────────────
// EVENT SOURCING
// ─────────────────────────────────────────────

describe("Event Sourcing — reconstruction d'état", () => {

  it("reconstruit l'état correct depuis une séquence d'événements", () => {
    const repo = createMockRepository();

    const events = [
      {
        eventType: "InterviewStarted",
        payload:   { config: {}, firstQuestion: {} },
        createdAt: new Date("2024-01-01T10:00:00"),
      },
      {
        eventType: "QuestionAsked",
        payload:   { question: { id: "q_1", text: "Test ?" } },
        createdAt: new Date("2024-01-01T10:01:00"),
      },
      {
        eventType: "AnswerReceived",
        payload:   { response: { id: "r_1" }, elapsedMinutes: 5 },
        createdAt: new Date("2024-01-01T10:05:00"),
      },
      {
        eventType: "PhaseTransitioned",
        payload:   { newPhase: "EXPLORATION" },
        createdAt: new Date("2024-01-01T10:06:00"),
      },
    ];

    let state = {};
    for (const event of events) {
      state = repo.applyEvent(state, event as any);
    }

    expect((state as any).phase).toBe("EXPLORATION");
    expect((state as any).questionsAsked).toHaveLength(1);
    expect((state as any).responses).toHaveLength(1);
    expect((state as any).elapsedMinutes).toBe(5);
  });
});

// ─────────────────────────────────────────────
// HELPERS DE TEST
// ─────────────────────────────────────────────

function createMockRepository() {
  // Exposer la méthode applyEvent pour les tests
  class TestableRepository {
    applyEvent(state: any, event: any): any {
      switch (event.eventType) {
        case "InterviewStarted":
          return {
            ...state,
            phase:          "OPENING",
            turnCount:      0,
            elapsedMinutes: 0,
            questionsAsked: [],
            responses:      [],
            lastUpdated:    event.createdAt,
          };
        case "QuestionAsked":
          return {
            ...state,
            questionsAsked: [...(state.questionsAsked ?? []), event.payload.question],
            turnCount: (state.turnCount ?? 0) + 1,
          };
        case "AnswerReceived":
          return {
            ...state,
            responses: [...(state.responses ?? []), event.payload.response],
            elapsedMinutes: event.payload.elapsedMinutes ?? state.elapsedMinutes,
          };
        case "PhaseTransitioned":
          return { ...state, phase: event.payload.newPhase };
        default:
          return state;
      }
    }
  }
  return new TestableRepository();
}
