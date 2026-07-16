import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInterview } from "@/features/voice-interview/hooks/useInterview.ts";
import { useConnection } from "@/features/voice-interview/hooks/useConnection.ts";
import { VoiceInterviewProvider } from "@/features/voice-interview/provider/VoiceInterviewProvider.tsx";
import { useInterviewStore } from "@/features/voice-interview/stores/interview.store.ts";

// Mock the client to track method calls
const mockStartInterview = vi.fn();
const mockConnect = vi.fn();

vi.mock("@voice-interview/client", () => {
  return {
    VoiceInterviewClient: class {
      on = vi.fn(() => () => {});
      destroy = vi.fn();
      startInterview = mockStartInterview;
      connect = mockConnect;
      telemetrySnapshot = {};
    }
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <VoiceInterviewProvider>{children}</VoiceInterviewProvider>
);

describe("Feature Hooks", () => {
  beforeEach(() => {
    mockStartInterview.mockClear();
    mockConnect.mockClear();
    useInterviewStore.getState().reset();
  });

  describe("useInterview", () => {
    it("should return current state from store", () => {
      useInterviewStore.getState().setState("WaitingAI", "Listening");
      
      const { result } = renderHook(() => useInterview(), { wrapper });
      
      expect(result.current.currentState).toBe("WaitingAI");
      expect(result.current.previousState).toBe("Listening");
    });

    it("should call client.startInterview", () => {
      const { result } = renderHook(() => useInterview(), { wrapper });
      
      act(() => {
        result.current.startInterview("cand-1", "Role");
      });
      
      expect(mockStartInterview).toHaveBeenCalledWith("cand-1", "Role");
    });
  });

  describe("useConnection", () => {
    it("should call client.connect", () => {
      const { result } = renderHook(() => useConnection(), { wrapper });
      
      act(() => {
        result.current.connect("token-123");
      });
      
      expect(mockConnect).toHaveBeenCalledWith("token-123");
    });
  });
});
