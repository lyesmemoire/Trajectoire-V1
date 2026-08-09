import { BaseEngine, BaseEngineConfig } from "./BaseEngine";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";
import { ContradictionCatalog, getContradictionType } from "../../../domain/cognitive/catalogs/ContradictionCatalog";
import { ContradictionLedger, ContradictionAssessment } from "./contradiction/ContradictionLedger";
import { ContradictionPolicyContext } from "./contradiction/policies/ContradictionPolicy";
import { ContradictionEventFactory } from "./contradiction/ContradictionEventFactory";
import { ContradictionValidatorRegistry } from "./contradiction/ContradictionValidatorRegistry";
import { ContradictionPolicyRegistry } from "./contradiction/policies/ContradictionPolicyRegistry";

// ===================================================================
// CONTRADICTION ENGINE — Pure Orchestrator (no business logic)
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
  manifestVersion: "1.0.0",
  minimumRuntimeVersion: "1.0.0",
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
  private readonly policyRegistry: ContradictionPolicyRegistry;
  private readonly validatorRegistry: ContradictionValidatorRegistry;

  constructor(
    policyRegistry: ContradictionPolicyRegistry,
    validatorRegistry: ContradictionValidatorRegistry,
    config?: Partial<BaseEngineConfig>
  ) {
    super({
      name: "ContradictionEngine",
      version: "1.0.0",
      schemaVersion: "1.0",
      ...config,
    });

    this.ledger = new ContradictionLedger();
    this.policyRegistry = policyRegistry;
    this.validatorRegistry = validatorRegistry;
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
            promptVersion: "1.0.0", // Internal LLM version - will be extracted from provider config when external provider is integrated
            provider: "internal", // Using internal LLM - will be updated when external provider is configured
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
            ContradictionManifest.version,
            {
              provider: "internal",
              model: "internal",
              promptId: "contradiction-default",
              promptVersion: "1.0.0",
              promptChecksum: "sha256-placeholder",
              schemaVersion: "1.0",
            }
          );
          events.push(...assessmentEvents);
        }
      }
    }

    return events;
  }

  private evaluateContradiction(obsA: any, obsB: any): ContradictionAssessment {
    // Detect contradiction type using catalog
    const contradictionType = this.detectContradictionType(obsA, obsB);
    
    if (!contradictionType) {
      return this.buildNoContradictionAssessment("No contradiction detected");
    }

    const typeConfig = getContradictionType(contradictionType);
    if (!typeConfig) {
      return this.buildNoContradictionAssessment("Unknown contradiction type");
    }

    // Use validator for business logic (pattern matching, confidence calculation)
    const validationResult = this.validatorRegistry.validateContradiction({
      observationA: obsA,
      observationB: obsB,
      contradictionType,
      severity: typeConfig.severity,
    });

    // Apply policies
    const policyContext: ContradictionPolicyContext = {
      observationA: obsA,
      observationB: obsB,
      contradictionType,
      severity: typeConfig.severity,
      metadata: {},
    };

    const blockingResult = this.policyRegistry.getBlockingResult(policyContext);
    const recoverableResult = this.policyRegistry.getRecoverableResult(policyContext);
    const benefitOfDoubtResult = this.policyRegistry.getBenefitOfDoubtResult(policyContext);
    const falsePositiveResult = this.policyRegistry.getFalsePositiveResult(policyContext);

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
    const reasons: string[] = [validationResult.reason];
    if (blockingResult?.reason) reasons.push(blockingResult.reason);
    if (recoverableResult?.reason) reasons.push(recoverableResult.reason);

    return {
      hasContradiction: true,
      contradictionType,
      severity: typeConfig.severity,
      confidence: validationResult.confidence,
      reason: reasons.join("; "),
      resolution: blockingResult?.resolution || recoverableResult?.resolution,
      isBlocking,
      isRecoverable,
      isFalsePositive: false,
    };
  }

  private detectContradictionType(obsA: any, obsB: any): string | null {
    // Use ContradictionCatalog to drive detection
    for (const [typeId, typeConfig] of ContradictionCatalog.entries()) {
      // Delegate pattern matching to validator
      const validationResult = this.validatorRegistry.validateContradiction({
        observationA: obsA,
        observationB: obsB,
        contradictionType: typeId,
        severity: typeConfig.severity,
      });
      
      if (validationResult.hasContradiction) {
        return typeId;
      }
    }

    return null;
  }

  private buildNoContradictionAssessment(reason: string): ContradictionAssessment {
    return {
      hasContradiction: false,
      contradictionType: "none",
      severity: "NONE",
      confidence: 0,
      reason,
      isBlocking: false,
      isRecoverable: false,
      isFalsePositive: false,
    };
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
