/**
 * CLI Run Command Tests
 * Automated tests for the run command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('blueprint run', () => {
  let tempDir: string;
  let packageFile: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `blueprint-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    packageFile = path.join(tempDir, 'test.bpp');
    await fs.writeFile(packageFile, JSON.stringify({
      success: true,
      bytecode: {
        version: '1.0.0',
        target: 'cvm-v3',
      },
    }));
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should run a valid package', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'run', '--package', packageFile], {
      cwd: process.cwd(),
      timeout: 20000,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Running package');
    expect(result.stdout).toContain('Execution completed');
    expect(result.stdout).toContain('Exit code: 0');
  });

  it('should fail if package file does not exist', async () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.bpp');

    await expect(
      execa('npx', ['tsx', 'bin/blueprint', 'run', '--package', nonExistentFile], {
        cwd: process.cwd(),
        timeout: 20000,
      })
    ).rejects.toThrow();
  });

  it('should support custom entry point', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'run', '--package', packageFile, '--entry', 'custom'], {
      cwd: process.cwd(),
      timeout: 20000,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Entry point: custom');
  });

  it('should support debug mode', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'run', '--package', packageFile, '--debug'], {
      cwd: process.cwd(),
      timeout: 20000,
    });

    expect(result.exitCode).toBe(0);
  });
});
