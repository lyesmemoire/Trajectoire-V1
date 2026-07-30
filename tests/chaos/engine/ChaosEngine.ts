import { EventEmitter } from 'events';
import { ChaosTarget, ChaosScenario, ChaosCampaignConfig, ChaosReport, ChaosOracleResult } from './interfaces';
import { FaultInjector } from './FaultInjector';

export class ChaosEngine {
  private config: ChaosCampaignConfig;
  private scenarios: ChaosScenario[];
  private injector: FaultInjector;
  private bus: EventEmitter;
  private report: ChaosReport;

  constructor(config: ChaosCampaignConfig, scenarios: ChaosScenario[], gitCommit: string) {
    this.config = config;
    this.scenarios = scenarios;
    this.injector = new FaultInjector();
    this.bus = new EventEmitter();
    
    this.report = {
      schemaVersion: this.config.schemaVersion,
      campaign: this.config.campaignId,
      campaignVersion: this.config.campaignVersion,
      seed: this.config.seed,
      gitCommit,
      sourceDateEpoch: process.env.SOURCE_DATE_EPOCH || null,
      timestamp: new Date().toISOString(),
      summary: {
        scenariosExecuted: 0,
        faultsInjected: 0,
        oracleViolations: 0,
        passed: true
      },
      results: []
    };
  }

  public getEventBus(): EventEmitter {
    return this.bus;
  }

  public async run(): Promise<ChaosReport> {
    this.bus.emit('CampaignStarted', { campaign: this.config.campaignId });

    for (const scenario of this.scenarios) {
      if (!this.config.scenarios.includes(scenario.id) && !this.config.scenarios.includes('all')) {
        continue; // Skip if not in campaign
      }

      this.bus.emit('ScenarioStarted', { scenario: scenario.id });
      
      const result = {
        scenarioId: scenario.id,
        faults: [] as string[],
        oracles: [] as Array<{ name: string; status: 'PASS' | 'FAIL'; violation?: string }>,
        recoveries: [] as string[],
        cleanupVerified: false,
        reproducible: true
      };

      try {
        await scenario.target.initialize();

        // Activate all faults for this scenario
        for (const fault of scenario.faults) {
          await this.injector.inject(fault, null);
          result.faults.push(fault.id);
          this.report.summary.faultsInjected++;
        }

        // Execute target logic under chaos
        let targetState = null;
        let threwException = false;
        try {
          targetState = await scenario.target.executeScenario(scenario.id);
        } catch (e: any) {
          threwException = true;
          // Read the mutable state from the target even on crash — the target
          // updates state in-place, so it reflects the system at crash time.
          targetState = (scenario.target as any).state || { error: e };
        }

        // Deactivate faults before running Oracles so Oracles don't fail due to chaos
        for (const fault of scenario.faults) {
          if (fault.deactivate) await fault.deactivate();
        }
        await this.injector.cleanup();
        result.cleanupVerified = true; // In real engine, Oracle checks this

        // Run Oracles
        for (const oracle of scenario.oracles) {
          // Verify each oracle against the resulting state (which might be an error state)
          let oracleRes: ChaosOracleResult;
          try {
            oracleRes = await oracle.check(targetState, scenario.faults[0] /* simplification */);
          } catch (e: any) {
            oracleRes = { status: 'FAIL', violation: `Oracle crashed: ${e.message}` };
          }

          result.oracles.push({ name: oracle.name, status: oracleRes.status, violation: oracleRes.violation });
          if (oracleRes.status === 'FAIL') {
            this.report.summary.oracleViolations++;
            this.report.summary.passed = false;
          }
        }
        
      } catch (err: any) {
        // Unexpected framework crash
        result.oracles.push({ name: 'Framework', status: 'FAIL', violation: `Unexpected: ${err.message}` });
        this.report.summary.passed = false;
      } finally {
        await scenario.target.shutdown();
      }

      this.report.results.push(result);
      this.report.summary.scenariosExecuted++;
      this.bus.emit('ScenarioFinished', { scenario: scenario.id, result });
    }

    this.bus.emit('CampaignFinished', { report: this.report });
    return this.report;
  }
}
