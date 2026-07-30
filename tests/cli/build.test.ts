/**
 * CLI Build Command Tests
 * Automated tests for the build command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('blueprint build', () => {
  let tempDir: string;
  let sourceDir: string;
  let outputDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `blueprint-test-${Date.now()}`);
    sourceDir = path.join(tempDir, 'src');
    outputDir = path.join(tempDir, 'dist');
    
    await fs.mkdir(sourceDir, { recursive: true });
    
    // Create a test Blueprint file
    await fs.writeFile(path.join(sourceDir, 'test.bp'), `contract Test {
  state: {
    value: number = 0
  }
}`);
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should build from source directory', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'build', '--input', sourceDir, '--output', outputDir], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Building from');
    expect(result.stdout).toContain('Build completed');
  });

  it('should handle empty directory gracefully', async () => {
    const emptyDir = path.join(tempDir, 'empty');
    await fs.mkdir(emptyDir, { recursive: true });
    
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'build', '--input', emptyDir, '--output', outputDir], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('No Blueprint files found');
  });

  it('should use default output directory if not specified', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'build', '--input', sourceDir], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    
    const defaultOutput = path.join(sourceDir, 'dist');
    const outputExists = await fs.access(defaultOutput).then(() => true).catch(() => false);
    expect(outputExists).toBe(true);
  });
});
