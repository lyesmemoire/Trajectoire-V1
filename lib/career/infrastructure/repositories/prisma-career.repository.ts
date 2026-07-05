import { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/lib/core/infrastructure/base/PrismaRepository";
import { CareerRepositoryPort } from "../../ports/career-repository.port";
import { CareerProfileAggregate } from "../../domain/aggregates/career-profile.aggregate";
import { CareerProfileMapper } from "../mappers/career-profile.mapper";
import { Result, ok, fail } from "@/lib/core/result";
import { NotFoundError } from "@/lib/core/result/errors";
import { Clock } from "@/lib/core/clock/Clock";

export class PrismaCareerRepository extends PrismaRepository implements CareerRepositoryPort {
  private mapper: CareerProfileMapper;

  constructor(private readonly prismaClient: PrismaClient, clock: Clock) {
    super();
    this.mapper = new CareerProfileMapper(clock);
  }

  // Override getter to use the injected client (or we can just use the global one)
  protected get db() {
    return this.prismaClient;
  }

  async getById(id: string): Promise<Result<CareerProfileAggregate>> {
    return this.safeExecute(async () => {
      const raw = await this.db.careerProfile.findUnique({
        where: { id }
      });

      if (!raw) {
        throw new NotFoundError(`CareerProfile with id ${id} not found`);
      }

      return this.mapper.toDomain(raw);
    });
  }

  async findByUserId(userId: string): Promise<Result<CareerProfileAggregate | null>> {
    return this.safeExecute(async () => {
      const raw = await this.db.careerProfile.findUnique({
        where: { userId }
      });

      if (!raw) return null;

      return this.mapper.toDomain(raw);
    });
  }

  async save(profile: CareerProfileAggregate): Promise<Result<void>> {
    return this.safeExecute(async () => {
      const data = this.mapper.toPersistence(profile);
      
      // Upsert to handle both insert and update gracefully
      await this.db.careerProfile.upsert({
        where: { id: profile.id },
        create: {
          id: data.id,
          userId: data.userId,
          employabilityScore: data.employabilityScore,
          communicationScore: data.communicationScore,
          confidenceTrend: data.confidenceTrend,
          leadershipScore: data.leadershipScore,
          unlockedPersonas: data.unlockedPersonas,
          stressResistance: data.stressResistance,
          clarityTrend: data.clarityTrend,
          ownershipTrend: data.ownershipTrend,
          careerDNA: data.careerDNA ?? undefined,
        },
        update: {
          employabilityScore: data.employabilityScore,
          communicationScore: data.communicationScore,
          confidenceTrend: data.confidenceTrend,
          leadershipScore: data.leadershipScore,
          unlockedPersonas: data.unlockedPersonas,
          stressResistance: data.stressResistance,
          clarityTrend: data.clarityTrend,
          ownershipTrend: data.ownershipTrend,
          careerDNA: data.careerDNA ?? undefined,
        }
      });
    });
  }

  async delete(id: string): Promise<Result<void>> {
    return this.safeExecute(async () => {
      await this.db.careerProfile.delete({
        where: { id }
      });
    });
  }
}
