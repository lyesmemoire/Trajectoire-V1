export interface FeatureFlagProvider {
  isEnabled(flag: string, context?: FeatureFlagContext): Promise<boolean>;
}

export interface FeatureFlagContext {
  userId?: string;
  plan?: string;
  role?: string;
  attributes?: Record<string, unknown>;
}

/**
 * Static feature flags loaded from a plain record.
 * Suitable for MVP and config-file-driven toggles.
 * Can be replaced by LaunchDarkly, Unleash, etc. later.
 */
export class StaticFeatureFlagProvider implements FeatureFlagProvider {
  constructor(private readonly flags: Record<string, boolean>) {}

  async isEnabled(flag: string): Promise<boolean> {
    return this.flags[flag] ?? false;
  }
}

/**
 * Feature flags that are always enabled.
 * Use in development or tests.
 */
export class AllEnabledFeatureFlagProvider implements FeatureFlagProvider {
  async isEnabled(): Promise<boolean> {
    return true;
  }
}
