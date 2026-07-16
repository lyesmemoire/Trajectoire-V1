import { getServerDb } from "../../../../lib/db/client";
import { Result, ok, fail } from "../../../../lib/core/result";
import { InfrastructureError } from "../../../../lib/core/result/errors";
import { JourneyRepositoryPort } from "../../ports/repositories/journey-repository.port";
import { JourneyAggregate, JourneyAggregateProps } from "../../domain/aggregates/journey.aggregate";
import { Clock } from "../../../../lib/core/clock/Clock";

export class SupabaseJourneyRepository implements JourneyRepositoryPort {
  constructor(private readonly clock: Clock) {}

  async save(journey: JourneyAggregate): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      const entity = journey.toEntity();

      const payload = {
        id: entity.id,
        user_id: entity.userId,
        current_step: entity.currentStep,
        status: entity.status,
        data: entity.data,
        started_at: entity.startedAt.toISOString(),
        completed_at: entity.completedAt?.toISOString(),
        error: entity.error,
      };

      const { error } = await supabase
        .from("journeys")
        .upsert(payload)
        .eq("id", entity.id);

      if (error) return fail(new InfrastructureError(error.message));
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to save journey"));
    }
  }

  async findById(id: string): Promise<Result<JourneyAggregate>> {
    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase.from("journeys").select("*").eq("id", id).single();

      if (error) return fail(new InfrastructureError(error.message));
      if (!data) return fail(new InfrastructureError("Journey not found"));

      const props: JourneyAggregateProps = {
        id: data.id,
        userId: data.user_id,
        currentStep: data.current_step,
        status: data.status,
        data: data.data,
        startedAt: new Date(data.started_at),
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
        error: data.error,
      };

      return ok(JourneyAggregate.load(props, this.clock));
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to find journey"));
    }
  }

  async findByUserId(userId: string): Promise<Result<JourneyAggregate[]>> {
    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return fail(new InfrastructureError(error.message));
      if (!data) return ok([]);

      const aggregates = data.map((record: any) => {
        const props: JourneyAggregateProps = {
          id: record.id,
          userId: record.user_id,
          currentStep: record.current_step,
          status: record.status,
          data: record.data,
          startedAt: new Date(record.started_at),
          completedAt: record.completed_at ? new Date(record.completed_at) : undefined,
          error: record.error,
        };
        return JourneyAggregate.load(props, this.clock);
      });

      return ok(aggregates);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to find journeys"));
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      const { error } = await supabase.from("journeys").delete().eq("id", id);

      if (error) return fail(new InfrastructureError(error.message));
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to delete journey"));
    }
  }
}
