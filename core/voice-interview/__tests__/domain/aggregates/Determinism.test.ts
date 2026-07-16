import { describe, it, expect } from 'vitest';
import { InterviewSessionAggregate, type AggregateServices } from '../../../domain/aggregates/InterviewSessionAggregate.js';
import { SessionId, CandidateId } from '../../../domain/types.js';

describe('InterviewSessionAggregate - Determinism & Lifecycle', () => {
  it('should generate completely deterministic events across identical executions', () => {
    let idCounter = 1;
    const fakeServices: AggregateServices = {
      clock: { now: () => new Date('2026-07-11T20:00:00Z') },
      idGenerator: { generate: () => `deterministic-id-${idCounter++}` }
    };

    const runScenario = (services: AggregateServices) => {
      const session = InterviewSessionAggregate.createNew(SessionId.create('s1'), CandidateId.create('c1'));
      session.start('Role', services);
      session.pause(services);
      session.resume(services);
      session.complete(services);
      return session.pullDomainEvents();
    };

    // First run
    idCounter = 1;
    const events1 = runScenario(fakeServices);

    // Second run
    idCounter = 1;
    const events2 = runScenario(fakeServices);

    // Both arrays must be strictly equal by value (JSON)
    expect(JSON.parse(JSON.stringify(events1))).toEqual(JSON.parse(JSON.stringify(events2)));
  });

  it('should increment aggregate version sequentially', () => {
    let idCounter = 1;
    const fakeServices: AggregateServices = {
      clock: { now: () => new Date() },
      idGenerator: { generate: () => `id-${idCounter++}` }
    };

    const session = InterviewSessionAggregate.createNew(SessionId.create('s1'), CandidateId.create('c1'));
    expect(session.version).toBe(0);

    session.start('Role', fakeServices);
    expect(session.version).toBe(1);

    session.pause(fakeServices);
    expect(session.version).toBe(2);

    const events = session.pullDomainEvents();
    expect(events[0].version).toBe(1);
    expect(events[1].version).toBe(2);
  });
});
