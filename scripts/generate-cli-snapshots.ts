/**
 * CLI Snapshot Generator
 * Creates snapshots of expected CLI output for regression testing
 */

import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

interface Snapshot {
  command: string;
  args: string[];
  expectedExitCode: number;
  expectedStdout: string;
  expectedStderr: string;
  timestamp: string;
  environment: {
    platform: string;
    arch: string;
    nodeVersion: string;
  };
}

async function createSnapshot(command: string, args: string[], snapshotDir: string): Promise<Snapshot> {
  const result = await execa(command, args, {
    cwd: process.cwd(),
    reject: false,
  });
  
  const snapshot: Snapshot = {
    command,
    args,
    expectedExitCode: result.exitCode || 0,
    expectedStdout: result.stdout,
    expectedStderr: result.stderr,
    timestamp: new Date().toISOString(),
    environment: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    },
  };
  
  const snapshotName = args[1] || 'command';
  const snapshotPath = path.join(snapshotDir, `${snapshotName}.snapshot.json`);
  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));
  
  return snapshot;
}

async function main() {
  const snapshotDir = path.join(process.cwd(), 'reports', 'cli', 'snapshots');
  await fs.mkdir(snapshotDir, { recursive: true });
  
  console.log('=== Generating CLI Snapshots ===\n');
  
  const snapshots: Snapshot[] = [];
  
  // Snapshot --help
  console.log('1. Snapshot --help');
  try {
    const snapshot = await createSnapshot('npx', ['tsx', 'bin/blueprint', '--help'], snapshotDir);
    snapshots.push(snapshot);
    console.log('   ✓ Snapshot created');
  } catch (error) {
    console.error(`   ✗ Failed: ${error}`);
  }
  
  // Snapshot --version
  console.log('2. Snapshot --version');
  try {
    const snapshot = await createSnapshot('npx', ['tsx', 'bin/blueprint', '--version'], snapshotDir);
    snapshots.push(snapshot);
    console.log('   ✓ Snapshot created');
  } catch (error) {
    console.error(`   ✗ Failed: ${error}`);
  }
  
  // Snapshot doctor
  console.log('3. Snapshot doctor');
  try {
    const snapshot = await createSnapshot('npx', ['tsx', 'bin/blueprint', 'doctor'], snapshotDir);
    snapshots.push(snapshot);
    console.log('   ✓ Snapshot created');
  } catch (error) {
    console.error(`   ✗ Failed: ${error}`);
  }
  
  // Create snapshot summary
  const summary = {
    timestamp: new Date().toISOString(),
    environment: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    },
    snapshots: snapshots.map(s => ({
      command: s.command,
      args: s.args,
      expectedExitCode: s.expectedExitCode,
      stdoutLength: s.expectedStdout.length,
      stderrLength: s.expectedStderr.length,
    })),
    summary: {
      total: snapshots.length,
      success: snapshots.filter(s => s.expectedExitCode === 0).length,
      failed: snapshots.filter(s => s.expectedExitCode !== 0).length,
    },
  };
  
  const summaryPath = path.join(snapshotDir, 'summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  
  console.log('\n=== Snapshot Generation Complete ===');
  console.log(`Snapshots created: ${snapshots.length}`);
  console.log(`Snapshot directory: ${snapshotDir}`);
}

main().catch(console.error);
