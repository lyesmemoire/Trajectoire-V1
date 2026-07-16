// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetCurrentUserUseCase, GetCurrentUserCommand } from "../../../lib/auth/application/use-cases/get-current-user.use-case";
import { ok, fail } from "../../../lib/core/result";
import { NotFoundError } from "../../../lib/core/result/errors";
import { InfrastructureError } from "../../../lib/core/result/errors";
import { UserAggregate } from "../../../lib/auth/domain/aggregates/user.aggregate";
import { Email } from "../../../lib/auth/domain/value-objects/email.vo";
import { DisplayName } from "../../../lib/auth/domain/value-objects/display-name.vo";
import { UserId } from "../../../lib/auth/domain/value-objects/user-id.vo";
import { FakeClock } from "../../../tests/shared/fakes";

describe("GetCurrentUserUseCase", () => {
  let useCase: GetCurrentUserUseCase;
  let fakeClock: FakeClock;
  let mockUserRepo: any;

  beforeEach(() => {
    fakeClock = new FakeClock();
    
    mockUserRepo = {
      findById: vi.fn().mockResolvedValue(ok(null)),
    };

    useCase = new GetCurrentUserUseCase(mockUserRepo);
  });

  describe("Success", () => {
    it("should get current user successfully", async () => {
      const userId = UserId.create("user-123");
      const email = Email.create("test@example.com");
      const displayName = DisplayName.create("Test User");
      const user = UserAggregate.create(userId, email, displayName, fakeClock);

      mockUserRepo.findById.mockResolvedValue(ok(user));

      const command: GetCurrentUserCommand = {
        userId: "user-123",
      };

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBe(user);
      expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe("Validation failure", () => {
    it("should return NotFoundError when user not found", async () => {
      mockUserRepo.findById.mockResolvedValue(ok(null));

      const command: GetCurrentUserCommand = {
        userId: "user-123",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(NotFoundError);
      expect(result.unwrapError().message).toBe("User not found");
    });
  });

  describe("Repository failure", () => {
    it("should return error when findById fails", async () => {
      mockUserRepo.findById.mockResolvedValue(fail(new InfrastructureError("Database error")));

      const command: GetCurrentUserCommand = {
        userId: "user-123",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in findById", async () => {
      mockUserRepo.findById.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const command: GetCurrentUserCommand = {
        userId: "user-123",
      };

      await expect(useCase.execute(command)).rejects.toThrow("Unexpected error");
    });
  });
});
