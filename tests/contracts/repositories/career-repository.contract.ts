import { describe, it, expect, vi } from "vitest";
import { PrismaCareerRepository } from "../../../lib/career/infrastructure/repositories/prisma-career.repository";
import { CareerProfileEntity } from "../../../lib/career/domain/entities/career-profile.entity";
import { EmployabilityScore } from "../../../lib/career/domain/value-objects/employability-score.vo";
import { CareerScore } from "../../../lib/career/domain/value-objects/career-score.vo";
import { PrismaClient } from "@prisma/client";

// Mock Prisma
const mockPrisma = {
  careerProfile: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  }
} as unknown as PrismaClient;

describe("CareerRepository Contract", () => {
  const repo = new PrismaCareerRepository(mockPrisma);

  it("should implement findByUserId", async () => {
    vi.mocked(mockPrisma.careerProfile.findUnique).mockResolvedValue({
      id: "test-id",
      userId: "user-1",
      employabilityScore: 80,
      communicationScore: 75,
      confidenceScore: 85,
      leadershipScore: 60,
      technicalScore: 90,
      unlockedPersonas: [],
      updatedAt: new Date(),
    } as any);

    const profile = await repo.findByUserId("user-1");
    expect(profile).toBeInstanceOf(CareerProfileEntity);
    expect(profile?.employabilityScore.value).toBe(80);
  });

  it("should implement save", async () => {
    const profile = new CareerProfileEntity({
      id: "test-id-2",
      userId: "user-2",
      employabilityScore: EmployabilityScore.create(50),
      communicationScore: CareerScore.create(50),
      confidenceScore: CareerScore.create(50),
      technicalScore: CareerScore.create(50),
      leadershipScore: CareerScore.create(50),
      unlockedPersonas: [],
      updatedAt: new Date(),
    });

    await repo.save(profile);
    expect(mockPrisma.careerProfile.create).toHaveBeenCalled();
  });
});
