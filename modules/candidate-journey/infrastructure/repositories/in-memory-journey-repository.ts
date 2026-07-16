import { Result, ok, fail } from "../../../../lib/core/result";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { JourneyRepositoryPort } from "../../ports/repositories/journey-repository.port";
import { JourneyAggregate, JourneyAggregateProps } from "../../domain/aggregates/journey.aggregate";
import { Clock } from "../../../../lib/core/clock/Clock";
import { Journey } from "../../domain/entities/journey.entity";

export class InMemoryJourneyRepository implements JourneyRepositoryPort {
  private journeys: Map<string, Journey> = new Map();

  constructor(private readonly clock: Clock) {}

  async save(journey: JourneyAggregate): Promise<Result<void>> {
    try {
      const entity = journey.toEntity();
      this.journeys.set(entity.id, entity);
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to save journey: ${error.message}`));
    }
  }

  async findById(id: string): Promise<Result<JourneyAggregate>> {
    try {
      const entity = this.journeys.get(id);
      if (!entity) {
        return fail(new InfrastructureError(`Journey not found: ${id}`));
      }

      const props: JourneyAggregateProps = {
        id: entity.id,
        userId: entity.userId,
        currentStep: entity.currentStep,
        status: entity.status,
        data: entity.data,
        startedAt: entity.startedAt,
        completedAt: entity.completedAt,
        error: entity.error,
      };

      return ok(JourneyAggregate.load(props, this.clock));
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find journey: ${error.message}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<JourneyAggregate[]>> {
    try {
      const entities = Array.from(this.journeys.values())
        .filter(j => j.userId === userId)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

      const aggregates = entities.map(entity => {
        const props: JourneyAggregateProps = {
          id: entity.id,
          userId: entity.userId,
          currentStep: entity.currentStep,
          status: entity.status,
          data: entity.data,
          startedAt: entity.startedAt,
          completedAt: entity.completedAt,
          error: entity.error,
        };
        return JourneyAggregate.load(props, this.clock);
      });

      return ok(aggregates);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find journeys: ${error.message}`));
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      this.journeys.delete(id);
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to delete journey: ${error.message}`));
    }
  }

  clear(): void {
    this.journeys.clear();
  }
}
