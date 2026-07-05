import { CareerUpdateDTO } from "../../dto/career-update.dto";
import { CareerProfileAggregate } from "../../../domain/aggregates/career-profile.aggregate";
import { PredictionSnapshotEntity } from "../../../domain/entities/prediction-snapshot.entity";
import { AuthenticityScore } from "../../../domain/value-objects/authenticity-score.vo";

export interface CareerPipelineContext {
  // Input
  dto: CareerUpdateDTO;
  userId: string;
  sessionId?: string;

  // State populated along the pipeline
  profile?: CareerProfileAggregate;
  authenticity?: AuthenticityScore;
  prediction?: PredictionSnapshotEntity;
}

export interface CareerPipelineStep {
  execute(context: CareerPipelineContext): Promise<CareerPipelineContext>;
}
