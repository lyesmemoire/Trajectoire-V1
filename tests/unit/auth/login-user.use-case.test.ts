import { describe, it, expect, beforeEach, vi } from "vitest";
import { LoginUserUseCase, LoginUserCommand } from "../../../lib/auth/application/use-cases/login-user.use-case";
import { ok, fail } from "../../../lib/core/result";
import { UnauthorizedError } from "../../../lib/core/result/errors";
import { InfrastructureError } from "../../../lib/core/result/errors";

describe("LoginUserUseCase", () => {
  let useCase: LoginUserUseCase;
  let mockAuthProvider: any;

  beforeEach(() => {
    mockAuthProvider = {
      login: vi.fn(),
    };

    useCase = new LoginUserUseCase(mockAuthProvider);
  });

  describe("Success", () => {
    it("should login successfully with valid credentials", async () => {
      const command: LoginUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
      };

      mockAuthProvider.login.mockResolvedValue(
        ok({
          userId: "user-123",
          accessToken: "access-token",
          refreshToken: "refresh-token",
          expiresIn: 3600,
        })
      );

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toEqual({
        userId: "user-123",
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
      });
      expect(mockAuthProvider.login).toHaveBeenCalledWith({
        email: expect.objectContaining({ value: "test@example.com" }),
        password: "SecurePassword123!",
      });
    });
  });

  describe("Validation failure", () => {
    it("should return error when email is invalid", async () => {
      const command: LoginUserCommand = {
        email: "invalid-email",
        password: "SecurePassword123!",
      };

      await expect(useCase.execute(command)).rejects.toThrow("Invalid email format");
    });
  });

  describe("Authentication failure", () => {
    it("should return UnauthorizedError for invalid credentials", async () => {
      mockAuthProvider.login.mockResolvedValue(
        fail(new InfrastructureError("Invalid login credentials"))
      );

      const command: LoginUserCommand = {
        email: "test@example.com",
        password: "wrong-password",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
      expect(result.unwrapError().message).toBe("Email ou mot de passe incorrect");
    });

    it("should return UnauthorizedError for unconfirmed email", async () => {
      mockAuthProvider.login.mockResolvedValue(
        fail(new InfrastructureError("Email not confirmed"))
      );

      const command: LoginUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
      expect(result.unwrapError().message).toBe("Veuillez confirmer votre email avant de vous connecter");
    });

    it("should return original error for other auth failures", async () => {
      mockAuthProvider.login.mockResolvedValue(
        fail(new InfrastructureError("Network error"))
      );

      const command: LoginUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Provider failure", () => {
    it("should return error when auth provider fails", async () => {
      mockAuthProvider.login.mockResolvedValue(
        fail(new UnauthorizedError("Auth provider error"))
      );

      const command: LoginUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in auth provider", async () => {
      mockAuthProvider.login.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const command: LoginUserCommand = {
        email: "test@example.com",
        password: "SecurePassword123!",
      };

      await expect(useCase.execute(command)).rejects.toThrow("Unexpected error");
    });
  });
});
