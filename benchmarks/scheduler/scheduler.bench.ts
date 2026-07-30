import { bench, describe } from 'vitest';
import { Scheduler } from '../../compiler/cvm/scheduler';

describe('Scheduler Benchmarks', () => {
  bench('Scheduler - schedule task', () => {
    const scheduler = new Scheduler();
    scheduler.schedule({ id: 'task1', priority: 1 });
  });

  bench('Scheduler - schedule 100 tasks', () => {
    const scheduler = new Scheduler();
    for (let i = 0; i < 100; i++) {
      scheduler.schedule({ id: `task${i}`, priority: i % 10 });
    }
  });

  bench('Scheduler - execute task', () => {
    const scheduler = new Scheduler();
    scheduler.execute({ id: 'task1', priority: 1 });
  });

  bench('Scheduler - priority queue operations', () => {
    const scheduler = new Scheduler();
    for (let i = 0; i < 1000; i++) {
      scheduler.schedule({ id: `task${i}`, priority: i % 10 });
    }
    scheduler.getNextTask();
  });
});
