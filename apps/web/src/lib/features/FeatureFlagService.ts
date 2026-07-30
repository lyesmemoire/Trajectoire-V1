/**
 * Feature Flag Service
 * Manages feature flags for activation without redeployment
 * Supports database-backed and environment-based flags
 */

import { z } from "zod";

// Feature flag schema
const FeatureFlagSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(), // For gradual rollout
  targetUsers: z.array(z.string()).optional(), // Specific user IDs
  targetEnvironments: z.array(z.string()).optional(), // Specific environments
});

// Canonical Reference: COS-OBJ-010 (blueprint.runtime.featureflag)
// Owner: COS Team
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

// Available feature flags
export enum FeatureFlagKey {
  NEW_REPORT = "NEW_REPORT",
  NEW_INTERVIEW = "NEW_INTERVIEW",
  NEW_AI = "NEW_AI",
  STREAMING = "STREAMING",
  VOICE = "VOICE",
  BETA = "BETA",
  ADVANCED_ANALYTICS = "ADVANCED_ANALYTICS",
  MULTI_LANGUAGE = "MULTI_LANGUAGE",
}

class FeatureFlagService {
  private flags: Map<FeatureFlagKey, FeatureFlag> = new Map();
  private static instance: FeatureFlagService;

  private constructor() {
    this.loadFlags();
  }

  /**
   * Load feature flags from environment variables or database
   */
  private loadFlags(): void {
    // Load from environment variables
    this.flags.set(FeatureFlagKey.NEW_REPORT, {
      key: FeatureFlagKey.NEW_REPORT,
      enabled: process.env.FEATURE_NEW_REPORT === "true",
      description: "Enable new report generation system",
    });

    this.flags.set(FeatureFlagKey.NEW_INTERVIEW, {
      key: FeatureFlagKey.NEW_INTERVIEW,
      enabled: process.env.FEATURE_NEW_INTERVIEW === "true",
      description: "Enable new interview system",
    });

    this.flags.set(FeatureFlagKey.NEW_AI, {
      key: FeatureFlagKey.NEW_AI,
      enabled: process.env.FEATURE_NEW_AI === "true",
      description: "Enable new AI model",
    });

    this.flags.set(FeatureFlagKey.STREAMING, {
      key: FeatureFlagKey.STREAMING,
      enabled: process.env.FEATURE_STREAMING === "true",
      description: "Enable streaming responses",
    });

    this.flags.set(FeatureFlagKey.VOICE, {
      key: FeatureFlagKey.VOICE,
      enabled: process.env.FEATURE_VOICE === "true",
      description: "Enable voice input/output",
    });

    this.flags.set(FeatureFlagKey.BETA, {
      key: FeatureFlagKey.BETA,
      enabled: process.env.FEATURE_BETA === "true",
      description: "Enable beta features",
    });

    this.flags.set(FeatureFlagKey.ADVANCED_ANALYTICS, {
      key: FeatureFlagKey.ADVANCED_ANALYTICS,
      enabled: process.env.FEATURE_ADVANCED_ANALYTICS === "true",
      description: "Enable advanced analytics dashboard",
    });

    this.flags.set(FeatureFlagKey.MULTI_LANGUAGE, {
      key: FeatureFlagKey.MULTI_LANGUAGE,
      enabled: process.env.FEATURE_MULTI_LANGUAGE === "true",
      description: "Enable multi-language support",
    });
  }

  /**
   * Get singleton instance
   */
  static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  /**
   * Check if a feature flag is enabled
   */
  isEnabled(key: FeatureFlagKey, userId?: string): boolean {
    const flag = this.flags.get(key);
    
    if (!flag) {
      return false;
    }

    // Check if globally enabled
    if (!flag.enabled) {
      return false;
    }

    // Check environment targeting
    if (flag.targetEnvironments && flag.targetEnvironments.length > 0) {
      const currentEnv = process.env.NODE_ENV || "development";
      if (!flag.targetEnvironments.includes(currentEnv)) {
        return false;
      }
    }

    // Check user targeting
    if (userId && flag.targetUsers && flag.targetUsers.length > 0) {
      return flag.targetUsers.includes(userId);
    }

    // Check percentage rollout (random based on user ID hash)
    if (flag.percentage !== undefined && userId) {
      const hash = this.hashUserId(userId);
      const rollout = hash % 100;
      return rollout < flag.percentage;
    }

    return true;
  }

  /**
   * Simple hash function for percentage rollout
   */
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Enable a feature flag
   */
  enable(key: FeatureFlagKey): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = true;
    }
  }

  /**
   * Disable a feature flag
   */
  disable(key: FeatureFlagKey): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = false;
    }
  }

  /**
   * Set feature flag
   */
  setFlag(key: FeatureFlagKey, flag: Partial<FeatureFlag>): void {
    const existing = this.flags.get(key);
    if (existing) {
      this.flags.set(key, { ...existing, ...flag, key });
    }
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  /**
   * Get feature flag by key
   */
  getFlag(key: FeatureFlagKey): FeatureFlag | undefined {
    return this.flags.get(key);
  }

  /**
   * Reload flags from environment/database
   */
  reload(): void {
    this.loadFlags();
  }
}

// Export singleton instance
export const featureFlags = FeatureFlagService.getInstance();
