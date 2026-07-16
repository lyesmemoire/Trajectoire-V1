import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useVoiceInterviewClient, VoiceInterviewProvider } from "@/features/voice-interview/provider/VoiceInterviewProvider.tsx";

// We only want to mock the client, not React
vi.mock("@voice-interview/client", () => {
  return {
    VoiceInterviewClient: class {
      on = vi.fn(() => () => {});
      destroy = vi.fn();
      telemetrySnapshot = {};
    }
  };
});

describe("VoiceInterviewProvider", () => {
  it("should provide the client via context", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <VoiceInterviewProvider>{children}</VoiceInterviewProvider>
    );

    const { result } = renderHook(() => useVoiceInterviewClient(), { wrapper });
    
    expect(result.current).toBeDefined();
    // Verify it's our mocked client instance
    expect(typeof result.current.on).toBe("function");
  });

  it("should throw if hook used outside provider", () => {
    // Suppress console.error for this expected error test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useVoiceInterviewClient())).toThrow(
      "useVoiceInterviewClient must be used within a VoiceInterviewProvider"
    );
    
    spy.mockRestore();
  });
});
