import { Mapper } from "@/lib/core/infrastructure/base/Mapper";
import { InterviewSessionAggregate } from "../../domain/aggregates/interview-session.aggregate";
import { InterviewSession } from "@prisma/client";
import { PressureLevel } from "../../domain/value-objects/pressure-level.vo";
import { Persona } from "../../domain/value-objects/persona.vo";
import { InterviewState } from "../../domain/aggregates/interview-state-machine";
import { InterviewQuestion } from "../../domain/value-objects/interview-question.vo";
import { InterviewAnswer } from "../../domain/value-objects/interview-answer.vo";
import { AnswerAnalysis } from "../../domain/value-objects/answer-analysis.vo";
import { Clock } from "@/lib/core/clock/Clock";

export class InterviewSessionMapper implements Mapper<InterviewSession, InterviewSessionAggregate> {
  constructor(private readonly clock: Clock) {}

  toDomain(raw: InterviewSession): InterviewSessionAggregate {
    const rawQuestions = Array.isArray(raw.questions) ? raw.questions : [];
    const rawAnswers = Array.isArray(raw.answers) ? raw.answers : [];

    const questions = rawQuestions.map((q: any) => InterviewQuestion.create({
      content: q.content,
      expectedSkills: q.expectedSkills,
      intent: q.intent,
      generatedAt: new Date(q.generatedAt || raw.createdAt)
    }));

    const answers = rawAnswers.map((a: any) => ({
      answer: InterviewAnswer.create({
        content: a.content,
        submittedAt: new Date(a.submittedAt || raw.createdAt),
        metrics: a.metrics
      }),
      analysis: a.analysis ? AnswerAnalysis.create({
        clarityScore: a.analysis.clarityScore,
        specificityScore: a.analysis.specificityScore,
        confidenceScore: a.analysis.confidenceScore,
        feedback: a.analysis.feedback,
        detectedWeaknesses: a.analysis.detectedWeaknesses || []
      }) : undefined
    }));

    const persona = Persona.create({
      id: raw.persona || "default",
      type: "direct", // In a real scenario, this would be fetched or mapped from a more complete persona definition
      instructions: "Default instructions"
    });

    return InterviewSessionAggregate.load(raw.id, {
      userId: raw.userId || "anonymous",
      jobTitle: raw.jobTitle || "Unknown Job",
      questions,
      answers,
      currentState: (raw.currentState as InterviewState) || "READY",
      pressureLevel: PressureLevel.create(raw.pressureLevel || 20),
      persona,
      startTime: raw.startedAt,
      endTime: raw.completedAt || undefined
    }, this.clock);
  }

  toPersistence(domain: InterviewSessionAggregate): InterviewSession {
    const rawQuestions = domain.questions.map(q => ({
      content: q.content,
      expectedSkills: q.expectedSkills,
      intent: q.intent,
      generatedAt: q.generatedAt.toISOString()
    }));

    const rawAnswers = domain.answers.map(a => ({
      content: a.answer.content,
      submittedAt: a.answer.submittedAt.toISOString(),
      metrics: a.answer.metrics,
      analysis: a.analysis ? {
        clarityScore: a.analysis.clarityScore,
        specificityScore: a.analysis.specificityScore,
        confidenceScore: a.analysis.confidenceScore,
        feedback: a.analysis.feedback,
        detectedWeaknesses: a.analysis.detectedWeaknesses
      } : null
    }));

    return {
      id: domain.id,
      userId: domain.userId,
      persona: domain.persona.id,
      currentState: domain.currentState,
      clarityScore: null,
      confidenceScore: null,
      ownershipScore: null,
      specificityScore: null,
      pressureLevel: domain.pressureLevel.value,
      authenticityScore: 1.0,
      jobTitle: domain.props.jobTitle,
      company: null,
      score: null,
      status: domain.currentState === "COMPLETED" ? "completed" : "active",
      questions: rawQuestions,
      answers: rawAnswers,
      analysis: null,
      startedAt: domain.props.startTime,
      completedAt: domain.props.endTime || null,
      createdAt: domain.props.startTime, // Ideally, leave undefined for new records, but we map it here
      careerTrajectoryScore: null,
      challengeEntryId: null,
      isPremium: false,
      sessionType: "interview"
    };
  }
}
