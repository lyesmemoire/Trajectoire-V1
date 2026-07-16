import { describe, it, expect, beforeEach } from "vitest";
import { useConnectionStore } from "@/features/voice-interview/stores/connection.store.ts";

describe("connection.store", () => {
  beforeEach(() => {
    useConnectionStore.getState().reset();
  });

  it("should have correct initial state", () => {
    const state = useConnectionStore.getState();
    expect(state.status).toBe("disconnected");
    expect(state.retryAttempt).toBe(0);
    expect(state.latencyMs).toBeNull();
    expect(state.error).toBeNull();
  });

  it("should update status", () => {
    useConnectionStore.getState().setStatus("connected");
    expect(useConnectionStore.getState().status).toBe("connected");
  });

  it("should update error", () => {
    const error = { code: 4000, message: "Fail", recoverable: false };
    useConnectionStore.getState().setError(error);
    expect(useConnectionStore.getState().error).toEqual(error);
  });

  it("should update latency", () => {
    useConnectionStore.getState().setLatency(42);
    expect(useConnectionStore.getState().latencyMs).toBe(42);
  });
});
