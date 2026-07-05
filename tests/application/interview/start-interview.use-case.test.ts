import { describe, it, expect, beforeEach, vi } from "vitest";
import { StartInterviewUseCase, StartInterviewCommand } from "../../../lib/interview/application/use-cases/start-interview/start-interview.use-case";
import { ok, fail } from "../../../lib/core/result";
import { ApplicationError } from "../../../lib/core/errors";
import { InfrastructureError } from "../../../lib/core/result/errors";
import { FakeClock, FakeIdGenerator } from "../../../tests/shared/fakes";

describe("StartInterviewUseCase", () => {
  let useCase: StartInterviewUseCase;
  let fakeClock: FakeClock;
  let fakeIdGenerator: FakeIdGenerator;
  let mockInterviewRepo: any;
  let mockPublisher: any;

  beforeEach(() => {
    fakeClock = new FakeClock();
    fakeIdGenerator = new FakeIdGenerator();
    
    mockInterviewRepo = {
      findActiveByUserId: vi.fn().mockResolvedValue(ok(null)),
      save: vi.fn().mockResolvedValue(ok(undefined)),
    };

    mockPublisher = {
      publishEventsFrom: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new StartInterviewUseCase(
      mockInterviewRepo,
      mockPublisher,
      fakeIdGenerator,
      fakeClock
    );
  });

  describe("Success", () => {
    it("should start an interview successfully", async () => {
      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
      };

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBe("test-0");
      expect(mockInterviewRepo.findActiveByUserId).toHaveBeenCalledWith("user-123");
      expect(mockInterviewRepo.save).toHaveBeenCalled();
      expect(mockPublisher.publishEventsFrom).toHaveBeenCalled();
    });

    it("should start interview with optional fields", async () => {
      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
        jobDescription: "Senior role",
        cvId: "cv-456",
        candidateSummary: "Experienced developer",
      };

      const result = await useCase.execute(command);

      expect(result.isSuccess()).toBe(true);
    });
  });

  describe("Validation failure", () => {
    it("should return error when interview already active", async () => {
      mockInterviewRepo.findActiveByUserId.mockResolvedValue(ok({ id: "existing-session" }));

      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(ApplicationError);
      expect(result.unwrapError().message).toBe("An interview is already active for this user.");
    });
  });

  describe("Repository failure", () => {
    it("should return error when findActiveByUserId fails", async () => {
      mockInterviewRepo.findActiveByUserId.mockResolvedValue(fail(new InfrastructureError("Database error")));

      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error when save fails", async () => {
      mockInterviewRepo.save.mockResolvedValue(fail(new InfrastructureError("Save failed")));

      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
      };

      const result = await useCase.execute(command);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in findActiveByUserId", async () => {
      mockInterviewRepo.findActiveByUserId.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
      };

      await expect(useCase.execute(command)).rejects.toThrow("Unexpected error");
    });

    it("should handle unexpected errors in save", async () => {
      mockInterviewRepo.save.mockImplementation(() => {
        throw new Error("Unexpected save error");
      });

      const command: StartInterviewCommand = {
        userId: "user-123",
        jobTitle: "Software Engineer",
      };

      await expect(useCase.execute(command)).rejects.toThrow("Unexpected save error");
    });
  });
});
