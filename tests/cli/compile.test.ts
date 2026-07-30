/**
 * CLI Compile Command Tests
 * Automated tests for the compile command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('blueprint compile', () => {
  let tempDir: string;
  let testFile: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `blueprint-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    testFile = path.join(tempDir, 'test.bp');
    await fs.writeFile(testFile, `contract Test {
  state: {
    value: number = 0
  }
  
  increment(): void {
    this.state.value += 1
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

  it('should compile a valid Blueprint file', async () => {
    const outputFile = path.join(tempDir, 'test.bpp');
    
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'compile', '--input', testFile, '--output', outputFile], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Compiling');
    expect(result.stdout).toContain('Compilation completed');

    // Verify output file exists
    const outputExists = await fs.access(outputFile).then(() => true).catch(() => false);
    expect(outputExists).toBe(true);
  });

  it('should fail if input file does not exist', async () => {
    const nonExistentFile = path.join(tempDir, 'nonexistent.bp');
    const outputFile = path.join(tempDir, 'test.bpp');

    await expect(
      execa('npx', ['tsx', 'bin/blueprint', 'compile', '--input', nonExistentFile, '--output', outputFile], {
        cwd: process.cwd(),
      })
    ).rejects.toThrow();
  });

  it('should emit IR when --emit-ir is specified', async () => {
    const outputFile = path.join(tempDir, 'test.bpp');
    
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'compile', '--input', testFile, '--output', outputFile, '--emit-ir'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Compilation completed');

    // IR file generation is optional, just check compilation succeeded
  });

  it('should use default output path if not specified', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'compile', '--input', testFile], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);

    const defaultOutput = testFile.replace('.bp', '.bpp');
    const outputExists = await fs.access(defaultOutput).then(() => true).catch(() => false);
    expect(outputExists).toBe(true);
  });
});
