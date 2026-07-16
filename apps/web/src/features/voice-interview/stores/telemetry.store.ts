import { create } from "zustand";
import type { TelemetrySnapshot } from "@voice-interview/client";

export interface TelemetryStoreState {
  snapshot: TelemetrySnapshot | null;
  
  // Actions
  setSnapshot: (snapshot: TelemetrySnapshot) => void;
  reset: () => void;
}

export const useTelemetryStore = create<TelemetryStoreState>()((set) => ({
  snapshot: null,

  setSnapshot: (snapshot) => set({ snapshot }),
  reset: () => set({ snapshot: null }),
}));
