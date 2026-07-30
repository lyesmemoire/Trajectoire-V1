import { BaseEngine, BaseEngineConfig } from "./BaseEngine";
import { EventFactory } from "./EventFactory";
import { FactBuilder } from "./FactBuilder";
import { CanonicalEntityResolver, ResolvedEntity } from "./CanonicalEntityResolver";
import { EngineManifest } from "./EngineManifest";
import { BaseEvent } from "../contracts/Event";
import { EngineInput } from "../contracts/Engine";
import { TechnologyCatalog } from "../../../domain/cognitive/catalogs/TechnologyCatalog";
import { CompanyCatalog } from "../../../domain/cognitive/catalogs/CompanyCatalog";

// ===================================================================
// ENTITY EXTRACTION ENGINE — Extract and Normalize Entities
// ===================================================================

export interface EntityExtractionContext {
  sessionId: string;
}

export interface EntityExtractionPayload {
  normalizedText: string;
}

export const EntityExtractionManifest: EngineManifest = {
  id: "entity-extraction",
  version: "1.0.0",
  description: "Extract and normalize entities (technologies, companies, dates, metrics) from normalized text",
  consumes: ["NormalizedText"],
  produces: ["EntityFacts"],
  facts: ["Technology", "Company", "Date", "Metric"],
  events: ["IdentityExtracted"],
  providers: [],
  timeout: 5000,
  retries: 2,
};

export class EntityExtractionEngine extends BaseEngine<EntityExtractionContext, EntityExtractionPayload, BaseEvent<{ entities: any[] }>> {
  constructor() {
    super({
      name: "EntityExtractionEngine",
      version: EntityExtractionManifest.version,
      schemaVersion: "1.0",
    });
  }

  protected async process(
    context: EntityExtractionContext,
    payload: EntityExtractionPayload,
    sessionId: string
  ): Promise<BaseEvent<{ entities: any[] }>[]> {
    const entities = this.extractEntities(payload.normalizedText);

    const event = this.createBaseEvent(sessionId, "ENTITY_EXTRACTED", {
      entities,
    });

    return [event];
  }

  private extractEntities(text: string): any[] {
    const entities: any[] = [];

    // Extract technologies
    const technologies = this.extractTechnologies(text);
    entities.push(...technologies);

    // Extract companies
    const companies = this.extractCompanies(text);
    entities.push(...companies);

    // Extract dates (simple pattern matching)
    const dates = this.extractDates(text);
    entities.push(...dates);

    // Extract metrics (simple pattern matching)
    const metrics = this.extractMetrics(text);
    entities.push(...metrics);

    return entities;
  }

  private extractTechnologies(text: string): any[] {
    const technologies: any[] = [];
    const lowerText = text.toLowerCase();

    // Check against TechnologyCatalog
    for (const [key, entry] of TechnologyCatalog.entries()) {
      for (const alias of entry.aliases) {
        if (lowerText.includes(alias.toLowerCase())) {
          const resolved = CanonicalEntityResolver.resolveTechnology(alias);
          if (resolved) {
            technologies.push(
              FactBuilder.entity({
                name: resolved.canonicalName,
                type: "TECHNOLOGY",
                attributes: {
                  category: resolved.category,
                },
                source: this.name,
                confidence: 1.0,
                canonicalName: resolved.canonicalName,
                aliases: resolved.aliases,
                category: resolved.category,
                sourceText: alias,
              })
            );
          }
          break;
        }
      }
    }

    return technologies;
  }

  private extractCompanies(text: string): any[] {
    const companies: any[] = [];
    const lowerText = text.toLowerCase();

    // Check against CompanyCatalog
    for (const [key, entry] of CompanyCatalog.entries()) {
      for (const alias of entry.aliases) {
        if (lowerText.includes(alias.toLowerCase())) {
          const resolved = CanonicalEntityResolver.resolveCompany(alias);
          if (resolved) {
            companies.push(
              FactBuilder.entity({
                name: resolved.canonicalName,
                type: "COMPANY",
                attributes: {
                  category: resolved.category,
                },
                source: this.name,
                confidence: 1.0,
                canonicalName: resolved.canonicalName,
                aliases: resolved.aliases,
                category: resolved.category,
                sourceText: alias,
              })
            );
          }
          break;
        }
      }
    }

    return companies;
  }

  private extractDates(text: string): any[] {
    const dates: any[] = [];
    const datePattern = /\b(19|20)\d{2}\b/g;
    const matches = text.match(datePattern);

    if (matches) {
      for (const match of matches) {
        dates.push(
          FactBuilder.entity({
            name: match,
            type: "DATE",
            attributes: {
              year: parseInt(match),
            },
            source: this.name,
            confidence: 1.0,
            sourceText: match,
          })
        );
      }
    }

    return dates;
  }

  private extractMetrics(text: string): any[] {
    const metrics: any[] = [];
    const metricPattern = /\b(\d+)\s*(microservices|services|projects|teams|users|customers|clients|employees)\b/gi;
    let match;

    while ((match = metricPattern.exec(text)) !== null) {
      metrics.push(
        FactBuilder.metric({
          name: match[2],
          value: parseInt(match[1]),
          unit: match[2],
          source: this.name,
          confidence: 1.0,
        })
      );
    }

    return metrics;
  }
}
