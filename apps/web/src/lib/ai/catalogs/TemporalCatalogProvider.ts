import { CatalogConfig } from "./CatalogProvider";
import { MemoryCatalogProvider } from "./CatalogProvider";
import temporalPatternsJson from "./data/temporal_patterns.json";

// ===================================================================
// TEMPORAL CATALOG PROVIDER — Specific Provider for Temporal Patterns
// ===================================================================

export interface TemporalPattern {
  id: string;
  name: string;
  regex: string;
  description: string;
}

export interface TemporalExtractionRule {
  id: string;
  eventType: string;
  patterns: string[];
  description: string;
}

export interface TemporalCatalogConfig extends CatalogConfig {
  patterns: TemporalPattern[];
  extractionRules: TemporalExtractionRule[];
}

export class TemporalCatalogProvider extends MemoryCatalogProvider {
  constructor() {
    super();
    this.loadFromJSON();
  }

  private loadFromJSON(): void {
    const config = temporalPatternsJson as TemporalCatalogConfig;
    this.register({
      version: config.version,
      items: [
        ...config.patterns.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: "temporal-pattern",
          metadata: { regex: p.regex },
        })),
        ...config.extractionRules.map(r => ({
          id: r.id,
          name: r.eventType,
          description: r.description,
          category: "extraction-rule",
          metadata: { patterns: r.patterns, eventType: r.eventType },
        })),
      ],
    });
  }

  /**
   * Get temporal patterns
   */
  getPatterns(): TemporalPattern[] {
    const catalog = this.getCatalog("1.0.0");
    if (!catalog) {
      return [];
    }
    return catalog.items
      .filter(item => item.category === "temporal-pattern")
      .map(item => ({
        id: item.id,
        name: item.name,
        regex: item.metadata?.regex as string,
        description: item.description,
      }));
  }

  /**
   * Get pattern by ID
   */
  getPatternById(id: string): TemporalPattern | undefined {
    return this.getPatterns().find(p => p.id === id);
  }

  /**
   * Get extraction rules
   */
  getExtractionRules(): TemporalExtractionRule[] {
    const catalog = this.getCatalog("1.0.0");
    if (!catalog) {
      return [];
    }
    return catalog.items
      .filter(item => item.category === "extraction-rule")
      .map(item => ({
        id: item.id,
        eventType: item.metadata?.eventType as string,
        patterns: item.metadata?.patterns as string[],
        description: item.description,
      }));
  }

  /**
   * Get extraction rule by ID
   */
  getExtractionRuleById(id: string): TemporalExtractionRule | undefined {
    return this.getExtractionRules().find(r => r.id === id);
  }
}
