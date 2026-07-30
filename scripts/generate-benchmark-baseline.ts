/**
 * Benchmark Baseline Generator
 * Creates baseline for benchmark comparison
 */

import { execa } from 'execa';
import * as fs from 'fs/promises';
import * as path from 'path';

interface BenchmarkData {
  timestamp: string;
  iterations: number;
  warmup: number;
  results: Array<{
    name: string;
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
      confidenceInterval95: {
        lower: number;
        upper: number;
      };
    };
  }>;
}

async function generateBaseline() {
  const benchmarksDir = path.join(process.cwd(), 'reports', 'cli', 'benchmarks');
  await fs.mkdir(benchmarksDir, { recursive: true });
  
  const tempDir = path.join(process.cwd(), 'temp-benchmark');
  await fs.mkdir(tempDir, { recursive: true });
  
  console.log('Generating benchmark baseline with 20 iterations...');
  
  const result = await execa('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '20', '--output', path.join(tempDir, 'baseline.json')], {
    cwd: process.cwd(),
  });
  
  if (result.exitCode === 0) {
    const baselinePath = path.join(tempDir, 'baseline.json');
    const baselineContent = await fs.readFile(baselinePath, 'utf-8');
    const baselineData = JSON.parse(baselineContent) as BenchmarkData;
    
    // Add confidence intervals to baseline data
    baselineData.results.forEach(result => {
      if (result.samples && result.statistics) {
        const n = result.samples.length;
        const stdDev = result.statistics.stdDev;
        const mean = result.statistics.mean;
        const marginOfError = 1.96 * (stdDev / Math.sqrt(n));
        result.statistics.confidenceInterval95 = {
          lower: mean - marginOfError,
          upper: mean + marginOfError,
        };
      }
    });
    
    // Save as baseline
    const baselineDest = path.join(benchmarksDir, 'baseline.json');
    await fs.writeFile(baselineDest, JSON.stringify(baselineData, null, 2));
    
    console.log('Baseline generated successfully');
    console.log(`Benchmarks: ${baselineData.results.length}`);
    console.log(`Iterations: ${baselineData.iterations}`);
    
    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true });
    
    return baselineData;
  } else {
    throw new Error('Benchmark generation failed');
  }
}

async function compareWithBaseline(current: BenchmarkData, baseline: BenchmarkData) {
  const comparison = {
    timestamp: new Date().toISOString(),
    baselineTimestamp: baseline.timestamp,
    currentTimestamp: current.timestamp,
    comparisons: current.results.map((curr, i) => {
      const base = baseline.results[i];
      if (!base) {
        return {
          name: curr.name,
          status: 'NO_BASELINE',
        };
      }
      
      const variation = ((curr.avgMs - base.avgMs) / base.avgMs) * 100;
      // Negative variation = faster = PASS
      // Positive variation thresholds:
      //   < 5% = PASS (acceptable variance)
      //   5-10% = WARNING (monitor)
      //   > 10% = REGRESSION (investigate)
      let status: string;
      if (variation < 0) {
        status = 'PASS';
      } else if (variation <= 5) {
        status = 'PASS';
      } else if (variation <= 10) {
        status = 'WARNING';
      } else {
        status = 'REGRESSION';
      }
      
      return {
        name: curr.name,
        current: {
          avgMs: curr.avgMs,
          opsPerSec: curr.opsPerSec,
          ciLower: curr.statistics.confidenceInterval95?.lower,
          ciUpper: curr.statistics.confidenceInterval95?.upper,
        },
        baseline: {
          avgMs: base.avgMs,
          opsPerSec: base.opsPerSec,
          ciLower: base.statistics.confidenceInterval95?.lower,
          ciUpper: base.statistics.confidenceInterval95?.upper,
        },
        variation: variation.toFixed(2) + '%',
        status,
        overlap: curr.statistics.confidenceInterval95 && base.statistics.confidenceInterval95 ?
          !(curr.statistics.confidenceInterval95.upper < base.statistics.confidenceInterval95.lower ||
            curr.statistics.confidenceInterval95.lower > base.statistics.confidenceInterval95.upper) :
          undefined,
      };
    }),
    summary: {
      total: current.results.length,
      passed: 0,
      warning: 0,
      regression: 0,
      noBaseline: 0,
    },
  };
  
  comparison.summary.passed = comparison.comparisons.filter(c => c.status === 'PASS').length;
  comparison.summary.warning = comparison.comparisons.filter(c => c.status === 'WARNING').length;
  comparison.summary.regression = comparison.comparisons.filter(c => c.status === 'REGRESSION').length;
  comparison.summary.noBaseline = comparison.comparisons.filter(c => c.status === 'NO_BASELINE').length;
  
  return comparison;
}

