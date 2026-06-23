import { describe, it, expect } from "vitest";
import * as brain from "../voice-interview/core/simulation/interviewer-brain.js";

describe("interviewer-brain (Façade)", () => {
  it("réexporte tous les symboles attendus", () => {
    expect(brain.getPersona).toBeDefined();
    expect(brain.QUESTION_BANK).toBeDefined();
    expect(brain.ROLE_TRACKS).toBeDefined();
    expect(brain.buildInterviewPlan).toBeDefined();
    expect(brain.pickTrapQuestion).toBeDefined();
  });
});
