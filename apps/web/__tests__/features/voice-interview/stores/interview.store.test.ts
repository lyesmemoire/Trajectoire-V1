import { describe, it, expect, beforeEach } from "vitest";
import { useInterviewStore } from "@/features/voice-interview/stores/interview.store.ts";

describe("interview.store", () => {
  beforeEach(() => {
    useInterviewStore.getState().reset();
  });

  it("should have correct initial state", () => {
    const state = useInterviewStore.getState();
    expect(state.currentState).toBe("Disconnected");
    expect(state.sessionId).toBeNull();
    expect(state.currentQuestion).toBeNull();
    expect(state.isCompleted).toBe(false);
  });

  it("should update state", () => {
    useInterviewStore.getState().setState("Listening", "WaitingInterview");
    const state = useInterviewStore.getState();
    expect(state.currentState).toBe("Listening");
    expect(state.previousState).toBe("WaitingInterview");
  });

  it("should update question", () => {
    useInterviewStore.getState().setQuestion("Hello?", "probe");
    const state = useInterviewStore.getState();
    expect(state.currentQuestion).toBe("Hello?");
    expect(state.feedbackSignal).toBe("probe");
  });

  it("should reset state", () => {
    useInterviewStore.getState().setSessionId("sess-1");
    useInterviewStore.getState().reset();
    const state = useInterviewStore.getState();
    expect(state.sessionId).toBeNull();
  });
});