async function main() {
  const benchmarksDir = path.join(process.cwd(), 'reports', 'cli', 'benchmarks');
  
  // Generate current benchmark with 20 iterations
  const tempDir = path.join(process.cwd(), 'temp-benchmark-current');
  await fs.mkdir(tempDir, { recursive: true });
  
  console.log('Generating current benchmark with 20 iterations...');
  const result = await execa('npx', ['tsx', 'bin/blueprint', 'benchmark', '--iterations', '20', '--output', path.join(tempDir, 'current.json')], {
    cwd: process.cwd(),
  });
  
  const currentPath = path.join(tempDir, 'current.json');
  const currentContent = await fs.readFile(currentPath, 'utf-8');
  const currentData = JSON.parse(currentContent) as BenchmarkData;
  
  // Add confidence intervals to current data
  currentData.results.forEach(result => {
    if (result.samples && result.statistics) {
      const n = result.samples.length;
      const stdDev = result.statistics.stdDev;
      const mean = result.statistics.mean;
      const marginOfError = 1.96 * (stdDev / Math.sqrt(n));
      result.statistics.confidenceInterval95 = {
        lower: mean - marginOfError,
        upper: mean + marginOfError,
      };
    }
  });
  
  const currentDest = path.join(benchmarksDir, 'current.json');
  await fs.writeFile(currentDest, JSON.stringify(currentData, null, 2));
  
  // Cleanup
  await fs.rm(tempDir, { recursive: true, force: true });
  
  // Check if baseline exists
  const baselinePath = path.join(benchmarksDir, 'baseline.json');
  let baselineData: BenchmarkData | null = null;
  
  try {
    const baselineContent = await fs.readFile(baselinePath, 'utf-8');
    baselineData = JSON.parse(baselineContent) as BenchmarkData;
  } catch {
    // No baseline exists, create one
    console.log('No baseline found, creating baseline...');
    baselineData = await generateBaseline();
  }
  
  // Compare
  if (baselineData) {
    console.log('Comparing with baseline...');
    const comparison = await compareWithBaseline(currentData, baselineData);
    
    const comparisonPath = path.join(benchmarksDir, 'comparison.json');
    await fs.writeFile(comparisonPath, JSON.stringify(comparison, null, 2));
    
    console.log('\n=== Benchmark Comparison (20 iterations, 95% confidence) ===');
    comparison.comparisons.forEach((comp: any) => {
      console.log(`${comp.name}:`);
      console.log(`  Current: ${comp.current.avgMs.toFixed(2)}ms (95% CI: [${comp.current.ciLower?.toFixed(2)}, ${comp.current.ciUpper?.toFixed(2)}])`);
      console.log(`  Baseline: ${comp.baseline.avgMs.toFixed(2)}ms (95% CI: [${comp.baseline.ciLower?.toFixed(2)}, ${comp.baseline.ciUpper?.toFixed(2)}])`);
      console.log(`  Variation: ${comp.variation}`);
      console.log(`  Status: ${comp.status}`);
      if (comp.overlap) {
        console.log(`  Confidence Intervals: OVERLAP (likely statistical noise)`);
      } else {
        console.log(`  Confidence Intervals: NO OVERLAP (likely real difference)`);
      }
    });
    
    console.log(`\nSummary: ${comparison.summary.passed} PASS, ${comparison.summary.warning} WARNING, ${comparison.summary.regression} REGRESSION, ${comparison.summary.noBaseline} NO_BASELINE`);
  }
}

main().catch(console.error);
