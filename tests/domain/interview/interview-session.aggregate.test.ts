import { describe, it, expect } from "vitest";
import { InterviewSessionAggregate } from "../../../lib/interview/domain/aggregates/interview-session.aggregate";
import { InterviewQuestion } from "../../../lib/interview/domain/value-objects/interview-question.vo";
import { InterviewAnswer } from "../../../lib/interview/domain/value-objects/interview-answer.vo";
import { AnswerAnalysis } from "../../../lib/interview/domain/value-objects/answer-analysis.vo";
import { PressureLevel } from "../../../lib/interview/domain/value-objects/pressure-level.vo";
import { Persona } from "../../../lib/interview/domain/value-objects/persona.vo";
import {
  InterviewStarted,
  AnswerSubmitted,
  RecoveryTriggered,
  InterviewPressureAdjusted,
  InterviewCompleted,
  InterviewStepOrchestrated
} from "../../../lib/interview/domain/events/interview-events";

describe("InterviewSessionAggregate", () => {
  describe("creation", () => {
    it("should create a new interview session", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create(
        "session-1",
        "user-1",
        "Software Engineer",
        persona,
        "Job description",
        "cv-1",
        "Candidate summary"
      );
      
      expect(session.id).toBe("session-1");
      expect(session.userId).toBe("user-1");
      expect(session.currentState).toBe("READY");
      expect(session.pressureLevel.value).toBe(20);
      expect(session.questions).toHaveLength(0);
      expect(session.answers).toHaveLength(0);
      expect(session.persona.type).toBe("direct");
    });

    it("should emit InterviewStarted event on creation", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create(
        "session-1",
        "user-1",
        "Software Engineer",
        persona
      );
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(InterviewStarted);
      
      const eventPayload = (events[0] as InterviewStarted).payload;
      expect(eventPayload.userId).toBe("user-1");
      expect(eventPayload.jobTitle).toBe("Software Engineer");
    });

    it("should load an existing session", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const props = {
        userId: "user-1",
        jobTitle: "Software Engineer",
        jobDescription: "Job description",
        cvId: "cv-1",
        candidateSummary: "Candidate summary",
        questions: [],
        answers: [],
        currentState: "QUESTIONING" as const,
        pressureLevel: PressureLevel.create(30),
        persona,
        startTime: new Date("2024-01-01T00:00:00Z"),
      };
      
      const session = InterviewSessionAggregate.load("session-1", props);
      
      expect(session.id).toBe("session-1");
      expect(session.currentState).toBe("QUESTIONING");
      expect(session.pressureLevel.value).toBe(30);
    });
  });

  describe("advance", () => {
    it("should advance to valid state", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.advance("INTRODUCTION" as const);
      
      expect(session.currentState).toBe("INTRODUCTION");
    });

    it("should throw error on invalid state transition", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      expect(() => session.advance("QUESTIONING" as const)).toThrow(
        "Invalid state transition from READY to QUESTIONING"
      );
    });

    it("should allow valid state transitions", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.advance("INTRODUCTION" as const);
      expect(session.currentState).toBe("INTRODUCTION");
      
      session.advance("QUESTIONING" as const);
      expect(session.currentState).toBe("QUESTIONING");
      
      session.advance("RECOVERY" as const);
      expect(session.currentState).toBe("RECOVERY");
      
      session.advance("QUESTIONING" as const);
      expect(session.currentState).toBe("QUESTIONING");
      
      session.advance("COMPLETED" as const);
      expect(session.currentState).toBe("COMPLETED");
    });
  });

  describe("addQuestion", () => {
    it("should add a question to the session", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const question = InterviewQuestion.create({
        content: "What is your experience?",
        expectedSkills: ["JavaScript"],
        intent: "Technical",
        generatedAt: new Date()
      });
      session.addQuestion(question);
      
      expect(session.questions).toHaveLength(1);
      expect(session.questions[0].content).toBe("What is your experience?");
    });

    it("should add multiple questions", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.addQuestion(InterviewQuestion.create({
        content: "Question 1?",
        expectedSkills: ["JavaScript"],
        intent: "Technical",
        generatedAt: new Date()
      }));
      session.addQuestion(InterviewQuestion.create({
        content: "Question 2?",
        expectedSkills: ["Communication"],
        intent: "Behavioral",
        generatedAt: new Date()
      }));
      session.addQuestion(InterviewQuestion.create({
        content: "Question 3?",
        expectedSkills: ["TypeScript"],
        intent: "Technical",
        generatedAt: new Date()
      }));
      
      expect(session.questions).toHaveLength(3);
    });
  });

  describe("submitAnswer", () => {
    it("should submit answer and emit AnswerSubmitted event", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const answer = InterviewAnswer.create({
        content: "I have 5 years of experience",
        submittedAt: new Date()
      });
      const analysis = AnswerAnalysis.create({
        clarityScore: 85,
        specificityScore: 90,
        confidenceScore: 80,
        feedback: "Good answer",
        detectedWeaknesses: []
      });
      
      session.submitAnswer(answer, analysis);
      
      expect(session.answers).toHaveLength(1);
      expect(session.answers[0].answer.content).toBe("I have 5 years of experience");
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2); // InterviewStarted + AnswerSubmitted
      expect(events[1]).toBeInstanceOf(AnswerSubmitted);
      
      const eventPayload = (events[1] as AnswerSubmitted).payload;
      expect(eventPayload.answerContent).toBe("I have 5 years of experience");
    });

    it("should store analysis with answer", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const answer = InterviewAnswer.create({
        content: "My answer",
        submittedAt: new Date()
      });
      const analysis = AnswerAnalysis.create({
        clarityScore: 85,
        specificityScore: 90,
        confidenceScore: 80,
        feedback: "Good",
        detectedWeaknesses: []
      });
      
      session.submitAnswer(answer, analysis);
      
      expect(session.answers[0].analysis).toBeDefined();
      expect(session.answers[0].analysis?.clarityScore).toBe(85);
    });
  });

  describe("orchestrateStep", () => {
    it("should emit InterviewStepOrchestrated event for standard step", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.orchestrateStep(false);
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2); // InterviewStarted + InterviewStepOrchestrated
      expect(events[1]).toBeInstanceOf(InterviewStepOrchestrated);
      
      const eventPayload = (events[1] as InterviewStepOrchestrated).payload;
      expect(eventPayload.step).toBe("STANDARD");
    });

    it("should emit InterviewStepOrchestrated event for recovery step", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.orchestrateStep(true);
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[1]).toBeInstanceOf(InterviewStepOrchestrated);
      
      const eventPayload = (events[1] as InterviewStepOrchestrated).payload;
      expect(eventPayload.step).toBe("RECOVERY");
    });
  });

  describe("adjustPressure", () => {
    it("should adjust pressure level and emit event", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const newPressure = PressureLevel.create(40);
      session.adjustPressure(newPressure);
      
      expect(session.pressureLevel.value).toBe(40);
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[1]).toBeInstanceOf(InterviewPressureAdjusted);
      
      const eventPayload = (events[1] as InterviewPressureAdjusted).payload;
      expect(eventPayload.previousPressure).toBe(20);
      expect(eventPayload.newPressure).toBe(40);
    });

    it("should track pressure changes over time", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.adjustPressure(PressureLevel.create(30));
      session.adjustPressure(PressureLevel.create(50));
      session.adjustPressure(PressureLevel.create(40));
      
      expect(session.pressureLevel.value).toBe(40);
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(4); // InterviewStarted + 3 pressure adjustments
    });
  });

  describe("triggerRecovery", () => {
    it("should trigger recovery and emit RecoveryTriggered event", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.advance("INTRODUCTION" as const);
      session.advance("QUESTIONING" as const);
      
      const newPressure = PressureLevel.create(10);
      session.triggerRecovery(newPressure);
      
      expect(session.currentState).toBe("RECOVERY");
      expect(session.pressureLevel.value).toBe(10);
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2); // InterviewStarted + RecoveryTriggered
      expect(events[1]).toBeInstanceOf(RecoveryTriggered);
      
      const eventPayload = (events[1] as RecoveryTriggered).payload;
      expect(eventPayload.previousPressure).toBe(20);
      expect(eventPayload.newPressure).toBe(10);
    });
  });

  describe("finish", () => {
    it("should finish interview and emit InterviewCompleted event", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.advance("INTRODUCTION" as const);
      session.advance("QUESTIONING" as const);
      
      session.finish();
      
      expect(session.currentState).toBe("COMPLETED");
      expect(session.props.endTime).toBeDefined();
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[1]).toBeInstanceOf(InterviewCompleted);
      
      const eventPayload = (events[1] as InterviewCompleted).payload;
      expect(eventPayload.finalPressure).toBe(20);
    });

    it("should set endTime timestamp", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const startTime = session.props.startTime;
      
      const delay = new Promise(resolve => setTimeout(resolve, 10));
      
      return delay.then(() => {
        session.advance("INTRODUCTION" as const);
        session.advance("QUESTIONING" as const);
        session.finish();
        
        expect(session.props.endTime).toBeDefined();
        expect(session.props.endTime!.getTime()).toBeGreaterThan(startTime.getTime());
      });
    });
  });

  describe("immutability", () => {
    it("should return copy of questions array", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const questions1 = session.questions;
      const questions2 = session.questions;
      
      expect(questions1).not.toBe(questions2);
    });

    it("should return copy of answers array", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      const answers1 = session.answers;
      const answers2 = session.answers;
      
      expect(answers1).not.toBe(answers2);
    });
  });

  describe("event ordering", () => {
    it("should emit events in correct order", () => {
      const persona = Persona.create({
        id: "persona-1",
        type: "direct",
        instructions: "Professional recruiter persona"
      });
      const session = InterviewSessionAggregate.create("session-1", "user-1", "Software Engineer", persona);
      
      session.advance("INTRODUCTION" as const);
      session.addQuestion(InterviewQuestion.create({
        content: "Question?",
        generatedAt: new Date()
      }));
      session.adjustPressure(PressureLevel.create(30));
      
      const events = (session as unknown).pullEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toBeInstanceOf(InterviewStarted);
      expect(events[1]).toBeInstanceOf(InterviewPressureAdjusted);
    });
  });
});

