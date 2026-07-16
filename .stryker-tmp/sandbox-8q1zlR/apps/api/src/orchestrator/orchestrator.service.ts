// @ts-nocheck
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeepgramProvider } from '../voice/providers/asr/deepgram.provider';
import { GeminiProvider } from '../llm/providers/gemini.provider';
import { ElevenlabsProvider } from '../voice/providers/tts/elevenlabs.provider';
import { SessionManager } from '../session/session.manager';
import { FsmEngine } from './fsm.engine';
import { handlers, VoiceEvent } from './handlers';
import { SessionState } from '../common/session.types';

/**
 * Thin orchestrator – pure FSM dispatcher.
 * All side‑effects are delegated to the handler map.
 */
@Injectable()
export class OrchestratorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrchestratorService.name);
  private readonly fsmEngine = new FsmEngine();

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly sessionManager: SessionManager,
    private readonly asr: DeepgramProvider,
    private readonly llm: GeminiProvider,
    private readonly tts: ElevenlabsProvider,
  ) {}

  onModuleInit() {
    // no special init needed
  }

  onModuleDestroy() {
    // clean up any lingering aborts via session manager cleanup if needed
  }

  /**
   * Central entry point – validates transition, updates session state, then dispatches
   * the appropriate handler. No business logic lives here.
   */
  async handleEvent(sessionId: string, event: VoiceEvent): Promise<void> {
    const session = this.sessionManager.getOrCreate(sessionId);
    // expose providers to handlers via the session (lazy typing)
    (session as any).asr = this.asr;
    (session as any).llm = this.llm;
    (session as any).tts = this.tts;
    // also expose playback queue & socket if not already set – handlers manage lazily

    if (!this.fsmEngine.canTransition(session.state, event.type)) {
      this.logger.warn(
        {
          sessionId: session.sessionId,
          state: session.state,
          event: event.type,
          reason: 'invalid_transition',
        },
        'FSM Guard Rejection',
      );
      return;
    }

    // Perform state transition and log it
    this.fsmEngine.transition(session, event.type);

    const handler = handlers[event.type];
    if (!handler) {
      this.logger.warn(`No handler defined for event type ${event.type}`);
      return;
    }
    try {
      await handler(session, event);
    } catch (err) {
      this.logger.error(
        {
          sessionId: session.sessionId,
          event: event.type,
          error: err,
        },
        'Handler execution failed',
      );
      // In case of error, reset session to IDLE to avoid stuck state
      session.state = SessionState.IDLE;
    }
  }
}
