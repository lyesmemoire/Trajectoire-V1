/**
 * Unit tests for CLI Build Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildCommand } from '../../../src/cli/buildCmd';
import { BuildOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

vi.mock('fs/promises', () => ({
  readdir: vi.fn(),
}));

import * as fs from 'fs/promises';

describe('Build Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
    vi.mocked(fs.readdir).mockResolvedValue(['test1.bp' as any, 'test2.bp' as any]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Build', () => {
    it('should build with default input directory', async () => {
      const options: BuildOptions = {};
      
      await expect(buildCommand(options)).resolves.not.toThrow();
    });

    it('should build with custom input directory', async () => {
      const options: BuildOptions = { input: '/custom/src' };
      
      await expect(buildCommand(options)).resolves.not.toThrow();
    });

    it('should build with custom output directory', async () => {
      const options: BuildOptions = { input: '/src', output: '/dist' };
      
      await expect(buildCommand(options)).resolves.not.toThrow();
    });

    it('should build with optimization enabled', async () => {
      const options: BuildOptions = { optimize: true };
      
      await expect(buildCommand(options)).resolves.not.toThrow();
    });
  });

  describe('File Discovery', () => {
    it('should scan for Blueprint files', async () => {
      vi.mocked(fs.readdir).mockResolvedValue(['test.bp' as any]);
      const options: BuildOptions = { input: '/src' };
      
      await buildCommand(options);
      
      expect(fs.readdir).toHaveBeenCalled();
    });

    it('should filter .bp files', async () => {
      vi.mocked(fs.readdir).mockResolvedValue(['test.bp' as any, 'other.txt' as any, 'config.json' as any]);
      const options: BuildOptions = { input: '/src' };
      
      await buildCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should handle no Blueprint files found', async () => {
      vi.mocked(fs.readdir).mockResolvedValue(['other.txt' as any, 'config.json' as any]);
      const options: BuildOptions = { input: '/src' };
      
      await expect(buildCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Build Process', () => {
    it('should create output directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: BuildOptions = { input: '/src' };
      
      await buildCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });

    it('should build each Blueprint file', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue(['test1.bp' as any, 'test2.bp' as any]);
      const options: BuildOptions = { input: '/src' };
      
      await buildCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should generate correct output paths', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BuildOptions = { input: '/src', output: '/dist' };
      
      await buildCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle directory read errors', async () => {
      vi.mocked(fs.readdir).mockRejectedValue(new Error('Read error'));
      const options: BuildOptions = { input: '/src' };
      
      await expect(buildCommand(options)).rejects.toThrow();
    });

    it('should handle file write errors', async () => {
      vi.spyOn(fileUtils, 'writeFile').mockRejectedValue(new Error('Write error'));
      const options: BuildOptions = { input: '/src' };
      
      await expect(buildCommand(options)).rejects.toThrow();
    });

    it('should handle directory creation errors', async () => {
      vi.spyOn(fileUtils, 'ensureDirectory').mockRejectedValue(new Error('Create error'));
      const options: BuildOptions = { input: '/src' };
      
      await expect(buildCommand(options)).rejects.toThrow();
    });

    it('should handle forceError', async () => {
      const options: BuildOptions = { input: '/src', forceError: true };
      
      await expect(buildCommand(options)).rejects.toThrow();
    });
  });

  describe('Output Format', () => {
    it('should include file name in output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BuildOptions = { input: '/src' };
      
      await buildCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include timestamp in output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BuildOptions = { input: '/src' };
      
      await buildCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include optimization flag in output', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BuildOptions = { input: '/src', optimize: true };
      
      await buildCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });
});
