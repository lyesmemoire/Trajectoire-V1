/**
 * Speech-To-Text Health Provider
 * 
 * Responsibilities:
 * - Implement ProviderHealthProvider interface for Speech-to-Text
 * - Monitor health of Speech-to-Text connection
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
// SPEECH HEALTH MONITOR
// ============================================================================

export interface SpeechHealthMonitor {
  checkHealth(sessionId: string): HealthStatus;
  checkConnectionHealth(): HealthStatus;
  checkStreamingHealth(): HealthStatus;
  checkTranscriptionHealth(): HealthStatus;
}

// ============================================================================
// SPEECH HEALTH PROVIDER IMPLEMENTATION
// ============================================================================

export class SpeechHealthProviderImpl implements ProviderHealthProvider {
  private healthMonitor: SpeechHealthMonitor;

  constructor(healthMonitor: SpeechHealthMonitor) {
    this.healthMonitor = healthMonitor;
  }

  async checkHealth(providerId: string): Promise<HealthStatus> {
    return this.healthMonitor.checkHealth(providerId);
  }

  async checkAllHealth(): Promise<Map<string, HealthStatus>> {
    const healthMap = new Map<string, HealthStatus>();
    healthMap.set("speech-to-text", this.healthMonitor.checkConnectionHealth());
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
