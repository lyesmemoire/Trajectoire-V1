import fs from 'fs';
import path from 'path';
import { FuzzerEngine, CampaignConfig } from './engine/FuzzerEngine';
import { Scheduler } from './engine/Scheduler';
import { VMTarget } from './targets/vm-target';
import { FuzzOracle, OracleResult, FuzzResult } from './engine/interfaces';

class BasicVMOracle implements FuzzOracle {
  name = 'BasicVMOracle';
  
  check(result: FuzzResult, input: Uint8Array): OracleResult {
    // If execution caused an error, it's not a logical oracle violation but a standard crash/error
    // FuzzerEngine catches exceptions anyway, but if there's a specific soft-crash we can detect it here.
    if (result.error && result.error.message.includes('out of bounds')) {
      return { status: 'FAIL', reason: 'Memory Violation', error: result.error };
    }
    return { status: 'PASS' };
  }
}

async function main() {
  const campaignName = process.argv[2] || 'quick';
  const campaignPath = path.join(__dirname, 'campaigns', `${campaignName}.json`);
  
  if (!fs.existsSync(campaignPath)) {
    console.error(`Campaign file not found: ${campaignPath}`);
    process.exit(1);
  }

  const config: CampaignConfig = JSON.parse(fs.readFileSync(campaignPath, 'utf8'));
  
  const target = new VMTarget();
  const oracle = new BasicVMOracle();
  const scheduler = new Scheduler();

  // Basic git commit fetch or default
  const gitCommit = process.env.GIT_COMMIT || 'development';

  const engine = new FuzzerEngine(target, oracle, scheduler, config, gitCommit);
  
  const bus = engine.getEventBus();
  bus.on('IterationCompleted', (ev) => {
    process.stdout.write(`\rIterations: ${ev.payload.iterations} / ${config.iterations}`);
  });
  bus.on('CrashDetected', (ev) => {
    console.log(`\n[CRASH] ${ev.payload.type} -> Signature: ${ev.payload.signature} (Saved to ${ev.payload.path})`);
  });
  bus.on('CoverageImproved', (ev) => {
    console.log(`\n[COVERAGE] New coverage found! (+${ev.payload.diff.diff} blocks)`);
  });

  console.log(`Starting campaign: ${config.campaignId} (v${config.campaignVersion})`);
  
  await engine.start();
  
  console.log('\nCampaign finished. Report generated in tests/fuzzing/reports/fuzz-report.json');
}

main().catch(console.error);
