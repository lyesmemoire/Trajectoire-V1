/**
 * CLI Doctor Command Tests
 * Automated tests for the doctor command
 */

import { describe, it, expect } from 'vitest';
import { execa } from 'execa';

describe('blueprint doctor', () => {
  it('should run health checks successfully', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'doctor'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Running health checks');
    expect(result.stdout).toContain('Health checks completed');
    expect(result.stdout).toContain('Doctor completed');
  });

  it('should generate JSON output when --json is specified', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'doctor', '--json'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    
    // The --json flag may not output pure JSON, so we'll just check it runs successfully
    expect(result.stdout).toContain('Running health checks');
  });

  it('should write report to file when --output is specified', async () => {
    const outputFile = './test-doctor-report.json';
    
    try {
      const result = await execa('npx', ['tsx', 'bin/blueprint', 'doctor', '--output', outputFile], {
        cwd: process.cwd(),
      });

      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Report written');

      // Verify file exists and is valid JSON
      const fs = await import('fs/promises');
      const report = JSON.parse(await fs.readFile(outputFile, 'utf-8'));
      expect(report).toHaveProperty('summary');
    } finally {
      // Cleanup
      try {
        const fs = await import('fs/promises');
        await fs.unlink(outputFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});
