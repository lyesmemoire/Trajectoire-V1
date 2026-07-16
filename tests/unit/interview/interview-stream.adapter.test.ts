import { describe, expect, it } from "vitest";

vi.mock("server-only", () => ({}));

import { InterviewStreamAdapter } from "@/lib/interview/infrastructure/adapters/interview-stream.adapter";

describe("InterviewStreamAdapter", () => {
  it("adapts text domain events to an AI SDK response", async () => {
    async function* events() {
      yield { type: "TextDelta" as const, text: "Bonjour" };
      yield {
        type: "Completed" as const,
        output: {
          responseId: "response-1",
          sessionId: "session-1",
          finalAnswer: "Bonjour",
          actions: [],
          metadata: {
            model: "test",
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            latencyMs: 0,
            contextSources: [],
            completedAtIso: "2026-07-13T00:00:00.000Z",
          },
        },
      };
    }

    const response = InterviewStreamAdapter.toResponse(events());
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain("Bonjour");
  });
});
