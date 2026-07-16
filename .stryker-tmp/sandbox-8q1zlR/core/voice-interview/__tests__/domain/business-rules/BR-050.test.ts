// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { InterviewSessionAggregate, type AggregateServices } from '../../../domain/aggregates/InterviewSessionAggregate.js';
import { VoiceTurn } from '../../../domain/entities/VoiceTurn.js';
import { SessionId, CandidateId, TurnId, Transcript, TurnTiming } from '../../../domain/types.js';
import { DuplicateTurnError } from '../../../domain/errors/DomainErrors.js';

describe('BR-050: Duplicate Turn Rejection', () => {
  const mockClock = { now: () => new Date('2025-01-01T10:00:00Z') };
  const mockIdGenerator = { generate: () => 'evt-123' };
  const services: AggregateServices = { clock: mockClock, idGenerator: mockIdGenerator };

  const createTurn = (idStr: string) => VoiceTurn.create({
    id: TurnId.create(idStr),
    transcript: Transcript.create('Hello'),
    intent: 'answer',
    evaluation: null,
    aiResponse: null,
    feedbackSignal: null,
    timing: TurnTiming.create(100, 1000)
  });

  it('should_reject_duplicate_turn()', () => {
    const session = InterviewSessionAggregate.createNew(SessionId.create('session-1'), CandidateId.create('candidate-1'));
    session.start('Backend Engineer', services);
    
    const turn1 = createTurn('turn-1');
    const turn2 = createTurn('turn-1'); // Exact same ID

    session.recordVoiceTurn(turn1, services);

    // BR-050: A turn with an already processed ID should be rejected to ensure idempotence
    expect(() => session.recordVoiceTurn(turn2, services)).toThrow(DuplicateTurnError);
  });
});
