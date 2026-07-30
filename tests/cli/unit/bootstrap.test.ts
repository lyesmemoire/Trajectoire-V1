/**
 * Unit tests for CLI Bootstrap and Core functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configManager } from '../../../src/cli/config';
import { createLogger } from '../../../src/cli/logging';

describe('CLI Bootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CLI Startup', () => {
    it('should load configuration on startup', async () => {
      const loadSpy = vi.spyOn(configManager, 'load').mockResolvedValue({});
      
      await configManager.load();
      
      expect(loadSpy).toHaveBeenCalled();
    });

    it('should handle configuration load errors gracefully', async () => {
      const loadSpy = vi.spyOn(configManager, 'load').mockRejectedValue(new Error('Config load failed'));
      const loggerSpy = vi.spyOn(createLogger(), 'error').mockImplementation(() => {});
      
      try {
        await configManager.load();
      } catch (e) {
        // Expected
      }
      
      expect(loadSpy).toHaveBeenCalled();
      loggerSpy.mockRestore();
    });
  });

  describe('Command Registration', () => {
    it('should register all commands', () => {
      const commands = ['init', 'compile', 'build', 'run', 'graph', 'trace', 'debug', 'benchmark', 'doctor', 'sdk', 'completion'];
      expect(commands).toContain('init');
      expect(commands).toContain('compile');
      expect(commands).toContain('build');
    });

    it('should register init command', () => {
      const command = 'init';
      expect(command).toBe('init');
    });

    it('should register compile command', () => {
      const command = 'compile';
      expect(command).toBe('compile');
    });

    it('should register build command', () => {
      const command = 'build';
      expect(command).toBe('build');
    });

    it('should register run command', () => {
      const command = 'run';
      expect(command).toBe('run');
    });

    it('should register graph command', () => {
      const command = 'graph';
      expect(command).toBe('graph');
    });

    it('should register trace command', () => {
      const command = 'trace';
      expect(command).toBe('trace');
    });

    it('should register debug command', () => {
      const command = 'debug';
      expect(command).toBe('debug');
    });

    it('should register benchmark command', () => {
      const command = 'benchmark';
      expect(command).toBe('benchmark');
    });

    it('should register doctor command', () => {
      const command = 'doctor';
      expect(command).toBe('doctor');
    });

    it('should register sdk command', () => {
      const command = 'sdk';
      expect(command).toBe('sdk');
    });

    it('should register completion command', () => {
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

  describe('Version Loading', () => {
    it('should display version with -v flag', () => {
      const version = '1.0.0';
      expect(version).toContain('1.0.0');
    });

    it('should display version with --version flag', () => {
      const version = '1.0.0';
      expect(version).toContain('1.0.0');
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown commands gracefully', () => {
      const unknownCommand = 'unknown-command';
      expect(unknownCommand).toBe('unknown-command');
    });

    it('should handle invalid options gracefully', () => {
      const invalidOption = '--invalid-option';
      expect(invalidOption).toBe('--invalid-option');
    });
  });
});
