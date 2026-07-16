/**
 * Moderation Health Provider
 *
 * Responsibilities:
 * - Implement ProviderHealthProvider interface for Moderation
 * - Monitor health of Moderation connection
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY health monitoring
 */

import {
  ProviderHealthProvider,
  HealthStatus,
  ProviderHealthCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// MODERATION HEALTH MONITOR
// ============================================================================

export interface ModerationHealthMonitor {
  checkHealth(sessionId: string): HealthStatus;
  checkModerationHealth(): HealthStatus;
  checkBatchHealth(): HealthStatus;
}

// ============================================================================
// MODERATION HEALTH PROVIDER IMPLEMENTATION
// ============================================================================

export class ModerationHealthProviderImpl implements ProviderHealthProvider {
  private healthMonitor: ModerationHealthMonitor;

  constructor(healthMonitor: ModerationHealthMonitor) {
    this.healthMonitor = healthMonitor;
  }

  async checkHealth(providerId: string): Promise<HealthStatus> {
    return this.healthMonitor.checkHealth(providerId);
  }

  async checkAllHealth(): Promise<Map<string, HealthStatus>> {
    const healthMap = new Map<string, HealthStatus>();
    healthMap.set("moderation", this.healthMonitor.checkModerationHealth());
    healthMap.set("moderation-batch", this.healthMonitor.checkBatchHealth());
    return healthMap;
  }

  getCapabilities(): ProviderHealthCapabilities {
    return {
      healthChecks: true,
      latencyMonitoring: true,
      errorTracking: true
    };
  }
}
