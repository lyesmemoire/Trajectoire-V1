/**
 * Prompt Version Manager
 * Manages prompt versioning, history, and rollback
 */

import {
  PromptVersion,
  PromptVersionHistory,
  QualityMetrics,
} from "./interfaces/IEvaluationPlatform";

// ============================================================================
// PROMPT VERSION MANAGER CLASS
// ============================================================================

export class PromptVersionManager {
  private static instance: PromptVersionManager;
  private prompts: Map<string, PromptVersion[]> = new Map();
  private activeVersions: Map<string, string> = new Map(); // promptId -> version

  private constructor() {}

  static getInstance(): PromptVersionManager {
    if (!PromptVersionManager.instance) {
      PromptVersionManager.instance = new PromptVersionManager();
    }
    return PromptVersionManager.instance;
  }

  /**
   * Create new prompt version
   */
  createPromptVersion(
    promptId: string,
    template: string,
    objective: string,
    variables: string[],
    createdBy: string,
    cost: number = 0.001
  ): PromptVersion {
    const existingVersions = this.prompts.get(promptId) || [];
    const nextVersion = this.getNextVersion(promptId);

    const version: PromptVersion = {
      id: `prompt_${promptId}_${nextVersion}_${Date.now()}`,
      promptId,
      version: nextVersion,
      createdAt: new Date(),
      createdBy,
      objective,
      variables,
      template,
      cost,
      qualityScore: 0, // Will be updated after evaluation
      history: [
        {
          version: nextVersion,
          timestamp: new Date(),
          change: "Initial version",
          author: createdBy,
        },
      ],
      isActive: false,
    };

    existingVersions.push(version);
    this.prompts.set(promptId, existingVersions);

    return version;
  }

  /**
   * Get next version number
   */
  private getNextVersion(promptId: string): string {
    const versions = this.prompts.get(promptId) || [];
    if (versions.length === 0) {
      return "1.0.0";
    }

    const lastVersion = versions[versions.length - 1].version;
    const parts = lastVersion.split(".").map(Number);
    parts[2]++; // Increment patch version

    return parts.join(".");
  }

  /**
   * Activate prompt version
   */
  activatePromptVersion(promptId: string, version: string): void {
    // Deactivate all versions of this prompt
    const versions = this.prompts.get(promptId);
    if (!versions) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    versions.forEach(v => {
      v.isActive = false;
    });

    // Activate specified version
    const targetVersion = versions.find(v => v.version === version);
    if (!targetVersion) {
      throw new Error(`Version not found: ${version}`);
    }

    targetVersion.isActive = true;
    this.activeVersions.set(promptId, version);
  }

  /**
   * Get active prompt version
   */
  getActivePromptVersion(promptId: string): PromptVersion | null {
    const activeVersion = this.activeVersions.get(promptId);
    if (!activeVersion) {
      return null;
    }

    const versions = this.prompts.get(promptId);
    if (!versions) {
      return null;
    }

    return versions.find(v => v.version === activeVersion) || null;
  }

  /**
   * Get prompt version by version number
   */
  getPromptVersion(promptId: string, version: string): PromptVersion | null {
    const versions = this.prompts.get(promptId);
    if (!versions) {
      return null;
    }

    return versions.find(v => v.version === version) || null;
  }

  /**
   * Get all versions of a prompt
   */
  getAllPromptVersions(promptId: string): PromptVersion[] {
    return this.prompts.get(promptId) || [];
  }

  /**
   * Update prompt version quality score
   */
  updateQualityScore(promptId: string, version: string, qualityScore: number, metrics?: QualityMetrics): void {
    const versions = this.prompts.get(promptId);
    if (!versions) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const targetVersion = versions.find(v => v.version === version);
    if (!targetVersion) {
      throw new Error(`Version not found: ${version}`);
    }

    targetVersion.qualityScore = qualityScore;

    // Add to history
    targetVersion.history.push({
      version,
      timestamp: new Date(),
      change: `Quality score updated to ${qualityScore}`,
      author: "system",
      metrics,
    });
  }

  /**
   * Rollback to previous version
   */
  rollbackToVersion(promptId: string, targetVersion: string): PromptVersion {
    const versions = this.prompts.get(promptId);
    if (!versions) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const rollbackTarget = versions.find(v => v.version === targetVersion);
    if (!rollbackTarget) {
      throw new Error(`Version not found: ${targetVersion}`);
    }

    // Create new version with rollback content
    const currentActive = this.getActivePromptVersion(promptId);
    const nextVersion = this.getNextVersion(promptId);

    const rolledBackVersion: PromptVersion = {
      id: `prompt_${promptId}_${nextVersion}_${Date.now()}`,
      promptId,
      version: nextVersion,
      createdAt: new Date(),
      createdBy: "system",
      objective: rollbackTarget.objective,
      variables: rollbackTarget.variables,
      template: rollbackTarget.template,
      cost: rollbackTarget.cost,
      qualityScore: rollbackTarget.qualityScore,
      history: [
        ...rollbackTarget.history,
        {
          version: nextVersion,
          timestamp: new Date(),
          change: `Rollback from ${currentActive?.version || "unknown"} to ${targetVersion}`,
          author: "system",
        },
      ],
      isActive: false,
    };

    versions.push(rolledBackVersion);
    this.prompts.set(promptId, versions);

    // Activate the rolled back version
    this.activatePromptVersion(promptId, nextVersion);

    return rolledBackVersion;
  }

