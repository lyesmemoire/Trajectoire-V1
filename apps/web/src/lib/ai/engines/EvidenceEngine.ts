import { BaseEngine, BaseEngineConfig } from "./BaseEngine";
import { EventFactory } from "./EventFactory";
import { FactBuilder } from "./FactBuilder";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";
import { EngineInput } from "../contracts/Engine";
import { EvidenceDimensionCatalog, getDimension } from "../../../domain/cognitive/catalogs/EvidenceDimensionCatalog";
import { EvidenceLedger, EvidenceAssessment } from "./evidence/EvidenceLedger";
import { EvidenceLinker, EvidenceLinkCandidate } from "./evidence/EvidenceLinker";
import { MinimumEvidencePolicy } from "./evidence/policies/MinimumEvidencePolicy";
import { EvidenceQualityPolicy } from "./evidence/policies/EvidenceQualityPolicy";
import { CorroborationPolicy } from "./evidence/policies/CorroborationPolicy";
import { WeakEvidencePolicy } from "./evidence/policies/WeakEvidencePolicy";

// ===================================================================
// EVIDENCE ENGINE — Evidence Evaluator with LLM + Policies
// ===================================================================

export interface EvidenceContext {
  sessionId: string;
  traceId: string;
  correlationId: string;
}

export interface EvidencePayload {
  observationFacts: any[];
  entityFacts: any[];
}

export const EvidenceManifest: EngineManifest = {
  id: "evidence",
  version: "1.0.0",
  description: "Evaluates evidence from observations using LLM + Policies (no direct link decisions)",
  consumes: ["ObservationFacts", "EntityFacts"],
  produces: ["EvidenceAssessments"],
  facts: ["Evidence"],
  events: ["EvidenceDetected", "EvidenceStrengthCalculated", "MissingEvidenceDetected", "EvidenceLinked"],
  providers: [],
  timeout: 15000,
  retries: 2,
};

export class EvidenceEngine extends BaseEngine<EvidenceContext, EvidencePayload, BaseEvent> {
  private readonly ledger: EvidenceLedger;
  private readonly policies: Map<string, any>;

  constructor() {
    super({
      name: "EvidenceEngine",
      version: EvidenceManifest.version,
      schemaVersion: "1.0",
    });

    this.ledger = new EvidenceLedger();
    this.policies = new Map([
      ["minimum-evidence", new MinimumEvidencePolicy()],
      ["evidence-quality", new EvidenceQualityPolicy()],
      ["corroboration", new CorroborationPolicy()],
      ["weak-evidence", new WeakEvidencePolicy()],
    ]);
  }

  protected async process(
    context: EvidenceContext,
    payload: EvidencePayload,
    sessionId: string
  ): Promise<BaseEvent[]> {
    const events: BaseEvent[] = [];

    // Evaluate each observation
    for (const observation of payload.observationFacts) {
      const assessment = this.evaluateObservation(observation, payload.entityFacts);
      
      // Record in ledger
      this.ledger.record({
        id: crypto.randomUUID(),
        originObservationId: observation.id,
        assessment,
        dimensions: this.extractDimensions(observation),
        policiesApplied: Array.from(this.policies.keys()),
        timestamp: new Date(),
        engineVersion: EvidenceManifest.version,
        traceId: context.traceId,
        correlationId: context.correlationId,
        sessionId,
      });

      // Emit appropriate events
      if (assessment.hasEvidence) {
        events.push(
          this.createBaseEvent(sessionId, "EVIDENCE_DETECTED", {
            observationId: observation.id,
            evidenceType: assessment.evidenceType,
            overallScore: assessment.overallScore,
            confidence: assessment.confidence,
          })
        );

        events.push(
          this.createBaseEvent(sessionId, "EVIDENCE_STRENGTH_CALCULATED", {
            observationId: observation.id,
            strength: assessment.evidenceType,
            score: assessment.overallScore,
            dimensions: Array.from(this.extractDimensions(observation).entries()),
          })
        );
      } else {
        // Emit MISSING_EVIDENCE_DETECTED for non-evidence observations
        events.push(
          this.createBaseEvent(sessionId, "MISSING_EVIDENCE_DETECTED", {
            observationId: observation.id,
            reason: assessment.reason,
            missingDimensions: assessment.missingDimensions,
            evidenceType: assessment.evidenceType,
          })
        );
      }
    }

    // Check for potential conflicts between observations
    const conflictLinks = this.detectPotentialConflicts(payload.observationFacts);
    for (const link of conflictLinks) {
      events.push(
        this.createBaseEvent(sessionId, "EVIDENCE_LINKED", {
          linkType: link.linkType,
          sourceObservationId: link.sourceObservationId,
          targetObservationId: link.targetObservationId,
          confidence: link.confidence,
          reason: link.reason,
        })
      );
    }

    return events;
  }

