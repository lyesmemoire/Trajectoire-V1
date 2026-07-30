import { BaseEngine, BaseEngineConfig } from "../BaseEngine";
import { EngineManifest } from "../EngineManifest";
import { BaseEvent } from "../../contracts/Event";
import { EngineInput } from "../../contracts/Engine";

// ===================================================================
// CONFIDENCE ENGINE — 100% Deterministic Confidence Calculation
// ===================================================================

export interface ConfidenceContext {
  sessionId: string;
  traceId: string;
  correlationId: string;
}

export interface ConfidencePayload {
  facts: any[];
  evidenceAssessments: any[];
  contradictionAssessments: any[];
  temporalEvents: any[];
}

export interface ConfidenceResult {
  overallConfidence: number;
  breakdown: ConfidenceBreakdown;
  factors: ConfidenceFactor[];
  metadata: {
    totalFacts: number;
    totalEvidence: number;
    totalContradictions: number;
    totalTemporalEvents: number;
  };
}

export interface ConfidenceBreakdown {
  evidenceConfidence: number;
  contradictionPenalty: number;
  temporalConsistency: number;
  factualityScore: number;
}

export interface ConfidenceFactor {
  id: string;
  type: "evidence" | "contradiction" | "temporal" | "factuality";
  weight: number;
  value: number;
  description: string;
  ruleId: string;
  ruleVersion: string;
}

export const ConfidenceManifest: EngineManifest = {
  id: "confidence",
  version: "1.0.0",
  manifestVersion: "1.0.0",
  minimumRuntimeVersion: "1.0.0",
  description: "Calculates overall confidence using deterministic rules (no LLM)",
  consumes: ["facts", "evidenceAssessments", "contradictionAssessments", "temporalEvents"],
  produces: ["confidenceResults"],
  facts: ["OBSERVATION", "EVIDENCE", "CONTRADICTION", "TEMPORAL"],
  events: ["CONFIDENCE_CALCULATED", "CONFIDENCE_UPDATED"],
  providers: ["internal"],
  timeout: 10000,
  retries: 0,
};

export class ConfidenceEngine extends BaseEngine<
  ConfidenceContext,
  ConfidencePayload,
  BaseEvent
