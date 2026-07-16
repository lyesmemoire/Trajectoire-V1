import { create } from "zustand";

export interface UIStoreState {
  isDebugOverlayVisible: boolean;
  isTranscriptVisible: boolean;
  
  // Actions
  toggleDebugOverlay: () => void;
  toggleTranscript: () => void;
}

export const useUIStore = create<UIStoreState>()((set) => ({
  isDebugOverlayVisible: false,
  isTranscriptVisible: true,

  toggleDebugOverlay: () => set((state) => ({ isDebugOverlayVisible: !state.isDebugOverlayVisible })),
  toggleTranscript: () => set((state) => ({ isTranscriptVisible: !state.isTranscriptVisible })),
}));
