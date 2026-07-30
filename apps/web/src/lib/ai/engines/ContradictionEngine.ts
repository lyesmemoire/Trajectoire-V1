import { BaseEngine, BaseEngineConfig } from "./BaseEngine";
import { EventFactory } from "./EventFactory";
import { FactBuilder } from "./FactBuilder";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";
import { EngineInput } from "../contracts/Engine";
import { ContradictionCatalog, getContradictionType } from "../../../domain/cognitive/catalogs/ContradictionCatalog";
import { ContradictionLedger, ContradictionAssessment } from "./contradiction/ContradictionLedger";
import { BaseContradictionPolicy, ContradictionPolicyContext } from "./contradiction/policies/ContradictionPolicy";
import { BlockingContradictionPolicy } from "./contradiction/policies/BlockingContradictionPolicy";
import { RecoverableContradictionPolicy } from "./contradiction/policies/RecoverableContradictionPolicy";
import { BenefitOfDoubtPolicy } from "./contradiction/policies/BenefitOfDoubtPolicy";
import { FalsePositivePolicy } from "./contradiction/policies/FalsePositivePolicy";
import { ContradictionEventFactory } from "./contradiction/ContradictionEventFactory";
import { FactQueryService } from "../services/FactQueryService";
import { CognitiveState } from "../../../domain/cognitive/CognitiveState";

// ===================================================================
// CONTRADICTION ENGINE — Contradiction Detector with Catalog + Policies
// ===================================================================

export interface ContradictionContext {
  sessionId: string;
  traceId: string;
  correlationId: string;
}

export interface ContradictionPayload {
  observationFacts: any[];
  entityFacts: any[];
}

export const ContradictionManifest: EngineManifest = {
  id: "contradiction",
  version: "1.0.0",
  description: "Detects contradictions between observations using catalog-driven policies",
  consumes: ["observationFacts", "entityFacts"],
  produces: ["contradictionFacts"],
  facts: ["OBSERVATION", "ENTITY"],
  events: [
    "CONTRADICTION_DETECTED",
    "BLOCKING_CONTRADICTION_DETECTED",
    "RECOVERABLE_CONTRADICTION_DETECTED",
    "FALSE_POSITIVE_CONTRADICTION_DETECTED",
    "CONTRADICTION_RESOLVED",
  ],
  providers: ["internal"],
  timeout: 30000,
  retries: 0,
};

export class ContradictionEngine extends BaseEngine<
  ContradictionContext,
  ContradictionPayload,
  BaseEvent
