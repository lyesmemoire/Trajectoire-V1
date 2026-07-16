import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getStrictUser = vi.fn();
const createInterviewUseCase = vi.fn();
const toResponse = vi.fn();

vi.mock("@/lib/auth/get-user", () => ({ getStrictUser }));
vi.mock("@/lib/interview/composition/interview.factory", () => ({ createInterviewUseCase }));
vi.mock("@/lib/interview/infrastructure/adapters/interview-stream.adapter", () => ({
  InterviewStreamAdapter: { toResponse },
}));

describe("POST /api/interview/chat", () => {
  it("authenticates, creates the use case and adapts its stream", async () => {
    getStrictUser.mockResolvedValue({ id: "user-1" });
    const execute = vi.fn(async function* () {
      yield { type: "TextDelta", text: "Bonjour" };
    });
    createInterviewUseCase.mockReturnValue({ execute });
    toResponse.mockReturnValue(new Response("stream", { status: 200 }));

    const { POST } = await import("@/app/api/interview/chat/route");
    const request = new NextRequest("http://localhost/api/interview/chat", {
      method: "POST",
      body: JSON.stringify({
        sessionId: "session-1",
        messages: [{ id: "message-1", role: "user", parts: [{ type: "text", text: "Bonjour" }] }],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(createInterviewUseCase).toHaveBeenCalledOnce();
    expect(execute).toHaveBeenCalledWith("user-1", expect.objectContaining({ sessionId: "session-1" }));
    expect(toResponse).toHaveBeenCalledOnce();
  });
});

