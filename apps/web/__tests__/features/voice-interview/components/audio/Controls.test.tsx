import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Controls } from "@/features/voice-interview/components/audio/Controls";
import * as interviewHooks from "@/features/voice-interview/hooks/useInterview";
import * as permissionHooks from "@/features/voice-interview/hooks/usePermissions";

vi.mock("@/features/voice-interview/hooks/useInterview");
vi.mock("@/features/voice-interview/hooks/usePermissions");

describe("Controls", () => {
  const useInterviewMock = vi.mocked(interviewHooks.useInterview);
  const usePermissionsMock = vi.mocked(permissionHooks.usePermissions);

  const defaultInterviewState = {
    currentState: "WaitingInterview",
    previousState: "Disconnected",
    sessionId: null,
    currentQuestion: null,
    feedbackSignal: null,
    isCompleted: false,
    startInterview: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    stop: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    usePermissionsMock.mockReturnValue({
      permission: "granted",
      isRequesting: false,
      requestMicrophoneAccess: vi.fn().mockResolvedValue(true),
    });
  });

  it("should render Microphone button when WaitingInterview", () => {
    useInterviewMock.mockReturnValue(defaultInterviewState);
    render(<Controls />);
    expect(screen.getByRole("button", { name: "Commencer l'entretien" })).toBeDefined();
  });

  it("should render Pause button when Listening", () => {
    useInterviewMock.mockReturnValue({
      ...defaultInterviewState,
      currentState: "Listening",
    });
    render(<Controls />);
    expect(screen.getByRole("button", { name: "Mettre l'entretien en pause" })).toBeDefined();
  });

  it("should render Resume button when Paused", () => {
    useInterviewMock.mockReturnValue({
      ...defaultInterviewState,
      currentState: "Paused",
    });
    render(<Controls />);
    expect(screen.getByRole("button", { name: "Reprendre l'entretien" })).toBeDefined();
  });

  it("should hide controls when Completed", () => {
    useInterviewMock.mockReturnValue({
      ...defaultInterviewState,
      currentState: "Completed",
    });
    const { container } = render(<Controls />);
    expect(container.firstChild).toBeNull();
  });
});
