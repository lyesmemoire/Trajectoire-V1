import { describe, it, expect, beforeEach, vi } from "vitest";
import { InfrastructureError } from "../../../lib/core/result/errors";
import { FakeClock } from "../../shared/fakes";
import { PressureLevel } from "../../../lib/interview/domain/value-objects/pressure-level.vo";
import { Persona } from "../../../lib/interview/domain/value-objects/persona.vo";

// Mock PrismaClient and prisma module using factory functions
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    interviewSession: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
  })),
}));

vi.mock("../../../lib/prisma", () => ({
  default: {
    interviewSession: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { PrismaInterviewRepository } from "../../../lib/interview/infrastructure/repositories/prisma-interview.repository";
import { InterviewSessionAggregate } from "../../../lib/interview/domain/aggregates/interview-session.aggregate";
import prisma from "../../../lib/prisma";

describe("PrismaInterviewRepository", () => {
  let repository: PrismaInterviewRepository;
  let fakeClock: FakeClock;

  beforeEach(() => {
    vi.clearAllMocks();
    fakeClock = new FakeClock();
    repository = new PrismaInterviewRepository(prisma as unknown, fakeClock);
  });

  describe("getById", () => {
    it("should find interview session by ID successfully", async () => {
      const mockData = {
        id: "session123",
        userId: "user123",
        persona: "default",
        currentState: "READY",
        pressureLevel: 20,
        jobTitle: "Software Engineer",
        status: "active",
        questions: [],
        answers: [],
        startedAt: new Date(),
        completedAt: null,
      };

      (prisma.interviewSession.findUnique as unknown).mockResolvedValue(mockData);

      const result = await repository.getById("session123");

      expect(result.isSuccess()).toBe(true);
      const session = result.unwrap();
      expect(session.id).toBe("session123");
      expect(session.userId).toBe("user123");
    });

    it("should return error when session not found", async () => {
      (prisma.interviewSession.findUnique as unknown).mockResolvedValue(null);

      const result = await repository.getById("session123");

      expect(result.isFailure()).toBe(true);
      expect(result.unwrapError()).toBeInstanceOf(InfrastructureError);
    });

    it("should return error on exception", async () => {
      (prisma.interviewSession.findUnique as unknown).mockRejectedValue(new Error("Database error"));

      const result = await repository.getById("session123");

      expect(result.isFailure()).toBe(true);
    });
  });

  describe("findActiveByUserId", () => {
    it("should find active interview session by user ID successfully", async () => {
      const mockData = {
        id: "session123",
        userId: "user123",
        persona: "default",
        currentState: "READY",
        pressureLevel: 20,
        jobTitle: "Software Engineer",
        status: "active",
        questions: [],
        answers: [],
        startedAt: new Date(),
        completedAt: null,
      };

      (prisma.interviewSession.findFirst as unknown).mockResolvedValue(mockData);

      const result = await repository.findActiveByUserId("user123");

      expect(result.isSuccess()).toBe(true);
      const session = result.unwrap();
      expect(session.id).toBe("session123");
    });

    it("should return null when no active session found", async () => {
      (prisma.interviewSession.findFirst as unknown).mockResolvedValue(null);

      const result = await repository.findActiveByUserId("user123");

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBeNull();
    });

    it("should return error on exception", async () => {
      (prisma.interviewSession.findFirst as unknown).mockRejectedValue(new Error("Database error"));

      const result = await repository.findActiveByUserId("user123");

      expect(result.isFailure()).toBe(true);
    });
  });

  describe("findByCorrelationId", () => {
    it("should return null (not implemented)", async () => {
      const result = await repository.findByCorrelationId("correlation123");

      expect(result.isSuccess()).toBe(true);
      expect(result.unwrap()).toBeNull();
    });
  });

  describe("save", () => {
    it("should save interview session successfully", async () => {
      const session = InterviewSessionAggregate.load("session123", {
        userId: "user123",
        jobTitle: "Software Engineer",
        questions: [],
        answers: [],
        currentState: "READY",
        pressureLevel: PressureLevel.create(20),
        persona: Persona.create({ id: "default", type: "direct", instructions: "Default" }),
        startTime: new Date(),
        endTime: undefined,
      }, fakeClock);

      (prisma.interviewSession.upsert as unknown).mockResolvedValue({});

      const result = await repository.save(session);

      expect(result.isSuccess()).toBe(true);
      expect((prisma.interviewSession.upsert as unknown)).toHaveBeenCalled();
    });

    it("should return error on exception", async () => {
      const session = InterviewSessionAggregate.load("session123", {
        userId: "user123",
        jobTitle: "Software Engineer",
        questions: [],
        answers: [],
        currentState: "READY",
        pressureLevel: PressureLevel.create(20),
        persona: Persona.create({ id: "default", type: "direct", instructions: "Default" }),
        startTime: new Date(),
        endTime: undefined,
      }, fakeClock);

      (prisma.interviewSession.upsert as unknown).mockRejectedValue(new Error("Database error"));

      const result = await repository.save(session);

      expect(result.isFailure()).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete interview session successfully", async () => {
      (prisma.interviewSession.delete as unknown).mockResolvedValue({});

      const result = await repository.delete("session123");

      expect(result.isSuccess()).toBe(true);
      expect((prisma.interviewSession.delete as unknown)).toHaveBeenCalledWith({
        where: { id: "session123" },
      });
    });

    it("should return error on exception", async () => {
      (prisma.interviewSession.delete as unknown).mockRejectedValue(new Error("Database error"));

      const result = await repository.delete("session123");

      expect(result.isFailure()).toBe(true);
    });
  });
});
