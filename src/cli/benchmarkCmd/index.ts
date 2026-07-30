/**
 * Benchmark Command
 * Run all benchmarks
 */

import * as path from 'path';
import { BenchmarkOptions } from '../types';
import { getLogger } from '../logging';
import { CommandError } from '../errors';
import { writeFile, ensureDirectory } from '../utils/file';

const logger = getLogger();

interface BenchmarkResult {
  name: string;
  iterations: number;
  duration: number;
  avgMs: number;
  opsPerSec: number;
  samples: number[];
  statistics: {
    min: number;
    max: number;
    mean: number;
    median: number;
    p95: number;
    p99: number;
    stdDev: number;
  };
}

function calculateStatistics(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  
  const min = sorted[0];
  const max = sorted[n - 1];
  const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];
  
  const p95Index = Math.floor(n * 0.95);
  const p99Index = Math.floor(n * 0.99);
  const p95 = sorted[p95Index];
  const p99 = sorted[p99Index];
  
  const variance = sorted.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  return { min, max, mean, median, p95, p99, stdDev };
}

export async function benchmarkCommand(options: BenchmarkOptions): Promise<void> {
  const startTime = Date.now();
  
  try {
    const iterations = options.iterations ? parseInt(String(options.iterations)) : 100;
    const warmup = options.warmup ? parseInt(String(options.warmup)) : 10;
    const outputPath = options.output || 'benchmark-report.json';
    
    logger.info(`Running benchmarks...`);
    logger.info(`Iterations: ${iterations}`);
    logger.info(`Warmup: ${warmup}`);
    
    // Allow forcing an error for testing
    if (options.forceError) {
      throw new Error('Forced error for testing');
    }
    
    // Simulate benchmarks
    const benchmarks = [
      { name: 'Compiler', baseDuration: 50 },
      { name: 'Runtime', baseDuration: 30 },
      { name: 'Memory', baseDuration: 20 },
      { name: 'Scheduler', baseDuration: 40 },
      { name: 'Providers', baseDuration: 60 },
    ];
    
    const results: BenchmarkResult[] = [];
    
    for (const benchmark of benchmarks) {
      logger.info(`Running ${benchmark.name} benchmark...`);
      
      // Warmup
      for (let i = 0; i < warmup; i++) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      // Actual benchmark with samples
      const samples: number[] = [];
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        // Simulate work with some variance
        const variance = (Math.random() - 0.5) * benchmark.baseDuration * 0.2;
        await new Promise(resolve => setTimeout(resolve, (benchmark.baseDuration + variance) / iterations));
        const duration = Date.now() - start;
        samples.push(duration);
      }
      
      const totalDuration = samples.reduce((sum, s) => sum + s, 0);
      const avgDuration = totalDuration / iterations;
      const statistics = calculateStatistics(samples);
      
      results.push({
        name: benchmark.name,
        iterations,
        duration: totalDuration,
        avgMs: avgDuration,
        opsPerSec: (iterations / totalDuration) * 1000,
        samples,
        statistics,
      });
      
      logger.success(`${benchmark.name}: ${totalDuration}ms (${(iterations / totalDuration * 1000).toFixed(2)} ops/sec)`);
      logger.info(`  Statistics: min=${statistics.min.toFixed(2)}ms, max=${statistics.max.toFixed(2)}ms, mean=${statistics.mean.toFixed(2)}ms, p95=${statistics.p95.toFixed(2)}ms`);
    }
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      iterations,
      warmup,
      results,
      summary: {
        totalDuration: Date.now() - startTime,
        avgDuration: results.reduce((sum, r) => sum + r.duration, 0) / results.length,
        totalOpsPerSec: results.reduce((sum, r) => sum + r.opsPerSec, 0),
      },
    };
    
    // Write output
    await ensureDirectory(path.dirname(outputPath));
    await writeFile(outputPath, JSON.stringify(report, null, 2));
    
    logger.success(`Benchmarks completed in ${Date.now() - startTime}ms`);
    logger.info(`Report: ${outputPath}`);
    
  } catch (error) {
    logger.failure('Benchmarking failed');
    throw new CommandError(error instanceof Error ? error.message : 'Unknown benchmark error');
  }
}

