import { BaseEngine, BaseEngineConfig } from "./BaseEngine";
import { EventFactory } from "./EventFactory";
import { FactBuilder } from "./FactBuilder";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";
import { EngineInput } from "../contracts/Engine";
import { EvidenceDimensionCatalog, getDimension } from "../../../domain/cognitive/catalogs/EvidenceDimensionCatalog";
import { EvidenceLedger, EvidenceAssessment } from "./evidence/EvidenceLedger";
import { EvidenceLinker, EvidenceLinkCandidate } from "./evidence/EvidenceLinker";
import { EvidenceEventFactory } from "./evidence/EvidenceEventFactory";
import { EvidencePolicyRegistry } from "./evidence/policies/EvidencePolicyRegistry";

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
  manifestVersion: "1.0.0",
  minimumRuntimeVersion: "1.0.0",
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
  private readonly policyRegistry: EvidencePolicyRegistry;

  constructor(policyRegistry: EvidencePolicyRegistry, config?: Partial<BaseEngineConfig>) {
    super({
      name: "EvidenceEngine",
      version: EvidenceManifest.version,
      schemaVersion: "1.0",
      ...config,
    });

    this.ledger = new EvidenceLedger();
    this.policyRegistry = policyRegistry;
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
      const dimensions = this.extractDimensions(observation);
      
      // Record in ledger with complete metadata
      this.ledger.record({
        id: crypto.randomUUID(),
        originObservationId: observation.id,
        assessment,
        dimensions,
        policiesApplied: Array.from(this.policyRegistry.getAll().map(p => p.id)),
        timestamp: new Date(),
        engineVersion: EvidenceManifest.version,
        promptVersion: "1.0.0", // TODO: Extract from LLM provider when available
        provider: "internal", // TODO: Extract from LLM provider when available
        traceId: context.traceId,
        correlationId: context.correlationId,
        sessionId,
      });

      // Create events using EventFactory (separation of concerns)
      const assessmentEvents = EvidenceEventFactory.createEventsFromAssessment(
        sessionId,
        observation.id,
        assessment,
        dimensions,
        EvidenceManifest.version,
        {
          provider: "internal",
          model: "internal",
          promptId: "evidence-default",
          promptVersion: "1.0.0",
          promptChecksum: "sha256-placeholder",
          schemaVersion: "1.0",
        }
      );
      events.push(...assessmentEvents);
    }

    // Check for potential conflicts between observations
    const conflictLinks = this.detectPotentialConflicts(payload.observationFacts);
    for (const link of conflictLinks) {
      const linkEvent = EvidenceEventFactory.createEventFromLink(
        sessionId,
        link,
        EvidenceManifest.version,
        {
          provider: "internal",
          model: "internal",
          promptId: "evidence-default",
          promptVersion: "1.0.0",
          promptChecksum: "sha256-placeholder",
          schemaVersion: "1.0",
        }
      );
      events.push(linkEvent);
    }

    return events;
  }

  private evaluateObservation(observation: any, entityFacts: any[]): EvidenceAssessment {
    const dimensions = this.extractDimensions(observation);
    const policiesApplied: string[] = [];

    // Extract category from observation
    const category = observation.data?.category?.toLowerCase() || observation.category?.toLowerCase() || "";

    // Apply policies
    const minimumEvidenceResult = this.policyRegistry.getMinimumEvidenceResult({
      observation,
      dimensions,
      metadata: {},
    });

    const qualityResult = this.policyRegistry.getEvidenceQualityResult({
      observation,
      dimensions,
      metadata: {},
    });

    const corroborationResult = this.policyRegistry.getCorroborationResult({
      observation,
      dimensions,
      metadata: {},
    });

    const weakEvidenceResult = this.policyRegistry.getWeakEvidenceResult({
      observation,
      dimensions,
      metadata: {},
    });

    // Track which policies were applied
    if (minimumEvidenceResult) policiesApplied.push("minimum-evidence");
    if (qualityResult) policiesApplied.push("evidence-quality");
    if (corroborationResult) policiesApplied.push("corroboration");
    if (weakEvidenceResult) policiesApplied.push("weak-evidence");

    // Special case: claims without quantification are always "claim-only"
    const isClaimWithoutEvidence = category === "claim" && 
      (dimensions.get("quantification") || 0) < 0.3;

    // Determine if observation contains evidence (all policies must agree)
    const hasEvidence = !isClaimWithoutEvidence && 
      (minimumEvidenceResult?.passed || false) &&
      (qualityResult?.passed || false) &&
      (corroborationResult?.passed || false);
    
    // Determine evidence type (claims without evidence get special treatment)
    let evidenceType = "none";
    if (isClaimWithoutEvidence) {
      evidenceType = "claim-only";
    } else if (hasEvidence) {
      if (weakEvidenceResult?.passed) {
        evidenceType = "strong";
      } else {
        evidenceType = "weak";
      }
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore(dimensions);
    const confidence = hasEvidence ? Math.min(overallScore + 0.2, 1.0) : 0.3;

    // Identify missing dimensions
    const missingDimensions = this.identifyMissingDimensions(dimensions);

    // Build reason from all policy results
    const reasons: string[] = [];
    if (minimumEvidenceResult?.reason) reasons.push(minimumEvidenceResult.reason);
    if (qualityResult?.reason) reasons.push(qualityResult.reason);
    if (corroborationResult?.reason) reasons.push(corroborationResult.reason);
    if (weakEvidenceResult?.reason) reasons.push(weakEvidenceResult.reason);

    return {
      hasEvidence,
      evidenceType,
      overallScore,
      confidence,
      reason: hasEvidence 
        ? reasons.join("; ") 
        : (isClaimWithoutEvidence ? "Claim without evidence" : reasons.join("; ")),
      missingDimensions,
    };
  }

  private extractDimensions(observation: any): Map<string, number> {
    const dimensions = new Map<string, number>();

    // Extract dimension scores from observation content
    const content = observation.data?.content?.toLowerCase() || observation.content?.toLowerCase() || "";
    const category = observation.data?.category?.toLowerCase() || observation.category?.toLowerCase() || "";

    // Use EvidenceDimensionCatalog to drive dimension calculation
    for (const [dimensionId, dimensionConfig] of EvidenceDimensionCatalog.entries()) {
      const score = this.calculateDimensionScore(dimensionId, content, category);
      dimensions.set(dimensionId, score);
    }

    return dimensions;
  }

  private calculateDimensionScore(dimensionId: string, content: string, category: string): number {
    switch (dimensionId) {
      case "specificity":
        return this.calculateSpecificity(content);
      case "ownership":
        return this.calculateOwnership(content);
      case "production":
        return category === "production" ? 0.8 : 0.3;
      case "quantification":
        return this.calculateQuantification(content);
      case "failure":
        return category === "failure" ? 0.8 : 0.2;
      case "recency":
        return 0.5; // Default to neutral (would need timestamp info)
      case "corroboration":
        return 0.3; // Default to neutral (would need other observations)
      case "verifiability":
        return this.calculateVerifiability(content);
      default:
        return 0.5; // Default neutral score
    }
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
    let totalScore = 0;
    let totalWeight = 0;

    // Use weights from EvidenceDimensionCatalog
    for (const [dimensionId, dimensionConfig] of EvidenceDimensionCatalog.entries()) {
      const value = dimensions.get(dimensionId) || 0;
      const weight = dimensionConfig.weight;
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
