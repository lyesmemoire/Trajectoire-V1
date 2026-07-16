import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { InterviewStatusBadge } from "@/features/voice-interview/components/interview/InterviewStatusBadge";
import * as interviewHooks from "@/features/voice-interview/hooks/useInterview";

vi.mock("@/features/voice-interview/hooks/useInterview");

describe("InterviewStatusBadge", () => {
  const useInterviewMock = vi.mocked(interviewHooks.useInterview);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render nothing when Disconnected", () => {
    useInterviewMock.mockReturnValue({ currentState: "Disconnected" } as any);
    const { container } = render(<InterviewStatusBadge />);
    expect(container.querySelector("[class*=badge]")).toBeNull();
  });

  it("should display 'Je vous écoute.' when Listening", () => {
    useInterviewMock.mockReturnValue({ currentState: "Listening" } as any);
    render(<InterviewStatusBadge />);
    expect(screen.getByText("Je vous écoute.")).toBeDefined();
  });

  it("should display 'Je prépare votre prochaine question.' when WaitingAI", () => {
    useInterviewMock.mockReturnValue({ currentState: "WaitingAI" } as any);
    render(<InterviewStatusBadge />);
    expect(screen.getByText("Je prépare votre prochaine question.")).toBeDefined();
  });

  it("should display 'L'IA vous répond.' when PlayingTTS", () => {
    useInterviewMock.mockReturnValue({ currentState: "PlayingTTS" } as any);
    render(<InterviewStatusBadge />);
    expect(screen.getByText("L'IA vous répond.")).toBeDefined();
  });

  it("should display 'L'entretien est en pause.' when Paused", () => {
    useInterviewMock.mockReturnValue({ currentState: "Paused" } as any);
    render(<InterviewStatusBadge />);
    expect(screen.getByText("L'entretien est en pause.")).toBeDefined();
  });
});
