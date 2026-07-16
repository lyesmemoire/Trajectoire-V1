import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TelemetryPanel } from "@/features/voice-interview/components/dialogs/TelemetryPanel";

vi.mock("@/features/voice-interview/hooks/useTelemetry", () => ({
  useTelemetry: () => ({
    snapshot: null,
    sttLatencyMs: 120,
    llmLatencyMs: 350,
    ttsLatencyMs: 80,
    roundTripMs: 550,
    wsLatencyMs: 25,
    currentPhase: null,
    traceId: "trace-abc-123",
  }),
}));

describe("TelemetryPanel", () => {
  it("should initially show only a toggle button", () => {
    render(<TelemetryPanel />);
    expect(screen.getByRole("button", { name: "Afficher la télémétrie" })).toBeDefined();
  });

  it("should expand when toggle is clicked", () => {
    render(<TelemetryPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Afficher la télémétrie" }));
    expect(screen.getByText("Télémétrie")).toBeDefined();
    expect(screen.getByText("120 ms")).toBeDefined();
    expect(screen.getByText("350 ms")).toBeDefined();
    expect(screen.getByText("550 ms")).toBeDefined();
  });

  it("should collapse when close is clicked", () => {
    render(<TelemetryPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Afficher la télémétrie" }));
    fireEvent.click(screen.getByRole("button", { name: "Fermer la télémétrie" }));
    expect(screen.queryByText("Télémétrie")).toBeNull();
  });
});
