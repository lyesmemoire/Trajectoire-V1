import { BaseEngine } from "./BaseEngine";
import { FactBuilder } from "./FactBuilder";
import { ObservationResolver } from "./ObservationResolver";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";

// ===================================================================
// PERCEPTION ENGINE — Extract Observations from NormalizedText + EntityFacts
// ===================================================================

export interface PerceptionContext {
  sessionId: string;
}

export interface PerceptionPayload {
  normalizedText: string;
  entityFacts: any[];
}

export const PerceptionManifest: EngineManifest = {
  id: "perception",
  version: "2.0.0",
  manifestVersion: "1.0.0",
  minimumRuntimeVersion: "1.0.0",
  description: "Extract observations from normalized text and entity facts (no inference, no evaluation)",
  consumes: ["NormalizedText", "EntityFacts"],
  produces: ["ObservationFacts"],
  facts: ["Observation"],
  events: ["ObservationExtracted"],
  providers: [],
  timeout: 10000,
  retries: 2,
};

export class PerceptionEngine extends BaseEngine<PerceptionContext, PerceptionPayload, BaseEvent<{ observations: any[] }>> {
  constructor() {
    super({
      name: "PerceptionEngine",
      version: PerceptionManifest.version,
      schemaVersion: "2.0",
    });
  }

  protected async process(
    context: PerceptionContext,
    payload: PerceptionPayload,
    sessionId: string
  ): Promise<BaseEvent<{ observations: any[] }>[]> {
    const observations = this.extractObservations(payload.normalizedText, payload.entityFacts);

    const event = this.createBaseEvent(sessionId, "OBSERVATION_EXTRACTED", {
      observations,
    });

    return [event];
  }

  private extractObservations(normalizedText: string, entityFacts: any[]): any[] {
    const observations: any[] = [];

    // Extract production observations
    const productionObs = this.extractProductionObservations(normalizedText);
    observations.push(...productionObs);

    // Extract failure observations
    const failureObs = this.extractFailureObservations(normalizedText);
    observations.push(...failureObs);

    // Extract responsibility observations
    const responsibilityObs = this.extractResponsibilityObservations(normalizedText);
    observations.push(...responsibilityObs);

    // Extract experience observations (from entity facts)
    const experienceObs = this.extractExperienceObservations(normalizedText, entityFacts);
    observations.push(...experienceObs);

    // Extract metric observations
    const metricObs = this.extractMetricObservations(normalizedText);
    observations.push(...metricObs);

    // Extract claim observations (to be verified by EvidenceEngine)
    const claimObs = this.extractClaimObservations(normalizedText);
    observations.push(...claimObs);

    // Extract unknown observations
    const unknownObs = this.extractUnknownObservations(normalizedText);
    observations.push(...unknownObs);

    return observations;
  }

  private extractProductionObservations(text: string): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for production incident patterns
    const incidentPatterns = ["incident", "crash", "downtime", "panne", "erreur en prod", "en prod", "production"];
    for (const pattern of incidentPatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }

  private extractFailureObservations(text: string): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for failure patterns
    const failurePatterns = ["échec", "a échoué", "projet raté", "n'a pas marché", "échoué", "failure", "bug"];
    for (const pattern of failurePatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }

  private extractResponsibilityObservations(text: string): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for responsibility patterns
    const responsibilityPatterns = ["dirigé une équipe", "leader", "responsable d'équipe", "team lead", "chef d'équipe", "manager", "responsable du projet"];
    for (const pattern of responsibilityPatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }

  private extractExperienceObservations(text: string, entityFacts: any[]): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for experience patterns
    const experiencePatterns = ["expérience avec", "utilisé", "travaillé avec", "développé avec"];
    for (const pattern of experiencePatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }

  private extractMetricObservations(text: string): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for metric patterns
    const metricPatterns = ["performance", "optimisation", "amélioré", "réduit", "augmenté", "latence", "throughput"];
    for (const pattern of metricPatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }

  private extractClaimObservations(text: string): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for claim patterns (to be verified by EvidenceEngine)
    const claimPatterns = ["maîtrise", "expert", "compétence", "je sais", "je connais", "bon en", "fort en"];
    for (const pattern of claimPatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }

  private extractUnknownObservations(text: string): any[] {
    const observations: any[] = [];
    const lowerText = text.toLowerCase();

    // Check for unknown patterns
    const unknownPatterns = ["je ne sais pas", "je ne connais pas", "inconnu", "pas sûr", "je ne me souviens pas"];
    for (const pattern of unknownPatterns) {
      if (lowerText.includes(pattern)) {
        const resolved = ObservationResolver.resolve(pattern);
        if (resolved) {
          observations.push(
            FactBuilder.observation({
              content: text,
              category: resolved.category,
              source: this.name,
              confidence: 1.0,
              observationType: resolved.observationType,
              expectedFields: resolved.expectedFields,
              sourceText: pattern,
            })
          );
        }
      }
    }

    return observations;
  }
}
