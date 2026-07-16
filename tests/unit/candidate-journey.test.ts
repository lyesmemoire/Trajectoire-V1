import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { JourneyAggregate } from "@/modules/candidate-journey/domain/aggregates/journey.aggregate";
import { JourneyStep } from "@/modules/candidate-journey/domain/entities/journey.entity";
import { InMemoryJourneyRepository } from "@/modules/candidate-journey/infrastructure/repositories/in-memory-journey-repository";
import { SystemClock } from "@/lib/core/clock/Clock";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";

describe("Candidate Journey Integration", () => {
  let clock: SystemClock;
  let idGenerator: UuidGenerator;
  let repository: InMemoryJourneyRepository;

  beforeEach(() => {
    clock = new SystemClock();
    idGenerator = new UuidGenerator();
    repository = new InMemoryJourneyRepository(clock);
  });

  afterEach(() => {
    repository.clear();
  });

  describe("JourneyAggregate", () => {
    it("should create a new journey", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      expect(journey.id).toBe(journeyId);
      expect(journey.userId).toBe("user-123");
      expect(journey.currentStep).toBe("CV_UPLOAD");
      expect(journey.status).toBe("IN_PROGRESS");
      expect(journey.data.userId).toBe("user-123");
    });

    it("should advance to next step", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      journey.advanceToStep("CAREER_PROFILE", { cvId: "cv-123", cvUrl: "https://example.com/cv.pdf" });

      expect(journey.currentStep).toBe("CAREER_PROFILE");
      expect(journey.data.cvId).toBe("cv-123");
      expect(journey.data.cvUrl).toBe("https://example.com/cv.pdf");
    });

    it("should complete journey", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      journey.complete({
        finalReport: {
          overall_assessment: "Completed",
          dimension_scores: {
            structure: 75,
            specificity: 80,
            impact: 70,
            adaptability: 85,
          },
          strengths: ["Strong communication"],
          development_areas: [],
          cv_coherence: { is_coherent: true, discrepancies: [] },
          readiness_level: "READY",
        },
      });

      expect(journey.status).toBe("COMPLETED");
      expect(journey.completedAt).toBeDefined();
      expect(journey.data.finalReport).toBeDefined();
    });

    it("should fail journey", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      journey.fail("Upload failed");

      expect(journey.status).toBe("FAILED");
      expect(journey.error).toBe("Upload failed");
    });
  });

  describe("InMemoryJourneyRepository", () => {
    it("should save and retrieve journey", async () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      const saveResult = await repository.save(journey);
      expect(saveResult.isSuccess()).toBe(true);

      const findResult = await repository.findById(journeyId);
      expect(findResult.isSuccess()).toBe(true);

      const retrieved = findResult.unwrap();
      expect(retrieved.id).toBe(journeyId);
      expect(retrieved.userId).toBe("user-123");
    });

    it("should find journeys by user", async () => {
      const journeyId1 = idGenerator.generate();
      const journeyId2 = idGenerator.generate();
      
      const journey1 = JourneyAggregate.create(journeyId1, "user-123", clock);
      const journey2 = JourneyAggregate.create(journeyId2, "user-123", clock);

      await repository.save(journey1);
      await repository.save(journey2);

      const findResult = await repository.findByUserId("user-123");
      expect(findResult.isSuccess()).toBe(true);

      const journeys = findResult.unwrap();
      expect(journeys.length).toBe(2);
    });

    it("should delete journey", async () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      await repository.save(journey);
      const deleteResult = await repository.delete(journeyId);
      expect(deleteResult.isSuccess()).toBe(true);

      const findResult = await repository.findById(journeyId);
      expect(findResult.isFailure()).toBe(true);
    });
  });

  describe("Journey Flow", () => {
    it("should complete full journey flow", async () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      // Step 1: CV Upload
      journey.advanceToStep("CAREER_PROFILE", { cvId: "cv-123", cvUrl: "https://example.com/cv.pdf" });
      await repository.save(journey);

      // Step 2: Career Profile
      journey.advanceToStep("JOB_OFFER_IMPORT", {});
      await repository.save(journey);

      // Step 3: Job Offer
      journey.advanceToStep("ATS_ANALYSIS", { jobOfferId: "job-123", jobOfferDescription: "Senior Developer" });
      await repository.save(journey);

      // Step 4: ATS Analysis
      journey.advanceToStep("CV_OPTIMIZATION", {
        atsAnalysisResult: {
          score: 85,
          matchedKeywords: ["React", "TypeScript"],
          missingKeywords: ["GraphQL"],
          strengths: ["Strong technical skills"],
          weaknesses: ["Missing GraphQL"],
          recommendations: ["Learn GraphQL"],
        },
      });
      await repository.save(journey);

      // Step 5: CV Optimization
      journey.advanceToStep("INTERVIEW_SIMULATION", { optimizedCvId: "cv-123" });
      await repository.save(journey);

      // Step 6: Interview
      journey.advanceToStep("FINAL_REPORT", { interviewSessionId: "session-123" });
      await repository.save(journey);

      // Step 7: Complete
      journey.complete({
        finalReport: {
          overall_assessment: "Excellent",
          dimension_scores: {
            structure: 85,
            specificity: 90,
            impact: 80,
            adaptability: 85,
          },
          strengths: ["Strong communication", "Good technical knowledge"],
          development_areas: [],
          cv_coherence: { is_coherent: true, discrepancies: [] },
          readiness_level: "EXCELLENT",
        },
      });
      await repository.save(journey);

      // Verify final state
      const findResult = await repository.findById(journeyId);
      expect(findResult.isSuccess()).toBe(true);

      const finalJourney = findResult.unwrap();
      expect(finalJourney.status).toBe("COMPLETED");
      expect(finalJourney.currentStep).toBe("FINAL_REPORT");
      expect(finalJourney.data.finalReport?.readiness_level).toBe("EXCELLENT");
    });
  });

  describe("Session Resume", () => {
    it("should resume journey from intermediate step", async () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      // Advance to intermediate step
      journey.advanceToStep("ATS_ANALYSIS", { 
        jobOfferId: "job-123", 
        jobOfferDescription: "Senior Developer" 
      });
      await repository.save(journey);

      // Simulate session resume - load journey
      const findResult = await repository.findById(journeyId);
      expect(findResult.isSuccess()).toBe(true);

      const resumedJourney = findResult.unwrap();
      expect(resumedJourney.currentStep).toBe("ATS_ANALYSIS");
      expect(resumedJourney.status).toBe("IN_PROGRESS");

      // Continue from resumed state
      resumedJourney.advanceToStep("CV_OPTIMIZATION", {
        atsAnalysisResult: {
          score: 85,
          matchedKeywords: ["React"],
          missingKeywords: [],
          strengths: ["Strong skills"],
          weaknesses: [],
          recommendations: [],
        },
      });
      await repository.save(resumedJourney);

      // Verify continuation
      const finalResult = await repository.findById(journeyId);
      expect(finalResult.isSuccess()).toBe(true);
      expect(finalResult.unwrap().currentStep).toBe("CV_OPTIMIZATION");
    });
  });

  describe("Journey Progression", () => {
    it("should calculate progress correctly", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      expect(journey.progress).toBe(14); // 1/7 = 14%

      journey.advanceToStep("CAREER_PROFILE", {});
      expect(journey.progress).toBe(29); // 2/7 = 29%

      journey.advanceToStep("JOB_OFFER_IMPORT", {});
      expect(journey.progress).toBe(43); // 3/7 = 43%

      journey.advanceToStep("ATS_ANALYSIS", {});
      expect(journey.progress).toBe(57); // 4/7 = 57%

      journey.advanceToStep("CV_OPTIMIZATION", {});
      expect(journey.progress).toBe(71); // 5/7 = 71%

      journey.advanceToStep("INTERVIEW_SIMULATION", {});
      expect(journey.progress).toBe(86); // 6/7 = 86%

      journey.advanceToStep("FINAL_REPORT", {});
      expect(journey.progress).toBe(100); // 7/7 = 100%
    });

    it("should track completed steps", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      expect(journey.completedSteps).toEqual([]);

      journey.advanceToStep("CAREER_PROFILE", {});
      expect(journey.completedSteps).toEqual(["CV_UPLOAD"]);

      journey.advanceToStep("ATS_ANALYSIS", {});
      expect(journey.completedSteps).toEqual(["CV_UPLOAD", "CAREER_PROFILE", "JOB_OFFER_IMPORT"]);
    });

    it("should provide available actions based on current step", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      expect(journey.availableActions).toContain("uploadCv");

      journey.advanceToStep("CAREER_PROFILE", {});
      expect(journey.availableActions).toContain("updateCareerProfile");
      expect(journey.availableActions).not.toContain("uploadCv");

      journey.advanceToStep("FINAL_REPORT", {});
      expect(journey.availableActions).toContain("generateFinalReport");

      journey.complete({});
      expect(journey.availableActions).toEqual([]);

      journey.fail("Error");
      expect(journey.availableActions).toContain("retry");
      expect(journey.availableActions).toContain("abandon");
    });
  });

  describe("Journey Response", () => {
    it("should return complete response with all fields", () => {
      const journeyId = idGenerator.generate();
      const journey = JourneyAggregate.create(journeyId, "user-123", clock);

      journey.advanceToStep("ATS_ANALYSIS", { jobOfferId: "job-123" });

      const response = journey.toResponse();

      expect(response.id).toBe(journeyId);
      expect(response.userId).toBe("user-123");
      expect(response.currentStep).toBe("ATS_ANALYSIS");
      expect(response.status).toBe("IN_PROGRESS");
      expect(response.progress).toBe(57);
      expect(response.completedSteps).toEqual(["CV_UPLOAD", "CAREER_PROFILE", "JOB_OFFER_IMPORT"]);
      expect(response.availableActions).toContain("analyzeAts");
      expect(response.startedAt).toBeDefined();
      expect(response.completedAt).toBeUndefined();
      expect(response.error).toBeUndefined();
    });
  });
});
