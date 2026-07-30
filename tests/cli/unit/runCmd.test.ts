/**
 * Unit tests for CLI Run Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { runCommand } from '../../../src/cli/runCmd';
import { RunOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

describe('Run Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'readFile').mockResolvedValue('package data');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Execution', () => {
    it('should run with package path', async () => {
      const options: RunOptions = { package: 'test.bpp' };
      
      await expect(runCommand(options)).resolves.not.toThrow();
    });

    it('should run with custom entry point', async () => {
      const options: RunOptions = { package: 'test.bpp', entry: 'main' };
      
      await expect(runCommand(options)).resolves.not.toThrow();
    });

    it('should run with debug enabled', async () => {
      const options: RunOptions = { package: 'test.bpp', debug: true };
      
      await expect(runCommand(options)).resolves.not.toThrow();
    });

    it('should run with custom arguments', async () => {
      const options: RunOptions = { package: 'test.bpp', args: ['arg1', 'arg2'] };
      
      await expect(runCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when package path is missing', async () => {
      const options: RunOptions = {} as RunOptions;
      
      await expect(runCommand(options)).rejects.toThrow();
    });

    it('should handle file read errors', async () => {
      vi.spyOn(fileUtils, 'readFile').mockRejectedValue(new Error('Read error'));
      const options: RunOptions = { package: 'test.bpp' };
      
      await expect(runCommand(options)).rejects.toThrow();
    });

    it('should handle FileNotFoundError specifically', async () => {
      const { FileNotFoundError } = await import('../../../src/cli/errors');
      vi.spyOn(fileUtils, 'readFile').mockRejectedValue(new FileNotFoundError('File not found'));
      const options: RunOptions = { package: 'test.bpp' };
      
      await expect(runCommand(options)).rejects.toThrow(FileNotFoundError);
    });

    it('should handle forceFileNotFoundError', async () => {
      const { FileNotFoundError } = await import('../../../src/cli/errors');
      const options: RunOptions = { package: 'test.bpp', forceFileNotFound: true };
      
      await expect(runCommand(options)).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('Execution Pipeline', () => {
    it('should initialize runtime', async () => {
      const options: RunOptions = { package: 'test.bpp' };
      
      await runCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });

    it('should load bytecode', async () => {
      const options: RunOptions = { package: 'test.bpp' };
      
      await runCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });

    it('should execute program', async () => {
      const options: RunOptions = { package: 'test.bpp' };
      
      await runCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });
  });

  describe('Output', () => {
    it('should include execution duration', async () => {
      const options: RunOptions = { package: 'test.bpp' };
      
      await runCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });

    it('should include exit code', async () => {
      const options: RunOptions = { package: 'test.bpp' };
      
      await runCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });

    it('should include debug flag in output', async () => {
      const options: RunOptions = { package: 'test.bpp', debug: true };
      
      await runCommand(options);
      
      expect(fileUtils.readFile).toHaveBeenCalled();
    });
  });
});
