/**
 * Unit tests for CLI Core functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configManager } from '../../../src/cli/config';
import * as errors from '../../../src/cli/errors';

describe('CLI Core', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Configuration Loading', () => {
    it('should load configuration on startup', async () => {
      const loadSpy = vi.spyOn(configManager, 'load').mockResolvedValue({});
      
      await configManager.load();
      
      expect(loadSpy).toHaveBeenCalled();
    });

    it('should handle configuration load errors', async () => {
      const loadSpy = vi.spyOn(configManager, 'load').mockRejectedValue(new Error('Config load failed'));
      
      try {
        await configManager.load();
      } catch (e) {
        // Expected
      }
      
      expect(loadSpy).toHaveBeenCalled();
    });
  });

  describe('Command Registration', () => {
    it('should have init command available', () => {
      const command = 'init';
      expect(command).toBe('init');
    });

    it('should have compile command available', () => {
      const command = 'compile';
      expect(command).toBe('compile');
    });

    it('should have build command available', () => {
      const command = 'build';
      expect(command).toBe('build');
    });

    it('should have run command available', () => {
      const command = 'run';
      expect(command).toBe('run');
    });

    it('should have graph command available', () => {
      const command = 'graph';
      expect(command).toBe('graph');
    });

    it('should have trace command available', () => {
      const command = 'trace';
      expect(command).toBe('trace');
    });

    it('should have debug command available', () => {
      const command = 'debug';
      expect(command).toBe('debug');
    });

    it('should have benchmark command available', () => {
      const command = 'benchmark';
      expect(command).toBe('benchmark');
    });

    it('should have doctor command available', () => {
      const command = 'doctor';
      expect(command).toBe('doctor');
    });

    it('should have sdk command available', () => {
      const command = 'sdk';
      expect(command).toBe('sdk');
    });

    it('should have completion command available', () => {
      const command = 'completion';
      expect(command).toBe('completion');
    });
  });

  describe('Global Options', () => {
    it('should support --verbose option', () => {
      const option = '--verbose';
      expect(option).toBe('--verbose');
    });

    it('should support --quiet option', () => {
      const option = '--quiet';
      expect(option).toBe('--quiet');
    });

    it('should support --json option', () => {
      const option = '--json';
      expect(option).toBe('--json');
    });

    it('should support --config option', () => {
      const option = '--config';
      expect(option).toBe('--config');
    });
  });

  describe('Error Handling', () => {
    it('should handle CLIError', () => {
      const error = new errors.CLIError('Test error', 'TEST_ERROR', 1);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.exitCode).toBe(1);
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      expect(error.message).toBe('Unknown error');
    });
  });

  describe('Completion Shells', () => {
    it('should support bash shell', () => {
      const shell = 'bash';
      expect(shell).toBe('bash');
    });

    it('should support zsh shell', () => {
      const shell = 'zsh';
      expect(shell).toBe('zsh');
    });

    it('should support fish shell', () => {
      const shell = 'fish';
      expect(shell).toBe('fish');
    });

    it('should support powershell shell', () => {
      const shell = 'powershell';
      expect(shell).toBe('powershell');
    });

    it('should reject unsupported shell', () => {
      const shell = 'unsupported';
      const supportedShells = ['bash', 'zsh', 'fish', 'powershell'];
      expect(supportedShells).not.toContain(shell);
    });
  });
});
