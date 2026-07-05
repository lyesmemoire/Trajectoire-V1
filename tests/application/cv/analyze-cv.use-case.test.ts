import { describe, it, expect, beforeEach, vi } from "vitest";
import { AnalyzeCvUseCase, AnalyzeCvInput } from "../../../lib/cv/application/use-cases/analyze/analyze-cv.use-case";
import { ok, fail } from "../../../lib/core/result";
import { RequestContext } from "../../../lib/core/runtime/context/RequestContext";
import { UnauthorizedError, InfrastructureError } from "../../../lib/core/result/errors";
import { CVAggregate } from "../../../lib/cv/domain/aggregates/cv.aggregate";
import { UserId } from "../../../lib/auth/domain/value-objects/user-id.vo";
import { FakeClock } from "../../../tests/shared/fakes";

describe("AnalyzeCvUseCase", () => {
  let useCase: AnalyzeCvUseCase;
  let fakeClock: FakeClock;
  let mockAtsAnalyzer: any;
  let mockCvRepo: any;
  let mockPublisher: any;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeClock = new FakeClock();
    
    mockAtsAnalyzer = {
      analyzeCv: vi.fn().mockResolvedValue(ok({
        score: 85,
        matchedKeywords: ["javascript", "react"],
        missingKeywords: ["typescript"],
        strengths: ["Strong JS skills"],
        weaknesses: ["Missing TS"],
        recommendations: ["Learn TypeScript"],
      })),
    };

    mockCvRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(ok(undefined)),
    };

    mockPublisher = {
      publishEventsFrom: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new AnalyzeCvUseCase(
      mockAtsAnalyzer,
      mockCvRepo,
      mockPublisher
    );
  });

  describe("Success", () => {
    it("should analyze CV successfully", async () => {
      const cv = CVAggregate.upload("user-123", "cv-456", "https://storage.example.com/cv.pdf", fakeClock);
      cv.attachParsedText("Sample CV text with javascript and react skills");
      
      mockCvRepo.findById.mockResolvedValue(ok(cv));

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
        jobDescription: "React Developer position",
      };

      const result = await useCase.execute(input);

      expect(result.isSuccess()).toBe(true);
      expect(mockCvRepo.findById).toHaveBeenCalledWith("cv-456");
      expect(mockAtsAnalyzer.analyzeCv).toHaveBeenCalled();
      expect(mockCvRepo.save).toHaveBeenCalled();
      expect(mockPublisher.publishEventsFrom).toHaveBeenCalled();
    });
  });

  describe("Validation failure", () => {
    it("should return UnauthorizedError when user not authenticated", async () => {
      vi.spyOn(RequestContext, "userId").mockReturnValue(undefined);

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
      };

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
    });

    it("should return UnauthorizedError when user does not own CV", async () => {
      const cv = CVAggregate.upload("other-user", "cv-456", "https://storage.example.com/cv.pdf", fakeClock);
      mockCvRepo.findById.mockResolvedValue(ok(cv));

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
      };

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
      expect(result.unwrapError().message).toBe("Not authorized to analyze this CV");
    });

    it("should return error when CV has no text", async () => {
      const cv = CVAggregate.upload("user-123", "cv-456", "https://storage.example.com/cv.pdf", fakeClock);
      mockCvRepo.findById.mockResolvedValue(ok(cv));

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
      };

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Repository failure", () => {
    it("should return error when findById fails", async () => {
      mockCvRepo.findById.mockResolvedValue(fail(new InfrastructureError("Database error")));

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
      };

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error when save fails", async () => {
      const cv = CVAggregate.upload("user-123", "cv-456", "https://storage.example.com/cv.pdf", fakeClock);
      cv.attachParsedText("Sample text");
      mockCvRepo.findById.mockResolvedValue(ok(cv));
      mockCvRepo.save.mockResolvedValue(fail(new InfrastructureError("Save failed")));

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
      };

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("Unexpected error", () => {
    it("should handle unexpected errors in findById", async () => {
      mockCvRepo.findById.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");

      const input: AnalyzeCvInput = {
        cvId: "cv-456",
      };

      await expect(useCase.execute(input)).rejects.toThrow("Unexpected error");
    });
  });
});
