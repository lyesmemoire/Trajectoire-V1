import type { VoiceInterviewClient } from "@voice-interview/client";
import {
  useInterviewStore,
  useConnectionStore,
  useAudioStore,
  useTelemetryStore,
} from "../stores";

/**
 * Connects a VoiceInterviewClient instance to the React Zustand stores.
 * This class ensures that React components never need to subscribe to the SDK directly.
 * It translates SDK events into Zustand state updates.
 */
export class ClientEventBinder {
  private readonly client: VoiceInterviewClient;
  private unsubs: Array<() => void> = [];
  private telemetryTimer: ReturnType<typeof setInterval> | null = null;

  constructor(client: VoiceInterviewClient) {
    this.client = client;
  }

  bind(): void {
    // Clean up any existing bindings just in case
    this.unbind();

    // 1. Connection events
    this.unsubs.push(
      this.client.on("connection", (event) => {
        useConnectionStore.getState().setStatus(event.status);
        useConnectionStore.getState().setRetryAttempt(event.attempt);
        useConnectionStore.getState().setLatency(event.latencyMs);
      })
    );

    this.unsubs.push(
      this.client.on("error", (event) => {
        useConnectionStore.getState().setError({
          code: event.code,
          message: event.message,
          recoverable: event.recoverable,
        });
      })
    );

    // 2. Interview State events
    this.unsubs.push(
      this.client.on("stateChanged", (event) => {
        useInterviewStore.getState().setState(event.currentState, event.previousState);
        // On state change, force an immediate telemetry sync
        this.syncTelemetry();
      })
    );

    this.unsubs.push(
      this.client.on("question", (event) => {
        useInterviewStore.getState().setSessionId(event.sessionId);
        useInterviewStore.getState().setQuestion(event.text, event.feedbackSignal);
      })
    );

    this.unsubs.push(
      this.client.on("completed", (_event) => {
        useInterviewStore.getState().setCompleted(true);
      })
    );

    // 3. Audio events
    this.unsubs.push(
      this.client.on("audioLevel", (event) => {
        useAudioStore.getState().setMicrophoneLevel(event.level, event.isSpeaking);
      })
    );

    this.unsubs.push(
      this.client.on("stateChanged", (event) => {
        const isPlaying = event.currentState === "PlayingTTS";
        useAudioStore.getState().setPlaying(isPlaying);
      })
    );

    // 4. Start periodic telemetry polling
    // Since telemetry (latency, etc.) updates rapidly and internally,
    // we poll the snapshot to update the store for the Debug Overlay.
    this.telemetryTimer = setInterval(() => this.syncTelemetry(), 500);
  }

  unbind(): void {
    for (const unsub of this.unsubs) {
      unsub();
    }
    this.unsubs = [];

    if (this.telemetryTimer !== null) {
      clearInterval(this.telemetryTimer);
      this.telemetryTimer = null;
    }
  }

  private syncTelemetry(): void {
    const snapshot = this.client.telemetrySnapshot;
    useTelemetryStore.getState().setSnapshot(snapshot);
  }
}