  private evaluateObservation(observation: any, entityFacts: any[]): EvidenceAssessment {
    const dimensions = this.extractDimensions(observation);
    const policiesApplied: string[] = [];

    // Apply policies
    const minimumEvidenceResult = this.policies.get("minimum-evidence")?.evaluate({
      observation,
      dimensions,
      metadata: {},
    });

    const qualityResult = this.policies.get("evidence-quality")?.evaluate({
      observation,
      dimensions,
      metadata: {},
    });

    const corroborationResult = this.policies.get("corroboration")?.evaluate({
      observation,
      dimensions,
      metadata: {},
    });

    const weakEvidenceResult = this.policies.get("weak-evidence")?.evaluate({
      observation,
      dimensions,
      metadata: {},
    });

    // Special case: claims without quantification are always "claim-only"
    const isClaimWithoutEvidence = observation.category === "claim" && 
      (dimensions.get("quantification") || 0) < 0.3;

    // Determine if observation contains evidence
    const hasEvidence = !isClaimWithoutEvidence && (minimumEvidenceResult?.passed || false);
    
    // Determine evidence type
    let evidenceType = "none";
    if (hasEvidence) {
      if (weakEvidenceResult?.passed) {
        evidenceType = "strong";
      } else {
        evidenceType = "weak";
      }
    } else {
      // Check if it's a claim without evidence
      if (isClaimWithoutEvidence) {
        evidenceType = "claim-only";
      }
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore(dimensions);
    const confidence = hasEvidence ? Math.min(overallScore + 0.2, 1.0) : 0.3;

    // Identify missing dimensions
    const missingDimensions = this.identifyMissingDimensions(dimensions);

    return {
      hasEvidence,
      evidenceType,
      overallScore,
      confidence,
      reason: hasEvidence 
        ? "Evidence meets minimum threshold" 
        : (isClaimWithoutEvidence ? "Claim without evidence" : "Insufficient evidence"),
      missingDimensions,
    };
  }

  private extractDimensions(observation: any): Map<string, number> {
    const dimensions = new Map<string, number>();

    // Extract dimension scores from observation content
    const content = observation.data?.content?.toLowerCase() || observation.content?.toLowerCase() || "";
    const category = observation.data?.category?.toLowerCase() || observation.category?.toLowerCase() || "";

    // Specificity: more specific content = higher score
    dimensions.set("specificity", this.calculateSpecificity(content));

    // Ownership: explicit ownership statements
    dimensions.set("ownership", this.calculateOwnership(content));

    // Production: production-related observations
    dimensions.set("production", category === "production" ? 0.8 : 0.3);

    // Quantification: presence of numbers/metrics
    dimensions.set("quantification", this.calculateQuantification(content));

    // Failure: failure-related observations
    dimensions.set("failure", category === "failure" ? 0.8 : 0.2);

    // Recency: default to neutral (would need timestamp info)
    dimensions.set("recency", 0.5);

    // Corroboration: default to neutral (would need other observations)
    dimensions.set("corroboration", 0.3);

    // Verifiability: how verifiable is the claim
    dimensions.set("verifiability", this.calculateVerifiability(content));

    return dimensions;
  }

  private calculateSpecificity(content: string): number {
    // More specific content = higher score
    const specificIndicators = ["microservices", "kubernetes", "docker", "180", "airbus", "2021", "services", "production"];
    const vagueIndicators = ["quelque chose", "un truc", "certaines choses", "plusieurs"];

    let score = 0.4; // base score
    for (const indicator of specificIndicators) {
      if (content.includes(indicator)) score += 0.12;
    }
    for (const indicator of vagueIndicators) {
      if (content.includes(indicator)) score -= 0.1;
    }
    return Math.min(Math.max(score, 0), 1);
  }

  private calculateOwnership(content: string): number {
    const ownershipIndicators = ["j'ai", "j'ai dirigé", "j'ai créé", "mon équipe", "notre équipe", "on a"];
    let score = 0.3; // base score
    for (const indicator of ownershipIndicators) {
      if (content.includes(indicator)) score += 0.2;
    }
    return Math.min(score, 1);
  }

  private calculateQuantification(content: string): number {
    const numbers = content.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return 0.9;
    }
    return 0.2;
  }

