/**
 * Blueprint Self-Healing: Orchestrator
 */

import { AutoRepair } from './auto-repair';

export interface HealingConfig {
  enabled: boolean;
  interval: number; // milliseconds
  autoRepair: boolean;
  notifyOnRepair: boolean;
}

export class HealingOrchestrator {
  private config: HealingConfig;
  private autoRepair: AutoRepair;
  private intervalId?: NodeJS.Timeout;

  constructor(config: HealingConfig) {
    this.config = config;
    this.autoRepair = new AutoRepair();
  }

  /**
   * Start healing
   */
  start(): void {
    if (!this.config.enabled) {
      console.log('Self-healing is disabled');
      return;
    }

    console.log(`Starting self-healing (interval: ${this.config.interval}ms)...`);

    this.intervalId = setInterval(async () => {
      try {
        if (this.config.autoRepair) {
          await this.autoRepair.runFullRepair();
        } else {
          // Detection only
          await this.detectOnly();
        }
      } catch (error) {
        console.error('Self-healing error:', error);
      }
    }, this.config.interval);
  }

  /**
   * Stop healing
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('Self-healing stopped');
    }
  }

  /**
   * Detect only (no repair)
   */
  private async detectOnly(): Promise<void> {
    // Implementation would run detection without repair
    console.log('Running self-healing detection...');
  }

  /**
   * Run manual healing
   */
  async runManualHealing(): Promise<void> {
    console.log('Running manual self-healing...');
    await this.autoRepair.runFullRepair();
  }

  /**
   * Update config
   */
  updateConfig(config: Partial<HealingConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart if interval changed
    if (config.interval && this.intervalId) {
      this.stop();
      this.start();
    }
  }
}
