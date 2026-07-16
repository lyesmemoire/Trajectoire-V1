import { describe, expect, it } from "vitest";
import { InterviewConversationUseCase } from "@/lib/interview/application/use-cases/interview-conversation.use-case";
import type { InterviewContextBuilderPort } from "@/lib/interview/domain/ports/interview-context-builder.port";
import type { InterviewEnginePort } from "@/lib/interview/domain/ports/interview-engine.port";

const input = {
  sessionId: "session-1",
  message: "Bonjour",
  history: [],
};

describe("InterviewConversationUseCase", () => {
  it("builds context before streaming engine domain events", async () => {
    const builder: InterviewContextBuilderPort = {
      buildContext: async () => ({
        candidate: { candidateId: "user-1", targetRole: "Manager", yearsOfExperience: 5, skills: [], summary: null },
        jobOffer: { offerId: null, title: "Manager", companyName: null, requiredSkills: [], descriptionSummary: null },
        history: [],
        objectives: [],
        level: "mid",
        constraints: { language: "fr", mode: "behavioral", level: "mid", maximumQuestions: 8, maximumResponseChars: 4000, allowFollowUpQuestions: true },
      }),
    };

    const engine: InterviewEnginePort = {
      async *generateResponseStream() {
        yield { type: "TextDelta", text: "Question" } as const;
      },
    };

    const events = [];
    for await (const event of new InterviewConversationUseCase(builder, engine).execute("user-1", input)) {
      events.push(event);
    }

    expect(events).toEqual([{ type: "TextDelta", text: "Question" }]);
  });

  it("returns a validation event instead of calling the engine for an empty message", async () => {
    const builder = { buildContext: vi.fn() } as unknown as InterviewContextBuilderPort;
    const engine = { generateResponseStream: vi.fn() } as unknown as InterviewEnginePort;

    const events = [];
    for await (const event of new InterviewConversationUseCase(builder, engine).execute("user-1", { ...input, message: " " })) {
      events.push(event);
    }

    expect(events[0]).toMatchObject({ type: "Error", error: { code: "VALIDATION_ERROR" } });
    expect(builder.buildContext).not.toHaveBeenCalled();
  });
});

