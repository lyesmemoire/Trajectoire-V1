/**
 * Embedding Health Provider
 *
 * Responsibilities:
 * - Implement ProviderHealthProvider interface for Embedding
 * - Monitor health of Embedding connection
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY health monitoring
 */
// @ts-nocheck


import {
  ProviderHealthProvider,
  HealthStatus,
  ProviderHealthCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// EMBEDDING HEALTH MONITOR
// ============================================================================

export interface EmbeddingHealthMonitor {
  checkHealth(sessionId: string): HealthStatus;
  checkEmbeddingHealth(): HealthStatus;
  checkBatchHealth(): HealthStatus;
}

// ============================================================================
// EMBEDDING HEALTH PROVIDER IMPLEMENTATION
// ============================================================================

export class EmbeddingHealthProviderImpl implements ProviderHealthProvider {
  private healthMonitor: EmbeddingHealthMonitor;

  constructor(healthMonitor: EmbeddingHealthMonitor) {
    this.healthMonitor = healthMonitor;
  }

  async checkHealth(providerId: string): Promise<HealthStatus> {
    return this.healthMonitor.checkHealth(providerId);
  }

  async checkAllHealth(): Promise<Map<string, HealthStatus>> {
    const healthMap = new Map<string, HealthStatus>();
    healthMap.set("embedding", this.healthMonitor.checkEmbeddingHealth());
    healthMap.set("embedding-batch", this.healthMonitor.checkBatchHealth());
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
