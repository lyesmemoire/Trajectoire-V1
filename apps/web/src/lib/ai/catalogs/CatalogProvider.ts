// ===================================================================
// CATALOG PROVIDER — Data-Driven Catalog Loading
// ===================================================================

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  category?: string;
  severity?: string;
  policy?: string;
  metadata?: Record<string, unknown>;
}

export interface CatalogConfig {
  version: string;
  items: CatalogItem[];
}

export interface CatalogProvider {
  /**
   * Load catalog from JSON/YAML file
   */
  load(filePath: string): Promise<CatalogConfig>;

  /**
   * Load catalog synchronously (for in-memory catalogs)
   */
  loadSync(filePath: string): CatalogConfig;

  /**
   * Get catalog by ID
   */
  getCatalog(id: string): CatalogConfig | undefined;

  /**
   * Get all catalogs
   */
  getAllCatalogs(): CatalogConfig[];

  /**
   * Register a catalog
   */
  register(catalog: CatalogConfig): void;

  /**
   * Clear all catalogs
   */
  clear(): void;
}

export class MemoryCatalogProvider implements CatalogProvider {
  private catalogs: Map<string, CatalogConfig> = new Map();

  async load(filePath: string): Promise<CatalogConfig> {
    // In a real implementation, this would read from file system
    // For now, we use loadSync
    return this.loadSync(filePath);
  }

  loadSync(filePath: string): CatalogConfig {
    // In a real implementation, this would read from file system
    // For now, we throw an error to indicate file loading is not implemented
    throw new Error(`File loading not implemented for ${filePath}. Use register() instead.`);
  }

  getCatalog(id: string): CatalogConfig | undefined {
    return this.catalogs.get(id);
  }

  getAllCatalogs(): CatalogConfig[] {
    return Array.from(this.catalogs.values());
  }

  register(catalog: CatalogConfig): void {
    this.catalogs.set(catalog.version, catalog);
  }

  clear(): void {
    this.catalogs.clear();
  }
}
