import { z } from "zod";
import { KnowledgeGraph, KnowledgeGraphSchema } from "./KnowledgeGraph";
import { Hypothesis, HypothesisSchema } from "./Hypothesis";
import { Evidence, EvidenceSchema } from "./Evidence";
import { Unknown, UnknownSchema } from "./Unknown";
import { WeakSignal, WeakSignalSchema } from "./WeakSignal";
import { Competency, CompetencySchema } from "./Competency";
import { InterviewBudget, InterviewBudgetSchema, createInitialBudget } from "./InterviewBudget";
import { InterviewGoal, InterviewGoalSchema } from "./InterviewGoal";
import { Strategy, StrategySchema } from "./Strategy";
import { Decision, DecisionSchema } from "./Decision";
import { Risk, RiskSchema } from "./Risk";
import { ConfidenceMatrix, ConfidenceMatrixSchema } from "./Confidence";

// ===================================================================
// INTERVIEW PHASE — The macro-state of the interview FSM
// ===================================================================

export const InterviewPhaseSchema = z.enum([
  "OPENING",
  "DISCOVERY",
  "DEEP_DIVE",
  "VALIDATION",
  "STRESS_TEST",
  "CONTRADICTION_RESOLUTION",
  "DECISION_VALIDATION",
  "CLOSING",
]);

export type InterviewPhase = z.infer<typeof InterviewPhaseSchema>;

// ===================================================================
// COGNITIVE STATE — The single source of truth
// This is the complete, serializable snapshot of the engine's mind.
// Every piece of knowledge, every hypothesis, every uncertainty
// lives here and nowhere else.
// ===================================================================

