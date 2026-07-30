/**
 * CLI Graph Command Tests
 * Automated tests for the graph command
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('blueprint graph', () => {
  let outputFile: string;

  beforeEach(() => {
    outputFile = path.join(process.cwd(), 'test-graph.json');
  });

  afterEach(async () => {
    try {
      await fs.unlink(outputFile);
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should generate dependency graph in JSON format', async () => {
    const result = await execa('npx', ['tsx', 'bin/blueprint', 'graph', '--type', 'dependency', '--format', 'json', '--output', outputFile], {
      cwd: process.cwd(),
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Generating dependency graph');
    expect(result.stdout).toContain('Graph generated');

    // Verify output file exists and is valid JSON
    const graph = JSON.parse(await fs.readFile(outputFile, 'utf-8'));
    expect(graph).toHaveProperty('type');
    expect(graph).toHaveProperty('format');
    expect(graph).toHaveProperty('nodes');
    expect(graph).toHaveProperty('edges');
    expect(Array.isArray(graph.nodes)).toBe(true);
    expect(Array.isArray(graph.edges)).toBe(true);
  });

  it('should generate graph in DOT format', async () => {
    const dotFile = path.join(process.cwd(), 'test-graph.dot');
    
    try {
      const result = await execa('npx', ['tsx', 'bin/blueprint', 'graph', '--type', 'dependency', '--format', 'dot', '--output', dotFile], {
        cwd: process.cwd(),
      });

      expect(result.exitCode).toBe(0);

      const dotContent = await fs.readFile(dotFile, 'utf-8');
      expect(dotContent).toContain('digraph');
    } finally {
      try {
        await fs.unlink(dotFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });

  it('should generate graph in Mermaid format', async () => {
    const mmdFile = path.join(process.cwd(), 'test-graph.mmd');
    
    try {
      const result = await execa('npx', ['tsx', 'bin/blueprint', 'graph', '--type', 'dependency', '--format', 'mermaid', '--output', mmdFile], {
        cwd: process.cwd(),
      });

      expect(result.exitCode).toBe(0);

      const mmdContent = await fs.readFile(mmdFile, 'utf-8');
      expect(mmdContent).toContain('graph TD');
    } finally {
      try {
        await fs.unlink(mmdFile);
      } catch {
        // Ignore cleanup errors
      }
    }
  });
});
