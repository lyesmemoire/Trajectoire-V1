import crypto from "crypto";

// ===================================================================
// PROMPT REGISTRY — Versioned, Checksummed, Replay-Compatible Prompts
// ===================================================================

export interface Prompt {
  id: string;
  version: string;
  name: string;
  description: string;
  template: string;
  parameters: string[];
  checksum: string;
  provider: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
  deprecated: boolean;
  schemaVersion: string;
  metadata?: Record<string, unknown>;
}

export interface PromptConfig {
  version: string;
  prompts: Prompt[];
}

export interface PromptRegistry {
  /**
   * Register a prompt
   */
  register(prompt: Prompt): void;

  /**
   * Register multiple prompts
   */
  registerAll(prompts: Prompt[]): void;

  /**
   * Get a prompt by ID and version
   */
  get(id: string, version?: string): Prompt | undefined;

  /**
   * Get latest version of a prompt by ID
   */
  getLatest(id: string): Prompt | undefined;

  /**
   * Get all prompts
   */
  getAll(): Prompt[];

  /**
   * Get prompts by category (if supported by prompt)
   */
  getByCategory(category: string): Prompt[];

  /**
   * Unregister a prompt
   */
  unregister(id: string, version?: string): void;

  /**
   * Clear all prompts
   */
  clear(): void;

  /**
   * Check if a prompt exists
   */
  has(id: string, version?: string): boolean;

  /**
   * Verify prompt checksum
   */
  verifyChecksum(prompt: Prompt): boolean;

  /**
   * Calculate checksum for a template
   */
  calculateChecksum(template: string): string;
}

export class MemoryPromptRegistry implements PromptRegistry {
  private prompts: Map<string, Prompt[]> = new Map();

  register(prompt: Prompt): void {
    if (!this.verifyChecksum(prompt)) {
      throw new Error(`Prompt checksum verification failed for ${prompt.id}`);
    }

    const versions = this.prompts.get(prompt.id) || [];
    if (versions.some(p => p.version === prompt.version)) {
      throw new Error(`Prompt ${prompt.id} version ${prompt.version} already registered`);
    }

    versions.push(prompt);
    this.prompts.set(prompt.id, versions);
  }

  registerAll(prompts: Prompt[]): void {
    for (const prompt of prompts) {
      this.register(prompt);
    }
  }

  get(id: string, version?: string): Prompt | undefined {
    const versions = this.prompts.get(id);
    if (!versions) {
      return undefined;
    }

    if (version) {
      return versions.find(p => p.version === version);
    }

    return this.getLatest(id);
  }

  getLatest(id: string): Prompt | undefined {
    const versions = this.prompts.get(id);
    if (!versions || versions.length === 0) {
      return undefined;
    }

    return versions[versions.length - 1];
  }

  getAll(): Prompt[] {
    const all: Prompt[] = [];
    for (const versions of this.prompts.values()) {
      all.push(...versions);
    }
    return all;
  }

  getByCategory(category: string): Prompt[] {
    return this.getAll().filter(prompt => {
      const promptAny = prompt as any;
      return promptAny.category === category;
    });
  }

  unregister(id: string, version?: string): void {
    if (version) {
      const versions = this.prompts.get(id);
      if (versions) {
        const filtered = versions.filter(p => p.version !== version);
        if (filtered.length === 0) {
          this.prompts.delete(id);
        } else {
          this.prompts.set(id, filtered);
        }
      }
    } else {
      this.prompts.delete(id);
    }
  }

  clear(): void {
    this.prompts.clear();
  }

  has(id: string, version?: string): boolean {
    return this.get(id, version) !== undefined;
  }

  verifyChecksum(prompt: Prompt): boolean {
    const calculated = this.calculateChecksum(prompt.template);
    return calculated === prompt.checksum;
  }

  calculateChecksum(template: string): string {
    return crypto
      .createHash("sha256")
      .update(template)
      .digest("hex");
  }
}
