import { TechnologyCatalog, TechnologyEntry } from "../../../domain/cognitive/catalogs/TechnologyCatalog";
import { CompanyCatalog, CompanyEntry } from "../../../domain/cognitive/catalogs/CompanyCatalog";

// ===================================================================
// CANONICAL ENTITY RESOLVER — Normalize Entity Names to Canonical Form
// ===================================================================

export interface ResolvedEntity {
  canonicalName: string;
  aliases: string[];
  category: string;
  sourceText: string;
}

export class CanonicalEntityResolver {
  private static normalizeForLookup(text: string): string {
    return text.toLowerCase().trim();
  }

  static resolveTechnology(sourceText: string): ResolvedEntity | null {
    const normalized = this.normalizeForLookup(sourceText);

    for (const [key, entry] of TechnologyCatalog.entries()) {
      if (entry.aliases.some((alias: string) => this.normalizeForLookup(alias) === normalized)) {
        return {
          canonicalName: entry.canonicalName,
          aliases: entry.aliases,
          category: entry.category,
          sourceText,
        };
      }
    }

    return null;
  }

  static resolveCompany(sourceText: string): ResolvedEntity | null {
    const normalized = this.normalizeForLookup(sourceText);

    for (const [key, entry] of CompanyCatalog.entries()) {
      if (entry.aliases.some((alias: string) => this.normalizeForLookup(alias) === normalized)) {
        return {
          canonicalName: entry.canonicalName,
          aliases: entry.aliases,
          category: entry.category,
          sourceText,
        };
      }
    }

    return null;
  }

  static resolve(sourceText: string, entityType: "technology" | "company"): ResolvedEntity | null {
    switch (entityType) {
      case "technology":
        return this.resolveTechnology(sourceText);
      case "company":
        return this.resolveCompany(sourceText);
      default:
        return null;
    }
  }

  static batchResolve(sourceTexts: string[], entityType: "technology" | "company"): ResolvedEntity[] {
    const results: ResolvedEntity[] = [];
    
    for (const sourceText of sourceTexts) {
      const resolved = this.resolve(sourceText, entityType);
      if (resolved) {
        results.push(resolved);
      }
    }

    return results;
  }
}
