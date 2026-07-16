import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VoiceInterviewUI } from "@/features/voice-interview/components/VoiceInterviewUI";
import * as interviewHooks from "@/features/voice-interview/hooks/useInterview";
// Mocking all hooks to render the root shell safely
vi.mock("@/features/voice-interview/hooks/useInterview");
vi.mock("@/features/voice-interview/hooks/useConnection", () => ({
  useConnection: () => ({ status: "connected", latencyMs: 50, error: null })
}));
vi.mock("@/features/voice-interview/hooks/useAudio", () => ({
  useAudio: () => ({ microphoneLevel: 0, isSpeaking: false, isPlaying: false, isMuted: false })
}));
vi.mock("@/features/voice-interview/hooks/useTranscript", () => ({
  useTranscript: () => ({ transcript: "Hello", sendTranscript: vi.fn() })
}));
vi.mock("@/features/voice-interview/hooks/useTelemetry", () => ({
  useTelemetry: () => ({})
}));
vi.mock("@/features/voice-interview/hooks/usePermissions", () => ({
  usePermissions: () => ({ permission: "granted" })
}));

describe("VoiceInterviewUI (Composition)", () => {
  const useInterviewMock = vi.mocked(interviewHooks.useInterview);

  it("should render the shell and active components when WaitingInterview", () => {
    useInterviewMock.mockReturnValue({
      currentState: "WaitingInterview",
      currentQuestion: null,
      startInterview: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      stop: vi.fn(),
    } as any);

    render(<VoiceInterviewUI />);
    // Check Header exists
    expect(screen.getByText("Trajectoire")).toBeDefined();
    // Check Controls exist (Microphone button since WaitingInterview)
    expect(screen.getByRole("button", { name: "Commencer l'entretien" })).toBeDefined();
  });

  it("should render CompletionCard when Completed", () => {
    useInterviewMock.mockReturnValue({
      currentState: "Completed",
      currentQuestion: null,
    } as any);

    render(<VoiceInterviewUI />);
    expect(screen.getByText("Merci.")).toBeDefined();
  });
});
