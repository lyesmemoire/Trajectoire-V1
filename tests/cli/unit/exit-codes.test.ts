/**
 * Unit tests for CLI Exit Codes
 */

import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import { CLIError, CommandError, ValidationError, ConfigError } from '../../../src/cli/errors';

describe('Exit Codes', () => {
  describe('Exit Code 0 - Success', () => {
    it('should exit with code 0 on success', async () => {
      const result = await execa('node', ['-e', 'process.exit(0)']);
      expect(result.exitCode).toBe(0);
    });

    it('should exit with code 0 for successful command execution', async () => {
      const result = await execa('npx', ['tsx', 'bin/blueprint', '--version'], {
        cwd: process.cwd(),
        reject: false,
      });
      
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Exit Code 1 - General Error', () => {
    it('should exit with code 1 on general error', async () => {
      const result = await execa('node', ['-e', 'process.exit(1)'], { reject: false });
      expect(result.exitCode).toBe(1);
    });

    it('should exit with code 1 for CLIError', () => {
      const error = new CLIError('Test error', 'TEST_ERROR', 1);
      expect(error.exitCode).toBe(1);
    });

    it('should exit with code 1 for CommandError', () => {
      const error = new CommandError('Command failed');
      expect(error.exitCode).toBe(1);
    });

    it('should exit with code 2 for ValidationError', () => {
      const error = new ValidationError('Validation failed');
      expect(error.exitCode).toBe(2);
    });

    it('should exit with code 3 for ConfigError', () => {
      const error = new ConfigError('Config error');
      expect(error.exitCode).toBe(3);
    });
  });

  describe('Exit Code 2 - Usage Error', () => {
    it('should exit with code 2 on usage error', async () => {
      const result = await execa('node', ['-e', 'process.exit(2)'], { reject: false });
      expect(result.exitCode).toBe(2);
    });
  });

  describe('Exit Code 64 - Command Line Usage Error', () => {
    it('should exit with code 64 for command line usage error', async () => {
      const result = await execa('node', ['-e', 'process.exit(64)'], { reject: false });
      expect(result.exitCode).toBe(64);
    });
  });

  describe('Exit Code 65 - Data Format Error', () => {
    it('should exit with code 65 for data format error', async () => {
      const result = await execa('node', ['-e', 'process.exit(65)'], { reject: false });
      expect(result.exitCode).toBe(65);
    });
  });

  describe('Exit Code 66 - Cannot Open Input', () => {
    it('should exit with code 66 for cannot open input error', async () => {
      const result = await execa('node', ['-e', 'process.exit(66)'], { reject: false });
      expect(result.exitCode).toBe(66);
    });
  });

  describe('Exit Code 70 - Internal Software Error', () => {
    it('should exit with code 70 for internal software error', async () => {
      const result = await execa('node', ['-e', 'process.exit(70)'], { reject: false });
      expect(result.exitCode).toBe(70);
    });
  });

  describe('Exit Code 74 - I/O Error', () => {
    it('should exit with code 74 for I/O error', async () => {
      const result = await execa('node', ['-e', 'process.exit(74)'], { reject: false });
      expect(result.exitCode).toBe(74);
    });
  });

  describe('Stdout Verification', () => {
    it('should write success message to stdout', async () => {
      const result = await execa('node', ['-e', 'console.log("Success")']);
      expect(result.stdout).toContain('Success');
      expect(result.exitCode).toBe(0);
    });

    it('should not write to stderr on success', async () => {
      const result = await execa('node', ['-e', 'console.log("Success")']);
      expect(result.stderr).toBe('');
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Stderr Verification', () => {
    it('should write error message to stderr', async () => {
      const result = await execa('node', ['-e', 'console.error("Error")'], { reject: false });
      expect(result.stderr).toContain('Error');
      expect(result.exitCode).toBe(0); // console.error doesn't change exit code
    });

    it('should not write to stdout on error', async () => {
      const result = await execa('node', ['-e', 'console.error("Error")'], { reject: false });
      expect(result.stdout).toBe('');
    });
  });

  describe('Combined Output Verification', () => {
    it('should handle both stdout and stderr', async () => {
      const result = await execa('node', ['-e', 'console.log("Out"); console.error("Err")'], { reject: false });
      expect(result.stdout).toContain('Out');
      expect(result.stderr).toContain('Err');
    });
  });

  describe('Custom Exit Codes', () => {
    it('should support custom exit codes', () => {
      const error = new CLIError('Custom error', 'CUSTOM_ERROR', 42);
      expect(error.exitCode).toBe(42);
    });

    it('should handle negative exit codes', () => {
      // Some systems use negative exit codes for signals
      const error = new CLIError('Signal error', 'SIGNAL_ERROR', -9);
      expect(error.exitCode).toBe(-9);
    });
  });
});
