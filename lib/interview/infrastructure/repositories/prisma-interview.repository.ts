import { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/lib/core/infrastructure/base/PrismaRepository";
import { InterviewRepositoryPort } from "../../ports/interview-repository.port";
import { InterviewSessionAggregate } from "../../domain/aggregates/interview-session.aggregate";
import { InterviewSessionMapper } from "../mappers/interview-session.mapper";
import { Result } from "@/lib/core/result";
import { NotFoundError } from "@/lib/core/result/errors";
import { Clock } from "@/lib/core/clock/Clock";

export class PrismaInterviewRepository extends PrismaRepository implements InterviewRepositoryPort {
  private mapper: InterviewSessionMapper;

  constructor(private readonly prismaClient: PrismaClient, clock: Clock) {
    super();
    this.mapper = new InterviewSessionMapper(clock);
  }

  protected get db() {
    return this.prismaClient;
  }

  async getById(id: string): Promise<Result<InterviewSessionAggregate>> {
    return this.safeExecute(async () => {
      const raw = await this.db.interviewSession.findUnique({
        where: { id }
      });

      if (!raw) {
        throw new NotFoundError(`InterviewSession with id ${id} not found`);
      }

      return this.mapper.toDomain(raw);
    });
  }

  async findActiveByUserId(userId: string): Promise<Result<InterviewSessionAggregate | null>> {
    return this.safeExecute(async () => {
      const raw = await this.db.interviewSession.findFirst({
        where: { userId, status: "active" },
        orderBy: { createdAt: "desc" }
      });

      if (!raw) return null;

      return this.mapper.toDomain(raw);
    });
  }

  async findByCorrelationId(correlationId: string): Promise<Result<InterviewSessionAggregate | null>> {
    // Optional implementation if correlationId is added to the schema.
    // For now, returning null or throwing not implemented.
    return this.safeExecute(async () => null);
  }

  async save(session: InterviewSessionAggregate): Promise<Result<void>> {
    return this.safeExecute(async () => {
      const data = this.mapper.toPersistence(session);

      await this.db.interviewSession.upsert({
        where: { id: session.id },
        create: {
          id: data.id,
          userId: data.userId,
          persona: data.persona,
          currentState: data.currentState,
          pressureLevel: data.pressureLevel,
          jobTitle: data.jobTitle,
          status: data.status,
          questions: data.questions ?? [],
          answers: data.answers ?? [],
          startedAt: data.startedAt,
          completedAt: data.completedAt,
        },
        update: {
          currentState: data.currentState,
          pressureLevel: data.pressureLevel,
          status: data.status,
          questions: data.questions ?? [],
          answers: data.answers ?? [],
          completedAt: data.completedAt,
        }
      });
    });
  }

  async delete(id: string): Promise<Result<void>> {
    return this.safeExecute(async () => {
      await this.db.interviewSession.delete({
        where: { id }
      });
    });
  }
}
