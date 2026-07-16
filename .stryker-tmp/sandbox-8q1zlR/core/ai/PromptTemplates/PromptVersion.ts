/**
 * Prompt Version Management
 *
 * Handles versioning of prompts for A/B testing and gradual rollouts.
 */
// @ts-nocheck


export type PromptVersion = string; // e.g., "v1", "v2", "v1.2"

export interface PromptVersionConfig {
  version: PromptVersion;
  createdAt: Date;
  isActive: boolean;
  rolloutPercentage?: number; // 0-100 for gradual rollout
  deprecated?: boolean;
}

export interface PromptMetadata {
  id: string;
  name: string;
  description: string;
  versions: Map<PromptVersion, PromptVersionConfig>;
  currentVersion: PromptVersion;
}

/**
 * Prompt Version Manager
 *
 * Manages prompt versions and active version selection.
 */
export class PromptVersionManager {
  private prompts: Map<string, PromptMetadata> = new Map();

  /**
   * Register a new prompt version
   */
  registerPromptVersion(
    promptId: string,
    name: string,
    description: string,
    version: PromptVersion,
    isActive: boolean = true
  ): void {
    const existing = this.prompts.get(promptId);

    if (existing) {
      existing.versions.set(version, {
        version,
        createdAt: new Date(),
        isActive,
      });
      if (isActive) {
        existing.currentVersion = version;
      }
    } else {
      const versions = new Map<PromptVersion, PromptVersionConfig>();
      versions.set(version, {
        version,
        createdAt: new Date(),
        isActive,
      });

      this.prompts.set(promptId, {
        id: promptId,
        name,
        description,
        versions,
        currentVersion: isActive ? version : version,
      });
    }
  }

  /**
   * Get active version for a prompt
   */
  getActiveVersion(promptId: string): PromptVersion | null {
    const prompt = this.prompts.get(promptId);
    if (!prompt) return null;

    // Check for rollout percentage
    const versionConfig = prompt.versions.get(prompt.currentVersion);
    if (versionConfig?.rolloutPercentage) {
      const random = Math.random() * 100;
      if (random > versionConfig.rolloutPercentage) {
        // Fall back to previous version
        return this.getPreviousVersion(promptId);
      }
    }

    return prompt.currentVersion;
  }

  /**
   * Get specific version of a prompt
   */
  getVersion(promptId: string, version: PromptVersion): PromptVersion | null {
    const prompt = this.prompts.get(promptId);
    if (!prompt) return null;

    if (prompt.versions.has(version)) {
      return version;
    }

    return null;
  }

  /**
   * Get all versions for a prompt
   */
  getAllVersions(promptId: string): PromptVersion[] {
    const prompt = this.prompts.get(promptId);
    if (!prompt) return [];

    return Array.from(prompt.versions.keys());
  }

  /**
   * Set active version for a prompt
   */
  setActiveVersion(promptId: string, version: PromptVersion, rolloutPercentage?: number): void {
    const prompt = this.prompts.get(promptId);
    if (!prompt) return;

    const versionConfig = prompt.versions.get(version);
    if (!versionConfig) return;

    // Deactivate all versions
    prompt.versions.forEach((config) => {
      config.isActive = false;
    });

    // Activate target version
    versionConfig.isActive = true;
    if (rolloutPercentage !== undefined) {
      versionConfig.rolloutPercentage = rolloutPercentage;
    }

    prompt.currentVersion = version;
  }

  /**
   * Deprecate a version
   */
  deprecateVersion(promptId: string, version: PromptVersion): void {
    const prompt = this.prompts.get(promptId);
    if (!prompt) return;

    const versionConfig = prompt.versions.get(version);
    if (versionConfig) {
      versionConfig.deprecated = true;
      versionConfig.isActive = false;
    }
  }

  /**
   * Get previous version (for rollback)
   */
  private getPreviousVersion(promptId: string): PromptVersion | null {
    const prompt = this.prompts.get(promptId);
    if (!prompt) return null;

    const versions = Array.from(prompt.versions.keys()).sort();
    const currentIndex = versions.indexOf(prompt.currentVersion);

    if (currentIndex > 0) {
      return versions[currentIndex - 1] ?? null;
    }

    return prompt.currentVersion;
  }

  /**
   * Get prompt metadata
   */
  getPromptMetadata(promptId: string): PromptMetadata | null {
    return this.prompts.get(promptId) || null;
  }
}
