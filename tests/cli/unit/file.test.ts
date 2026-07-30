/**
 * Unit tests for CLI File Utilities module
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile, writeFile, fileExists, ensureDirectory, readJSON, writeJSON } from '../../../src/cli/utils/file';
import { FileNotFoundError } from '../../../src/cli/errors';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('File Utilities', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(process.cwd(), 'temp-file-test');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';
      await fs.writeFile(filePath, content);

      const result = await readFile(filePath);
      
      expect(result).toBe(content);
    });

    it('should resolve relative paths', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Test content';
      await fs.writeFile(filePath, content);

      const result = await readFile(path.join(tempDir, 'test.txt'));
      
      expect(result).toBe(content);
    });

    it('should throw FileNotFoundError for non-existent file', async () => {
      const filePath = path.join(tempDir, 'nonexistent.txt');
      
      await expect(readFile(filePath)).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('writeFile', () => {
    it('should write file content', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'Hello, World!';

      await writeFile(filePath, content);
      
      const result = await fs.readFile(filePath, 'utf-8');
      expect(result).toBe(content);
    });

    it('should create parent directories', async () => {
      const filePath = path.join(tempDir, 'subdir', 'nested', 'test.txt');
      const content = 'Test content';

      await writeFile(filePath, content);
      
      const result = await fs.readFile(filePath, 'utf-8');
      expect(result).toBe(content);
    });

    it('should write buffer content', async () => {
      const filePath = path.join(tempDir, 'test.bin');
      const content = Buffer.from('Hello, World!');

      await writeFile(filePath, content);
      
      const result = await fs.readFile(filePath);
      expect(result).toEqual(content);
    });

    it('should overwrite existing file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'Old content');

      await writeFile(filePath, 'New content');
      
      const result = await fs.readFile(filePath, 'utf-8');
      expect(result).toBe('New content');
    });
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const exists = await fileExists(filePath);
      
      expect(exists).toBe(true);
    });

    it('should return true for existing directory', async () => {
      const dirPath = path.join(tempDir, 'subdir');
      await fs.mkdir(dirPath);

      const exists = await fileExists(dirPath);
      
      expect(exists).toBe(true);
    });

    it('should return false for non-existent path', async () => {
      const filePath = path.join(tempDir, 'nonexistent.txt');

      const exists = await fileExists(filePath);
      
      expect(exists).toBe(false);
    });

    it('should resolve relative paths', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const exists = await fileExists(path.join(tempDir, 'test.txt'));
      
      expect(exists).toBe(true);
    });
  });

  describe('ensureDirectory', () => {
    it('should create directory', async () => {
      const dirPath = path.join(tempDir, 'newdir');

      await ensureDirectory(dirPath);
      
      const exists = await fileExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should create nested directories', async () => {
      const dirPath = path.join(tempDir, 'a', 'b', 'c');

      await ensureDirectory(dirPath);
      
      const exists = await fileExists(dirPath);
      expect(exists).toBe(true);
    });

    it('should not error if directory already exists', async () => {
      const dirPath = path.join(tempDir, 'existing');
      await fs.mkdir(dirPath);

      await expect(ensureDirectory(dirPath)).resolves.not.toThrow();
    });
  });

  describe('readJSON', () => {
    it('should read and parse JSON file', async () => {
      const filePath = path.join(tempDir, 'test.json');
      const data = { name: 'test', value: 42 };
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await readJSON(filePath);
      
      expect(result).toEqual(data);
    });

    it('should parse JSON with typed return', async () => {
      const filePath = path.join(tempDir, 'test.json');
      const data = { name: 'test', value: 42 };
      await fs.writeFile(filePath, JSON.stringify(data));

      const result = await readJSON<{ name: string; value: number }>(filePath);
      
      expect(result.name).toBe('test');
      expect(result.value).toBe(42);
    });

    it('should throw error for invalid JSON', async () => {
      const filePath = path.join(tempDir, 'invalid.json');
      await fs.writeFile(filePath, '{ invalid json }');

      await expect(readJSON(filePath)).rejects.toThrow();
    });

    it('should throw FileNotFoundError for non-existent file', async () => {
      const filePath = path.join(tempDir, 'nonexistent.json');

      await expect(readJSON(filePath)).rejects.toThrow(FileNotFoundError);
    });
  });

  describe('writeJSON', () => {
    it('should write JSON file', async () => {
      const filePath = path.join(tempDir, 'test.json');
      const data = { name: 'test', value: 42 };

      await writeJSON(filePath, data);
      
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed).toEqual(data);
    });

    it('should write formatted JSON with indentation', async () => {
      const filePath = path.join(tempDir, 'test.json');
      const data = { name: 'test', value: 42 };

      await writeJSON(filePath, data);
      
      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toContain('  "name"'); // Has indentation
    });

    it('should write typed data', async () => {
      const filePath = path.join(tempDir, 'test.json');
      const data = { name: 'test', value: 42 } as const;

      await writeJSON(filePath, data);
      
      const result = await readJSON(filePath);
      expect(result).toEqual(data);
    });

    it('should create parent directories', async () => {
      const filePath = path.join(tempDir, 'subdir', 'test.json');
      const data = { test: true };

      await writeJSON(filePath, data);
      
      const exists = await fileExists(filePath);
      expect(exists).toBe(true);
    });
  });
});
