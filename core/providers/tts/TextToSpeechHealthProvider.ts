/**
 * Text-To-Speech Health Provider
 *
 * Responsibilities:
 * - Implement ProviderHealthProvider interface for Text-to-Speech
 * - Monitor health of Text-to-Speech connection
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY health monitoring
 */

import {
  ProviderHealthProvider,
  HealthStatus,
  ProviderHealthCapabilities
} from "../ProviderAbstractionLayer";

// ============================================================================
// TTS HEALTH MONITOR
// ============================================================================

export interface TTSHealthMonitor {
  checkHealth(sessionId: string): HealthStatus;
  checkSynthesisHealth(): HealthStatus;
  checkStreamingHealth(): HealthStatus;
  checkPlaybackHealth(): HealthStatus;
}

// ============================================================================
// TEXT-TO-SPEECH HEALTH PROVIDER IMPLEMENTATION
// ============================================================================

export class TextToSpeechHealthProviderImpl implements ProviderHealthProvider {
  private healthMonitor: TTSHealthMonitor;

  constructor(healthMonitor: TTSHealthMonitor) {
    this.healthMonitor = healthMonitor;
  }

  async checkHealth(providerId: string): Promise<HealthStatus> {
    return this.healthMonitor.checkHealth(providerId);
  }

  async checkAllHealth(): Promise<Map<string, HealthStatus>> {
    const healthMap = new Map<string, HealthStatus>();
    healthMap.set("text-to-speech", this.healthMonitor.checkSynthesisHealth());
    healthMap.set("text-to-speech-streaming", this.healthMonitor.checkStreamingHealth());
    healthMap.set("text-to-speech-playback", this.healthMonitor.checkPlaybackHealth());
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
