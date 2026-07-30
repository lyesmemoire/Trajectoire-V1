// ===================================================================
// ENGINE MANIFEST — Declarative Engine Metadata
// ===================================================================

export interface EngineManifest {
  id: string;
  version: string;
  manifestVersion: string;
  minimumRuntimeVersion: string;
  description: string;
  consumes: string[];
  produces: string[];
  facts: string[];
  events: string[];
  providers: string[];
  timeout: number;
  retries: number;
  deprecated?: boolean;
  deprecationMessage?: string;
}

export class EngineManifestRegistry {
  private manifests: Map<string, EngineManifest> = new Map();

  register(manifest: EngineManifest): void {
    if (this.manifests.has(manifest.id)) {
      throw new Error(`Engine manifest ${manifest.id} is already registered`);
    }
    this.manifests.set(manifest.id, manifest);
  }

  get(id: string): EngineManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): EngineManifest[] {
    return Array.from(this.manifests.values());
  }

  has(id: string): boolean {
    return this.manifests.has(id);
  }

  clear(): void {
    this.manifests.clear();
  }
}
