import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const maybeSingle = vi.fn();
const createServerClient = vi.fn(() => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => ({ maybeSingle })),
      })),
    })),
  })),
}));

vi.mock("@/lib/supabase/server", () => ({ createServerClient }));

describe("SupabaseInterviewContextBuilder", () => {
  it("builds the minimal server context from the owned interview session", async () => {
    maybeSingle.mockResolvedValue({
      data: { id: "session-1", user_id: "user-1", job_title: "Engineering Manager", job_description: "Lead teams" },
      error: null,
    });

    const { SupabaseInterviewContextBuilder } = await import("@/lib/interview/infrastructure/builders/supabase-interview-context.builder");
    const context = await new SupabaseInterviewContextBuilder().buildContext("user-1", {
      sessionId: "session-1",
      message: "Bonjour",
      history: [],
    });

    expect(context.candidate.targetRole).toBe("Engineering Manager");
    expect(context.jobOffer.descriptionSummary).toBe("Lead teams");
    expect(context.constraints.mode).toBe("behavioral");
  });
});
