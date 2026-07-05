import { describe, it, expect, beforeEach, vi } from "vitest";
import { ActivateSubscriptionUseCase, ActivateSubscriptionCommand } from "../../../lib/billing/application/use-cases/activate-subscription.use-case";
import { ok, fail } from "../../../lib/core/result";
import { InfrastructureError } from "../../../lib/core/result/errors";
import { FakeClock, FakeIdGenerator } from "../../../tests/shared/fakes";

describe("ActivateSubscriptionUseCase", () => {
  let useCase: ActivateSubscriptionUseCase;
  let fakeClock: FakeClock;
  let fakeIdGenerator: FakeIdGenerator;
  let mockSubscriptionRepo: any;

  beforeEach(() => {
    fakeClock = new FakeClock();
    fakeIdGenerator = new FakeIdGenerator();
    
    mockSubscriptionRepo = {
      save: vi.fn().mockResolvedValue(ok(undefined)),
    };

    useCase = new ActivateSubscriptionUseCase(
      mockSubscriptionRepo,
      fakeClock,
      fakeIdGenerator
    );
  });

  describe("Success", () => {
    it("should activate subscription successfully", async () => {
      const command: ActivateSubscriptionCommand = {
        userId: "user-123",
        stripeCustomerId: "cus_123",
        stripeSubId: "sub_456",
        planStr: "PRO",
        periodEnd: new Date("2024-12-31"),
      };

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
      expect(mockSubscriptionRepo.save).toHaveBeenCalled();
    });
  });

  describe("Validation failure", () => {
    it("should handle invalid plan", async () => {
      const command: ActivateSubscriptionCommand = {
        userId: "user-123",
        stripeCustomerId: "cus_123",
        stripeSubId: "sub_456",
        planStr: "", // Invalid plan
        periodEnd: new Date("2024-12-31"),
      };

      // Plan.create() will throw error for invalid plan
      await expect(useCase.execute(command)).rejects.toThrow();
    });
  });

  describe("Repository failure", () => {
    it("should return error when save fails", async () => {
      mockSubscriptionRepo.save.mockResolvedValue(fail(new InfrastructureError("Database save failed")));

      const command: ActivateSubscriptionCommand = {
        userId: "user-123",
        stripeCustomerId: "cus_123",
        stripeSubId: "sub_456",
        planStr: "PRO",
        periodEnd: new Date("2024-12-31"),
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in save", async () => {
      mockSubscriptionRepo.save.mockImplementation(() => {
        throw new Error("Unexpected save error");
      });

      const command: ActivateSubscriptionCommand = {
        userId: "user-123",
        stripeCustomerId: "cus_123",
        stripeSubId: "sub_456",
        planStr: "PRO",
        periodEnd: new Date("2024-12-31"),
      };

      await expect(useCase.execute(command)).rejects.toThrow("Unexpected save error");
    });
  });
});
