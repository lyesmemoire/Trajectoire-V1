import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TranscriptLine } from "@/features/voice-interview/components/interview/TranscriptLine";

describe("TranscriptLine", () => {
  it("should render the text content", () => {
    render(<TranscriptLine text="Bonjour, parlez-moi de vous." speaker="ai" />);
    expect(screen.getByText("Bonjour, parlez-moi de vous.")).toBeDefined();
  });

  it("should align AI messages to the left", () => {
    const { container } = render(<TranscriptLine text="Question" speaker="ai" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-start");
  });

  it("should align user messages to the right", () => {
    const { container } = render(<TranscriptLine text="Réponse" speaker="user" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("justify-end");
  });
});
