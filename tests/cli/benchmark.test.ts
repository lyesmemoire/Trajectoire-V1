/**
 * CLI Benchmark Command Tests
 * Automated tests for the benchmark command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('blueprint benchmark', () => {
  let reportFile: string;

  beforeEach(() => {
    reportFile = path.join(process.cwd(), 'test-benchmark-report.json');
  });

  afterEach(async () => {
    try {
      await fs.unlink(reportFile);
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should run benchmarks successfully', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '5'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Running benchmarks');
    expect(result.stdout).toContain('Benchmarks completed');
  });

  it('should generate benchmark report', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '5', '--output', reportFile], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Report');

    // Verify report file exists and is valid JSON
    const report = JSON.parse(await fs.readFile(reportFile, 'utf-8'));
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('iterations');
    expect(report).toHaveProperty('results');
    expect(report).toHaveProperty('summary');
    expect(Array.isArray(report.results)).toBe(true);
  });

  it('should respect custom iteration count', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '3'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Iterations: 3');
  });

  it('should respect custom warmup count', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'benchmark', '--warmup', '5'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Warmup: 5');
  });
});
