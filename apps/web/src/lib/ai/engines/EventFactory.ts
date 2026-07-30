import { BaseEvent } from "../contracts/Event";

// ===================================================================
// EVENT FACTORY — Uniform Event Construction
// ===================================================================

export class EventFactory {
  static createObservationExtractedEvent(data: {
    sessionId: string;
    engine: string;
    engineVersion: string;
    observations: string[];
  }): BaseEvent<{ observations: string[] }> {
    return {
      id: crypto.randomUUID(),
      sessionId: data.sessionId,
      sequence: 0,
      engine: data.engine,
      eventType: "OBSERVATION_EXTRACTED",
      engineVersion: data.engineVersion,
      payload: {
        observations: data.observations,
      },
      createdAt: new Date(),
    };
  }

  static createFactExtractedEvent(data: {
    sessionId: string;
    engine: string;
    engineVersion: string;
    facts: any[];
  }): BaseEvent<{ facts: any[] }> {
    return {
      id: crypto.randomUUID(),
      sessionId: data.sessionId,
      sequence: 0,
      engine: data.engine,
      eventType: "FACT_EXTRACTED",
      engineVersion: data.engineVersion,
      payload: {
        facts: data.facts,
      },
      createdAt: new Date(),
    };
  }

  static createNormalizedEvent(data: {
    sessionId: string;
    engine: string;
    engineVersion: string;
    normalizedText: string;
  }): BaseEvent<{ normalizedText: string }> {
    return {
      id: crypto.randomUUID(),
      sessionId: data.sessionId,
      sequence: 0,
      engine: data.engine,
      eventType: "TEXT_NORMALIZED",
      engineVersion: data.engineVersion,
      payload: {
        normalizedText: data.normalizedText,
      },
      createdAt: new Date(),
    };
  }

  static createIdentityExtractedEvent(data: {
    sessionId: string;
    engine: string;
    engineVersion: string;
    identity: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
  }): BaseEvent<{ identity: any }> {
    return {
      id: crypto.randomUUID(),
      sessionId: data.sessionId,
      sequence: 0,
      engine: data.engine,
      eventType: "IDENTITY_EXTRACTED",
      engineVersion: data.engineVersion,
      payload: {
        identity: data.identity,
      },
      createdAt: new Date(),
    };
  }

  static createEvidenceExtractedEvent(data: {
    sessionId: string;
    engine: string;
    engineVersion: string;
    evidences: any[];
  }): BaseEvent<{ evidences: any[] }> {
    return {
      id: crypto.randomUUID(),
      sessionId: data.sessionId,
      sequence: 0,
      engine: data.engine,
      eventType: "EVIDENCE_EXTRACTED",
      engineVersion: data.engineVersion,
      payload: {
        evidences: data.evidences,
      },
      createdAt: new Date(),
    };
  }
}
