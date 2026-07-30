/**
 * Comprehensive CLI Evidence Generator
 * Generates all objective evidence for Enterprise certification
 */

import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as os from 'os';

interface CommandLog {
  command: string;
  args: string[];
  exitCode: number;
  duration: number;
  stdout: string;
  stderr: string;
  timestamp: string;
}

interface ArtifactInfo {
  path: string;
  size: number;
  sha256: string;
  date: string;
}

async function calculateSHA256(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function captureArtifacts(directory: string): Promise<ArtifactInfo[]> {
  const artifacts: ArtifactInfo[] = [];
  
  try {
    const files = await fs.readdir(directory, { recursive: true });
    
    for (const file of files) {
      if (typeof file === 'string') {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile()) {
          artifacts.push({
            path: filePath,
            size: stat.size || 0,
            sha256: await calculateSHA256(filePath),
            date: stat.mtime.toISOString(),
          });
        }
      }
    }
  } catch {
    // Directory may not exist
  }
  
  return artifacts;
}

async function runCommandWithLogging(command: string, args: string[], logDir: string, artifactDir?: string): Promise<CommandLog> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  const result = await execa(command, args, {
    cwd: process.cwd(),
    reject: false,
  });
  
  const duration = Date.now() - startTime;
  
  const log: CommandLog = {
    command,
    args,
    exitCode: result.exitCode || 0,
    duration,
    stdout: result.stdout,
    stderr: result.stderr,
    timestamp,
  };
  
  // Save raw log
  const logFileName = `${args[1] || 'command'}.log`;
  const logPath = path.join(logDir, logFileName);
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, JSON.stringify(log, null, 2));
  
  // Save separate stdout/stderr files
  await fs.mkdir(logDir, { recursive: true });
  await fs.writeFile(path.join(logDir, `${args[1] || 'command'}-stdout.txt`), result.stdout);
  await fs.writeFile(path.join(logDir, `${args[1] || 'command'}-stderr.txt`), result.stderr);
  await fs.writeFile(path.join(logDir, `${args[1] || 'command'}-exitcode.txt`), String(result.exitCode || 0));
  
  // Capture artifacts if directory provided
  if (artifactDir) {
    const artifacts = await captureArtifacts(artifactDir);
    const artifactPath = path.join(logDir, `${args[1] || 'command'}-artifacts.json`);
    await fs.writeFile(artifactPath, JSON.stringify(artifacts, null, 2));
    
    // Copy artifacts to artifacts directory
    const artifactsDir = path.join(path.dirname(logDir), 'artifacts');
    await fs.mkdir(artifactsDir, { recursive: true });
    
    for (const artifact of artifacts) {
      const destPath = path.join(artifactsDir, path.basename(artifact.path));
      await fs.copyFile(artifact.path, destPath);
    }
  }
  
  return log;
}

async function generateChecksums(artifactsDir: string): Promise<void> {
  const checksumsPath = path.join(artifactsDir, 'checksums.sha256');
  const artifacts = await captureArtifacts(artifactsDir);
  
  const checksums = artifacts.map(a => `${a.sha256}  ${path.basename(a.path)}`).join('\n');
  await fs.writeFile(checksumsPath, checksums);
}

