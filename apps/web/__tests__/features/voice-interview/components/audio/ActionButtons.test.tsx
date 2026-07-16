import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PauseButton } from "@/features/voice-interview/components/audio/PauseButton";
import { ResumeButton } from "@/features/voice-interview/components/audio/ResumeButton";
import { StopButton } from "@/features/voice-interview/components/audio/StopButton";

describe("Action Buttons", () => {
  describe("PauseButton", () => {
    it("should render with correct aria-label", () => {
      render(<PauseButton onPause={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Mettre l'entretien en pause" })).toBeDefined();
    });

    it("should call onPause when clicked", () => {
      const onPause = vi.fn();
      render(<PauseButton onPause={onPause} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onPause).toHaveBeenCalledOnce();
    });

    it("should be disabled when disabled prop is true", () => {
      render(<PauseButton onPause={vi.fn()} disabled />);
      const btn = screen.getByRole("button") as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });
  });

  describe("ResumeButton", () => {
    it("should render with correct label", () => {
      render(<ResumeButton onResume={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Reprendre l'entretien" })).toBeDefined();
    });

    it("should call onResume when clicked", () => {
      const onResume = vi.fn();
      render(<ResumeButton onResume={onResume} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onResume).toHaveBeenCalledOnce();
    });
  });

  describe("StopButton", () => {
    it("should render with correct aria-label", () => {
      render(<StopButton onStop={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Terminer l'entretien définitivement" })).toBeDefined();
    });

    it("should call onStop when clicked", () => {
      const onStop = vi.fn();
      render(<StopButton onStop={onStop} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onStop).toHaveBeenCalledOnce();
    });
  });
});
