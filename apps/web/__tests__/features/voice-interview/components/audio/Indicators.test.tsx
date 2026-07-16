import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecordingIndicator } from "@/features/voice-interview/components/audio/RecordingIndicator";
import { PlaybackIndicator } from "@/features/voice-interview/components/audio/PlaybackIndicator";
import * as interviewHooks from "@/features/voice-interview/hooks/useInterview";

vi.mock("@/features/voice-interview/hooks/useInterview");

describe("Indicators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("RecordingIndicator", () => {
    it("should show 'Microphone actif' when Listening", () => {
      vi.mocked(interviewHooks.useInterview).mockReturnValue({
        currentState: "Listening",
      } as any);

      render(<RecordingIndicator />);
      expect(screen.getByText("Microphone actif")).toBeDefined();
    });

    it("should render nothing when not Listening", () => {
      vi.mocked(interviewHooks.useInterview).mockReturnValue({
        currentState: "WaitingAI",
      } as any);

      const { container } = render(<RecordingIndicator />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("PlaybackIndicator", () => {
    it("should show \"L'IA parle...\" when PlayingTTS", () => {
      vi.mocked(interviewHooks.useInterview).mockReturnValue({
        currentState: "PlayingTTS",
      } as any);

      render(<PlaybackIndicator />);
      expect(screen.getByText("L'IA parle...")).toBeDefined();
    });

    it("should render nothing when not PlayingTTS", () => {
      vi.mocked(interviewHooks.useInterview).mockReturnValue({
        currentState: "Listening",
      } as any);

      const { container } = render(<PlaybackIndicator />);
      expect(container.firstChild).toBeNull();
    });
  });
});
