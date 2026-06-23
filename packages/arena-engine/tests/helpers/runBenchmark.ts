export async function runBenchmark(
  name: string,
  fn: () => Promise<void> | void,
  iterations = 10000
) {
  // Run once to warmup JIT
  await fn();

  const startMem = process.memoryUsage().heapUsed;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    await fn();
  }

  const end = performance.now();
  const endMem = process.memoryUsage().heapUsed;

  const totalMs = end - start;
  const avgMs = totalMs / iterations;
  const opsPerSec = 1000 / avgMs;

  return {
    name,
    iterations,
    totalMs,
    avgMs,
    opsPerSec,
    heapDeltaKb: (endMem - startMem) / 1024,
  };
}