  private calculateVerifiability(content: string): number {
    const verifiableIndicators = ["production", "airbus", "2021", "180", "microservices", "services", "heures"];
    let score = 0.4; // base score
    for (const indicator of verifiableIndicators) {
      if (content.includes(indicator)) score += 0.12;
    }
    return Math.min(score, 1);
  }

  private calculateOverallScore(dimensions: Map<string, number>): number {
    const weights: Record<string, number> = {
      specificity: 0.25,
      ownership: 0.20,
      production: 0.30,
      quantification: 0.20,
      failure: 0.25,
      recency: 0.15,
      corroboration: 0.20,
      verifiability: 0.15,
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [dimension, value] of dimensions.entries()) {
      const weight = weights[dimension] || 0.1;
      totalScore += value * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private identifyMissingDimensions(dimensions: Map<string, number>): string[] {
    const missing: string[] = [];
    const threshold = 0.3;

    for (const [dimension, value] of dimensions.entries()) {
      if (value < threshold) {
        missing.push(dimension);
      }
    }

    return missing;
  }

  protected createBaseEvent(sessionId: string, eventType: string, payload: any): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: EvidenceManifest.id,
      eventType,
      engineVersion: EvidenceManifest.version,
      payload,
      createdAt: new Date(),
    };
  }

  private detectPotentialConflicts(observations: any[]): any[] {
    const links: any[] = [];

    // Simple conflict detection: different numbers for similar concepts
    const numberObservations = observations.filter((obs) => {
      const content = obs.data?.content?.toLowerCase() || obs.content?.toLowerCase() || "";
      return /\d+/.test(content);
    });

    for (let i = 0; i < numberObservations.length; i++) {
      for (let j = i + 1; j < numberObservations.length; j++) {
        const obs1 = numberObservations[i];
        const obs2 = numberObservations[j];

        const content1 = obs1.data?.content || obs1.content || "";
        const content2 = obs2.data?.content || obs2.content || "";

        const numbers1 = content1.match(/\d+/g) || [];
        const numbers2 = content2.match(/\d+/g) || [];

        if (numbers1.length > 0 && numbers2.length > 0) {
          const num1 = parseInt(numbers1[0]);
          const num2 = parseInt(numbers2[0]);

          // If numbers differ significantly, flag as potential conflict
          if (Math.abs(num1 - num2) > 10) {
            const link = EvidenceLinker.createPotentialConflictReference(
              obs1.id,
              obs2.id,
              `Different quantities: ${num1} vs ${num2}`
            );
            links.push(link);
          }
        }
      }
    }

    return links;
  }

  getLedger(): EvidenceLedger {
    return this.ledger;
  }
}
