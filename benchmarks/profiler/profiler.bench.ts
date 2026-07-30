import { bench, describe } from 'vitest';
import { DistributedProfiler } from '../../compiler/cpr/distributed-profiler';

describe('Profiler Benchmarks', () => {
  bench('Profiler - start and stop', () => {
    const profiler = new DistributedProfiler();
    profiler.start();
    profiler.stop();
  });

  bench('Profiler - record sample', () => {
    const profiler = new DistributedProfiler();
    profiler.recordSample('function1', 100);
  });

  bench('Profiler - record 1000 samples', () => {
    const profiler = new DistributedProfiler();
    for (let i = 0; i < 1000; i++) {
      profiler.recordSample(`function${i % 10}`, Math.random() * 100);
    }
  });

  bench('Profiler - generate report', () => {
    const profiler = new DistributedProfiler();
    for (let i = 0; i < 1000; i++) {
      profiler.recordSample(`function${i % 10}`, Math.random() * 100);
    }
    profiler.generateReport();
  });
});
