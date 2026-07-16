import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LatencyIndicator } from "@/features/voice-interview/components/layout/LatencyIndicator";
import * as hooks from "@/features/voice-interview/hooks/useConnection";

vi.mock("@/features/voice-interview/hooks/useConnection");

describe("LatencyIndicator", () => {
  const useConnectionMock = vi.mocked(hooks.useConnection);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when disconnected", () => {
    useConnectionMock.mockReturnValue({
      status: "disconnected",
      latencyMs: null,
      retryAttempt: 0,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    const { container } = render(<LatencyIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render when latency is null", () => {
    useConnectionMock.mockReturnValue({
      status: "connected",
      latencyMs: null,
      retryAttempt: 0,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    const { container } = render(<LatencyIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it("should render latency value when connected", () => {
    useConnectionMock.mockReturnValue({
      status: "connected",
      latencyMs: 42,
      retryAttempt: 0,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<LatencyIndicator />);
    expect(screen.getByText("42 ms")).toBeDefined();
  });

  it("should have accessible label", () => {
    useConnectionMock.mockReturnValue({
      status: "connected",
      latencyMs: 150,
      retryAttempt: 0,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<LatencyIndicator />);
    expect(screen.getByLabelText("Latence de 150 millisecondes")).toBeDefined();
  });
});
