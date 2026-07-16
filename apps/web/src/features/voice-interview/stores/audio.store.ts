import { create } from "zustand";

export interface AudioStoreState {
  microphoneLevel: number; // 0-1 RMS
  isSpeaking: boolean;     // VAD status
  isPlaying: boolean;      // TTS playback status
  isMuted: boolean;
  microphonePermission: "prompt" | "granted" | "denied" | "unknown";

  // Actions
  setMicrophoneLevel: (level: number, speaking: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setMuted: (muted: boolean) => void;
  setPermission: (state: "prompt" | "granted" | "denied" | "unknown") => void;
  reset: () => void;
}

const initialState = {
  microphoneLevel: 0,
  isSpeaking: false,
  isPlaying: false,
  isMuted: false,
  microphonePermission: "unknown" as const,
};

export const useAudioStore = create<AudioStoreState>()((set) => ({
  ...initialState,

  setMicrophoneLevel: (level, speaking) => set({ microphoneLevel: level, isSpeaking: speaking }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setMuted: (muted) => set({ isMuted: muted }),
  setPermission: (state) => set({ microphonePermission: state }),
  reset: () => set(initialState),
}));
