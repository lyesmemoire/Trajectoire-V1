import { Bench } from 'tinybench';
import { CircuitBreakerService } from '../src/infrastructure/circuit-breaker/circuit-breaker.service';
import { TransactionService } from '../src/infrastructure/transactions/transaction.service';

const bench = new Bench({ time: 1000 });

const circuitBreakerService = new CircuitBreakerService();
const transactionService = new TransactionService();

// Circuit Breaker Benchmark
const testBreaker = circuitBreakerService.create(
  'benchmark-breaker',
  async () => {
    return 'success';
  },
  { timeout: 5000 },
);

bench.add('Circuit Breaker - Successful Call', async () => {
  await testBreaker.fire();
});

bench.add('Circuit Breaker - Get Status', async () => {
  circuitBreakerService.getStatus('benchmark-breaker');
});

bench.add('Circuit Breaker - Get All Statuses', async () => {
  circuitBreakerService.getAllStatuses();
});

// Transaction Benchmark
bench.add('Transaction - Acquire Lock', async () => {
  await transactionService.acquireLock('benchmark-lock', 30);
});

bench.add('Transaction - Release Lock', async () => {
  await transactionService.acquireLock('benchmark-lock', 30);
  await transactionService.releaseLock('benchmark-lock');
});

bench.add('Transaction - Extend Lock', async () => {
  await transactionService.acquireLock('benchmark-lock', 30);
  await transactionService.extendLock('benchmark-lock', 30);
  await transactionService.releaseLock('benchmark-lock');
});

// Run benchmarks
await bench.run();

console.table(bench.table());

// Save results
const results = bench.results();
console.log('\nBenchmark Results:');
results.forEach((result) => {
  console.log(`${result.name}:`);
  console.log(`  - Average: ${result.mean}ms`);
  console.log(`  - Min: ${result.min}ms`);
  console.log(`  - Max: ${result.max}ms`);
  console.log(`  - RPS: ${result.hz}`);
  console.log(`  - P95: ${result.p95}ms`);
});
