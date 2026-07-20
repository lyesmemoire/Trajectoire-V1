/**
 * HIIOS v4 Enterprise — Mock Provider
 *
 * Provider de test — ne fait aucun appel réseau.
 * Simule des réponses réalistes avec contrôle total.
 */

import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
  EmbeddingResponse,
  ModerationResponse,
  ModelInfo,
} from "./LLMProvider";

export type MockResponseStrategy =
  | "STRONG_CANDIDATE"      // Réponses riches et structurées
  | "WEAK_CANDIDATE"        // Réponses vagues et courtes
  | "AVOIDANT_CANDIDATE"    // Réponses évasives
  | "CONTRADICTORY_CANDIDATE" // Réponses incohérentes
  | "CUSTOM";               // Réponses définies manuellement

export class MockProvider implements LLMProvider {

  readonly name = "mock";

  readonly models: ModelInfo[] = [{
    id:                "mock-v1",
    provider:          "mock",
    contextWindow:     100000,
    maxOutput:         4096,
    supportsFunctions: true,
    supportsVision:    false,
    costPer1kInput:    0,
    costPer1kOutput:   0,
  }];

  private strategy:       MockResponseStrategy;
  private customResponses: string[];
  private responseIndex:  number = 0;
  private latencyMs:      number;

  constructor(config: {
    strategy?:       MockResponseStrategy;
    customResponses?: string[];
    latencyMs?:      number;
  } = {}) {
    this.strategy       = config.strategy ?? "STRONG_CANDIDATE";
    this.customResponses = config.customResponses ?? [];
    this.latencyMs      = config.latencyMs ?? 100;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    await this.simulateLatency();

    const content = this.generateContent(request);

    return {
      content,
      model:    "mock-v1",
      provider: "mock",
      usage: {
        promptTokens:     this.estimateTokens(request.messages.map(m => m.content).join(" ")),
        completionTokens: this.estimateTokens(content),
        totalTokens:      this.estimateTokens(request.messages.map(m => m.content).join(" ")) + this.estimateTokens(content),
      },
      latencyMs:    this.latencyMs,
      finishReason: "stop",
    };
  }

  async stream(
    request: LLMRequest,
    onChunk: (chunk: LLMStreamChunk) => void
  ): Promise<LLMResponse> {
    const content = this.generateContent(request);
    const words   = content.split(" ");

    for (let i = 0; i < words.length; i++) {
      await this.simulateLatency(10);
      const delta = (i === 0 ? "" : " ") + words[i];
      onChunk({ delta, finished: false });
    }

    onChunk({
      delta:    "",
      finished: true,
      usage: {
        promptTokens:     100,
        completionTokens: words.length,
        totalTokens:      100 + words.length,
      },
    });

    return {
      content,
      model:        "mock-v1",
      provider:     "mock",
      usage:        { promptTokens: 100, completionTokens: words.length, totalTokens: 100 + words.length },
      latencyMs:    this.latencyMs * words.length,
      finishReason: "stop",
    };
  }

  async embed(_text: string): Promise<EmbeddingResponse> {
    await this.simulateLatency();
    return {
      embedding: Array(1536).fill(0).map(() => Math.random() * 2 - 1),
      model:     "mock-embedding",
      usage:     { promptTokens: 10 },
    };
  }

  async moderate(_text: string): Promise<ModerationResponse> {
    return { flagged: false, categories: {}, scores: {} };
  }

  tokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  // ── Génération de contenu ──────────────────

  private generateContent(request: LLMRequest): string {
    if (this.strategy === "CUSTOM" && this.customResponses.length > 0) {
      const response = this.customResponses[this.responseIndex % this.customResponses.length];
      this.responseIndex++;
      return response;
    }

    // Détecter le type de prompt
    const userContent = request.messages
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join(" ")
      .toLowerCase();

    if (userContent.includes("analyse") || userContent.includes("réponse du candidat")) {
      return this.generateAnalysisResponse();
    }

    if (userContent.includes("décision") || userContent.includes("recommandation")) {
      return this.generateDecisionResponse();
    }

    if (userContent.includes("synthèse")) {
      return this.generateSynthesisResponse();
    }

    return this.generateGenericAnalysis();
  }

