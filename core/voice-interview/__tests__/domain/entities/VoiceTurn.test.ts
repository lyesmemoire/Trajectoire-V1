import { describe, it, expect } from 'vitest';
import { VoiceTurn } from '../../../domain/entities/VoiceTurn.js';
import { TurnId, Transcript, TurnTiming, AnswerEvaluation, ScoreSignal, AIResponse } from '../../../domain/types.js';

describe('VoiceTurn Entity', () => {
  const defaultTiming = TurnTiming.create(100, 1000);
  const defaultTurnId = TurnId.create('turn-1');

  it('should create a valid answer VoiceTurn', () => {
    const turn = VoiceTurn.create({
      id: defaultTurnId,
      transcript: Transcript.create('Yes, I have experience with Node.js'),
      intent: 'answer',
      evaluation: null,
      aiResponse: null,
      feedbackSignal: null,
      timing: defaultTiming
    });

    expect(turn.id).toBe(defaultTurnId);
    expect(turn.intent).toBe('answer');
    expect(turn.transcript?.value).toBe('Yes, I have experience with Node.js');
  });

  it('should throw if intent is answer but transcript is null', () => {
    expect(() => {
      VoiceTurn.create({
        id: defaultTurnId,
        transcript: null,
        intent: 'answer',
        evaluation: null,
        aiResponse: null,
        feedbackSignal: null,
        timing: defaultTiming
      });
    }).toThrow('VoiceTurn with answer intent must have a transcript');
  });

  it('should allow silence intent without transcript', () => {
    const turn = VoiceTurn.create({
      id: defaultTurnId,
      transcript: null,
      intent: 'silence',
      evaluation: null,
      aiResponse: null,
      feedbackSignal: null,
      timing: defaultTiming
    });

    expect(turn.intent).toBe('silence');
    expect(turn.transcript).toBeNull();
  });

  it('should mutate immutably via withEvaluation', () => {
    const turn = VoiceTurn.create({
      id: defaultTurnId,
      transcript: Transcript.create('Test'),
      intent: 'answer',
      evaluation: null,
      aiResponse: null,
      feedbackSignal: null,
      timing: defaultTiming
    });

    const evalData = AnswerEvaluation.create(ScoreSignal.create(80), true, 'Good answer');
    const newTurn = turn.withEvaluation(evalData, 'deepen');

    expect(newTurn).not.toBe(turn); // Ensure immutability
    expect(newTurn.id).toBe(turn.id);
    expect(newTurn.evaluation).toBe(evalData);
    expect(newTurn.feedbackSignal).toBe('deepen');
    expect(turn.evaluation).toBeNull(); // Original is unchanged
  });

  it('should mutate immutably via withAIResponse', () => {
    const turn = VoiceTurn.create({
      id: defaultTurnId,
      transcript: Transcript.create('Test'),
      intent: 'answer',
      evaluation: null,
      aiResponse: null,
      feedbackSignal: null,
      timing: defaultTiming
    });

    const aiRes = AIResponse.create('Here is the next question');
    const newTurn = turn.withAIResponse(aiRes);

    expect(newTurn).not.toBe(turn);
    expect(newTurn.aiResponse).toBe(aiRes);
    expect(turn.aiResponse).toBeNull();
  });
});
