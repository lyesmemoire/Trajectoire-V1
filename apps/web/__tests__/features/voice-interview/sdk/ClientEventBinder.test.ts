import { describe, it, expect, vi } from "vitest";
import { ClientEventBinder } from "@/features/voice-interview/sdk/ClientEventBinder.ts";
import { VoiceInterviewClient } from "@voice-interview/client";
import { useConnectionStore } from "@/features/voice-interview/stores/connection.store.ts";
import { useInterviewStore } from "@/features/voice-interview/stores/interview.store.ts";
import { useAudioStore } from "@/features/voice-interview/stores/audio.store.ts";

vi.mock("@voice-interview/client");

describe("ClientEventBinder", () => {
  it("should bind to SDK events and update stores", () => {
    const client = new VoiceInterviewClient({});
    
    // Create a mock implementation for 'on' that allows us to trigger events
    const listeners: Record<string, Function[]> = {};
    vi.mocked(client.on).mockImplementation((event: string, callback: any) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
      return () => { 
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      };
    });

    const trigger = (event: string, payload: any) => {
      listeners[event]?.forEach(cb => cb(payload));
    };

    const binder = new ClientEventBinder(client);
    binder.bind();

    // Trigger a connection event
    trigger("connection", { status: "connected", attempt: 0, latencyMs: 50 });
    expect(useConnectionStore.getState().status).toBe("connected");
    expect(useConnectionStore.getState().latencyMs).toBe(50);

    // Trigger a stateChanged event
    trigger("stateChanged", { previousState: "Connecting", currentState: "Listening" });
    expect(useInterviewStore.getState().currentState).toBe("Listening");

    // Trigger an audioLevel event
    trigger("audioLevel", { level: 0.8, isSpeaking: true });
    expect(useAudioStore.getState().microphoneLevel).toBe(0.8);
    expect(useAudioStore.getState().isSpeaking).toBe(true);

    binder.unbind();
  });
});
