import { describe, it, expect, beforeEach, vi } from "vitest";
import { LogoutUserUseCase, LogoutUserCommand } from "../../../lib/auth/application/use-cases/logout-user.use-case";
import { ok, fail } from "../../../lib/core/result";
import { UnauthorizedError } from "../../../lib/core/result/errors";
import { InfrastructureError } from "../../../lib/core/result/errors";

describe("LogoutUserUseCase", () => {
  let useCase: LogoutUserUseCase;
  let mockAuthProvider: any;

  beforeEach(() => {
    mockAuthProvider = {
      logout: vi.fn(),
    };

    useCase = new LogoutUserUseCase(mockAuthProvider);
  });

  describe("Success", () => {
    it("should logout successfully", async () => {
      const command: LogoutUserCommand = {
        userId: "user-123",
      };

      mockAuthProvider.logout.mockResolvedValue(ok(undefined));

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
      expect(mockAuthProvider.logout).toHaveBeenCalledWith("user-123");
    });
  });

  describe("Provider failure", () => {
    it("should return error when auth provider fails", async () => {
      mockAuthProvider.logout.mockResolvedValue(
        fail(new InfrastructureError("Network error"))
      );

      const command: LogoutUserCommand = {
        userId: "user-123",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in auth provider", async () => {
      mockAuthProvider.logout.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const command: LogoutUserCommand = {
        userId: "user-123",
      };

      await expect(useCase.execute(command)).rejects.toThrow("Unexpected error");
    });
  });
});
