import { create } from "zustand";

interface TranscriptState {
  transcripts: Array<{ id: number; text: string; isFinal: boolean }>;
  addTranscript: (msg: any) => void;
  clear: () => void;
}

let nextId = 0;

export const useTranscriptStore = create<TranscriptState>((set) => ({
  transcripts: [],
  addTranscript: (msg) => {
    set((state) => {
      if (!msg.isFinal) {
        const last = state.transcripts[state.transcripts.length - 1];
        if (last && !last.isFinal) {
          const newTranscripts = [...state.transcripts];
          newTranscripts[newTranscripts.length - 1] = {
            ...last,
            text: msg.transcript,
          };
          return { transcripts: newTranscripts };
        }
      }
      return {
        transcripts: [
          ...state.transcripts,
          { id: nextId++, text: msg.transcript, isFinal: msg.isFinal },
        ],
      };
    });
  },
  clear: () => set({ transcripts: [] }),
}));
