// ===================================================================
// TEMPORAL CATALOG — Pure Data Catalog (No Business Logic)
// ===================================================================

import { TemporalCatalogProvider, TemporalPattern, TemporalExtractionRule } from "../../catalogs/TemporalCatalogProvider";

export class TemporalCatalog {
  private static provider: TemporalCatalogProvider | null = null;

  static setProvider(provider: TemporalCatalogProvider): void {
    this.provider = provider;
  }

  static getProvider(): TemporalCatalogProvider {
    if (!this.provider) {
      this.provider = new TemporalCatalogProvider();
    }
    return this.provider;
  }

  static getPatterns(): TemporalPattern[] {
    return this.getProvider().getPatterns();
  }

  static getPatternById(id: string): TemporalPattern | undefined {
    return this.getProvider().getPatternById(id);
  }

  static getExtractionRules(): TemporalExtractionRule[] {
    return this.getProvider().getExtractionRules();
  }

  static getExtractionRuleById(id: string): TemporalExtractionRule | undefined {
    return this.getProvider().getExtractionRuleById(id);
  }
}
