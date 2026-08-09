/**
 * Unit tests for CLI Configuration module
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigManager } from '../../../src/cli/config/index';
import { ConfigError } from '../../../src/cli/errors';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ConfigManager', () => {
  let configManager: ConfigManager;
  let tempDir: string;

  beforeEach(async () => {
    configManager = new ConfigManager();
    tempDir = path.join(process.cwd(), 'temp-config-test');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('load', () => {
    it('should load JSON configuration file', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.json');
      const configContent = {
        name: 'test-project',
        version: '1.0.0',
        compiler: {
          target: 'cvm-v3',
          optimize: true,
        },
      };
      await fs.writeFile(configPath, JSON.stringify(configContent, null, 2));

      const config = await configManager.load(configPath);
      
      expect(config.name).toBe('test-project');
      expect(config.version).toBe('1.0.0');
      expect(config.compiler?.target).toBe('cvm-v3');
      expect(config.compiler?.optimize).toBe(true);
    });

    it('should load YAML configuration file', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.yaml');
      const configContent = `
name: test-project
version: 1.0.0
compiler:
  target: cvm-v3
  optimize: true
`;
      await fs.writeFile(configPath, configContent);

      const config = await configManager.load(configPath);
      
      expect(config.name).toBe('test-project');
      expect(config.version).toBe('1.0.0');
      expect(config.compiler?.target).toBe('cvm-v3');
      expect(config.compiler?.optimize).toBe(true);
    });

    it('should load .yml configuration file', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.yml');
      const configContent = `
name: test-project
compiler:
  target: cvm-v3
`;
      await fs.writeFile(configPath, configContent);

      const config = await configManager.load(configPath);
      
      expect(config.name).toBe('test-project');
      expect(config.compiler?.target).toBe('cvm-v3');
    });

    it('should throw error for TypeScript config', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.ts');
      await fs.writeFile(configPath, 'export default {}');

      await expect(configManager.load(configPath)).rejects.toThrow(ConfigError);
      await expect(configManager.load(configPath)).rejects.toThrow('TypeScript config not yet supported');
    });

    it('should load environment variables', async () => {
      process.env.BLUEPRINT_TARGET = 'cvm-v3';
      process.env.BLUEPRINT_OPTIMIZE = 'true';
      process.env.BLUEPRINT_OUTPUT_DIR = './dist';

      const config = await configManager.load();
      
      expect(config.compiler?.target).toBe('cvm-v3');
      expect(config.compiler?.optimize).toBe(true);
      expect(config.output?.directory).toBe('./dist');

      delete process.env.BLUEPRINT_TARGET;
      delete process.env.BLUEPRINT_OPTIMIZE;
      delete process.env.BLUEPRINT_OUTPUT_DIR;
    });

    it('should return empty config when no file found', async () => {
      const config = await configManager.load();
      
      expect(config).toEqual({});
    });

    it('should prioritize explicit config path over search', async () => {
      const configPath = path.join(tempDir, 'custom.config.json');
      const configContent = { name: 'custom' };
      await fs.writeFile(configPath, JSON.stringify(configContent));

      const config = await configManager.load(configPath);
      
      expect(config.name).toBe('custom');
    });
  });

  describe('findConfigFile', () => {
    it('should find blueprint.config.json', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.json');
      await fs.writeFile(configPath, '{}');
      
      // Change to temp directory so findConfigFile can find the config
      const originalCwd = process.cwd();
      process.chdir(tempDir);
      
      await configManager.load();
      
      expect(configManager['configPath']).toBeDefined();
      
      process.chdir(originalCwd);
    });

    it('should find .blueprintrc', async () => {
      const configPath = path.join(tempDir, '.blueprintrc');
      await fs.writeFile(configPath, '{}');
      
      const originalCwd = process.cwd();
      process.chdir(tempDir);
      
      await configManager.load();
      
      expect(configManager['configPath']).toBeDefined();
      
      process.chdir(originalCwd);
    });

    it('should return null when no config file exists', async () => {
      const emptyDir = path.join(tempDir, 'empty');
      await fs.mkdir(emptyDir, { recursive: true });
      
      const originalCwd = process.cwd();
      process.chdir(emptyDir);
      
      const config = await configManager.load();
      
      expect(config).toEqual({});
      
      process.chdir(originalCwd);
    });
  });

  describe('get', () => {
    it('should return value for existing key', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.json');
      await fs.writeFile(configPath, JSON.stringify({ name: 'test' }));

      await configManager.load(configPath);
      
      expect(configManager.get('name')).toBe('test');
    });

    it('should return undefined for non-existent key', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.json');
      await fs.writeFile(configPath, JSON.stringify({}));

      await configManager.load(configPath);
      
      expect(configManager.get('name')).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set value for key', async () => {
      configManager.set('name', 'test');
      
      expect(configManager.get('name')).toBe('test');
    });

    it('should overwrite existing value', async () => {
      configManager.set('name', 'test1');
      configManager.set('name', 'test2');
      
      expect(configManager.get('name')).toBe('test2');
    });
  });

  describe('getAll', () => {
    it('should return copy of config', async () => {
      const configPath = path.join(tempDir, 'blueprint.config.json');
      await fs.writeFile(configPath, JSON.stringify({ name: 'test' }));

      await configManager.load(configPath);
      const all = configManager.getAll();
      
      expect(all.name).toBe('test');
      
      // Verify it's a copy
      all.name = 'modified';
      expect(configManager.get('name')).toBe('test');
    });

    it('should return empty object when no config loaded', () => {
      const all = configManager.getAll();
      
      expect(all).toEqual({});
    });
  });

  describe('loadEnvVars', () => {
    it('should load BLUEPRINT_TARGET env var', () => {
      process.env.BLUEPRINT_TARGET = 'cvm-v3';
      
      configManager['loadEnvVars']();
      
      expect(configManager['config'].compiler?.target).toBe('cvm-v3');
      delete process.env.BLUEPRINT_TARGET;
    });

    it('should load BLUEPRINT_OPTIMIZE env var as boolean', () => {
      process.env.BLUEPRINT_OPTIMIZE = 'true';
      
      configManager['loadEnvVars']();
      
      expect(configManager['config'].compiler?.optimize).toBe(true);
      delete process.env.BLUEPRINT_OPTIMIZE;
    });

    it('should handle false for BLUEPRINT_OPTIMIZE', () => {
      process.env.BLUEPRINT_OPTIMIZE = 'false';
      
      configManager['loadEnvVars']();
      
      expect(configManager['config'].compiler?.optimize).toBe(false);
      delete process.env.BLUEPRINT_OPTIMIZE;
    });

    it('should load BLUEPRINT_OUTPUT_DIR env var', () => {
      process.env.BLUEPRINT_OUTPUT_DIR = './dist';
      
      configManager['loadEnvVars']();
      
      expect(configManager['config'].output?.directory).toBe('./dist');
      delete process.env.BLUEPRINT_OUTPUT_DIR;
    });
  });
});
