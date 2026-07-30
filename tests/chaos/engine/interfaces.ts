export type FaultFamily = 'Process' | 'Memory' | 'Disk' | 'Time' | 'System' | 'Network';

export interface ChaosFault {
  id: string;
  family: FaultFamily;
  triggerCondition?: (state: any) => boolean;
  activate: () => Promise<void> | void;
  deactivate: () => Promise<void> | void;
}

export interface ChaosTarget {
  name: string;
  initialize(): Promise<void>;
  executeScenario(scenarioId: string): Promise<any>;
  shutdown(): Promise<void>;
}

export interface ChaosOracleResult {
  status: 'PASS' | 'FAIL';
  violation?: string;
}

export interface ChaosOracle {
  name: string;
  check(targetState: any, fault: ChaosFault): Promise<ChaosOracleResult> | ChaosOracleResult;
}

export interface ChaosScenario {
  id: string;
  name: string;
  target: ChaosTarget;
  faults: ChaosFault[];
  oracles: ChaosOracle[];
}

export interface ChaosCampaignConfig {
  schemaVersion: string;
  campaignId: string;
  campaignVersion: string;
  seed: number;
  scenarios: string[];
}

export interface ChaosReport {
  schemaVersion: string;
  campaign: string;
  campaignVersion: string;
  seed: number;
  gitCommit: string;
  sourceDateEpoch: string | null;
  timestamp: string;
  summary: {
    scenariosExecuted: number;
    faultsInjected: number;
    oracleViolations: number;
    passed: boolean;
  };
  results: Array<{
    scenarioId: string;
    faults: string[];
    oracles: Array<{ name: string; status: 'PASS' | 'FAIL'; violation?: string }>;
    recoveries: string[];
    cleanupVerified: boolean;
    reproducible: boolean;
  }>;
}
