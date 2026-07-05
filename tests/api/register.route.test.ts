import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST } from "../../app/api/register/route";
import { NextRequest } from "next/server";

// Mock dependencies using factory functions
vi.mock("../../lib/core/runtime/container/app-container", () => ({
  appContainer: {
    resolve: vi.fn(),
  },
}));

vi.mock("../../lib/auth/presentation/AuthPresenter", () => ({
  AuthPresenter: class {
    present() {
      return {
        id: "user123",
        email: "test@example.com",
        displayName: "Test User",
      };
    }
  },
}));

vi.mock("../../lib/core/result/errors/ErrorHttpMapper", () => ({
  ErrorHttpMapper: {
    toHttpResponse: vi.fn().mockReturnValue({
      status: 400,
      body: { error: "Validation error", code: "VALIDATION_ERROR" },
    }),
  },
}));

import { appContainer } from "../../lib/core/runtime/container/app-container";
import { RegisterUserUseCase } from "../../lib/auth/application/use-cases/register-user.use-case";
import { ok } from "../../lib/core/result";

describe("POST /api/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should register user successfully with valid data", async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(ok({
        id: "user123",
        email: "test@example.com",
        displayName: "Test User",
      })),
    };

    (appContainer.resolve as any).mockReturnValue(mockUseCase);

    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "test-agent",
        "X-Forwarded-For": "127.0.0.1",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "securePassword123",
        fullName: "Test User",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.email).toBe("test@example.com");
    expect(data.message).toBe("Compte créé. Vérifiez votre email pour activer votre compte.");
    expect(mockUseCase.execute).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "securePassword123",
      displayName: "Test User",
      ip: "127.0.0.1",
      fingerprint: undefined,
      userAgent: "test-agent",
    });
  });

  it("should return 200 for honeypot (company field filled)", async () => {
    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "securePassword123",
        company: "Spam Company",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Si cette adresse est valide, un email de confirmation a été envoyé.");
  });

  it("should return 500 for invalid email (Zod validation error)", async () => {
    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "invalid-email",
        password: "securePassword123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("should return 500 for short password (Zod validation error)", async () => {
    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "short",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("should return error when use case fails", async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue({
        isFailure: () => true,
        unwrapError: () => ({ message: "Email already exists", code: "EMAIL_EXISTS" }),
      }),
    };

    (appContainer.resolve as any).mockReturnValue(mockUseCase);

    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "existing@example.com",
        password: "securePassword123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation error");
  });

  it("should handle missing fullName by using email prefix", async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(ok({
        id: "user123",
        email: "test@example.com",
        displayName: "Test User",
      })),
    };

    (appContainer.resolve as any).mockReturnValue(mockUseCase);

    const request = new NextRequest("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "securePassword123",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "test",
      })
    );
  });
});
