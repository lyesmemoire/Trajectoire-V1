import { bench, describe } from 'vitest';
import { DistributedTrace } from '../../compiler/cpr/distributed-trace';

describe('Trace Benchmarks', () => {
  bench('Trace - create span', () => {
    const trace = new DistributedTrace();
    trace.createSpan('operation');
  });

  bench('Trace - create 100 spans', () => {
    const trace = new DistributedTrace();
    for (let i = 0; i < 100; i++) {
      trace.createSpan(`operation${i}`);
    }
  });

  bench('Trace - add event', () => {
    const trace = new DistributedTrace();
    const span = trace.createSpan('operation');
    trace.addEvent(span, 'event1', { key: 'value' });
  });

  bench('Trace - serialize trace', () => {
    const trace = new DistributedTrace();
    for (let i = 0; i < 100; i++) {
      const span = trace.createSpan(`operation${i}`);
      trace.addEvent(span, `event${i}`, { key: 'value' });
    }
    trace.serialize();
  });
});
