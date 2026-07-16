import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InterviewShell } from "@/features/voice-interview/components/layout/InterviewShell";

vi.mock("@/features/voice-interview/hooks/useConnection", () => ({
  useConnection: () => ({
    status: "connected",
    latencyMs: 30,
    retryAttempt: 0,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

describe("InterviewShell", () => {
  it("should render children inside the shell", () => {
    render(
      <InterviewShell>
        <div data-testid="child">Hello</div>
      </InterviewShell>
    );
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Hello")).toBeDefined();
  });

  it("should render the header with Trajectoire branding", () => {
    render(<InterviewShell><div /></InterviewShell>);
    expect(screen.getByText("Trajectoire")).toBeDefined();
    expect(screen.getByText("Coach d'Entretien")).toBeDefined();
  });

  it("should have a bg-surface background", () => {
    const { container } = render(<InterviewShell><div /></InterviewShell>);
    const shell = container.firstChild as HTMLElement;
    expect(shell.className).toContain("bg-surface");
  });
});
