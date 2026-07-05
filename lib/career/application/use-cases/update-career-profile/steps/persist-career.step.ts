import { CareerPipelineStep, CareerPipelineContext } from "../career-pipeline";
import { CareerRepositoryPort } from "../../../../ports/career-repository.port";
import { PredictionRepositoryPort } from "../../../../ports/prediction-repository.port";

export class PersistCareerStep implements CareerPipelineStep {
  constructor(
    private readonly careerRepo: CareerRepositoryPort,
    private readonly predictionRepo: PredictionRepositoryPort
  ) {}

  async execute(context: CareerPipelineContext): Promise<CareerPipelineContext> {
    if (!context.profile) {
      throw new Error("Profile must be loaded before persisting");
    }

    const saveResult = await this.careerRepo.save(context.profile);
    if (saveResult.isFailure()) {
      throw new Error(saveResult.unwrapError().message);
    }

    if (context.prediction) {
      const predResult = await this.predictionRepo.saveSnapshot(context.prediction);
      if (predResult.isFailure()) {
        throw new Error(predResult.unwrapError().message);
      }
    }

    return context;
  }
}
