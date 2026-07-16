import { create } from "zustand";

export interface ConnectionStoreState {
  status: "connected" | "disconnected" | "reconnecting" | "connecting";
  retryAttempt: number;
  latencyMs: number | null;
  error: { code: number; message: string; recoverable: boolean } | null;

  // Actions
  setStatus: (status: "connected" | "disconnected" | "reconnecting" | "connecting") => void;
  setRetryAttempt: (attempt: number) => void;
  setLatency: (ms: number | null) => void;
  setError: (error: { code: number; message: string; recoverable: boolean } | null) => void;
  reset: () => void;
}

const initialState = {
  status: "disconnected" as const,
  retryAttempt: 0,
  latencyMs: null,
  error: null,
};

export const useConnectionStore = create<ConnectionStoreState>()((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setRetryAttempt: (attempt) => set({ retryAttempt: attempt }),
  setLatency: (ms) => set({ latencyMs: ms }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
