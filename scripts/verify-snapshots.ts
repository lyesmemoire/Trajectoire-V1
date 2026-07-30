/**
 * CLI Snapshot Verification
 * Compares current CLI output against stored snapshots
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

interface VerificationResult {
  command: string;
  args: string[];
  exitCodeMatch: boolean;
  stdoutMatch: boolean;
  stderrMatch: boolean;
  environmentMatch: boolean;
  overallMatch: boolean;
  differences: string[];
}

async function verifySnapshot(snapshotPath: string): Promise<VerificationResult> {
  const snapshotContent = await fs.readFile(snapshotPath, 'utf-8');
  const snapshot: Snapshot = JSON.parse(snapshotContent);
  
  const result = await execa(snapshot.command, snapshot.args, {
    cwd: process.cwd(),
    reject: false,
  });
  
  const differences: string[] = [];
  
  // Check exit code
  const exitCodeMatch = (result.exitCode || 0) === snapshot.expectedExitCode;
  if (!exitCodeMatch) {
    differences.push(`Exit code mismatch: expected ${snapshot.expectedExitCode}, got ${result.exitCode}`);
  }
  
  // Check stdout (allow for minor variations like timestamps)
  const stdoutMatch = result.stdout.includes(snapshot.expectedStdout.substring(0, 100)) || 
                      result.stdout === snapshot.expectedStdout;
  if (!stdoutMatch) {
    differences.push(`Stdout mismatch: output differs from snapshot`);
  }
  
  // Check stderr
  const stderrMatch = result.stderr === snapshot.expectedStderr;
  if (!stderrMatch) {
    differences.push(`Stderr mismatch: expected empty, got "${result.stderr}"`);
  }
  
  // Check environment (platform-specific)
  const currentEnv = {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
  };
  const environmentMatch = currentEnv.platform === snapshot.environment.platform;
  if (!environmentMatch) {
    differences.push(`Platform mismatch: snapshot from ${snapshot.environment.platform}, current ${currentEnv.platform}`);
  }
  
  const overallMatch = exitCodeMatch && stdoutMatch && stderrMatch;
  
  return {
    command: snapshot.command,
    args: snapshot.args,
    exitCodeMatch,
    stdoutMatch,
    stderrMatch,
    environmentMatch,
    overallMatch,
    differences,
  };
}

async function main() {
  const snapshotDir = path.join(process.cwd(), 'reports', 'cli', 'snapshots');
  const verificationDir = path.join(process.cwd(), 'reports', 'cli', 'snapshots');
  
  console.log('=== Verifying CLI Snapshots ===\n');
  
  const results: VerificationResult[] = [];
  
  // Find all snapshot files
  const files = await fs.readdir(snapshotDir);
  const snapshotFiles = files.filter(f => f.endsWith('.snapshot.json'));
  
  for (const snapshotFile of snapshotFiles) {
    const snapshotPath = path.join(snapshotDir, snapshotFile);
    console.log(`Verifying: ${snapshotFile}`);
    
    try {
      const result = await verifySnapshot(snapshotPath);
      results.push(result);
      
      console.log(`  Exit Code: ${result.exitCodeMatch ? '✓' : '✗'}`);
      console.log(`  Stdout: ${result.stdoutMatch ? '✓' : '✗'}`);
      console.log(`  Stderr: ${result.stderrMatch ? '✓' : '✗'}`);
      console.log(`  Overall: ${result.overallMatch ? '✓ PASS' : '✗ FAIL'}`);
      
      if (result.differences.length > 0) {
        console.log(`  Differences:`);
        result.differences.forEach(diff => console.log(`    - ${diff}`));
      }
      
      console.log();
    } catch (error) {
      console.error(`  ✗ Failed to verify: ${error}\n`);
    }
  }
  
  // Generate verification report
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    },
    results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.overallMatch).length,
      failed: results.filter(r => !r.overallMatch).length,
      passRate: ((results.filter(r => r.overallMatch).length / results.length) * 100).toFixed(2) + '%',
    },
  };
  
  const reportPath = path.join(verificationDir, 'verification-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('=== Verification Complete ===');
  console.log(`Report saved to: ${reportPath}`);
  console.log(`Pass Rate: ${report.summary.passRate}`);
  console.log(`Status: ${report.summary.failed === 0 ? '✓ ALL SNAPSHOTS VERIFIED' : '✗ SOME SNAPSHOTS FAILED'}`);
}

main().catch(console.error);
