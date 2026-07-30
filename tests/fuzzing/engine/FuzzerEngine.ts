import fs from 'fs';
import path from 'path';
import { FuzzTarget, FuzzOracle, FuzzEventBus, Scheduler, FuzzResult } from './interfaces';
import { CorpusManager } from './CorpusManager';
import { CoverageTracker } from './CoverageTracker';
import { Mutator } from './Mutator';
import { CrashReporter } from './CrashReporter';

export interface CampaignConfig {
  campaignId: string;
  campaignVersion: string;
  iterations: number;
  timeoutMs?: number;
  coverage: boolean;
  saveCorpus: boolean;
  minimizeCrashes: boolean;
  seed: number;
}

export class FuzzerEngine {
  private eventBus = new FuzzEventBus();
  private corpusManager = new CorpusManager();
  private coverageTracker = new CoverageTracker();
  private mutator = new Mutator();
  private crashReporter: CrashReporter;
  private isRunning = false;
  
  private stats = {
    iterations: 0,
    startTime: 0,
    crashes: 0,
    uniqueCrashes: 0,
    newCorpusEntries: 0,
    timeouts: 0
  };

  private uniqueCrashSignatures = new Set<string>();

  constructor(
    private target: FuzzTarget,
    private oracle: FuzzOracle,
    private scheduler: Scheduler,
    private config: CampaignConfig,
    private gitCommit: string
  ) {
    this.crashReporter = new CrashReporter(target.name);
  }

  public getEventBus(): FuzzEventBus {
    return this.eventBus;
  }

  async start() {
    this.isRunning = true;
    this.stats.startTime = Date.now();
    
    await this.target.initialize();
    if (this.config.coverage) {
      await this.coverageTracker.initialize();
    }

    // Load initial corpus
    const entries = this.corpusManager.loadAll();
    for (const entry of entries) {
      this.scheduler.addEntry(entry, 100);
    }
    
    if (entries.length === 0) {
      // Seed if empty
      this.scheduler.addEntry({ hash: '', data: new Uint8Array([0]), size: 1, tags: ['seed'] }, 100);
    }

    this.eventBus.emit('CampaignStarted', { config: this.config });

    let timeoutTimer: NodeJS.Timeout | null = null;
    if (this.config.timeoutMs) {
      timeoutTimer = setTimeout(() => {
        this.isRunning = false;
        this.eventBus.emit('TimeoutDetected', { reason: 'Campaign timeout reached' });
      }, this.config.timeoutMs);
    }

    while (this.isRunning && this.stats.iterations < this.config.iterations) {
      const input = this.scheduler.next();
      if (!input) {
        this.isRunning = false;
        break;
      }

      const { mutated, strategy } = this.mutator.mutate(input);
      let result: FuzzResult | null = null;
      let crashed = false;
      let oracleFailed = false;
      let errorObj: Error | null = null;
      let oracleRes: any = null;

      const execStart = Date.now();
      try {
        result = await this.target.execute(mutated);
        oracleRes = this.oracle.check(result, mutated);
        if (oracleRes.status !== 'PASS') {
          oracleFailed = true;
          errorObj = oracleRes.error || new Error(oracleRes.reason);
        }
      } catch (e: any) {
        crashed = true;
        errorObj = e;
      }
      const execTime = Date.now() - execStart;

      this.stats.iterations++;

      if (crashed || oracleFailed) {
        this.stats.crashes++;
        const sig = this.crashReporter.generateSignature(errorObj, oracleRes, this.gitCommit);
        if (!this.uniqueCrashSignatures.has(sig)) {
          this.uniqueCrashSignatures.add(sig);
          this.stats.uniqueCrashes++;
          const type = this.crashReporter.getType(errorObj, oracleRes);
          
          let finalInput = mutated;
          if (this.config.minimizeCrashes) {
            finalInput = await this.crashReporter.minimize(this.target, mutated, sig, this.gitCommit, (res, inp) => this.oracle.check(res, inp));
          }

          const savedPath = this.corpusManager.saveCrash(finalInput, type, sig);
          this.eventBus.emit('CrashDetected', { signature: sig, path: savedPath, type });
        }
        
        // Feed negative back to mutator and scheduler
        this.mutator.feedback(strategy, false);
        this.scheduler.feedback(CorpusManager.hash(mutated), result || { executionTimeMs: execTime }, false);
      } else {
        // Success execution, check coverage
        let newCoverage = false;
        if (this.config.coverage) {
          const diff = await this.coverageTracker.getCoverageDiff();
          newCoverage = diff.newCoverage;
          if (newCoverage) {
            this.eventBus.emit('CoverageImproved', { diff });
          }
        }

        if (newCoverage && this.config.saveCorpus) {
          this.stats.newCorpusEntries++;
          const hash = this.corpusManager.saveToCorpus(mutated, 'coverage');
          this.scheduler.addEntry({ hash, data: mutated, size: mutated.length, tags: ['coverage'] }, 150);
        }

        this.mutator.feedback(strategy, newCoverage);
        this.scheduler.feedback(CorpusManager.hash(mutated), result!, newCoverage);
      }

      if (this.stats.iterations % 100 === 0) {
        this.eventBus.emit('IterationCompleted', { iterations: this.stats.iterations });
      }
    }

    if (timeoutTimer) clearTimeout(timeoutTimer);
    
    if (this.config.coverage) {
      await this.coverageTracker.stop();
    }
    await this.target.shutdown();
    
    this.generateReport();
    this.eventBus.emit('CampaignFinished', { stats: this.stats });
  }

  private generateReport() {
    const reportPath = path.join(process.cwd(), 'tests', 'fuzzing', 'reports', 'fuzz-report.json');
    const report = {
      schemaVersion: "1.0",
      reportType: "fuzz-report",
      campaign: {
        campaignId: this.config.campaignId,
        campaignVersion: this.config.campaignVersion,
        seed: this.config.seed,
        gitCommit: this.gitCommit,
        sourceDateEpoch: Math.floor(Date.now() / 1000)
      },
      coverage: this.coverageTracker.getStatistics(),
      crashes: {
        total: this.stats.crashes,
        unique: this.stats.uniqueCrashes
      },
      mutationStatistics: this.mutator.getStatistics(),
      schedulerStatistics: {
        queueSize: this.scheduler.getQueueSize()
      },
      corpusStatistics: {
        newEntries: this.stats.newCorpusEntries
      },
      performance: {
        iterations: this.stats.iterations,
        durationMs: Date.now() - this.stats.startTime,
        execPerSec: this.stats.iterations / Math.max(1, (Date.now() - this.stats.startTime) / 1000)
      }
    };

    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  }
}
