// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { InterviewSessionAggregate, type AggregateServices } from '../../../domain/aggregates/InterviewSessionAggregate.js';
import { SessionId, CandidateId } from '../../../domain/types.js';

describe('BR-001: Start Interview', () => {
  const mockClock = { now: () => new Date('2025-01-01T10:00:00Z') };
  const mockIdGenerator = { generate: () => 'evt-123' };
  const services: AggregateServices = { clock: mockClock, idGenerator: mockIdGenerator };

  it('should_start_in_opening_phase()', () => {
    const sessionId = SessionId.create('session-1');
    const candidateId = CandidateId.create('candidate-1');
    
    const session = InterviewSessionAggregate.createNew(sessionId, candidateId);
    
    // Initial state
    expect(session.phase).toBe('opening');
    expect(session.status).toBe('not-started');
    expect(session.version).toBe(0);

    // Start
    session.start('Backend Engineer', services);

    // Final state
    expect(session.status).toBe('in-progress');
    expect(session.phase).toBe('opening'); // Still opening
    expect(session.version).toBe(1);

    const events = session.pullDomainEvents();
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('InterviewSessionStarted');
    expect(events[0].eventId).toBe('evt-123');
    expect(events[0].version).toBe(1);
  });

  it('should throw an error if already started', () => {
    const session = InterviewSessionAggregate.createNew(SessionId.create('s1'), CandidateId.create('c1'));
    session.start('Role', services);
    
    expect(() => session.start('Role', services)).toThrow('Already started');
  });
});
