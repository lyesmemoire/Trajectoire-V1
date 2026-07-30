/**
 * CLI Trace Command Tests
 * Automated tests for the trace command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('blueprint trace', () => {
  let traceFile: string;

  beforeEach(() => {
    traceFile = path.join(process.cwd(), 'test-trace.json');
  });

  afterEach(async () => {
    try {
      await fs.unlink(traceFile);
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should run trace with default duration', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'trace', '--duration', '100'], {
      cwd: process.cwd(),
      timeout: 20000,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Starting runtime tracing');
    expect(result.stdout).toContain('Trace completed');
  });

  it('should generate trace report', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'trace', '--duration', '100', '--output', traceFile], {
      cwd: process.cwd(),
      timeout: 20000,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Output');

    // Verify trace file exists and is valid JSON
    const trace = JSON.parse(await fs.readFile(traceFile, 'utf-8'));
    expect(trace).toHaveProperty('startTime');
    expect(trace).toHaveProperty('endTime');
    expect(trace).toHaveProperty('duration');
    expect(trace).toHaveProperty('events');
    expect(Array.isArray(trace.events)).toBe(true);
  });

  it('should respect custom duration', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'trace', '--duration', '50'], {
      cwd: process.cwd(),
      timeout: 20000,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Duration: 50ms');
  });
});
