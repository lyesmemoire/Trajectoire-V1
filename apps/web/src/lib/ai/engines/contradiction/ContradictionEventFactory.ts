import { BaseEvent } from "../../contracts/Event";
import { ContradictionAssessment } from "./ContradictionLedger";

// ===================================================================
// CONTRADICTION EVENT FACTORY — Creates Domain Events from Contradiction Assessments
// ===================================================================

export class ContradictionEventFactory {
  /**
   * Creates ContradictionDetected event when a contradiction is found
   */
  static createContradictionDetected(
    sessionId: string,
    observationAId: string,
    observationBId: string,
    assessment: ContradictionAssessment,
    ruleId: string,
    ruleVersion: string,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "contradiction",
      eventType: "CONTRADICTION_DETECTED",
      engineVersion,
      payload: {
        observationAId,
        observationBId,
        contradictionType: assessment.contradictionType,
        severity: assessment.severity,
        confidence: assessment.confidence,
        reason: assessment.reason,
        ruleId,
        ruleVersion,
        isBlocking: assessment.isBlocking,
        isRecoverable: assessment.isRecoverable,
        isFalsePositive: assessment.isFalsePositive,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates BlockingContradictionDetected event for critical contradictions
   */
  static createBlockingContradictionDetected(
    sessionId: string,
    observationAId: string,
    observationBId: string,
    assessment: ContradictionAssessment,
    ruleId: string,
    ruleVersion: string,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "contradiction",
      eventType: "BLOCKING_CONTRADICTION_DETECTED",
      engineVersion,
      payload: {
        observationAId,
        observationBId,
        contradictionType: assessment.contradictionType,
        severity: assessment.severity,
        confidence: assessment.confidence,
        reason: assessment.reason,
        ruleId,
        ruleVersion,
        resolution: assessment.resolution,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates RecoverableContradictionDetected event for contradictions that can be resolved
   */
  static createRecoverableContradictionDetected(
    sessionId: string,
    observationAId: string,
    observationBId: string,
    assessment: ContradictionAssessment,
    ruleId: string,
    ruleVersion: string,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "contradiction",
      eventType: "RECOVERABLE_CONTRADICTION_DETECTED",
      engineVersion,
      payload: {
        observationAId,
        observationBId,
        contradictionType: assessment.contradictionType,
        severity: assessment.severity,
        confidence: assessment.confidence,
        reason: assessment.reason,
        ruleId,
        ruleVersion,
        resolution: assessment.resolution,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates FalsePositiveContradictionDetected event for likely false positives
   */
  static createFalsePositiveContradictionDetected(
    sessionId: string,
    observationAId: string,
    observationBId: string,
    assessment: ContradictionAssessment,
    ruleId: string,
    ruleVersion: string,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "contradiction",
      eventType: "FALSE_POSITIVE_CONTRADICTION_DETECTED",
      engineVersion,
      payload: {
        observationAId,
        observationBId,
        contradictionType: assessment.contradictionType,
        severity: assessment.severity,
        confidence: assessment.confidence,
        reason: assessment.reason,
        ruleId,
        ruleVersion,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates ContradictionResolved event when a contradiction is resolved
   */
  static createContradictionResolved(
    sessionId: string,
    contradictionId: string,
    resolutionMethod: string,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "contradiction",
      eventType: "CONTRADICTION_RESOLVED",
      engineVersion,
      payload: {
        contradictionId,
        resolutionMethod,
        resolvedAt: new Date(),
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates all appropriate events from a contradiction assessment
   * This is the main factory method that decides which events to emit
   */
  static createEventsFromAssessment(
    sessionId: string,
    observationAId: string,
    observationBId: string,
    assessment: ContradictionAssessment,
    ruleId: string,
    ruleVersion: string,
    engineVersion: string
  ): BaseEvent[] {
    const events: BaseEvent[] = [];

    if (!assessment.hasContradiction) {
      return events;
    }

    // Always emit the base contradiction detected event
    events.push(
      this.createContradictionDetected(
        sessionId,
        observationAId,
        observationBId,
        assessment,
        ruleId,
        ruleVersion,
        engineVersion
      )
    );

    // Emit specific event based on assessment properties
    if (assessment.isBlocking) {
      events.push(
        this.createBlockingContradictionDetected(
          sessionId,
          observationAId,
          observationBId,
          assessment,
          ruleId,
          ruleVersion,
          engineVersion
        )
      );
    }

    if (assessment.isRecoverable) {
      events.push(
        this.createRecoverableContradictionDetected(
          sessionId,
          observationAId,
          observationBId,
          assessment,
          ruleId,
          ruleVersion,
          engineVersion
        )
      );
    }

    if (assessment.isFalsePositive) {
      events.push(
        this.createFalsePositiveContradictionDetected(
          sessionId,
          observationAId,
          observationBId,
          assessment,
          ruleId,
          ruleVersion,
          engineVersion
        )
      );
    }

    return events;
  }

  /**
   * Creates ContradictionResolved event from a ledger entry
   */
  static createEventFromResolution(
    sessionId: string,
    contradictionId: string,
    resolutionMethod: string,
    engineVersion: string
  ): BaseEvent {
    return this.createContradictionResolved(sessionId, contradictionId, resolutionMethod, engineVersion);
  }
}
