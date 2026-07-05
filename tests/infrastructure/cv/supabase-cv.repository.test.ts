import { describe, it, expect, beforeEach, vi } from "vitest";
import { Result, ok, fail } from "../../../lib/core/result";
import { InfrastructureError } from "../../../lib/core/result/errors";
import { CVAggregate } from "../../../lib/cv/domain/aggregates/cv.aggregate";
import { FakeClock } from "../../shared/fakes";

// Mock getServerDb before importing the repository
const mockSupabase = {
  from: vi.fn(),
};

vi.mock("../../../lib/db/client", () => ({
  getServerDb: () => Promise.resolve(mockSupabase),
}));

import { SupabaseCvRepository } from "../../../lib/cv/infrastructure/repositories/supabase-cv.repository";

describe("SupabaseCvRepository", () => {
  let repository: SupabaseCvRepository;
  let fakeClock: FakeClock;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeClock = new FakeClock();
    repository = new SupabaseCvRepository(fakeClock);
  });

  describe("save", () => {
    it("should save CV successfully", async () => {
      const cv = CVAggregate.upload("user123", "cv123", "https://storage.example.com/cv.pdf", fakeClock);

      const mockEq = vi.fn().mockResolvedValue({ error: null });
      const mockUpsert = vi.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({
        upsert: mockUpsert,
      });

      const result = await repository.save(cv);

      expect(result.isSuccess()).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith("cvs");
      expect(mockUpsert).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "cv123");
    });

    it("should return error when upsert fails", async () => {
      const cv = CVAggregate.upload("user123", "cv123", "https://storage.example.com/cv.pdf", fakeClock);

      mockSupabase.from = vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: { message: "Database error" } }),
      });

      const result = await repository.save(cv);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error on exception", async () => {
      const cv = CVAggregate.upload("user123", "cv123", "https://storage.example.com/cv.pdf", fakeClock);

      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.save(cv);

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("findById", () => {
    it("should find CV by ID successfully", async () => {
      const mockData = {
        id: "cv123",
        user_id: "user123",
        title: "Software Engineer",
        original_text: "Experience in software development",
        optimized_text: null,
        pdf_url: "https://storage.example.com/cv.pdf",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await repository.findById("cv123");

      expect(result.isSuccess()).toBe(true);
      const cv = result.unwrap();
      expect(cv.id).toBe("cv123");
      expect(cv.userId).toBe("user123");
    });

    it("should return error when CV not found", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
          }),
        }),
      });

      const result = await repository.findById("cv123");

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.findById("cv123");

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("findByUserId", () => {
    it("should find CVs by user ID successfully", async () => {
      const mockData = [
        {
          id: "cv123",
          user_id: "user123",
          title: "Software Engineer",
          original_text: "Experience in software development",
          optimized_text: null,
          pdf_url: "https://storage.example.com/cv.pdf",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await repository.findByUserId("user123");

      expect(result.isSuccess()).toBe(true);
      const cvs = result.unwrap();
      expect(cvs).toHaveLength(1);
      expect(cvs[0].id).toBe("cv123");
    });

    it("should return empty array when no CVs found", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const result = await repository.findByUserId("user123");

      expect(result.isSuccess()).toBe(true);
      const cvs = result.unwrap();
      expect(cvs).toHaveLength(0);
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.findByUserId("user123");

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });

  describe("delete", () => {
    it("should delete CV successfully", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      });

      const result = await repository.delete("cv123");

      expect(result.isSuccess()).toBe(true);
    });

    it("should return error when delete fails", async () => {
      mockSupabase.from = vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: "Database error" } }),
        }),
      });

      const result = await repository.delete("cv123");

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error on exception", async () => {
      mockSupabase.from = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });

      const result = await repository.delete("cv123");

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });
  });
});
