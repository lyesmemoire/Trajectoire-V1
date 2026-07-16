import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompletionCard } from "@/features/voice-interview/components/interview/CompletionCard";

describe("CompletionCard", () => {
  it("should render the completion title", () => {
    render(<CompletionCard />);
    expect(screen.getByText("Merci.")).toBeDefined();
  });

  it("should render a reassuring message", () => {
    render(<CompletionCard />);
    const message = screen.getByText(/Votre entretien est terminé./);
    expect(message).toBeDefined();
  });
});