> {
  constructor(config?: Partial<BaseEngineConfig>) {
    super({
      name: "ConfidenceEngine",
      version: "1.0.0",
      schemaVersion: "1.0",
      ...config,
    });
  }

  protected async process(
    context: ConfidenceContext,
    payload: ConfidencePayload,
    sessionId: string
  ): Promise<BaseEvent[]> {
    const result = this.calculateConfidence(payload);

    const event: BaseEvent = {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "confidence",
      eventType: "CONFIDENCE_CALCULATED",
      engineVersion: ConfidenceManifest.version,
      payload: {
        overallConfidence: result.overallConfidence,
        breakdown: result.breakdown,
        factors: result.factors,
        metadata: result.metadata,
      },
      createdAt: new Date(),
    };

    return [event];
  }

  /**
   * Calculate overall confidence using deterministic rules
   * 100% TypeScript - no LLM involved
   */
  private calculateConfidence(payload: ConfidencePayload): ConfidenceResult {
    const evidenceConfidence = this.calculateEvidenceConfidence(payload.evidenceAssessments);
    const contradictionPenalty = this.calculateContradictionPenalty(payload.contradictionAssessments);
    const temporalConsistency = this.calculateTemporalConsistency(payload.temporalEvents);
    const factualityScore = this.calculateFactualityScore(payload.facts);

    const breakdown: ConfidenceBreakdown = {
      evidenceConfidence,
      contradictionPenalty,
      temporalConsistency,
      factualityScore,
    };

    const factors = this.generateFactors(breakdown, payload);

    // Calculate overall confidence using weighted formula
    const overallConfidence = this.calculateOverallConfidence(breakdown, factors);

    const metadata = {
      totalFacts: payload.facts.length,
      totalEvidence: payload.evidenceAssessments.length,
      totalContradictions: payload.contradictionAssessments.length,
      totalTemporalEvents: payload.temporalEvents.length,
    };

    return {
      overallConfidence,
      breakdown,
      factors,
      metadata,
    };
  }

  /**
   * Calculate evidence confidence from evidence assessments
   */
  private calculateEvidenceConfidence(evidenceAssessments: any[]): number {
    if (evidenceAssessments.length === 0) {
      return 0.5; // Neutral confidence when no evidence
    }

    const totalConfidence = evidenceAssessments.reduce((sum, assessment) => {
      const confidence = assessment.confidence || 0.5;
      const weight = assessment.hasEvidence ? 1.0 : 0.5;
      return sum + confidence * weight;
    }, 0);

    const totalWeight = evidenceAssessments.reduce((sum, assessment) => {
      return sum + (assessment.hasEvidence ? 1.0 : 0.5);
    }, 0);

    return totalWeight > 0 ? totalConfidence / totalWeight : 0.5;
  }

  /**
   * Calculate contradiction penalty
   */
  private calculateContradictionPenalty(contradictionAssessments: any[]): number {
    if (contradictionAssessments.length === 0) {
      return 1.0; // No penalty when no contradictions
    }

    let penalty = 1.0;

    for (const assessment of contradictionAssessments) {
      if (!assessment.hasContradiction) continue;

      const severity = assessment.severity || "LOW";
      const isBlocking = assessment.isBlocking || false;
      const isFalsePositive = assessment.isFalsePositive || false;

      if (isFalsePositive) {
        // False positives don't penalize
        continue;
      }

      if (isBlocking) {
        penalty -= 0.3; // Blocking contradictions have high penalty
      } else if (severity === "CRITICAL") {
        penalty -= 0.25;
      } else if (severity === "HIGH") {
        penalty -= 0.2;
      } else if (severity === "MEDIUM") {
        penalty -= 0.1;
      } else {
        penalty -= 0.05; // LOW severity
      }
    }

    return Math.max(penalty, 0.0); // Minimum penalty is 0
  }

  /**
   * Calculate temporal consistency
   */
  private calculateTemporalConsistency(temporalEvents: any[]): number {
    if (temporalEvents.length === 0) {
      return 1.0; // Perfect consistency when no temporal events
    }

    let consistency = 1.0;

    for (const event of temporalEvents) {
      const confidence = event.confidence || 0.5;
      const hasTimestamp = event.timestamp || event.startDate ? true : false;
      const hasDuration = event.duration ? true : false;

      if (!hasTimestamp) {
        consistency -= 0.1; // Penalty for missing timestamp
      }

      if (!hasDuration && event.eventType === "employment") {
        consistency -= 0.05; // Small penalty for missing duration on employment
      }

      // Weight by event confidence
      consistency *= (0.5 + confidence * 0.5);
    }

    return Math.max(consistency, 0.0);
  }

  /**
   * Calculate factuality score from facts
   */
  private calculateFactualityScore(facts: any[]): number {
    if (facts.length === 0) {
      return 0.5; // Neutral score when no facts
    }

    let score = 0.0;
    let count = 0;

    for (const fact of facts) {
      const category = fact.category || fact.type || "general";
      const confidence = fact.confidence || 0.5;

      if (category === "quantified") {
        score += confidence * 1.2; // Quantified facts have higher weight
      } else if (category === "claim") {
        score += confidence * 0.8; // Claims have lower weight
      } else {
        score += confidence;
      }

      count++;
    }

    return count > 0 ? Math.min(score / count, 1.0) : 0.5;
  }

  /**
   * Generate confidence factors for explainability
   */
  private generateFactors(breakdown: ConfidenceBreakdown, payload: ConfidencePayload): ConfidenceFactor[] {
    const factors: ConfidenceFactor[] = [];

    // Evidence factor
    factors.push({
      id: "factor-evidence",
      type: "evidence",
      weight: 0.4,
      value: breakdown.evidenceConfidence,
      description: `Evidence confidence based on ${payload.evidenceAssessments.length} assessments`,
      ruleId: "CONFIDENCE-001",
      ruleVersion: "1.0.0",
    });

    // Contradiction factor
    factors.push({
      id: "factor-contradiction",
      type: "contradiction",
      weight: 0.3,
      value: breakdown.contradictionPenalty,
      description: `Contradiction penalty based on ${payload.contradictionAssessments.length} assessments`,
      ruleId: "CONFIDENCE-002",
      ruleVersion: "1.0.0",
    });

    // Temporal factor
    factors.push({
      id: "factor-temporal",
      type: "temporal",
      weight: 0.2,
      value: breakdown.temporalConsistency,
      description: `Temporal consistency based on ${payload.temporalEvents.length} events`,
      ruleId: "CONFIDENCE-003",
      ruleVersion: "1.0.0",
    });

    // Factuality factor
    factors.push({
      id: "factor-factuality",
      type: "factuality",
      weight: 0.1,
      value: breakdown.factualityScore,
      description: `Factuality score based on ${payload.facts.length} facts`,
      ruleId: "CONFIDENCE-004",
      ruleVersion: "1.0.0",
    });

    return factors;
  }

  /**
   * Calculate overall confidence using weighted formula
   */
  private calculateOverallConfidence(breakdown: ConfidenceBreakdown, factors: ConfidenceFactor[]): number {
    let weightedSum = 0.0;
    let totalWeight = 0.0;

    for (const factor of factors) {
      weightedSum += factor.value * factor.weight;
      totalWeight += factor.weight;
    }

    const baseConfidence = totalWeight > 0 ? weightedSum / totalWeight : 0.5;

    // Apply contradiction penalty multiplicatively
    const adjustedConfidence = baseConfidence * breakdown.contradictionPenalty;

    return Math.max(0.0, Math.min(1.0, adjustedConfidence));
  }

  getManifest(): EngineManifest {
    return ConfidenceManifest;
  }
}
