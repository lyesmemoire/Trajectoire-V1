/**
 * VoiceInterviewClient — Façade.
 * Single public entry point coordinating FSM, WebSocket, Audio, and Telemetry.
 * Framework-agnostic. No React, no Vue, no Angular.
 */

import type { DeepPartial, VoiceClientConfig, OutboundMessage } from "./types/index.js";
import type { VoiceClientEventMap, VoiceClientEventName } from "./types/events.js";
import type { TelemetrySnapshot } from "./types/telemetry.js";
import { mergeConfig } from "./types/config.js";
import { TypedEventEmitter } from "./events/EventEmitter.js";
import { InterviewStateMachine } from "./state-machine/InterviewStateMachine.js";
import { ClientState, ClientEvent } from "./state-machine/States.js";
import type { GuardContext } from "./state-machine/Guards.js";
import { WebSocketManager } from "./connection/WebSocketManager.js";
import { TicketAuthenticator } from "./connection/TicketAuthenticator.js";
import { ConnectionMonitor } from "./connection/ConnectionMonitor.js";
import { BackoffStrategy } from "./connection/BackoffStrategy.js";
import { MessageFactory } from "./protocol/MessageFactory.js";
import { MessageSequencer } from "./protocol/MessageSequencer.js";
import { MicrophoneManager } from "./audio/MicrophoneManager.js";
import { AudioPlayer } from "./audio/AudioPlayer.js";
import { BargeInController } from "./audio/BargeInController.js";
import { ClientTelemetry } from "./telemetry/ClientTelemetry.js";
import { ConnectionError } from "./errors/ConnectionError.js";

type Listener<T> = (event: T) => void;

export class VoiceInterviewClient {
  private readonly config: VoiceClientConfig;
  private readonly emitter: TypedEventEmitter;
  private readonly fsm: InterviewStateMachine;
  private readonly authenticator: TicketAuthenticator;
  private readonly monitor: ConnectionMonitor;
  private readonly sequencer: MessageSequencer;
  private readonly microphone: MicrophoneManager;
  private readonly player: AudioPlayer;
  private readonly bargeIn: BargeInController;
  private readonly telemetry: ClientTelemetry;
  private wsManager: WebSocketManager | null = null;
  private backoff: BackoffStrategy;

  private authToken: string | null = null;
  private ticket: string | null = null;
  private sessionId: string | null = null;
  private currentTranscript: string | null = null;
  private turnCounter: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(configPartial: DeepPartial<VoiceClientConfig>) {
    this.config = mergeConfig(configPartial);
    this.emitter = new TypedEventEmitter();
    this.fsm = new InterviewStateMachine();
    this.authenticator = new TicketAuthenticator(
      this.config.connection.baseUrl,
      this.config.connection.connectionTimeoutMs
    );
    this.monitor = new ConnectionMonitor();
    this.sequencer = new MessageSequencer();
    this.microphone = new MicrophoneManager(this.config.audio);
    this.player = new AudioPlayer();
    this.bargeIn = new BargeInController(this.player, this.config.features.bargeIn);
    this.telemetry = new ClientTelemetry(this.config.telemetry);
    this.backoff = new BackoffStrategy(
      this.config.connection.initialBackoffMs,
      this.config.connection.maxBackoffMs,
      this.config.connection.backoffMultiplier
    );

    this.setupAudioCallbacks();
    this.setupBargeIn();
  }

  // ─── Public API ────────────────────────────────────────

  get state(): ClientState {
    return this.fsm.currentState;
  }

  get telemetrySnapshot(): TelemetrySnapshot {
    return this.telemetry.snapshot;
  }

  on<K extends VoiceClientEventName>(event: K, listener: Listener<VoiceClientEventMap[K]>): () => void {
    return this.emitter.on(event, listener);
  }

  off<K extends VoiceClientEventName>(event: K, listener: Listener<VoiceClientEventMap[K]>): void {
    this.emitter.off(event, listener);
  }

  async connect(authToken: string): Promise<void> {
    this.authToken = authToken;
    this.doTransition(ClientEvent.CONNECT, this.buildGuardContext());
    this.telemetry.newTrace();

    try {
      this.telemetry.startPhase("auth");
      this.ticket = await this.authenticator.requestTicket(authToken);
      this.telemetry.endPhase("auth");

      this.doTransition(ClientEvent.TICKET_RECEIVED, this.buildGuardContext());
      this.connectWebSocket();
    } catch (error: unknown) {
      this.doTransition(ClientEvent.AUTH_FAILED, this.buildGuardContext());
      this.emitError(error, false);
    }
  }

