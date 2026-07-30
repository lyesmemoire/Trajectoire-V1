/**
 * CLI Debug Command Tests
 * Automated tests for the debug command
 */

import { describe, it, expect } from 'vitest';
import { execa } from 'execa';

describe('blueprint debug', () => {
  it('should start debugger with default settings', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'debug'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Starting debugger');
    expect(result.stdout).toContain('Port: 9229');
    expect(result.stdout).toContain('Host: localhost');
  });

  it('should start debugger with custom port', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'debug', '--port', '9230'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Port: 9230');
  });

  it('should start debugger with custom host', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'debug', '--host', '127.0.0.1'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Host: 127.0.0.1');
  });

  it('should support attach mode', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'debug', '--attach'], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Attaching to existing process');
  });
});
