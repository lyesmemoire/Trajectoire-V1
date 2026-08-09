import { CatalogConfig, CatalogItem } from "./CatalogProvider";
import { MemoryCatalogProvider } from "./CatalogProvider";
import contradictionsJson from "./data/contradictions.json";

// ===================================================================
// CONTRADICTION CATALOG PROVIDER — Specific Provider for Contradiction Catalog
// ===================================================================

export class ContradictionCatalogProvider extends MemoryCatalogProvider {
  constructor() {
    super();
    this.loadFromJSON();
  }

  private loadFromJSON(): void {
    const catalog: CatalogConfig = contradictionsJson as CatalogConfig;
    this.register(catalog);
  }

  /**
   * Get contradiction type by ID
   */
  getContradictionType(id: string): CatalogItem | undefined {
    const catalog = this.getCatalog("1.0.0");
    if (!catalog) {
      return undefined;
    }
    return catalog.items.find(item => item.id === id);
  }

  /**
   * Get all contradiction types
   */
  getAllContradictionTypes(): CatalogItem[] {
    const catalog = this.getCatalog("1.0.0");
    if (!catalog) {
      return [];
    }
    return catalog.items;
  }

  /**
   * Get contradiction types by category
   */
  getContradictionTypesByCategory(category: string): CatalogItem[] {
    return this.getAllContradictionTypes().filter(item => item.category === category);
  }

  /**
   * Get contradiction types by severity
   */
  getContradictionTypesBySeverity(severity: string): CatalogItem[] {
    return this.getAllContradictionTypes().filter(item => item.severity === severity);
  }

  /**
   * Get contradiction types by policy
   */
  getContradictionTypesByPolicy(policy: string): CatalogItem[] {
    return this.getAllContradictionTypes().filter(item => item.policy === policy);
  }
}
