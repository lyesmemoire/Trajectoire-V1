/**
 * File Utilities
 * File system operations for CLI
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { FileNotFoundError } from '../errors';

export async function readFile(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(filePath);
    return await fs.readFile(absolutePath, 'utf-8');
  } catch (error) {
    throw new FileNotFoundError(filePath);
  }
}

export async function writeFile(filePath: string, content: string | Buffer): Promise<void> {
  const absolutePath = path.resolve(filePath);
  const dir = path.dirname(absolutePath);
  
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(absolutePath, content);
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(path.resolve(filePath));
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(dirPath: string): Promise<void> {
  const absolutePath = path.resolve(dirPath);
  await fs.mkdir(absolutePath, { recursive: true });
}

export async function readJSON<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath);
  return JSON.parse(content) as T;
}

export async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await writeFile(filePath, content);
}
