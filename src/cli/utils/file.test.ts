import { describe, it, expect } from 'vitest';
import { readFile, writeFile, fileExists, ensureDirectory, readJSON, writeJSON } from './file';
import { promises as fs } from 'fs';
import path from 'path';

describe('file utils', () => {
  it('should read file', async () => {
    const content = await readFile('package.json');
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);
  });

  it('should write file', async () => {
    const testFile = path.join(process.cwd(), 'test-write.txt');
    await writeFile(testFile, 'test content');
    const exists = await fileExists(testFile);
    expect(exists).toBe(true);
    await fs.unlink(testFile);
  });

  it('should check file existence', async () => {
    const exists = await fileExists('package.json');
    expect(exists).toBe(true);
  });

  it('should ensure directory', async () => {
    const testDir = path.join(process.cwd(), 'test-dir');
    await ensureDirectory(testDir);
    const exists = await fs.access(testDir).then(() => true).catch(() => false);
    expect(exists).toBe(true);
    await fs.rmdir(testDir);
  });

  it('should read JSON', async () => {
    const json = await readJSON('package.json');
    expect(json).toBeDefined();
    expect(typeof json).toBe('object');
  });

  it('should write JSON', async () => {
    const testFile = path.join(process.cwd(), 'test-json.json');
    await writeJSON(testFile, { test: true });
    const json = await readJSON(testFile);
    expect(json).toEqual({ test: true });
    await fs.unlink(testFile);
  });
});
