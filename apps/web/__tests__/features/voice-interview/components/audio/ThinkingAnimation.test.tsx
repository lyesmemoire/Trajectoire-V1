import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { ThinkingAnimation } from "@/features/voice-interview/components/audio/ThinkingAnimation";
import * as interviewHooks from "@/features/voice-interview/hooks/useInterview";

vi.mock("@/features/voice-interview/hooks/useInterview");

describe("ThinkingAnimation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dots when WaitingAI", () => {
    vi.mocked(interviewHooks.useInterview).mockReturnValue({
      currentState: "WaitingAI",
    } as any);

    const { container } = render(<ThinkingAnimation />);
    // 3 dots rendered
    const dots = container.querySelectorAll("[class*='rounded-full']");
    expect(dots.length).toBeGreaterThanOrEqual(3);
  });

  it("should render nothing when Listening", () => {
    vi.mocked(interviewHooks.useInterview).mockReturnValue({
      currentState: "Listening",
    } as any);

    const { container } = render(<ThinkingAnimation />);
    // No dot should be rendered (AnimatePresence exit)
    const dots = container.querySelectorAll("[class*='bg-sky']");
    expect(dots.length).toBe(0);
  });
});
