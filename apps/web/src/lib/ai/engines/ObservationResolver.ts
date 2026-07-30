import { ObservationCatalog, ObservationType } from "../../../domain/cognitive/catalogs/ObservationCatalog";

// ===================================================================
// OBSERVATION RESOLVER — Normalize Observations to Canonical Types
// ===================================================================

export interface ResolvedObservation {
  observationType: string;
  category: string;
  patterns: string[];
  expectedFields: string[];
  sourceText: string;
}

export class ObservationResolver {
  private static normalizeForLookup(text: string): string {
    return text.toLowerCase().trim();
  }

  static resolve(sourceText: string): ResolvedObservation | null {
    const normalized = this.normalizeForLookup(sourceText);

    for (const [key, entry] of ObservationCatalog.entries()) {
      for (const pattern of entry.patterns) {
        if (normalized.includes(this.normalizeForLookup(pattern))) {
          return {
            observationType: entry.name,
            category: entry.category,
            patterns: entry.patterns,
            expectedFields: entry.expectedFields,
            sourceText,
          };
        }
      }
    }

    return null;
  }

  static batchResolve(sourceTexts: string[]): ResolvedObservation[] {
    const results: ResolvedObservation[] = [];
    
    for (const sourceText of sourceTexts) {
      const resolved = this.resolve(sourceText);
      if (resolved) {
        results.push(resolved);
      }
    }

    return results;
  }

  static getByCategory(category: string): ObservationType[] {
    const results: ObservationType[] = [];
    
    for (const [key, entry] of ObservationCatalog.entries()) {
      if (entry.category === category) {
        results.push(entry);
      }
    }

    return results;
  }
}
