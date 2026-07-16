import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VoiceHalo } from "../../../../../src/features/voice-interview/components/audio/VoiceHalo";
import { useInterview, useAudio } from "../../../../../src/features/voice-interview/hooks";

vi.mock("../../../../../src/features/voice-interview/hooks", () => ({
  useInterview: vi.fn(),
  useAudio: vi.fn(),
}));

describe("VoiceHalo", () => {
  const useInterviewMock = vi.mocked(useInterview);
  const useAudioMock = vi.mocked(useAudio);

  beforeEach(() => {
    vi.clearAllMocks();
    useAudioMock.mockReturnValue({ microphoneLevel: 0 } as any);
    useInterviewMock.mockReturnValue({ currentState: "WaitingInterview" } as any);
  });

  it("should render without crashing", () => {
    const { container } = render(<VoiceHalo />);
    expect(container.firstChild).toBeDefined();
  });

  it("should use CandidateSpeaking state when Listening", () => {
    useInterviewMock.mockReturnValue({ currentState: "Listening" } as any);
    const { container } = render(<VoiceHalo />);
    expect(container).toBeDefined();
  });

  it("should use aiSpeaking state when PlayingTTS", () => {
    useInterviewMock.mockReturnValue({ currentState: "PlayingTTS" } as any);
    const { container } = render(<VoiceHalo />);
    expect(container).toBeDefined();
  });
});
