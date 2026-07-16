import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CurrentQuestionCard } from "@/features/voice-interview/components/interview/CurrentQuestionCard";
import * as interviewHooks from "@/features/voice-interview/hooks/useInterview";

vi.mock("@/features/voice-interview/hooks/useInterview");

describe("CurrentQuestionCard", () => {
  const useInterviewMock = vi.mocked(interviewHooks.useInterview);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when Disconnected", () => {
    useInterviewMock.mockReturnValue({
      currentState: "Disconnected",
      currentQuestion: null,
    } as any);

    const { container } = render(<CurrentQuestionCard />);
    expect(container.firstChild).toBeNull();
  });

  it("should render fallback text when question is null", () => {
    useInterviewMock.mockReturnValue({
      currentState: "WaitingInterview",
      currentQuestion: null,
    } as any);

    render(<CurrentQuestionCard />);
    expect(screen.getByText("Bonjour Thomas. Prenons quelques secondes.")).toBeDefined();
  });

  it("should render the current question", () => {
    useInterviewMock.mockReturnValue({
      currentState: "Listening",
      currentQuestion: "Pouvez-vous me parler de votre expérience React ?",
    } as any);

    render(<CurrentQuestionCard />);
    expect(screen.getByText("Pouvez-vous me parler de votre expérience React ?")).toBeDefined();
  });
});
