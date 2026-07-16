import { describe, it, expect } from 'vitest';
import { InterviewSessionAggregate, type AggregateServices } from '../../../domain/aggregates/InterviewSessionAggregate.js';
import { VoiceTurn } from '../../../domain/entities/VoiceTurn.js';
import { SessionId, CandidateId, TurnId, Transcript, TurnTiming } from '../../../domain/types.js';
import { AggregateSerializer } from '../../../infrastructure/serialization/AggregateSerializer.js';
import { AggregateDeserializer } from '../../../infrastructure/serialization/AggregateDeserializer.js';

describe('Replay & Serialization', () => {
  let idCounter = 1;
  const mockClock = { now: () => new Date('2026-07-11T20:00:00Z') };
  const mockIdGenerator = { generate: () => `evt-${idCounter++}` };
  const services: AggregateServices = { clock: mockClock, idGenerator: mockIdGenerator };

  it('should serialize and deserialize an aggregate symmetrically', () => {
    idCounter = 1;
    // 1. Create original aggregate
    const original = InterviewSessionAggregate.createNew(SessionId.create('session-x'), CandidateId.create('c-1'));
    original.start('Developer', services);
    
    // Add 100 turns
    for (let i = 0; i < 100; i++) {
      const turn = VoiceTurn.create({
        id: TurnId.create(`t-${i}`),
        transcript: Transcript.create(`Answer ${i}`),
        intent: 'answer',
        evaluation: null,
        aiResponse: null,
        feedbackSignal: null,
        timing: TurnTiming.create(100, 500)
      });
      original.recordVoiceTurn(turn, services);
    }
    
    original.pause(services);

    // 2. Serialize
    const serialized = AggregateSerializer.serialize(original, original.version);
    const jsonStr = JSON.stringify(serialized);

    // 3. Deserialize
    const parsed = JSON.parse(jsonStr);
    const reconstituted = AggregateDeserializer.deserialize(parsed);

    // 4. Verify Identity
    expect(reconstituted.id).toBe(original.id);
    expect(reconstituted.phase).toBe(original.phase);
    expect(reconstituted.status).toBe(original.status);
    expect(reconstituted.version).toBe(original.version);
    expect(reconstituted.timeline.count()).toBe(100);
    expect(reconstituted.timeline.lastTurn()?.id).toBe(original.timeline.lastTurn()?.id);
  });
});
