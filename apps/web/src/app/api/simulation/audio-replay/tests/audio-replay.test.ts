import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock dependencies
vi.mock("@/lib/auth/verified-user", () => ({
  getVerifiedUserWithRetry: vi.fn(),
}));

vi.mock("@/lib/supabase/service", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    interviewSession: {
      findUnique: vi.fn(),
    },
  },
}));

import { GET } from "../route";
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user";
import { createAdminClient } from "@/lib/supabase/service";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

describe("GET /api/simulation/audio-replay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRequest = (url: string) => new NextRequest(new URL(url));

  it("should return 400 if missing parameters", async () => {
    const req = mockRequest("http://localhost/api/simulation/audio-replay");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("should return 401 if unauthenticated", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: null, authError: new Error("unauth") } as any);
    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("should return 404 if session not found", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: { id: "user1" }, authError: null } as any);
    vi.mocked(prisma.interviewSession.findUnique as any).mockResolvedValue(null);

    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("should return 403 if user is not the owner", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: { id: "user1" }, authError: null } as any);
    vi.mocked(prisma.interviewSession.findUnique as any).mockResolvedValue({
      userId: "user2",
      analysis: {},
    });

    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("should return 404 if messageId not in evaluations", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: { id: "user1" }, authError: null } as any);
    vi.mocked(prisma.interviewSession.findUnique as any).mockResolvedValue({
      userId: "user1",
      analysis: {
        qnaEvaluations: [{ messageId: "different-id" }],
      },
    });

    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("should return 404 if audio not found for message", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: { id: "user1" }, authError: null } as any);
    vi.mocked(prisma.interviewSession.findUnique as any).mockResolvedValue({
      userId: "user1",
      analysis: {
        qnaEvaluations: [{ messageId: "456", audio: null }],
      },
    });

    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("should return 500 if storage fails to sign URL", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: { id: "user1" }, authError: null } as any);
    vi.mocked(prisma.interviewSession.findUnique as any).mockResolvedValue({
      userId: "user1",
      analysis: {
        qnaEvaluations: [{ messageId: "456", audio: { path: "user1/123/456.webm" } }],
      },
    });

    const mockCreateSignedUrl = vi.fn().mockResolvedValue({ data: null, error: new Error("Storage error") });
    vi.mocked(createAdminClient).mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: mockCreateSignedUrl,
        }),
      },
    } as any);

    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);
    expect(res.status).toBe(500);
  });

  it("should return signed URL successfully", async () => {
    vi.mocked(getVerifiedUserWithRetry).mockResolvedValue({ user: { id: "user1" }, authError: null } as any);
    vi.mocked(prisma.interviewSession.findUnique as any).mockResolvedValue({
      userId: "user1",
      analysis: {
        qnaEvaluations: [{ messageId: "456", audio: { path: "user1/123/456.webm" } }],
      },
    });

    const mockCreateSignedUrl = vi.fn().mockResolvedValue({ data: { signedUrl: "https://signed.url" }, error: null });
    vi.mocked(createAdminClient).mockReturnValue({
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: mockCreateSignedUrl,
        }),
      },
    } as any);

    const req = mockRequest("http://localhost/api/simulation/audio-replay?sessionId=123&messageId=456");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.signedUrl).toBe("https://signed.url");
    expect(mockCreateSignedUrl).toHaveBeenCalledWith("user1/123/456.webm", 300);
  });
});
