// @ts-nocheck
export interface BootstrapConfig {
  workerCount: number;
  epochIntervalMs: number;
  maxEpochs: number; // 0 = infinite (danger mode)
  enableBFT: boolean;
  enableHealing: boolean;
  enableGovernor: boolean;
  federationEnabled?: boolean;
  healthPort?: number; // default 8089
}
