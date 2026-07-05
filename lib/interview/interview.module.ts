import { DomainModule } from "@/lib/core/application/DomainModule";
import { PrismaClient } from "@prisma/client";
import { Container } from "@/lib/core/runtime/container/Container";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";
import { PrismaInterviewRepository } from "./infrastructure/repositories/prisma-interview.repository";
import { OpenAiQuestionGeneratorAdapter } from "./infrastructure/adapters/openai-question-generator.adapter";
import { OpenAiAnswerAnalyzerAdapter } from "./infrastructure/adapters/openai-answer-analyzer.adapter";
import { PressureEngine } from "./domain/services/pressure-engine.service";
import { AnalyzeAnswerStep } from "./application/use-cases/orchestrate-step/steps/analyze-answer.step";
import { EvaluatePressureStep } from "./application/use-cases/orchestrate-step/steps/evaluate-pressure.step";
import { GenerateQuestionStep } from "./application/use-cases/orchestrate-step/steps/generate-question.step";
import { PersistSessionStep } from "./application/use-cases/orchestrate-step/steps/persist-session.step";
import { StartInterviewUseCase } from "./application/use-cases/start-interview/start-interview.use-case";
import { OrchestrateInterviewStepUseCase } from "./application/use-cases/orchestrate-step/orchestrate-interview-step.use-case";
import { InterviewPresenter } from "./presentation/interview.presenter";

export class InterviewModule extends DomainModule {
  register(container: Container): void {
    const clock = container.resolve("Clock") as Clock;

    // Infrastructure
    container.registerSingleton("InterviewRepositoryPort", () => new PrismaInterviewRepository(new PrismaClient(), clock));
    container.registerSingleton("QuestionGeneratorPort", () => new OpenAiQuestionGeneratorAdapter());
    container.registerSingleton("AnswerAnalyzerPort", () => new OpenAiAnswerAnalyzerAdapter());

    // Domain Services
    container.registerSingleton("PressureEngine", () => new PressureEngine());

    // Application Steps
    container.registerSingleton("AnalyzeAnswerStep", () => new AnalyzeAnswerStep(
      container.resolve("AnswerAnalyzerPort")
    ));
    container.registerSingleton("EvaluatePressureStep", () => new EvaluatePressureStep(
      container.resolve("PressureEngine")
    ));
    container.registerSingleton("GenerateQuestionStep", () => new GenerateQuestionStep(
      container.resolve("QuestionGeneratorPort")
    ));
    container.registerSingleton("PersistSessionStep", () => new PersistSessionStep(
      container.resolve("InterviewRepositoryPort"),
      container.resolve("DomainEventPublisher") // Global
    ));

    // UseCases
    container.registerSingleton("StartInterviewUseCase", () => new StartInterviewUseCase(
      container.resolve("InterviewRepositoryPort"),
      container.resolve("DomainEventPublisher"), // Global
      new UuidGenerator(),
      container.resolve("Clock") as Clock
    ));

    container.registerSingleton("OrchestrateInterviewStepUseCase", () => new OrchestrateInterviewStepUseCase(
      container.resolve("InterviewRepositoryPort"),
      container.resolve("AnalyzeAnswerStep"),
      container.resolve("EvaluatePressureStep"),
      container.resolve("GenerateQuestionStep"),
      container.resolve("PersistSessionStep")
    ));

    // Presenter
    container.registerSingleton("InterviewPresenter", () => new InterviewPresenter());
  }
}
