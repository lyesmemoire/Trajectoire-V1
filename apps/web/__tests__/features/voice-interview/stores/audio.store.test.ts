import { describe, it, expect, beforeEach } from "vitest";
import { useAudioStore } from "@/features/voice-interview/stores/audio.store.ts";

describe("audio.store", () => {
  beforeEach(() => {
    useAudioStore.getState().reset();
  });

  it("should initialize correctly", () => {
    const state = useAudioStore.getState();
    expect(state.microphoneLevel).toBe(0);
    expect(state.isSpeaking).toBe(false);
    expect(state.isPlaying).toBe(false);
    expect(state.isMuted).toBe(false);
  });

  it("should update microphone level and VAD state", () => {
    useAudioStore.getState().setMicrophoneLevel(0.5, true);
    const state = useAudioStore.getState();
    expect(state.microphoneLevel).toBe(0.5);
    expect(state.isSpeaking).toBe(true);
  });

  it("should update playing state", () => {
    useAudioStore.getState().setPlaying(true);
    expect(useAudioStore.getState().isPlaying).toBe(true);
  });
});
