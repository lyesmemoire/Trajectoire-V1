// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { VoiceWebSocketHandler } from '../../../integration/handlers/VoiceWebSocketHandler.js';
import { ApplicationError, failure, success } from '../../../application/types.js';

describe('VoiceWebSocketHandler', () => {
  it('should process a valid start message and send a response', async () => {
    const orchestrator = { 
      startInterview: vi.fn().mockResolvedValue(success({
        sessionId: 's-123',
        initialQuestionText: 'Hello',
        initialAudioChunk: 'audio'
      })) 
    } as any;

    const handler = new VoiceWebSocketHandler(orchestrator, {} as any, {} as any, {} as any);
    
    const ws = { send: vi.fn() };
    const payload = JSON.stringify({
      type: 'START',
      candidateId: 'c1',
      targetRole: 'Backend'
    });

    await handler.handleMessage(ws as any, payload);

    expect(orchestrator.startInterview).toHaveBeenCalled();
    expect(ws.send).toHaveBeenCalled();
    
    const sentData = JSON.parse(ws.send.mock.calls[0][0]);
    expect(sentData.type).toBe('TEXT');
    expect(sentData.sessionId).toBe('s-123');
  });

  it('should map ApplicationError to Error WS message', async () => {
    const orchestrator = { 
      handleIncomingAudio: vi.fn().mockResolvedValue(failure(
        new ApplicationError('SESSION_NOT_FOUND', 'Session not found')
      )) 
    } as any;
    
    const handler = new VoiceWebSocketHandler(orchestrator, {} as any, {} as any, {} as any);
    
    const ws = { send: vi.fn() };
    const payload = JSON.stringify({
      type: 'TURN',
      sessionId: 's-123',
      turnId: 't1',
      transcript: 'ans',
      intent: 'answer',
      timingMs: 100
    });

    await handler.handleMessage(ws as any, payload);

    expect(ws.send).toHaveBeenCalled();
    const sentData = JSON.parse(ws.send.mock.calls[0][0]);
    expect(sentData.type).toBe('ERROR');
    expect(sentData.code).toBe(5000); // Mapped code for SESSION_NOT_FOUND (fallback)
    expect(sentData.message).toBe('Internal server error');
  });
});
