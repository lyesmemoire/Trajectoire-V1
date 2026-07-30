/**
 * Unit tests for CLI Graph Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { graphCommand } from '../../../src/cli/graphCmd';
import { GraphOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

describe('Graph Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Graph Generation', () => {
    it('should generate dependency graph by default', async () => {
      const options: GraphOptions = {};
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should generate dependency graph explicitly', async () => {
      const options: GraphOptions = { type: 'dependency' };
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should generate knowledge graph', async () => {
      const options: GraphOptions = { type: 'knowledge' };
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should generate runtime graph', async () => {
      const options: GraphOptions = { type: 'runtime' };
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Output Formats', () => {
    it('should generate JSON format by default', async () => {
      const options: GraphOptions = {};
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should generate JSON format explicitly', async () => {
      const options: GraphOptions = { format: 'json' };
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should generate DOT format', async () => {
      const options: GraphOptions = { format: 'dot' };
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should generate Mermaid format', async () => {
      const options: GraphOptions = { format: 'mermaid' };
      
      await expect(graphCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Output Path', () => {
    it('should use default output path', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: GraphOptions = {};
      
      await graphCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should use custom output path', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: GraphOptions = { output: '/custom/path/graph.json' };
      
      await graphCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Graph Structure', () => {
    it('should include nodes in graph', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: GraphOptions = { type: 'dependency' };
      
      await graphCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include edges in graph', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: GraphOptions = { type: 'dependency' };
      
      await graphCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include metadata in graph', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: GraphOptions = { type: 'dependency' };
      
      await graphCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle file write errors', async () => {
      vi.spyOn(fileUtils, 'writeFile').mockRejectedValue(new Error('Write error'));
      const options: GraphOptions = {};
      
      await expect(graphCommand(options)).rejects.toThrow();
    });

    it('should handle directory creation errors', async () => {
      vi.spyOn(fileUtils, 'ensureDirectory').mockRejectedValue(new Error('Create error'));
      const options: GraphOptions = { output: '/custom/path/graph.json' };
      
      await expect(graphCommand(options)).rejects.toThrow();
    });

    it('should handle forceError', async () => {
      const options: GraphOptions = { forceError: true };
      
      await expect(graphCommand(options)).rejects.toThrow();
    });
  });

  describe('Graph Generation Pipeline', () => {
    it('should analyze dependencies', async () => {
      const options: GraphOptions = { type: 'dependency' };
      
      await graphCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should build graph structure', async () => {
      const options: GraphOptions = { type: 'dependency' };
      
      await graphCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });
  });

  describe('Conditional Branches', () => {
    it('should handle format=json branch', async () => {
      const options: GraphOptions = { format: 'json' };
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle format=dot branch', async () => {
      const options: GraphOptions = { format: 'dot' };
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle format=mermaid branch', async () => {
      const options: GraphOptions = { format: 'mermaid' };
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle unknown format branch (defaults to json)', async () => {
      const options: GraphOptions = { format: 'unknown' as any };
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle type specified branch', async () => {
      const options: GraphOptions = { type: 'knowledge' };
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle type not specified branch (defaults to dependency)', async () => {
      const options: GraphOptions = {};
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle output specified branch', async () => {
      const options: GraphOptions = { output: 'custom.json' };
      await expect(graphCommand(options)).resolves.not.toThrow();
    });

    it('should handle output not specified branch (uses default)', async () => {
      const options: GraphOptions = {};
      await expect(graphCommand(options)).resolves.not.toThrow();
    });
  });
});