  private generateAnalysisResponse(): string {
    const strategies: Record<MockResponseStrategy, object> = {
      STRONG_CANDIDATE: {
        evidences: [{
          content:   "Le candidat a décrit précisément une restructuration d'équipe de 12 personnes en 6 mois avec augmentation de 40% de la vélocité",
          level:     "L1_DIRECT_OBSERVED",
          source:    "direct_answer",
          reliability: 0.90,
          supportsHypothesisIds: [],
          opposesHypothesisIds: [],
        }],
        patterns: [{
          name:        "Servant Leadership",
          description: "Le candidat positionne clairement son rôle comme service à l'équipe",
          valence:     "POSITIVE",
          certainty:   "STRONG",
        }],
        requiresFollowUp:   false,
        responseQuality:    "HIGH",
        keySignals: ["Spécificité élevée", "Résultats mesurables", "Usage du je pour les décisions"],
      },
      WEAK_CANDIDATE: {
        evidences: [{
          content:   "Le candidat mentionne avoir travaillé en équipe de façon générale",
          level:     "L4_WEAK_SIGNAL",
          source:    "direct_answer",
          reliability: 0.45,
          supportsHypothesisIds: [],
          opposesHypothesisIds: [],
        }],
        patterns: [],
        requiresFollowUp: true,
        responseQuality:  "LOW",
        keySignals: ["Réponse vague", "Pas de chiffres", "Généralités"],
      },
      AVOIDANT_CANDIDATE: {
        evidences: [{
          content:   "Le candidat parle de l'équipe en général sans se positionner",
          level:     "L4_WEAK_SIGNAL",
          source:    "direct_answer",
          reliability: 0.40,
          supportsHypothesisIds: [],
          opposesHypothesisIds: [],
        }],
        patterns: [{
          name:        "Accountability Deflection",
          description: "Usage systématique du 'nous' et du 'on' pour les décisions difficiles",
          valence:     "NEGATIVE",
          certainty:   "MODERATE",
        }],
        requiresFollowUp: true,
        responseQuality:  "LOW",
        keySignals: ["Usage du nous pour les décisions", "Évitement du je"],
      },
      CONTRADICTORY_CANDIDATE: {
        evidences: [
          {
            content:   "Affirme prendre des décisions rapidement",
            level:     "L3_BEHAVIORAL_SIGNAL",
            source:    "direct_answer",
            reliability: 0.60,
            supportsHypothesisIds: [],
            opposesHypothesisIds: [],
          },
          {
            content:   "Décrit un processus de décision par consensus très long",
            level:     "L2_INDIRECT_STRONG",
            source:    "direct_answer",
            reliability: 0.75,
            supportsHypothesisIds: [],
            opposesHypothesisIds: [],
          },
        ],
        patterns: [],
        requiresFollowUp: true,
        responseQuality:  "MEDIUM",
        keySignals: ["Contradiction détectée sur la vitesse de décision"],
        contradictions: ["Contradiction : 'décisions rapides' vs processus consensus décrit"],
      },
      CUSTOM: { evidences: [], patterns: [], requiresFollowUp: false, responseQuality: "MEDIUM", keySignals: [] },
    };

    return JSON.stringify(strategies[this.strategy]);
  }

