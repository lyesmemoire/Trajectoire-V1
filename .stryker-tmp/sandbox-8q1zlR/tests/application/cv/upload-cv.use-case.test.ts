// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { UploadCvUseCase, UploadCvInput } from "../../../lib/cv/application/use-cases/upload/upload-cv.use-case";
import { ok, fail } from "../../../lib/core/result";
import { RequestContext } from "../../../lib/core/runtime/context/RequestContext";
import { UnauthorizedError } from "../../../lib/core/result/errors";
import { FakeClock } from "../../../tests/shared/fakes";

// Mock dependencies
const mockStorage = {
  uploadFile: vi.fn(),
};

const mockParser = {
  extractText: vi.fn(),
};

const mockRepository = {
  save: vi.fn(),
};

const mockPublisher = {
  publishEventsFrom: vi.fn(),
};

const mockIdGenerator = {
  generate: vi.fn(),
};

describe("UploadCvUseCase", () => {
  let useCase: UploadCvUseCase;
  let fakeClock: FakeClock;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeClock = new FakeClock();
    useCase = new UploadCvUseCase(
      mockStorage as any,
      mockParser as any,
      mockRepository as any,
      mockPublisher as any,
      mockIdGenerator as any,
      fakeClock
    );
  });

  describe("successful upload", () => {
    it("should upload CV successfully", async () => {
      const input: UploadCvInput = {
        file: Buffer.from("test content"),
        filename: "cv.pdf",
        mimeType: "application/pdf",
      };

      // Setup mocks
      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");
      mockIdGenerator.generate.mockReturnValue("cv-456");
      mockStorage.uploadFile.mockResolvedValue(ok("https://storage.example.com/cv-456.pdf"));
      mockParser.extractText.mockResolvedValue(ok("Parsed CV text"));
      mockRepository.save.mockResolvedValue(ok(undefined));
      mockPublisher.publishEventsFrom.mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toEqual({
        cvId: "cv-456",
        url: "https://storage.example.com/cv-456.pdf",
      });

      expect(mockStorage.uploadFile).toHaveBeenCalledWith("user-123", input.file, input.filename);
      expect(mockParser.extractText).toHaveBeenCalledWith(input.file, input.mimeType);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockPublisher.publishEventsFrom).toHaveBeenCalled();
    });

    it("should handle failed parsing gracefully", async () => {
      const input: UploadCvInput = {
        file: Buffer.from("test content"),
        filename: "cv.pdf",
        mimeType: "application/pdf",
      };

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");
      mockIdGenerator.generate.mockReturnValue("cv-456");
      mockStorage.uploadFile.mockResolvedValue(ok("https://storage.example.com/cv-456.pdf"));
      mockParser.extractText.mockResolvedValue(fail(new UnauthorizedError("Parse failed")));
      mockRepository.save.mockResolvedValue(ok(undefined));
      mockPublisher.publishEventsFrom.mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      expect(result.isSuccess()).toBe(true);
      // Should still succeed even if parsing fails
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should return UnauthorizedError when user is not authenticated", async () => {
      const input: UploadCvInput = {
        file: Buffer.from("test content"),
        filename: "cv.pdf",
        mimeType: "application/pdf",
      };

      vi.spyOn(RequestContext, "userId").mockReturnValue(undefined);

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(UnauthorizedError);
      expect(result.unwrapError().message).toBe("User not authenticated");
    });

    it("should return error when storage upload fails", async () => {
      const input: UploadCvInput = {
        file: Buffer.from("test content"),
        filename: "cv.pdf",
        mimeType: "application/pdf",
      };

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");
      mockStorage.uploadFile.mockResolvedValue(fail(new UnauthorizedError("Storage upload failed")));

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError().message).toBe("Storage upload failed");
    });

    it("should return error when repository save fails", async () => {
      const input: UploadCvInput = {
        file: Buffer.from("test content"),
        filename: "cv.pdf",
        mimeType: "application/pdf",
      };

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");
      mockIdGenerator.generate.mockReturnValue("cv-456");
      mockStorage.uploadFile.mockResolvedValue(ok("https://storage.example.com/cv-456.pdf"));
      mockParser.extractText.mockResolvedValue(ok("Parsed text"));
      mockRepository.save.mockResolvedValue(fail(new UnauthorizedError("Database save failed")));

      const result = await useCase.execute(input);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError().message).toBe("Database save failed");
    });
  });

  describe("pipeline order", () => {
    it("should execute steps in correct order: storage → aggregate → parse → persist → publish", async () => {
      const input: UploadCvInput = {
        file: Buffer.from("test content"),
        filename: "cv.pdf",
        mimeType: "application/pdf",
      };

      vi.spyOn(RequestContext, "userId").mockReturnValue("user-123");
      mockIdGenerator.generate.mockReturnValue("cv-456");
      mockStorage.uploadFile.mockResolvedValue(ok("https://storage.example.com/cv-456.pdf"));
      mockParser.extractText.mockResolvedValue(ok("Parsed text"));
      mockRepository.save.mockResolvedValue(ok(undefined));
      mockPublisher.publishEventsFrom.mockResolvedValue(undefined);

      await useCase.execute(input);

      const callOrder = [
        mockStorage.uploadFile,
        mockParser.extractText,
        mockRepository.save,
        mockPublisher.publishEventsFrom,
      ];

      callOrder.forEach((mock, index) => {
        if (index > 0) {
          expect(mock.mock.invocationCallOrder[0]).toBeGreaterThan(
            callOrder[index - 1].mock.invocationCallOrder[0]
          );
        }
      });
    });
  });
});