  async startInterview(candidateId: string, targetRole: string): Promise<void> {
    this.doTransition(ClientEvent.START_INTERVIEW, this.buildGuardContext());

    const message = MessageFactory.createStartMessage(candidateId, targetRole);
    const sent = this.wsManager?.send(JSON.stringify(message));
    if (!sent) {
      this.sequencer.enqueue(message);
    }

    this.telemetry.startRoundTrip();
    this.telemetry.startPhase("llm");

    // Start microphone
    await this.microphone.start({
      onAudioData: (data) => this.handleAudioData(data),
      onSpeechStart: () => this.handleSpeechStart(),
      onSpeechEnd: () => this.handleSpeechEnd(),
      onLevelChange: (rms, peak, isSpeaking) => {
        this.emitter.emit("audioLevel", { level: rms, isSpeaking });
      },
      onError: (error) => this.emitError(error, true),
    });
  }

  pause(): void {
    this.doTransition(ClientEvent.PAUSE, this.buildGuardContext());
    if (this.sessionId) {
      const msg = MessageFactory.createLifecycleMessage("PAUSE", this.sessionId);
      this.wsManager?.send(JSON.stringify(msg));
    }
    this.microphone.mute();
  }

  resume(): void {
    this.doTransition(ClientEvent.RESUME, this.buildGuardContext());
    if (this.sessionId) {
      const msg = MessageFactory.createLifecycleMessage("RESUME", this.sessionId);
      this.wsManager?.send(JSON.stringify(msg));
    }
    this.microphone.unmute();
  }

  stop(): void {
    if (this.sessionId) {
      const msg = MessageFactory.createLifecycleMessage("STOP", this.sessionId);
      this.wsManager?.send(JSON.stringify(msg));
    }
    this.microphone.stop();
  }

  sendTranscript(transcript: string): void {
    if (!this.sessionId) return;

    this.currentTranscript = transcript;
    this.turnCounter += 1;
    const turnId = `turn-${this.turnCounter}`;

    const msg = MessageFactory.createTurnMessage(
      this.sessionId,
      turnId,
      transcript,
      "answer",
      0
    );

    this.doTransition(ClientEvent.SPEECH_END, this.buildGuardContext());

    const sent = this.wsManager?.send(JSON.stringify(msg));
    if (!sent) {
      this.sequencer.enqueue(msg);
    }

    this.doTransition(ClientEvent.TURN_SENT, this.buildGuardContext());
    this.telemetry.startRoundTrip();
    this.telemetry.startPhase("llm");
  }

  disconnect(): void {
    this.microphone.stop();
    void this.player.stopPlayback();
    this.wsManager?.disconnect();
    try {
      this.doTransition(ClientEvent.DISCONNECT, this.buildGuardContext());
    } catch {
      // If we're in a state that doesn't support DISCONNECT, force reset
      this.fsm.reset();
      this.emitStateChange("Disconnected");
    }
    this.clearReconnectTimer();
  }

  destroy(): void {
    this.disconnect();
    this.wsManager?.destroy();
    this.microphone.destroy();
    this.player.destroy();
    this.telemetry.reset();
    this.emitter.removeAllListeners();
    this.wsManager = null;
  }

  // ─── Private: WebSocket ────────────────────────────────

  private connectWebSocket(): void {
    if (!this.ticket) return;

    this.wsManager = new WebSocketManager(
      this.config.connection,
      {
        onMessage: (msg) => this.handleServerMessage(msg),
        onOpen: () => this.handleWsOpen(),
        onClose: (code, reason) => this.handleWsClose(code, reason),
        onError: (error) => this.handleWsError(error),
      },
      this.monitor,
      this.sequencer
    );

    this.wsManager.connect(this.ticket);
    this.telemetry.updateSocketStatus("connecting");
  }

  private handleWsOpen(): void {
    this.doTransition(ClientEvent.WS_OPENED, this.buildGuardContext());
    this.telemetry.updateSocketStatus("connected");
    this.backoff.reset();
    this.emitter.emit("connection", {
      status: "connected",
      attempt: 0,
      latencyMs: this.monitor.averageLatencyMs,
    });
  }

  private handleWsClose(code: number, _reason: string): void {
    this.telemetry.updateSocketStatus("disconnected");

    // Don't reconnect if intentionally closed or in terminal state
    if (code === 1000 || this.fsm.isTerminal) return;

    if (this.fsm.currentState !== ClientState.Disconnected) {
      try {
        this.doTransition(ClientEvent.WS_LOST, this.buildGuardContext());
        this.attemptReconnect();
      } catch {
        // Already in a state that can't transition to Reconnecting
      }
    }
  }

  private handleWsError(error: ConnectionError): void {
    this.emitError(error, error.recoverable);
  }

  private attemptReconnect(): void {
    if (this.backoff.currentAttempt >= this.config.connection.maxReconnectAttempts) {
      this.doTransition(ClientEvent.MAX_RETRIES_EXCEEDED, this.buildGuardContext());
      this.emitError(
        ConnectionError.maxRetriesExceeded(this.config.connection.maxReconnectAttempts),
        false
      );
      return;
    }

    this.telemetry.updateSocketStatus("reconnecting");
    this.telemetry.updateRetryCount(this.backoff.currentAttempt);
    this.emitter.emit("connection", {
      status: "reconnecting",
      attempt: this.backoff.currentAttempt,
      latencyMs: null,
    });

    const delay = this.backoff.nextDelay();
    this.reconnectTimer = setTimeout(() => {
      this.doTransition(ClientEvent.RECONNECT_AUTH, this.buildGuardContext());
      void this.reconnect();
    }, delay);
  }

