/**
 * Tests de sécurité : vérification que les routes LLM ne sont PAS
 * appelables sans auth, sans crédits, ou sans rate limit.
 *
 * Ces tests ne nécessitent PAS de connexion API externe.
 * Ils vérifient uniquement les gates de sécurité.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ─────────────────────────────────────────────────────
vi.mock("@/lib/auth", () => ({
  getAuthenticatedUser: vi.fn(),
}));

vi.mock("@/lib/credits/transactional", () => ({
  CreditTransaction: {
    reserve: vi.fn(),
    commit: vi.fn(),
    rollback: vi.fn(),
  },
}));

vi.mock("@/lib/openai", () => ({
  getOpenAIClient: vi.fn(),
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: vi.fn().mockImplementation(() => ({
    limit: vi.fn().mockResolvedValue({ success: true }),
  })),
}));

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn(),
}));

import { getAuthenticatedUser } from "@/lib/auth";
import { CreditTransaction } from "@/lib/credits/transactional";

const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  email_confirmed_at: "2026-01-01T00:00:00Z",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const mockTxResult = { txId: "tx-123" };

beforeEach(() => {
  vi.clearAllMocks();
  process.env.UPSTASH_REDIS_REST_URL = "http://localhost:6379";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  process.env.OPENAI_API_KEY = "test-openai-key";
});

// ─── Tests communs aux 3 routes ─────────────────────────────────

describe("Sécurité routes LLM — gates de protection", () => {
  describe("Auth obligatoire", () => {
    it("doit rejeter une requête sans utilisateur (401)", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

      const { POST } = await import("@/app/api/ai/stream/route");
      const req = new Request("http://localhost/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: "test" }),
      });
      const response = await POST(req);

      expect(response.status).toBe(401);
      expect(getAuthenticatedUser).toHaveBeenCalled();
      expect(CreditTransaction.reserve).not.toHaveBeenCalled();
    });

    it("doit rejeter /api/ai/tts sans utilisateur (401)", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

      const { POST } = await import("@/app/api/ai/tts/route");
      const req = new Request("http://localhost/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textChunk: "test" }),
      });
      const response = await POST(req);

      expect(response.status).toBe(401);
      expect(CreditTransaction.reserve).not.toHaveBeenCalled();
    });

    it("doit rejeter /api/cv/analyze sans utilisateur (401)", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(null);

      const { POST } = await import("@/app/api/cv/analyze/route");
      const req = new Request("http://localhost/api/cv/analyze", {
        method: "POST",
      });
      const response = await POST(req);

      expect(response.status).toBe(401);
      expect(CreditTransaction.reserve).not.toHaveBeenCalled();
    });
  });

  describe("CreditTransaction obligatoire", () => {
    it("doit appeler CreditTransaction.reserve avant tout appel LLM", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser);
      vi.mocked(CreditTransaction.reserve).mockResolvedValue({
        error: "Insufficient credits",
      });

      const { POST } = await import("@/app/api/ai/stream/route");
      const req = new Request("http://localhost/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: "test transcript" }),
      });
      await POST(req);

      expect(CreditTransaction.reserve).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(Number),
        expect.stringContaining("ai_stream"),
        expect.any(String),
      );
    });

    it("doit retourner 402 si crédits insuffisants", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser);
      vi.mocked(CreditTransaction.reserve).mockResolvedValue({
        error: "Insufficient credits or system error.",
      });

      const { POST } = await import("@/app/api/ai/stream/route");
      const req = new Request("http://localhost/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: "test transcript" }),
      });
      const response = await POST(req);

      expect(response.status).toBe(402);
    });
  });

  describe("Rollback en cas d'erreur LLM", () => {
    it("doit appeler rollback si reserve réussi mais LLM échoue", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser);
      vi.mocked(CreditTransaction.reserve).mockResolvedValue(mockTxResult);

      // Simule un échec OpenAI
      const { getOpenAIClient } = await import("@/lib/openai");
      vi.mocked(getOpenAIClient).mockImplementation(() => {
        return {
          chat: {
            completions: {
              create: vi.fn().mockRejectedValue(new Error("OpenAI API down")),
            },
          },
        } as any;
      });

      const { POST } = await import("@/app/api/ai/stream/route");
      const req = new Request("http://localhost/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: "test transcript" }),
      });
      const response = await POST(req);

      expect(response.status).toBe(502);
      expect(CreditTransaction.rollback).toHaveBeenCalledWith(
        "tx-123",
        "openai_call_failed",
      );
      expect(CreditTransaction.commit).not.toHaveBeenCalled();
    });
  });

  describe("Validation des inputs", () => {
    it("doit rejeter /api/ai/stream sans transcript (400)", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser);
      vi.mocked(CreditTransaction.reserve).mockResolvedValue(mockTxResult);

      const { POST } = await import("@/app/api/ai/stream/route");
      const req = new Request("http://localhost/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: "test" }), // pas de transcript
      });
      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("doit rejeter /api/ai/tts sans textChunk (400)", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser);
      vi.mocked(CreditTransaction.reserve).mockResolvedValue(mockTxResult);

      const { POST } = await import("@/app/api/ai/tts/route");
      const req = new Request("http://localhost/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // pas de textChunk
      });
      const response = await POST(req);

      expect(response.status).toBe(400);
    });

    it("doit rejeter /api/cv/analyze sans fichier (400)", async () => {
      vi.mocked(getAuthenticatedUser).mockResolvedValue(mockUser);
      vi.mocked(CreditTransaction.reserve).mockResolvedValue(mockTxResult);

      const { POST } = await import("@/app/api/cv/analyze/route");
      const formData = new FormData();
      // Pas de fichier ajouté
      const req = new Request("http://localhost/api/cv/analyze", {
        method: "POST",
        body: formData,
      });
      const response = await POST(req);

      expect(response.status).toBe(400);
    });
  });
});