export const CognitiveStateSchema = z.object({
  sessionId: z.string().uuid(),
  version: z.number().int().nonnegative(),
  schemaVersion: z.literal("1.0"),
  engineVersion: z.string(),

  knowledgeGraph: KnowledgeGraphSchema,
  competencies: z.array(CompetencySchema).default([]),
  confidenceMatrix: ConfidenceMatrixSchema.default({}),

  hypotheses: z.array(HypothesisSchema).default([]),
  evidences: z.array(EvidenceSchema).default([]),
  unknowns: z.array(UnknownSchema).default([]),
  weakSignals: z.array(WeakSignalSchema).default([]),
  risks: z.array(RiskSchema).default([]),
  decisions: z.array(DecisionSchema).default([]),

  currentPhase: InterviewPhaseSchema.default("OPENING"),
  currentStrategy: StrategySchema.nullable().default(null),
  currentGoals: z.array(InterviewGoalSchema).default([]),

  budget: InterviewBudgetSchema,

  metrics: z.object({
    totalQuestions: z.number().int().nonnegative().default(0),
    totalFollowUps: z.number().int().nonnegative().default(0),
    totalChallenges: z.number().int().nonnegative().default(0),
    totalContradictions: z.number().int().nonnegative().default(0),
    totalWeakSignals: z.number().int().nonnegative().default(0),
    averageConfidence: z.number().min(0).max(1).default(0),
    elapsedMinutes: z.number().nonnegative().default(0),
  }),

  history: z.array(
    z.object({
      sequence: z.number().int().nonnegative(),
      engine: z.string(),
      eventType: z.string(),
      timestamp: z.date(),
    })
  ).default([]),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CognitiveStateData = z.infer<typeof CognitiveStateSchema>;

export class CognitiveState {
  private readonly data: CognitiveStateData;

  private constructor(data: CognitiveStateData) {
    this.data = data;
  }

  /**
   * Creates a fresh cognitive state for a new interview session.
   */
  static create(
    sessionId: string,
    engineVersion: string,
    durationMinutes: number = 45,
    maxQuestions: number = 35,
    competencyIdentifiers: string[] = []
  ): CognitiveState {
    const now = new Date();
    const competencies: z.infer<typeof CompetencySchema>[] = competencyIdentifiers.map((id) => ({
      identifier: id,
      confidence: 0,
      status: "UNKNOWN" as const,
      supportingEvidence: [],
      contradictions: [],
      coverage: 0,
      depth: 0,
      lastUpdated: now,
    }));

    const unknowns: z.infer<typeof UnknownSchema>[] = competencyIdentifiers.map((id, index) => ({
      id: crypto.randomUUID(),
      competency: id,
      priority: "MEDIUM" as const,
      impact: 0.5,
      remainingQuestions: 3,
      difficulty: 0.5,
      reason: `Competency ${id} has not been explored yet`,
      createdAt: now,
      resolvedAt: null,
    }));

    const data: CognitiveStateData = {
      sessionId,
      version: 0,
      schemaVersion: "1.0",
      engineVersion,
      knowledgeGraph: {
        nodes: [],
        edges: [],
        version: 0,
        lastUpdated: now,
      },
      competencies,
      confidenceMatrix: {},
      hypotheses: [],
      evidences: [],
      unknowns,
      weakSignals: [],
      risks: [],
      decisions: [],
      currentPhase: "OPENING",
      currentStrategy: null,
      currentGoals: [],
      budget: createInitialBudget(durationMinutes, maxQuestions, competencyIdentifiers.length || 12),
      metrics: {
        totalQuestions: 0,
        totalFollowUps: 0,
        totalChallenges: 0,
        totalContradictions: 0,
        totalWeakSignals: 0,
        averageConfidence: 0,
        elapsedMinutes: 0,
      },
      history: [],
      createdAt: now,
      updatedAt: now,
    };

    return new CognitiveState(CognitiveStateSchema.parse(data));
  }

  /**
   * Restores a cognitive state from persisted data.
   */
  static fromData(data: CognitiveStateData): CognitiveState {
    return new CognitiveState(CognitiveStateSchema.parse(data));
  }

  // ─── Accessors ────────────────────────────────────────────────

  get sessionId(): string { return this.data.sessionId; }
  get version(): number { return this.data.version; }
  get schemaVersion(): string { return this.data.schemaVersion; }
  get engineVersion(): string { return this.data.engineVersion; }
  get currentPhase(): InterviewPhase { return this.data.currentPhase; }
  get currentStrategy(): Strategy | null { return this.data.currentStrategy; }
  get budget(): InterviewBudget { return this.data.budget; }
  get metrics(): CognitiveStateData["metrics"] { return this.data.metrics; }
  get createdAt(): Date { return this.data.createdAt; }
  get updatedAt(): Date { return this.data.updatedAt; }

  get knowledgeGraph(): KnowledgeGraph {
    return KnowledgeGraph.fromData(this.data.knowledgeGraph);
  }

  get competencies(): ReadonlyArray<Competency> { return this.data.competencies; }
  get hypotheses(): ReadonlyArray<Hypothesis> { return this.data.hypotheses; }
  get evidences(): ReadonlyArray<Evidence> { return this.data.evidences; }
  get unknowns(): ReadonlyArray<Unknown> { return this.data.unknowns; }
  get weakSignals(): ReadonlyArray<WeakSignal> { return this.data.weakSignals; }
  get risks(): ReadonlyArray<Risk> { return this.data.risks; }
  get decisions(): ReadonlyArray<Decision> { return this.data.decisions; }
  get currentGoals(): ReadonlyArray<InterviewGoal> { return this.data.currentGoals; }
  get confidenceMatrix(): ConfidenceMatrix { return this.data.confidenceMatrix; }
  get history(): ReadonlyArray<CognitiveStateData["history"][number]> { return this.data.history; }

  // ─── Cognitive Queries ────────────────────────────────────────

  /**
   * Answers: "What do we know?"
   * Returns all competencies with status != UNKNOWN.
   */
  getKnownCompetencies(): ReadonlyArray<Competency> {
    return this.data.competencies.filter((c) => c.status !== "UNKNOWN");
  }

  /**
   * Answers: "What do we believe?"
   * Returns all pending hypotheses.
   */
  getActiveHypotheses(): ReadonlyArray<Hypothesis> {
    return this.data.hypotheses.filter((h) => h.status === "PENDING" || h.status === "INCONCLUSIVE");
  }

  /**
   * Answers: "What remains to be discovered?"
   * Returns all unresolved unknowns.
   */
  getRemainingUnknowns(): ReadonlyArray<Unknown> {
    return this.data.unknowns.filter((u) => u.resolvedAt === null);
  }

  /**
   * Answers: "What must we verify?"
   * Returns all hypotheses that need more evidence.
   */
  getHypothesesRequiringVerification(): ReadonlyArray<Hypothesis> {
    return this.data.hypotheses.filter(
      (h) =>
        h.status === "PENDING" &&
        h.requiredEvidence.length > 0 &&
        h.supportingEvidence.length < h.requiredEvidence.length
    );
  }

  /**
   * Answers: "What must we challenge?"
   * Returns all competencies with contradictions.
   */
  getContradictedCompetencies(): ReadonlyArray<Competency> {
    return this.data.competencies.filter((c) => c.contradictions.length > 0);
  }

  /**
   * Answers: "Are we sufficiently confident?"
   * Returns true if the global average confidence exceeds the threshold.
   */
  isSufficientlyConfident(threshold: number = 0.7): boolean {
    if (this.data.competencies.length === 0) return false;
    const avg =
      this.data.competencies.reduce((sum, c) => sum + c.confidence, 0) /
      this.data.competencies.length;
    return avg >= threshold;
  }

  /**
   * Answers: "Can we conclude?"
   * The interview can conclude when:
   * - All critical unknowns are resolved
   * - No unresolved critical contradictions
   * - Budget is exhausted OR sufficient confidence
   */
  canConclude(): boolean {
    const criticalUnknowns = this.data.unknowns.filter(
      (u) => u.priority === "CRITICAL" && u.resolvedAt === null
    );
    const unresolvedContradictions = this.data.weakSignals.filter(
      (ws) => ws.type === "CONTRADICTION" && !ws.resolved && ws.severity === "CRITICAL"
    );

    if (criticalUnknowns.length > 0 || unresolvedContradictions.length > 0) {
      return false;
    }

    return this.isSufficientlyConfident() || this.data.budget.remainingQuestions <= 0;
  }

  /**
   * Find a competency by identifier.
   */
  findCompetency(identifier: string): Competency | undefined {
    return this.data.competencies.find((c) => c.identifier === identifier);
  }

  /**
   * Find a hypothesis by id.
   */
  findHypothesis(id: string): Hypothesis | undefined {
    return this.data.hypotheses.find((h) => h.id === id);
  }

  // ─── Serialization ────────────────────────────────────────────

  toData(): CognitiveStateData {
    return {
      ...this.data,
      knowledgeGraph: this.data.knowledgeGraph,
      competencies: [...this.data.competencies],
      hypotheses: [...this.data.hypotheses],
      evidences: [...this.data.evidences],
      unknowns: [...this.data.unknowns],
      weakSignals: [...this.data.weakSignals],
      risks: [...this.data.risks],
      decisions: [...this.data.decisions],
      currentGoals: [...this.data.currentGoals],
      history: [...this.data.history]
    };
  }
}
