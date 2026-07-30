/**
 * CLI Execution Evidence Capture Script
 * Captures detailed execution evidence for CLI commands
 */

import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import * as os from 'os';

interface ExecutionEvidence {
  command: string;
  args: string[];
  exitCode: number;
  duration: number;
  stdout: string;
  stderr: string;
  timestamp: string;
  environment: {
    platform: string;
    arch: string;
    nodeVersion: string;
  };
  artifacts?: {
    path: string;
    size: number;
    sha256: string;
  }[];
}

async function calculateSHA256(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function captureArtifacts(directory: string): Promise<ExecutionEvidence['artifacts']> {
  const artifacts: ExecutionEvidence['artifacts'] = [];
  
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
          });
        }
      }
    }
  } catch {
    // Directory may not exist
  }
  
  return artifacts;
}

async function captureCommand(command: string, args: string[], artifactDir?: string): Promise<ExecutionEvidence> {
  const startTime = Date.now();
  
  const result = await execa(command, args, {
    cwd: process.cwd(),
    reject: false,
  });
  
  const duration = Date.now() - startTime;
  
  const evidence: ExecutionEvidence = {
    command,
    args,
    exitCode: result.exitCode || 0,
    duration,
    stdout: result.stdout,
    stderr: result.stderr,
    timestamp: new Date().toISOString(),
    environment: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    },
  };
  
  if (artifactDir) {
    evidence.artifacts = await captureArtifacts(artifactDir);
  }
  
  return evidence;
}

async function main() {
  const evidenceDir = path.join(process.cwd(), 'reports', 'cli', 'evidence');
  await fs.mkdir(evidenceDir, { recursive: true });
  
  // Create temp directories for commands that generate artifacts
  const tempDir = path.join(os.tmpdir(), `blueprint-evidence-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  
  const results: Record<string, ExecutionEvidence> = {};
  
  // Run commands in order (init must run first)
  console.log(`Capturing evidence for: help`);
  try {
    const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', '--help']);
    results['help'] = evidence;
    const evidenceFile = path.join(evidenceDir, 'help.json');
    await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
    console.log(`  Exit Code: ${evidence.exitCode}`);
    console.log(`  Duration: ${evidence.duration}ms`);
  } catch (error) {
    console.error(`  Failed: ${error}`);
  }
  
  console.log(`Capturing evidence for: doctor`);
  try {
    const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', 'doctor']);
    results['doctor'] = evidence;
    const evidenceFile = path.join(evidenceDir, 'doctor.json');
    await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
    console.log(`  Exit Code: ${evidence.exitCode}`);
    console.log(`  Duration: ${evidence.duration}ms`);
  } catch (error) {
    console.error(`  Failed: ${error}`);
  }
  
  console.log(`Capturing evidence for: doctor-json`);
  try {
    const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', 'doctor', '--json']);
    results['doctor-json'] = evidence;
    const evidenceFile = path.join(evidenceDir, 'doctor-json.json');
    await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
    console.log(`  Exit Code: ${evidence.exitCode}`);
    console.log(`  Duration: ${evidence.duration}ms`);
  } catch (error) {
    console.error(`  Failed: ${error}`);
  }
  
  // Run init first to create files
  console.log(`Capturing evidence for: init`);
  try {
    const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', 'init', '--name', 'evidence-test', '--directory', tempDir, '--force'], tempDir);
    results['init'] = evidence;
    const evidenceFile = path.join(evidenceDir, 'init.json');
    await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
    console.log(`  Exit Code: ${evidence.exitCode}`);
    console.log(`  Duration: ${evidence.duration}ms`);
    console.log(`  Artifacts: ${evidence.artifacts?.length || 0}`);
  } catch (error) {
    console.error(`  Failed: ${error}`);
  }
  
  // Now run compile (depends on init)
  if (results['init'] && results['init'].exitCode === 0) {
    console.log(`Capturing evidence for: compile`);
    try {
      const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', 'compile', '--input', path.join(tempDir, 'src/contracts/SampleContract.bp'), '--output', path.join(tempDir, 'artifacts/SampleContract.bpp')], path.join(tempDir, 'artifacts'));
      results['compile'] = evidence;
      const evidenceFile = path.join(evidenceDir, 'compile.json');
      await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
      console.log(`  Exit Code: ${evidence.exitCode}`);
      console.log(`  Duration: ${evidence.duration}ms`);
      console.log(`  Artifacts: ${evidence.artifacts?.length || 0}`);
    } catch (error) {
      console.error(`  Failed: ${error}`);
    }
  }
  
  console.log(`Capturing evidence for: graph`);
  try {
    const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', 'graph', '--type', 'dependency', '--format', 'json', '--output', path.join(tempDir, 'graph.json')], tempDir);
    results['graph'] = evidence;
    const evidenceFile = path.join(evidenceDir, 'graph.json');
    await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
    console.log(`  Exit Code: ${evidence.exitCode}`);
    console.log(`  Duration: ${evidence.duration}ms`);
    console.log(`  Artifacts: ${evidence.artifacts?.length || 0}`);
  } catch (error) {
    console.error(`  Failed: ${error}`);
  }
  
  console.log(`Capturing evidence for: benchmark`);
  try {
    const evidence = await captureCommand('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '5', '--output', path.join(tempDir, 'benchmark.json')], tempDir);
    results['benchmark'] = evidence;
    const evidenceFile = path.join(evidenceDir, 'benchmark.json');
    await fs.writeFile(evidenceFile, JSON.stringify(evidence, null, 2));
    console.log(`  Exit Code: ${evidence.exitCode}`);
    console.log(`  Duration: ${evidence.duration}ms`);
    console.log(`  Artifacts: ${evidence.artifacts?.length || 0}`);
  } catch (error) {
    console.error(`  Failed: ${error}`);
  }
  
  // Cleanup temp directory
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
  
  // Save summary
  const summaryFile = path.join(evidenceDir, 'summary.json');
  await fs.writeFile(summaryFile, JSON.stringify(results, null, 2));
  
  console.log(`\nEvidence saved to: ${evidenceDir}`);
}

main().catch(console.error);
