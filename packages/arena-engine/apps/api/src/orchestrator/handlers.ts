import { Socket } from 'socket.io';
import { InterviewSession } from '../common/session.types';
import { PlaybackQueue } from '../common/playback-queue';
import { Logger } from '@nestjs/common';

import { VoiceEventType } from './fsm.engine';

// Define the shape of a VoiceEvent (payload only, no socket)
export interface VoiceEvent {
  type: VoiceEventType;
  payload?: any; // event‑specific data (e.g., audio chunk buffer)
}


// ---------------------------------------------------------------------------
// Helper to safely get the bound socket from a session. The socket is attached
// by the gateway when a client first connects.
// ---------------------------------------------------------------------------
function getSocket(session: InterviewSession): Socket | undefined {
  return (session as any).socket as Socket | undefined;
}

// ---------------------------------------------------------------------------
// Individual handlers – each receives the session and the raw event payload.
// Side‑effects (provider calls, socket emits, queue ops) are performed here.
// ---------------------------------------------------------------------------
export const handlers: Record<
  VoiceEventType,
  (session: InterviewSession, event: VoiceEvent) => Promise<void>
> = {
  async [VoiceEventType.AUDIO_CHUNK](session, event) {
    const logger = new Logger('Handler:AudioChunk');
    const chunk: Buffer = event.payload?.chunk;
    if (!chunk) {
      logger.warn('Audio chunk missing in payload');
      return;
    }
    // Ensure an audio Subject exists for the session
    if (!session.audioSubject) {
      // Lazy creation – DeepgramProvider expects an RxJS Subject to push chunks
      const { Subject } = await import('rxjs');
      session.audioSubject = new Subject<Buffer>();
    }
    // Push the incoming audio to the ASR stream
    session.audioSubject.next(chunk);
    logger.debug('Pushed audio chunk to ASR stream');
  },

  async [VoiceEventType.TRANSCRIPT_PARTIAL](session, event) {
    const logger = new Logger('Handler:TranscriptPartial');
    const socket = getSocket(session);
    const text: string = event.payload?.text;
    if (socket && text) {
      socket.emit('transcript_partial', { text });
    }
    logger.debug('Emitted partial transcript');
  },

  async [VoiceEventType.TRANSCRIPT_FINAL](session, event) {
    const logger = new Logger('Handler:TranscriptFinal');
    const socket = getSocket(session);
    const finalText: string = event.payload?.text;
    if (!finalText) {
      logger.warn('Final transcript missing');
      return;
    }
    // Transition to THINKING is handled by the FSM engine; here we start LLM.
    const llmResponse = (session as any).llm.generateResponse(finalText);
    // Stream tokens back to client and optionally store them for later TTS.
    for await (const token of llmResponse) {
      socket?.emit('llm_token', { token });
      // In a full implementation we would accumulate the text for TTS.
    }
    logger.debug('LLM streaming completed');
  },

  async [VoiceEventType.LLM_TOKEN](session, event) {
    // This handler is currently a no‑op because token emission is performed in
    // the TRANSCRIPT_FINAL handler. It exists to satisfy the FSM contract.
    const logger = new Logger('Handler:LLMToken');
    logger.debug('LLM token event received – no side‑effects');
  },

  async [VoiceEventType.TTS_CHUNK](session, event) {
    const logger = new Logger('Handler:TTSChunk');
    const socket = getSocket(session);
    const audioChunk: Buffer = event.payload?.chunk;
    if (!audioChunk) {
      logger.warn('Missing TTS audio chunk');
      return;
    }
    // Push to playback queue (stateless buffer) and emit to the client.
    const queue = (session as any).playbackQueue as PlaybackQueue;
    if (!queue) {
      // Lazy creation of a per‑session playback queue.
      (session as any).playbackQueue = new PlaybackQueue();
    }
    (session as any).playbackQueue.enqueue(audioChunk);
    socket?.emit('audio', audioChunk);
    logger.debug('Enqueued and emitted TTS chunk');
  },

  async [VoiceEventType.INTERRUPT](session, _event) {
    const logger = new Logger('Handler:Interrupt');
    // Abort any ongoing streams.
    session.asrAbort?.abort();
    session.ttsAbort?.abort();
    // Clear playback queue if present.
    const queue = (session as any).playbackQueue as PlaybackQueue | undefined;
    queue?.clear();
    // Reset socket state – send a special interrupt notification.
    const socket = getSocket(session);
    socket?.emit('interrupt_ack', { status: 'interrupted' });
    logger.warn('Session interrupted – all pipelines cleared');
  },

  async [VoiceEventType.DISCONNECT](session, _event) {
    const logger = new Logger('Handler:Disconnect');
    // Cleanup resources.
    session.asrAbort?.abort();
    session.ttsAbort?.abort();
    const queue = (session as any).playbackQueue as PlaybackQueue | undefined;
    queue?.clear();
    // Remove socket reference.
    delete (session as any).socket;
    logger.log(`Session ${session.sessionId} disconnected and cleaned up`);
  },
};
