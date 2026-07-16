import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConnectionBadge } from "@/features/voice-interview/components/layout/ConnectionBadge";
import * as hooks from "@/features/voice-interview/hooks/useConnection";

vi.mock("@/features/voice-interview/hooks/useConnection");

describe("ConnectionBadge", () => {
  const useConnectionMock = vi.mocked(hooks.useConnection);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render Connected state", () => {
    useConnectionMock.mockReturnValue({
      status: "connected",
      latencyMs: 50,
      retryAttempt: 0,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<ConnectionBadge />);
    expect(screen.getByText("Connecté")).toBeDefined();
  });

  it("should render Connecting state", () => {
    useConnectionMock.mockReturnValue({
      status: "connecting",
      latencyMs: null,
      retryAttempt: 1,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<ConnectionBadge />);
    expect(screen.getByText("Connexion sécurisée...")).toBeDefined();
  });

  it("should render Disconnected state", () => {
    useConnectionMock.mockReturnValue({
      status: "disconnected",
      latencyMs: null,
      retryAttempt: 0,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    });

    render(<ConnectionBadge />);
    expect(screen.getByText("Déconnecté")).toBeDefined();
  });
});
