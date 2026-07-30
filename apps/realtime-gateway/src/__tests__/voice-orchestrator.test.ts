import { describe, it, expect } from "vitest";
import { 
  handleCommand, 
  handleRepeat, 
  handleStop 
} from "../voice-interview/core/voice-orchestrator-handlers.js";
import type { TurnContext } from "../voice-interview/core/voice-orchestrator-handlers.js";

const mockState = (): unknown => ({
  phase: "intro" as const,
  askedQuestions: ["Question 1", "Question 2"],
  jobGap: "gap",
  interviewId: "1",
  evaluationScore: 0,
  scoreSignals: [],
});

const mockHistory = () => ([]);

describe("voice-orchestrator-handlers", () => {
  describe("routing intent → handler", () => {
    it.each([
      ["repeat", "Bien sûr, je reformule plus simplement."],
      ["clarify", "Pas de souci, voici une explication."],
      ["stop", "Très bien, terminons ici. Voici ta synthèse."],
      ["slower", "D'accord, je ralentis. Reprenons tranquillement."],
      ["next", "D'accord, passons à la question suivante."],
    ] as const)("intent command %s retourne le bon feedback", (action, expectedFeedback) => {
      const ctx: TurnContext = { state: mockState(), transcript: "test", history: mockHistory() };
      const result = handleCommand(action, ctx);
      expect(result.feedback).toBe(expectedFeedback);
    });
  });

  it("handleStop clôture et résume", () => {
    const ctx: TurnContext = { state: mockState(), transcript: "stop", history: mockHistory() };
    const result = handleStop(ctx);
    expect(result.finished).toBe(true);
    expect(result.summary).toBeDefined();
    expect(result.statePatch).toEqual({ phase: "wrap" });
  });

  it("handleRepeat reformule la dernière question", () => {
    const ctx: TurnContext = { state: mockState(), transcript: "repeat", history: mockHistory() };
    const result = handleRepeat(ctx);
    expect(result.speakText).toContain("gap"); 
    expect(result.finished).toBe(false);
  });

});