async function main() {
  const evidenceBaseDir = path.join(process.cwd(), 'reports', 'cli');
  
  // Create directory structure
  await fs.mkdir(path.join(evidenceBaseDir, 'evidence'), { recursive: true });
  await fs.mkdir(path.join(evidenceBaseDir, 'logs'), { recursive: true });
  await fs.mkdir(path.join(evidenceBaseDir, 'artifacts'), { recursive: true });
  await fs.mkdir(path.join(evidenceBaseDir, 'benchmarks'), { recursive: true });
  await fs.mkdir(path.join(evidenceBaseDir, 'tests'), { recursive: true });
  await fs.mkdir(path.join(evidenceBaseDir, 'coverage'), { recursive: true });
  await fs.mkdir(path.join(evidenceBaseDir, 'documentation'), { recursive: true });
  
  const logDir = path.join(evidenceBaseDir, 'logs');
  const evidenceDir = path.join(evidenceBaseDir, 'evidence');
  
  // Create temp directory for commands that generate artifacts
  const tempDir = path.join(os.tmpdir(), `blueprint-evidence-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  
  const results: Record<string, CommandLog> = {};
  
  console.log('=== Generating CLI Evidence ===\n');
  
  // Test --help
  console.log('1. Testing --help');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', '--help'], logDir);
    results['help'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test --version
  console.log('2. Testing --version');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', '--version'], logDir);
    results['version'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test doctor
  console.log('3. Testing doctor');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'doctor'], logDir);
    results['doctor'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test init
  console.log('4. Testing init');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'init', '--name', 'evidence-test', '--directory', tempDir, '--force'], logDir, tempDir);
    results['init'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms, Artifacts: ${log.stdout.includes('✓') ? 'Yes' : 'No'}`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test compile (depends on init)
  if (results['init'] && results['init'].exitCode === 0) {
    console.log('5. Testing compile');
    try {
      const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'compile', '--input', path.join(tempDir, 'src/contracts/SampleContract.bp'), '--output', path.join(tempDir, 'artifacts/SampleContract.bpp')], logDir, path.join(tempDir, 'artifacts'));
      results['compile'] = log;
      console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
    } catch (error) {
      console.error(`   Failed: ${error}`);
    }
  }
  
  // Test graph
  console.log('6. Testing graph');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'graph', '--type', 'dependency', '--format', 'json', '--output', path.join(tempDir, 'graph.json')], logDir, tempDir);
    results['graph'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test trace
  console.log('7. Testing trace');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'trace', '--duration', '50', '--output', path.join(tempDir, 'trace.json')], logDir, tempDir);
    results['trace'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test debug
  console.log('8. Testing debug');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'debug', '--port', '9230'], logDir);
    results['debug'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test run
  console.log('9. Testing run');
  try {
    const packageFile = path.join(tempDir, 'artifacts/SampleContract.bpp');
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'run', '--package', packageFile], logDir);
    results['run'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test build
  console.log('10. Testing build');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'build', '--input', tempDir, '--output', path.join(tempDir, 'dist')], logDir, path.join(tempDir, 'dist'));
    results['build'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Test benchmark
  console.log('11. Testing benchmark');
  try {
    const log = await runCommandWithLogging('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '5', '--output', path.join(tempDir, 'benchmark.json')], logDir, tempDir);
    results['benchmark'] = log;
    console.log(`   Exit Code: ${log.exitCode}, Duration: ${log.duration}ms`);
    
    // Copy benchmark to benchmarks directory
    const benchmarkSrc = path.join(tempDir, 'benchmark.json');
    const benchmarkDest = path.join(evidenceBaseDir, 'benchmarks', 'current.json');
    try {
      await fs.copyFile(benchmarkSrc, benchmarkDest);
    } catch {
      // File may not exist
    }
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Cleanup temp directory
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
  
  // Generate checksums for artifacts
  console.log('8. Generating checksums');
  try {
    await generateChecksums(path.join(evidenceBaseDir, 'artifacts'));
    console.log('   Checksums generated');
  } catch (error) {
    console.error(`   Failed: ${error}`);
  }
  
  // Save evidence summary
  const summaryPath = path.join(evidenceDir, 'summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(results, null, 2));
  
  // Save test results
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    },
    commands: Object.keys(results).map(key => ({
      command: key,
      exitCode: results[key].exitCode,
      duration: results[key].duration,
      success: results[key].exitCode === 0,
    })),
    summary: {
      total: Object.keys(results).length,
      passed: Object.values(results).filter(r => r.exitCode === 0).length,
      failed: Object.values(results).filter(r => r.exitCode !== 0).length,
    },
  };
  
  const testResultsPath = path.join(evidenceBaseDir, 'tests', 'cli-results.json');
  await fs.writeFile(testResultsPath, JSON.stringify(testResults, null, 2));
  
  console.log('\n=== Evidence Generation Complete ===');
  console.log(`Evidence directory: ${evidenceBaseDir}`);
  console.log(`Commands tested: ${Object.keys(results).length}`);
  console.log(`Passed: ${testResults.summary.passed}`);
  console.log(`Failed: ${testResults.summary.failed}`);
}

main().catch(console.error);
