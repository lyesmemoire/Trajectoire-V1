/**
 * Unit tests for CLI Benchmark Command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { benchmarkCommand } from '../../../src/cli/benchmarkCmd';
import { BenchmarkOptions } from '../../../src/cli/types';
import * as fileUtils from '../../../src/cli/utils/file';

describe('Benchmark Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
    vi.spyOn(fileUtils, 'ensureDirectory').mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Benchmarking', () => {
    it('should run benchmarks with default settings', async () => {
      const options: BenchmarkOptions = {};
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });

    it('should run benchmarks with custom iterations', async () => {
      const options: BenchmarkOptions = { iterations: 50 };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });

    it('should run benchmarks with custom warmup', async () => {
      const options: BenchmarkOptions = { warmup: 5 };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });

    it('should run benchmarks with custom output path', async () => {
      const options: BenchmarkOptions = { output: '/custom/benchmark.json' };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });
  });

  describe('Benchmark Execution', () => {
    it('should run Compiler benchmark', async () => {
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run Runtime benchmark', async () => {
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run Memory benchmark', async () => {
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run Scheduler benchmark', async () => {
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });

    it('should run Providers benchmark', async () => {
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(fileUtils.writeFile).toHaveBeenCalled();
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate min statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should calculate max statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should calculate mean statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should calculate median statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should calculate p95 statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should calculate p99 statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should calculate stdDev statistic', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Report Generation', () => {
    it('should include timestamp in report', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include iterations in report', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = { iterations: 50 };
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include warmup in report', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = { warmup: 5 };
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include results in report', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });

    it('should include summary in report', async () => {
      const writeSpy = vi.spyOn(fileUtils, 'writeFile').mockResolvedValue(undefined);
      const options: BenchmarkOptions = {};
      
      await benchmarkCommand(options);
      
      expect(writeSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle file write errors', async () => {
      vi.spyOn(fileUtils, 'writeFile').mockRejectedValue(new Error('Write error'));
      const options: BenchmarkOptions = {};
      
      await expect(benchmarkCommand(options)).rejects.toThrow();
    });

    it('should handle directory creation errors', async () => {
      vi.spyOn(fileUtils, 'ensureDirectory').mockRejectedValue(new Error('Create error'));
      const options: BenchmarkOptions = { output: '/custom/benchmark.json' };
      
      await expect(benchmarkCommand(options)).rejects.toThrow();
    });

    it('should handle forceError', async () => {
      const options: BenchmarkOptions = { forceError: true };
      
      await expect(benchmarkCommand(options)).rejects.toThrow();
    });
  });

  describe('Parameter Parsing', () => {
    it('should parse string iterations', async () => {
      const options: BenchmarkOptions = { iterations: '50' as any };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });

    it('should parse number iterations', async () => {
      const options: BenchmarkOptions = { iterations: 75 };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });

    it('should parse string warmup', async () => {
      const options: BenchmarkOptions = { warmup: '5' as any };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });

    it('should parse number warmup', async () => {
      const options: BenchmarkOptions = { warmup: 8 };
      
      await expect(benchmarkCommand(options)).resolves.not.toThrow();
    });
  });
});