  /**
   * Compare two versions
   */
  compareVersions(promptId: string, versionA: string, versionB: string): {
    versionA: PromptVersion;
    versionB: PromptVersion;
    templateDiff: string;
    costDiff: number;
    qualityDiff: number;
    recommendation: "useA" | "useB" | "neutral";
  } {
    const vA = this.getPromptVersion(promptId, versionA);
    const vB = this.getPromptVersion(promptId, versionB);

    if (!vA || !vB) {
      throw new Error("One or both versions not found");
    }

    const templateDiff = this.calculateTemplateDiff(vA.template, vB.template);
    const costDiff = vA.cost - vB.cost;
    const qualityDiff = vA.qualityScore - vB.qualityScore;

    let recommendation: "useA" | "useB" | "neutral";
    if (qualityDiff > 5) {
      recommendation = "useA";
    } else if (qualityDiff < -5) {
      recommendation = "useB";
    } else {
      recommendation = "neutral";
    }

    return {
      versionA: vA,
      versionB: vB,
      templateDiff,
      costDiff,
      qualityDiff,
      recommendation,
    };
  }

  /**
   * Calculate template difference
   */
  private calculateTemplateDiff(templateA: string, templateB: string): string {
    const linesA = templateA.split("\n");
    const linesB = templateB.split("\n");

    const added: string[] = [];
    const removed: string[] = [];

    linesB.forEach(line => {
      if (!linesA.includes(line)) {
        added.push(line);
      }
    });

    linesA.forEach(line => {
      if (!linesB.includes(line)) {
        removed.push(line);
      }
    });

    let diff = "";
    if (added.length > 0) {
      diff += `Added: ${added.length} lines\n`;
    }
    if (removed.length > 0) {
      diff += `Removed: ${removed.length} lines\n`;
    }

    return diff || "No changes";
  }

  /**
   * Get prompt history
   */
  getPromptHistory(promptId: string): PromptVersionHistory[] {
    const versions = this.prompts.get(promptId);
    if (!versions) {
      return [];
    }

    const allHistory: PromptVersionHistory[] = [];
    versions.forEach(version => {
      allHistory.push(...version.history);
    });

    return allHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Delete prompt version
   */
  deletePromptVersion(promptId: string, version: string): void {
    const versions = this.prompts.get(promptId);
    if (!versions) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const targetVersion = versions.find(v => v.version === version);
    if (!targetVersion) {
      throw new Error(`Version not found: ${version}`);
    }

    if (targetVersion.isActive) {
      throw new Error("Cannot delete active version");
    }

    const filtered = versions.filter(v => v.version !== version);
    this.prompts.set(promptId, filtered);
  }

  /**
   * Delete entire prompt
   */
  deletePrompt(promptId: string): void {
    this.prompts.delete(promptId);
    this.activeVersions.delete(promptId);
  }

  /**
   * Get all prompts
   */
  getAllPrompts(): Map<string, PromptVersion[]> {
    return new Map(this.prompts);
  }

  /**
   * Export prompt data
   */
  exportPrompts(): Record<string, PromptVersion[]> {
    const data: Record<string, PromptVersion[]> = {};
    this.prompts.forEach((versions, promptId) => {
      data[promptId] = versions;
    });
    return data;
  }

  /**
   * Import prompt data
   */
  importPrompts(data: Record<string, PromptVersion[]>): void {
    Object.entries(data).forEach(([promptId, versions]) => {
      this.prompts.set(promptId, versions);
      
      // Set active versions
      versions.forEach(version => {
        if (version.isActive) {
          this.activeVersions.set(promptId, version.version);
        }
      });
    });
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    totalPrompts: number;
    totalVersions: number;
    activeVersions: number;
    averageQualityScore: number;
    promptsByObjective: Record<string, number>;
  } {
    let totalVersions = 0;
    let activeVersions = 0;
    let totalQualityScore = 0;
    const promptsByObjective: Record<string, number> = {};

    this.prompts.forEach(versions => {
      totalVersions += versions.length;
      
      versions.forEach(version => {
        if (version.isActive) {
          activeVersions++;
        }
        totalQualityScore += version.qualityScore;
        
        promptsByObjective[version.objective] = (promptsByObjective[version.objective] || 0) + 1;
      });
    });

    const averageQualityScore = totalVersions > 0 ? totalQualityScore / totalVersions : 0;

    return {
      totalPrompts: this.prompts.size,
      totalVersions,
      activeVersions,
      averageQualityScore,
      promptsByObjective,
    };
  }

  /**
   * Clear all prompts
   */
  clearAllPrompts(): void {
    this.prompts.clear();
    this.activeVersions.clear();
  }
}

export const promptVersionManager = PromptVersionManager.getInstance();
