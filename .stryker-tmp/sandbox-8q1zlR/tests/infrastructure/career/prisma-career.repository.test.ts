// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from "vitest";
import { PrismaCareerRepository } from "../../../lib/career/infrastructure/repositories/prisma-career.repository";
import { CareerProfileAggregate } from "../../../lib/career/domain/aggregates/career-profile.aggregate";
import { NotFoundError } from "../../../lib/core/result/errors";
import { EmployabilityScore } from "../../../lib/career/domain/value-objects/employability-score.vo";
import { CareerScore } from "../../../lib/career/domain/value-objects/career-score.vo";

// Mock Prisma Client
const mockPrismaClient = {
  careerProfile: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
  },
};

describe("PrismaCareerRepository", () => {
  let repository: PrismaCareerRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PrismaCareerRepository(mockPrismaClient as any);
  });

  describe("getById", () => {
    it("should return career profile by id", async () => {
      const mockProfile = {
        id: "profile-1",
        userId: "user-1",
        employabilityScore: 75,
        communicationScore: 80,
        confidenceTrend: [70, 75, 80],
        leadershipScore: 65,
        unlockedPersonas: ["leader"],
        stressResistance: 70,
        clarityTrend: [75, 80],
        ownershipTrend: [80, 85],
        careerDNA: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.careerProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await repository.getById("profile-1");

      expect(result.isOk()).toBe(true);
      expect(mockPrismaClient.careerProfile.findUnique).toHaveBeenCalledWith({
        where: { id: "profile-1" }
      });
    });

    it("should return NotFoundError when profile not found", async () => {
      mockPrismaClient.careerProfile.findUnique.mockResolvedValue(null);

      const result = await repository.getById("non-existent");

      expect(result.isFail()).toBe(true);
      expect(result.error).toBeInstanceOf(NotFoundError);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database connection failed");
      mockPrismaClient.careerProfile.findUnique.mockRejectedValue(dbError);

      const result = await repository.getById("profile-1");

      expect(result.isFail()).toBe(true);
      expect(result.error).toEqual(dbError);
    });
  });

  describe("findByUserId", () => {
    it("should return career profile by user id", async () => {
      const mockProfile = {
        id: "profile-1",
        userId: "user-1",
        employabilityScore: 75,
        communicationScore: 80,
        confidenceTrend: [70, 75, 80],
        leadershipScore: 65,
        unlockedPersonas: ["leader"],
        stressResistance: 70,
        clarityTrend: [75, 80],
        ownershipTrend: [80, 85],
        careerDNA: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.careerProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await repository.findByUserId("user-1");

      expect(result.isOk()).toBe(true);
      expect(result.value).toBeDefined();
      expect(mockPrismaClient.careerProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" }
      });
    });

    it("should return null when profile not found for user", async () => {
      mockPrismaClient.careerProfile.findUnique.mockResolvedValue(null);

      const result = await repository.findByUserId("non-existent-user");

      expect(result.isOk()).toBe(true);
      expect(result.value).toBeNull();
    });
  });

  describe("save", () => {
    it("should create new profile when it doesn't exist", async () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      
      mockPrismaClient.careerProfile.upsert.mockResolvedValue({ id: "profile-1" });

      const result = await repository.save(profile);

      expect(result.isOk()).toBe(true);
      expect(mockPrismaClient.careerProfile.upsert).toHaveBeenCalledWith({
        where: { id: "profile-1" },
        create: expect.objectContaining({
          id: "profile-1",
          userId: "user-1",
        }),
        update: expect.any(Object),
      });
    });

    it("should update existing profile", async () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      profile.updateScores({
        employability: EmployabilityScore.create(80),
        communication: CareerScore.create(85),
        confidence: CareerScore.create(85),
        technical: CareerScore.create(75),
        leadership: CareerScore.create(70),
      });
      
      mockPrismaClient.careerProfile.upsert.mockResolvedValue({ id: "profile-1" });

      const result = await repository.save(profile);

      expect(result.isOk()).toBe(true);
      expect(mockPrismaClient.careerProfile.upsert).toHaveBeenCalledWith({
        where: { id: "profile-1" },
        create: expect.any(Object),
        update: expect.objectContaining({
          employabilityScore: 80,
          communicationScore: 85,
        }),
      });
    });

    it("should propagate database errors on save", async () => {
      const profile = CareerProfileAggregate.create("profile-1", "user-1");
      const dbError = new Error("Database connection failed");
      mockPrismaClient.careerProfile.upsert.mockRejectedValue(dbError);

      const result = await repository.save(profile);

      expect(result.isFail()).toBe(true);
      expect(result.error).toEqual(dbError);
    });
  });

  describe("delete", () => {
    it("should delete profile by id", async () => {
      mockPrismaClient.careerProfile.delete.mockResolvedValue({ id: "profile-1" });

      const result = await repository.delete("profile-1");

      expect(result.isOk()).toBe(true);
      expect(mockPrismaClient.careerProfile.delete).toHaveBeenCalledWith({
        where: { id: "profile-1" }
      });
    });

    it("should propagate database errors on delete", async () => {
      const dbError = new Error("Database connection failed");
      mockPrismaClient.careerProfile.delete.mockRejectedValue(dbError);

      const result = await repository.delete("profile-1");

      expect(result.isFail()).toBe(true);
      expect(result.error).toEqual(dbError);
    });
  });
});
