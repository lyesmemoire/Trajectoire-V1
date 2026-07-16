import { CareerMemory } from "../domain/entities/career-memory.entity";
import { Repository } from "@/lib/core/infrastructure/base/Repository";

export interface CareerMemoryRepositoryPort extends Repository<CareerMemory> {
  findByUserId(userId: string): Promise<CareerMemory | null>;
}
