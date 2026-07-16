// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/lib/core/infrastructure/base/PrismaRepository";
import { PredictionRepositoryPort } from "../../ports/prediction-repository.port";
import { PredictionSnapshotEntity } from "../../domain/entities/prediction-snapshot.entity";
import { Result } from "@/lib/core/result";

export class PrismaPredictionRepository extends PrismaRepository implements PredictionRepositoryPort {
  constructor(private readonly prismaClient: PrismaClient) {
    super();
  }

  protected get db() {
    return this.prismaClient;
  }

  async saveSnapshot(snapshot: PredictionSnapshotEntity): Promise<Result<void>> {
    return this.safeExecute(async () => {
      await this.db.userPredictionSnapshot.create({
        data: {
          id: snapshot.id,
          userId: snapshot.userId,
          sessionId: snapshot.sessionId,
          returnProbability: snapshot.returnProbability.value,
          returnSegment: snapshot.returnSegment,
          primaryDriver: snapshot.primaryDriver,
          createdAt: snapshot.createdAt,
        }
      });
    });
  }

  async findSnapshotsForUser(userId: string): Promise<Result<PredictionSnapshotEntity[]>> {
    return this.safeExecute(async () => {
      const raw = await this.db.userPredictionSnapshot.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      return raw.map((r: any) => new PredictionSnapshotEntity({
        id: r.id,
        userId: r.userId,
        sessionId: r.sessionId,
        returnProbability: r.returnProbability,
        returnSegment: r.returnSegment,
        primaryDriver: r.primaryDriver,
        stressScore: r.stressScore || 0,
        recoveryScore: r.recoveryScore || 0,
        engagementScore: r.engagementScore || 0,
        createdAt: r.createdAt
      }));
    });
  }
}