> {
  private readonly ledger: ContradictionLedger;
  private readonly policies: Map<string, BaseContradictionPolicy>;
  private readonly factQueryService: FactQueryService;

  constructor(
    config?: Partial<BaseEngineConfig>,
    state?: CognitiveState
  ) {
    super({
      name: "ContradictionEngine",
      version: "1.0.0",
      schemaVersion: "1.0",
      ...config,
    });

    this.ledger = new ContradictionLedger();
    this.policies = new Map([
      ["blocking-contradiction", new BlockingContradictionPolicy()],
      ["recoverable-contradiction", new RecoverableContradictionPolicy()],
      ["benefit-of-doubt", new BenefitOfDoubtPolicy()],
      ["false-positive", new FalsePositivePolicy()],
    ]);

    // Initialize FactQueryService if state is provided
    this.factQueryService = state ? new FactQueryService(state) : null as any;
  }

  protected async process(
    context: ContradictionContext,
    payload: ContradictionPayload,
    sessionId: string
  ): Promise<BaseEvent[]> {
    const events: BaseEvent[] = [];

    // Detect contradictions between all pairs of observations
    for (let i = 0; i < payload.observationFacts.length; i++) {
      for (let j = i + 1; j < payload.observationFacts.length; j++) {
        const obsA = payload.observationFacts[i];
        const obsB = payload.observationFacts[j];

        const assessment = this.evaluateContradiction(obsA, obsB);
        
        if (assessment.hasContradiction) {
          const contradictionType = getContradictionType(assessment.contradictionType);
          const ruleId = contradictionType?.ruleId || "CONTRADICTION-UNKNOWN";
          const ruleVersion = contradictionType?.ruleVersion || "1.0.0";

          // Record in ledger
          this.ledger.record({
            id: crypto.randomUUID(),
            observationAId: obsA.id,
            observationBId: obsB.id,
            assessment,
            ruleId,
            ruleVersion,
            policy: this.getAppliedPolicies(assessment).join(","),
            timestamp: new Date(),
            engineVersion: ContradictionManifest.version,
            promptVersion: "1.0.0", // TODO: Extract from LLM provider when available
            provider: "internal", // TODO: Extract from LLM provider when available
            traceId: context.traceId,
            correlationId: context.correlationId,
            sessionId,
          });

          // Create events using EventFactory (separation of concerns)
          const assessmentEvents = ContradictionEventFactory.createEventsFromAssessment(
            sessionId,
            obsA.id,
            obsB.id,
            assessment,
            ruleId,
            ruleVersion,
            ContradictionManifest.version
          );
          events.push(...assessmentEvents);
        }
      }
    }

    return events;
  }

  private evaluateContradiction(obsA: any, obsB: any): ContradictionAssessment {
    // Detect contradiction type using catalog-driven logic
    const contradictionType = this.detectContradictionType(obsA, obsB);
    
    if (!contradictionType) {
      return {
        hasContradiction: false,
        contradictionType: "none",
        severity: "NONE",
        confidence: 0,
        reason: "No contradiction detected",
        isBlocking: false,
        isRecoverable: false,
        isFalsePositive: false,
      };
    }

    const typeConfig = getContradictionType(contradictionType);
    if (!typeConfig) {
      return {
        hasContradiction: false,
        contradictionType: "none",
        severity: "NONE",
        confidence: 0,
        reason: "Unknown contradiction type",
        isBlocking: false,
        isRecoverable: false,
        isFalsePositive: false,
      };
    }

    // Apply policies
    const policyContext: ContradictionPolicyContext = {
      observationA: obsA,
      observationB: obsB,
      contradictionType,
      severity: typeConfig.severity,
      metadata: {},
    };

    const blockingResult = this.policies.get("blocking-contradiction")?.evaluate(policyContext);
    const recoverableResult = this.policies.get("recoverable-contradiction")?.evaluate(policyContext);
    const benefitOfDoubtResult = this.policies.get("benefit-of-doubt")?.evaluate(policyContext);
    const falsePositiveResult = this.policies.get("false-positive")?.evaluate(policyContext);

    // Determine assessment based on policy results
    const isBlocking = blockingResult?.passed === false;
    const isRecoverable = recoverableResult?.passed === true;
    const isFalsePositive = falsePositiveResult?.passed === true;

    // If false positive, mark as no contradiction
    if (isFalsePositive) {
      return {
        hasContradiction: false,
        contradictionType,
        severity: typeConfig.severity,
        confidence: falsePositiveResult?.score || 0,
        reason: falsePositiveResult?.reason || "Likely false positive",
        resolution: falsePositiveResult?.resolution,
        isBlocking: false,
        isRecoverable: false,
        isFalsePositive: true,
      };
    }

    // If benefit of doubt, mark as no contradiction but note it
    if (benefitOfDoubtResult?.passed === true) {
      return {
        hasContradiction: false,
        contradictionType,
        severity: typeConfig.severity,
        confidence: benefitOfDoubtResult?.score || 0,
        reason: benefitOfDoubtResult?.reason || "Benefit of doubt granted",
        resolution: benefitOfDoubtResult?.resolution,
        isBlocking: false,
        isRecoverable: false,
        isFalsePositive: false,
      };
    }

    // Otherwise, it's a contradiction
    const confidence = this.calculateConfidence(typeConfig.severity, isBlocking, isRecoverable);
    const reasons: string[] = [];
    if (blockingResult?.reason) reasons.push(blockingResult.reason);
    if (recoverableResult?.reason) reasons.push(recoverableResult.reason);

    return {
      hasContradiction: true,
      contradictionType,
      severity: typeConfig.severity,
      confidence,
      reason: reasons.join("; "),
      resolution: blockingResult?.resolution || recoverableResult?.resolution,
      isBlocking,
      isRecoverable,
      isFalsePositive: false,
    };
  }

  private detectContradictionType(obsA: any, obsB: any): string | null {
    const contentA = (obsA.data?.content || obsA.content || "").toLowerCase();
    const contentB = (obsB.data?.content || obsB.content || "").toLowerCase();

    // Use ContradictionCatalog to drive detection
    for (const [typeId, typeConfig] of ContradictionCatalog.entries()) {
      if (this.matchesContradictionPattern(contentA, contentB, typeConfig)) {
        return typeId;
      }
    }

    return null;
  }

  private matchesContradictionPattern(contentA: string, contentB: string, typeConfig: any): boolean {
    // Simple pattern matching based on contradiction type
    // In a real implementation, this would use more sophisticated NLP
    
    const patterns: Record<string, () => boolean> = {
      "factual-number-mismatch": () => {
        const numbersA: string[] = contentA.match(/\d+/g) || [];
        const numbersB: string[] = contentB.match(/\d+/g) || [];
        return numbersA.length > 0 && numbersB.length > 0 && 
               numbersA.some((n) => !numbersB.includes(n));
      },
      "factual-entity-mismatch": () => {
        const entitiesA = this.extractEntities(contentA);
        const entitiesB = this.extractEntities(contentB);
        return entitiesA.length > 0 && entitiesB.length > 0 && 
               !entitiesA.some(e => entitiesB.includes(e));
      },
      "temporal-overlap": () => {
        return contentA.includes("while") || contentB.includes("while") ||
               contentA.includes("simultaneously") || contentB.includes("simultaneously");
      },
      "temporal-sequence": () => {
        return contentA.includes("before") || contentB.includes("before") ||
               contentA.includes("after") || contentB.includes("after");
      },
      "technical-incompatibility": () => {
        const techA = this.extractTechnologies(contentA);
        const techB = this.extractTechnologies(contentB);
        return this.checkIncompatibility(techA, techB);
      },
    };

    const matcher = patterns[typeConfig.id as keyof typeof patterns];
    return matcher ? matcher() : false;
  }

  private extractEntities(content: string): string[] {
    // Simple entity extraction - in real implementation, use NER
    const entityPatterns = [
      /airbus|boeing|google|microsoft|amazon|apple|meta|netflix|spotify/gi,
      /kubernetes|docker|aws|azure|gcp|terraform|ansible/gi,
    ];
    const entities: string[] = [];
    for (const pattern of entityPatterns) {
      const matches = content.match(pattern);
      if (matches) entities.push(...matches);
    }
    return [...new Set(entities.map(e => e.toLowerCase()))];
  }

  private extractTechnologies(content: string): string[] {
    const techPatterns = [
      /java|python|javascript|typescript|go|rust|c\+\+|c#/gi,
      /react|angular|vue|svelte|next\.js|nuxt/gi,
      /kubernetes|docker|terraform|ansible|chef|puppet/gi,
      /aws|azure|gcp|heroku|vercel|netlify/gi,
    ];
    const techs: string[] = [];
    for (const pattern of techPatterns) {
      const matches = content.match(pattern);
      if (matches) techs.push(...matches);
    }
    return [...new Set(techs.map(t => t.toLowerCase()))];
  }

  private checkIncompatibility(techA: string[], techB: string[]): boolean {
    // Simple incompatibility check
    const incompatiblePairs = [
      ["react", "angular"],
      ["vue", "angular"],
      ["kubernetes", "docker swarm"],
    ];
    
    for (const [t1, t2] of incompatiblePairs) {
      if (techA.includes(t1) && techB.includes(t2)) return true;
      if (techA.includes(t2) && techB.includes(t1)) return true;
    }
    
    return false;
  }

  private calculateConfidence(severity: string, isBlocking: boolean, isRecoverable: boolean): number {
    let baseConfidence = 0.5;
    
    switch (severity) {
      case "CRITICAL":
        baseConfidence = 0.95;
        break;
      case "HIGH":
        baseConfidence = 0.85;
        break;
      case "MEDIUM":
        baseConfidence = 0.7;
        break;
      case "LOW":
        baseConfidence = 0.5;
        break;
    }
    
    if (isBlocking) baseConfidence = Math.min(baseConfidence + 0.05, 1.0);
    if (isRecoverable) baseConfidence = Math.max(baseConfidence - 0.1, 0.3);
    
    return baseConfidence;
  }

  private getAppliedPolicies(assessment: ContradictionAssessment): string[] {
    const policies: string[] = [];
    if (assessment.isBlocking) policies.push("BlockingContradictionPolicy");
    if (assessment.isRecoverable) policies.push("RecoverableContradictionPolicy");
    if (assessment.isFalsePositive) policies.push("FalsePositivePolicy");
    return policies;
  }

  getLedger(): ContradictionLedger {
    return this.ledger;
  }
}
