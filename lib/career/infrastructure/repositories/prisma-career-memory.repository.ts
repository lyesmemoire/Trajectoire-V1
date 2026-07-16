import { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/lib/core/infrastructure/base/PrismaRepository";
import { CareerMemoryRepositoryPort } from "../../ports/career-memory-repository.port";
import { CareerMemory } from "../../domain/entities/career-memory.entity";
import { Result, ok } from "@/lib/core/result";

export class PrismaCareerMemoryRepository extends PrismaRepository implements CareerMemoryRepositoryPort {
  constructor(private readonly prismaClient: PrismaClient) {
    super();
  }

  protected get db() {
    return this.prismaClient;
  }

  async getById(id: string): Promise<Result<CareerMemory>> {
    return this.safeExecute(async () => {
      // Career memory is stored in Journey data field
      const journeys = await (this.db as any).journey.findMany();
      
      for (const journey of journeys) {
        const data = journey.data as any;
        if (data.careerMemory && data.careerMemory.userId === id) {
          return data.careerMemory;
        }
      }
      
      throw new Error("Career memory not found");
    });
  }

  async findByUserId(userId: string): Promise<CareerMemory | null> {
    const result = await this.safeExecute(async () => {
      const journey = await (this.db as any).journey.findFirst({
        where: { userId }
      });

      if (!journey) return null;

      const data = journey.data as any;
      return data.careerMemory || null;
    });

    return result.isSuccess() ? result.unwrap() : null;
  }

  async save(memory: CareerMemory): Promise<Result<void>> {
    return this.safeExecute(async () => {
      // Store career memory in Journey data field
      const existingJourney = await (this.db as any).journey.findFirst({
        where: { userId: memory.userId }
      });

      if (existingJourney) {
        const data = existingJourney.data as any;
        data.careerMemory = memory;

        await (this.db as any).journey.update({
          where: { id: existingJourney.id },
          data: { data }
        });
      } else {
        // Create a new journey if none exists for this user
        await (this.db as any).journey.create({
          data: {
            userId: memory.userId,
            currentStep: "career_memory",
            status: "active",
            data: {
              careerMemory: memory
            }
          }
        });
      }
    });
  }

  async delete(id: string): Promise<Result<void>> {
    return this.safeExecute(async () => {
      const journeys = await (this.db as any).journey.findMany();
      
      for (const journey of journeys) {
        const data = journey.data as any;
        if (data.careerMemory && data.careerMemory.userId === id) {
          delete data.careerMemory;
          await (this.db as any).journey.update({
            where: { id: journey.id },
            data: { data }
          });
          break;
        }
      }
    });
  }
}
