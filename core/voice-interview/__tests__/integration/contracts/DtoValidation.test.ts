import { describe, it, expect } from 'vitest';
import { parseInboundMessage } from '../../../integration/validation/DTOValidators.js';

describe('Integration Contract Tests - DTO Validation', () => {
  it('should validate valid START message', () => {
    const raw = JSON.stringify({
      protocolVersion: 1,
      type: 'START',
      candidateId: 'cand-123',
      targetRole: 'Fullstack'
    });
    const result = parseInboundMessage(raw);
    expect(result.valid).toBe(true);
    if (result.valid && result.data) {
      expect(result.data.type).toBe('START');
    }
  });

  it('should reject START message without protocolVersion', () => {
    const raw = JSON.stringify({
      type: 'START',
      candidateId: 'cand-123',
      targetRole: 'Fullstack'
    });
    const result = parseInboundMessage(raw);
    expect(result.valid).toBe(false);
  });

  it('should reject START message without candidateId', () => {
    const raw = JSON.stringify({
      protocolVersion: 1,
      type: 'START',
      targetRole: 'Fullstack'
    });
    const result = parseInboundMessage(raw);
    expect(result.valid).toBe(false);
  });

  it('should validate valid TURN message', () => {
    const raw = JSON.stringify({
      protocolVersion: 1,
      type: 'TURN',
      sessionId: 'sess-123',
      turnId: 'turn-456',
      transcript: 'My answer',
      intent: 'answer',
      timingMs: 1500
    });
    const result = parseInboundMessage(raw);
    expect(result.valid).toBe(true);
  });

  it('should map unknown intents to error', () => {
    const raw = JSON.stringify({
      protocolVersion: 1,
      type: 'TURN',
      sessionId: 'sess-123',
      turnId: 'turn-456',
      transcript: 'My answer',
      intent: 'invalid-intent',
      timingMs: 1500
    });
    const result = parseInboundMessage(raw);
    expect(result.valid).toBe(false);
  });
});
