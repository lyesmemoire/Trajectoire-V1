import { BaseEvent } from "../../contracts/Event";
import { EvidenceAssessment } from "./EvidenceLedger";
import { EvidenceLink } from "./EvidenceLinker";

// ===================================================================
// EVIDENCE EVENT FACTORY — Creates Domain Events from Evidence Assessments
// ===================================================================

export class EvidenceEventFactory {
  /**
   * Creates EvidenceDetected event when evidence is found
   */
  static createEvidenceDetected(
    sessionId: string,
    observationId: string,
    assessment: EvidenceAssessment,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "evidence",
      eventType: "EVIDENCE_DETECTED",
      engineVersion,
      payload: {
        observationId,
        evidenceType: assessment.evidenceType,
        overallScore: assessment.overallScore,
        confidence: assessment.confidence,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates EvidenceStrengthCalculated event with dimension details
   */
  static createEvidenceStrengthCalculated(
    sessionId: string,
    observationId: string,
    assessment: EvidenceAssessment,
    dimensions: Map<string, number>,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "evidence",
      eventType: "EVIDENCE_STRENGTH_CALCULATED",
      engineVersion,
      payload: {
        observationId,
        strength: assessment.evidenceType,
        score: assessment.overallScore,
        dimensions: Array.from(dimensions.entries()),
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates MissingEvidenceDetected event when evidence is insufficient
   */
  static createMissingEvidenceDetected(
    sessionId: string,
    observationId: string,
    assessment: EvidenceAssessment,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "evidence",
      eventType: "MISSING_EVIDENCE_DETECTED",
      engineVersion,
      payload: {
        observationId,
        reason: assessment.reason,
        missingDimensions: assessment.missingDimensions,
        evidenceType: assessment.evidenceType,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates EvidenceLinked event for evidence relationships
   */
  static createEvidenceLinked(
    sessionId: string,
    link: EvidenceLink,
    engineVersion: string
  ): BaseEvent {
    return {
      id: crypto.randomUUID(),
      sessionId,
      sequence: 0,
      engine: "evidence",
      eventType: "EVIDENCE_LINKED",
      engineVersion,
      payload: {
        linkType: link.linkType,
        sourceObservationId: link.sourceObservationId,
        targetObservationId: link.targetObservationId,
        confidence: link.confidence,
        reason: link.reason,
      },
      createdAt: new Date(),
    };
  }

  /**
   * Creates all appropriate events from an evidence assessment
   * This is the main factory method that decides which events to emit
   */
  static createEventsFromAssessment(
    sessionId: string,
    observationId: string,
    assessment: EvidenceAssessment,
    dimensions: Map<string, number>,
    engineVersion: string
  ): BaseEvent[] {
    const events: BaseEvent[] = [];

    if (assessment.hasEvidence) {
      events.push(
        this.createEvidenceDetected(sessionId, observationId, assessment, engineVersion)
      );
      events.push(
        this.createEvidenceStrengthCalculated(sessionId, observationId, assessment, dimensions, engineVersion)
      );
    } else {
      events.push(
        this.createMissingEvidenceDetected(sessionId, observationId, assessment, engineVersion)
      );
    }

    return events;
  }

  /**
   * Creates EvidenceLinked event from a link
   */
  static createEventFromLink(
    sessionId: string,
    link: EvidenceLink,
    engineVersion: string
  ): BaseEvent {
    return this.createEvidenceLinked(sessionId, link, engineVersion);
  }
}
