import { Result } from "@/lib/core/result";
import { PredictionSnapshotEntity } from "../domain/entities/prediction-snapshot.entity";

export interface PredictionRepositoryPort {
  saveSnapshot(snapshot: PredictionSnapshotEntity): Promise<Result<void>>;
  findSnapshotsForUser(userId: string): Promise<Result<PredictionSnapshotEntity[]>>;
}