  private async reconnect(): Promise<void> {
    if (!this.authToken) return;
    try {
      this.ticket = await this.authenticator.requestTicket(this.authToken);
      this.doTransition(ClientEvent.TICKET_RECEIVED, this.buildGuardContext());
      this.connectWebSocket();
    } catch {
      this.attemptReconnect();
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // ─── Private: Server Messages ──────────────────────────

  private handleServerMessage(msg: OutboundMessage): void {
    switch (msg.type) {
      case "TEXT":
        this.sessionId = msg.sessionId;
        this.telemetry.endPhase("llm");
        this.emitter.emit("question", {
          sessionId: msg.sessionId,
          text: msg.text,
          feedbackSignal: msg.feedbackSignal,
        });

        // If no audio follows, go back to Listening
        if (this.fsm.currentState === ClientState.WaitingAI) {
          // Wait briefly for potential AUDIO message before transitioning
          setTimeout(() => {
            if (this.fsm.currentState === ClientState.WaitingAI) {
              this.doTransition(ClientEvent.TEXT_ONLY_RECEIVED, this.buildGuardContext());
            }
          }, 200);
        }
        break;

      case "AUDIO":
        this.sessionId = msg.sessionId;
        this.telemetry.startPhase("tts");
        if (this.fsm.currentState === ClientState.WaitingAI) {
          this.doTransition(ClientEvent.AUDIO_RECEIVED, this.buildGuardContext());
        }
        this.player.enqueue(msg.audioChunk);
        this.emitter.emit("audio", {
          sessionId: msg.sessionId,
          audioChunk: msg.audioChunk,
        });
        break;

      case "STATE":
        this.telemetry.updatePhase(msg.phase);
        break;

      case "ERROR":
        this.emitter.emit("error", {
          code: msg.code,
          message: msg.message,
          correlationId: msg.correlationId,
          recoverable: msg.code < 5000,
        });
        break;

      case "COMPLETED":
        this.telemetry.endRoundTrip();
        this.doTransition(ClientEvent.SERVER_COMPLETED, this.buildGuardContext());
        this.microphone.stop();
        void this.player.stopPlayback();
        this.emitter.emit("completed", {
          sessionId: msg.sessionId,
          timestamp: Date.now(),
        });
        break;

      case "PONG":
        // Already handled in WebSocketManager
        break;
    }
  }

  // ─── Private: Audio ────────────────────────────────────

  private handleAudioData(_data: string): void {
    // Audio data is streamed continuously; transcript-based turns
    // are managed through the VAD → sendTranscript flow
  }

  private handleSpeechStart(): void {
    this.bargeIn.handleSpeechDetected();
  }

  private handleSpeechEnd(): void {
    // VAD detected end of speech. The UI should call sendTranscript()
    // after STT processing. We emit a transcript event as a signal.
    this.emitter.emit("transcript", {
      sessionId: this.sessionId ?? "",
      text: "",
      isFinal: true,
    });
  }

  private setupAudioCallbacks(): void {
    this.player.setCallbacks({
      onPlaybackStarted: () => {
        this.telemetry.endPhase("tts");
      },
      onPlaybackEnded: () => {
        if (this.fsm.currentState === ClientState.PlayingTTS) {
          this.doTransition(ClientEvent.PLAYBACK_ENDED, this.buildGuardContext());
        }
      },
      onError: (error) => this.emitError(error, true),
    });
  }

  private setupBargeIn(): void {
    this.bargeIn.setBargeInCallback(() => {
      if (this.fsm.currentState === ClientState.PlayingTTS) {
        this.doTransition(ClientEvent.BARGE_IN, this.buildGuardContext());
      }
    });
  }

  // ─── Private: FSM Helpers ──────────────────────────────

  private doTransition(event: ClientEvent, ctx: GuardContext): void {
    const result = this.fsm.transition(event, ctx);
    this.telemetry.updateState(result.currentState);
    this.emitStateChange(result.currentState, result.previousState);
  }

  private buildGuardContext(): GuardContext {
    return Object.freeze({
      ticket: this.ticket,
      retryCount: this.backoff.currentAttempt,
      maxRetries: this.config.connection.maxReconnectAttempts,
      transcript: this.currentTranscript,
    });
  }

  private emitStateChange(current: string, previous?: string): void {
    this.emitter.emit("stateChanged", {
      previousState: previous ?? "Disconnected",
      currentState: current,
      timestamp: Date.now(),
    });
  }

  private emitError(error: unknown, recoverable: boolean): void {
    const message = error instanceof Error ? error.message : "Unknown error";
    const code = error instanceof ConnectionError ? 0 : -1;
    this.emitter.emit("error", {
      code,
      message,
      correlationId: this.telemetry.snapshot.correlationId,
      recoverable,
    });
  }
}
