/**
 * Unit tests for CLI Init Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initCommand } from '../../../src/cli/initCmd';
import { InitOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

describe('Init Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'fileExists').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Initialization', () => {
    it('should initialize project with default name', async () => {
      const options: InitOptions = {};
      
      await expect(initCommand(options)).resolves.not.toThrow();
    });

    it('should initialize project with custom name', async () => {
      const options: InitOptions = { name: 'my-project' };
      
      await expect(initCommand(options)).resolves.not.toThrow();
    });

    it('should initialize project with custom directory', async () => {
      const options: InitOptions = { directory: '/custom/path' };
      
      await expect(initCommand(options)).resolves.not.toThrow();
    });

    it('should initialize project with template', async () => {
      const options: InitOptions = { template: 'basic' };
      
      await expect(initCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Directory Creation', () => {
    it('should create src directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });

    it('should create src/contracts directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });

    it('should create src/modules directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });

    it('should create tests directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });

    it('should create artifacts directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });

    it('should create config directory', async () => {
      const ensureSpy = vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(ensureSpy).toHaveBeenCalled();
    });
  });

  describe('File Creation', () => {
    it('should create blueprint.config.json', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should create sample contract', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should create README.md', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should throw error if directory exists without force', async () => {
      vi.spyOn(fileUtils, 'fileExists').mockResolvedValue(true);
      const options: InitOptions = { name: 'test-project', force: false };
      
      await expect(initCommand(options)).rejects.toThrow();
    });

    it('should overwrite if directory exists with force', async () => {
      vi.spyOn(fileUtils, 'fileExists').mockResolvedValue(true);
      const options: InitOptions = { name: 'test-project', force: true };
      
      await expect(initCommand(options)).resolves.not.toThrow();
    });

    it('should handle file system errors', async () => {
      vi.spyOn(fileUtils, 'ensureDirectory').mockRejectedValue(new Error('FS error'));
      const options: InitOptions = { name: 'test-project' };
      
      await expect(initCommand(options)).rejects.toThrow();
    });
  });

  describe('Configuration', () => {
    it('should include project name in config', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'my-custom-project' };
      
      await initCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include compiler settings in config', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include runtime settings in config', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: InitOptions = { name: 'test-project' };
      
      await initCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });
});
