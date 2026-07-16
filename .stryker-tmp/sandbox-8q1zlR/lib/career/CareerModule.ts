// @ts-nocheck
import { DomainModule } from "@/lib/core/application/DomainModule";
import { Container } from "@/lib/core/runtime/container/Container";
import { UuidGenerator } from "@/lib/core/id/IdGenerator";
import { Clock } from "@/lib/core/clock/Clock";
import prisma from "@/lib/prisma";

import { PrismaCareerRepository } from "./infrastructure/repositories/prisma-career.repository";
import { PrismaPredictionRepository } from "./infrastructure/repositories/prisma-prediction.repository";

import { AiInsightAdapter } from "./infrastructure/adapters/ai-insight.adapter";
import { HeuristicPredictionAdapter } from "./infrastructure/adapters/heuristic-prediction.adapter";
import { IntegrityEngineAdapter } from "./infrastructure/adapters/integrity-engine.adapter";

import { LoadCareerProfileStep } from "./application/use-cases/update-career-profile/steps/load-career-profile.step";
import { ComputeAuthenticityStep } from "./application/use-cases/update-career-profile/steps/compute-authenticity.step";
import { ComputePredictionStep } from "./application/use-cases/update-career-profile/steps/compute-prediction.step";
import { GenerateInsightsStep } from "./application/use-cases/update-career-profile/steps/generate-insights.step";
import { PersistCareerStep } from "./application/use-cases/update-career-profile/steps/persist-career.step";
import { UpdateCareerProfileUseCase } from "./application/use-cases/update-career-profile/update-career-profile.use-case";

import { CareerPresenter } from "./presentation/career.presenter";

export class CareerModule extends DomainModule {
  protected registerRepositories(container: Container): void {
    const clock = container.resolve("Clock") as Clock;
    container.registerSingleton("CareerRepositoryPort", () => new PrismaCareerRepository(prisma, clock));
    container.registerSingleton("PredictionRepositoryPort", new PrismaPredictionRepository(prisma));
  }

  protected registerGateways(container: Container): void {
    container.registerSingleton("InsightGeneratorPort", new AiInsightAdapter());
    container.registerSingleton("PredictionEnginePort", new HeuristicPredictionAdapter());
    container.registerSingleton("AuthenticityEnginePort", new IntegrityEngineAdapter());
  }

  protected registerUseCases(container: Container): void {
    container.registerTransient("UpdateCareerProfileUseCase", () => {
      const idGenerator = new UuidGenerator();
      const clock = container.resolve("Clock") as Clock;

      const loadStep = new LoadCareerProfileStep(
        container.resolve("CareerRepositoryPort"),
        idGenerator,
        clock
      );
      const authStep = new ComputeAuthenticityStep(
        container.resolve("AuthenticityEnginePort")
      );
      const predictionStep = new ComputePredictionStep(
        container.resolve("PredictionEnginePort"),
        idGenerator,
        clock
      );
      const insightStep = new GenerateInsightsStep(
        container.resolve("InsightGeneratorPort")
      );
      const persistStep = new PersistCareerStep(
        container.resolve("CareerRepositoryPort"),
        container.resolve("PredictionRepositoryPort")
      );

      return new UpdateCareerProfileUseCase(
        [loadStep, authStep, predictionStep, insightStep, persistStep],
        container.resolve("DomainEventPublisher")
      );
    });
  }

  protected registerPresenters(container: Container): void {
    container.registerSingleton("CareerPresenter", new CareerPresenter());
  }
}