  private generateDecisionResponse(): string {
    const decisions: Record<MockResponseStrategy, object> = {
      STRONG_CANDIDATE: {
        recommendation:        "YES",
        globalConfidenceScore: 0.76,
        rationale: {
          summary:             "Les preuves observées suggèrent fortement un profil de leadership solide.",
          fullExplanation:     "Confiance élevée sur leadership et ownership. Communication à vérifier.",
          evidenceChain:       [],
          alternativesConsidered: [],
          uncertaintiesAcknowledged: ["Communication insuffisamment explorée"],
          biasesChecked:       [],
        },
        skillAssessments: [
          { skillId: "leadership", confidenceScore: 0.78, summary: "Leadership confirmé sur 3 dimensions." },
          { skillId: "ownership",  confidenceScore: 0.72, summary: "Ownership fort avec un exemple L1." },
        ],
        keyStrengths:          ["Leadership opérationnel confirmé", "Ownership élevé"],
        keyRisks:              ["Communication pas suffisamment explorée"],
        openQuestions:         ["Gestion des conflits non évaluée"],
        recommendedNextSteps:  ["Entretien technique", "Vérification des références"],
      },
      WEAK_CANDIDATE: {
        recommendation:        "INSUFFICIENT_DATA",
        globalConfidenceScore: 0.28,
        rationale: {
          summary:         "Les données collectées sont insuffisantes pour une recommandation fiable.",
          fullExplanation: "Réponses trop vagues pour évaluer les compétences critiques.",
          evidenceChain:   [],
          alternativesConsidered: [],
          uncertaintiesAcknowledged: ["Toutes les compétences critiques insuffisamment couvertes"],
          biasesChecked:   [],
        },
        skillAssessments:      [],
        keyStrengths:          [],
        keyRisks:              ["Données insuffisantes pour évaluer le profil"],
        openQuestions:         ["Leadership", "Ownership", "Communication"],
        recommendedNextSteps:  ["Second entretien avec questions plus structurées"],
      },
      AVOIDANT_CANDIDATE: {
        recommendation:        "NO_WITH_RESERVES",
        globalConfidenceScore: 0.38,
        rationale: {
          summary: "Les signaux disponibles suggèrent un ownership faible et une tendance à l'évitement.",
          fullExplanation: "Pattern d'évitement de responsabilité détecté sur 3 échanges.",
          evidenceChain:   [],
          alternativesConsidered: [],
          uncertaintiesAcknowledged: ["Contexte organisationnel inconnu"],
          biasesChecked:   [],
        },
        skillAssessments:      [],
        keyStrengths:          [],
        keyRisks:              ["Ownership faible", "Pattern d'évitement"],
        openQuestions:         [],
        recommendedNextSteps:  ["Feedback constructif au candidat"],
      },
      CONTRADICTORY_CANDIDATE: {
        recommendation:        "NEUTRAL",
        globalConfidenceScore: 0.45,
        rationale: {
          summary: "Des contradictions non résolues empêchent une recommandation claire.",
          fullExplanation: "Contradictions détectées sur la prise de décision.",
          evidenceChain:   [],
          alternativesConsidered: [],
          uncertaintiesAcknowledged: ["Contradictions non résolues"],
          biasesChecked:   [],
        },
        skillAssessments:      [],
        keyStrengths:          [],
        keyRisks:              ["Contradictions non résolues"],
        openQuestions:         ["Clarifier l'approche décisionnelle"],
        recommendedNextSteps:  ["Second entretien focalisé sur la prise de décision"],
      },
      CUSTOM: {
        recommendation: "NEUTRAL", globalConfidenceScore: 0.50,
        rationale: { summary: "Evaluation personnalisée.", fullExplanation: "",
          evidenceChain: [], alternativesConsidered: [],
          uncertaintiesAcknowledged: [], biasesChecked: [] },
        skillAssessments: [], keyStrengths: [], keyRisks: [],
        openQuestions: [], recommendedNextSteps: [],
      },
    };

    return JSON.stringify(decisions[this.strategy]);
  }

  private generateSynthesisResponse(): string {
    return JSON.stringify({
      currentState: "Entretien en cours — phase DEEPENING",
      confirmedStrengths: ["Leadership — signaux positifs sur 2 dimensions"],
      uncertainties: ["Ownership — 1 seule preuve L2, besoin de L1"],
      redFlags: [],
      nextStrategy: "Explorer l'ownership avec une question de challenge sur un échec",
      estimatedRemainingTime: "15 minutes",
    });
  }

  private generateGenericAnalysis(): string {
    return JSON.stringify({
      message: "Analyse générique",
      evidences: [],
      patterns:  [],
      requiresFollowUp: false,
    });
  }

  private async simulateLatency(ms?: number): Promise<void> {
    await new Promise(r => setTimeout(r, ms ?? this.latencyMs));
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
