import { create } from "zustand";
import type { FeedbackSignal } from "@voice-interview/client";

export interface InterviewStoreState {
  currentState: string;
  previousState: string;
  sessionId: string | null;
  currentQuestion: string | null;
  feedbackSignal: FeedbackSignal | null;
  isCompleted: boolean;
  
  // Actions
  setState: (current: string, previous: string) => void;
  setSessionId: (id: string) => void;
  setQuestion: (text: string, feedback: FeedbackSignal | null) => void;
  setCompleted: (completed: boolean) => void;
  reset: () => void;
}

const initialState = {
  currentState: "Disconnected",
  previousState: "Disconnected",
  sessionId: null,
  currentQuestion: null,
  feedbackSignal: null,
  isCompleted: false,
};

export const useInterviewStore = create<InterviewStoreState>()((set) => ({
  ...initialState,

  setState: (current, previous) => set({ currentState: current, previousState: previous }),
  setSessionId: (id) => set({ sessionId: id }),
  setQuestion: (text, feedback) => set({ currentQuestion: text, feedbackSignal: feedback }),
  setCompleted: (completed) => set({ isCompleted: completed }),
  reset: () => set(initialState),
}));
