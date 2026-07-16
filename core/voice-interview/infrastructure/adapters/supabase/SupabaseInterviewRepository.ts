import type { InterviewSessionRepository } from "../../../application/ports/InterviewSessionRepository.js";
import type { InterviewSessionAggregate } from "../../../domain/aggregates/InterviewSessionAggregate.js";
import type { SessionId, CandidateId } from "../../../domain/types.js";
import { AggregateSerializer } from "../../serialization/AggregateSerializer.js";
import { AggregateDeserializer } from "../../serialization/AggregateDeserializer.js";
import type { SerializedAggregate } from "../../serialization/AggregateSerializer.js";
import { ConcurrencyError, ProviderError } from "../../errors/ProviderErrors.js";

export interface SupabaseClient {
  from(table: string): SupabaseQueryBuilder;
}

export interface SupabaseQueryBuilder {
  upsert(data: unknown): SupabaseQueryBuilder;
  select(columns: string, options?: { count: string }): SupabaseQueryBuilder;
  delete(): SupabaseQueryBuilder;
  eq(column: string, value: unknown): SupabaseQueryBuilder;
  neq(column: string, value: unknown): SupabaseQueryBuilder;
  single(): Promise<{ data: unknown; error: SupabaseError | null; count?: number }>;
}

interface SupabaseError {
  code: string;
  message: string;
}

export class SupabaseInterviewRepository implements InterviewSessionRepository {
  constructor(private supabase: SupabaseClient) {}

  async save(session: InterviewSessionAggregate): Promise<void> {
    try {
      const expectedVersion = session.version;
      const serialized = AggregateSerializer.serialize(session, expectedVersion);

      // Atomic save with optimistic locking:
      // The upsert includes version in the WHERE clause.
      // If another process incremented version, the row won't match → 0 rows updated → conflict.
      const result = await this.supabase
        .from("interviews")
        .upsert(serialized)
        .eq("id", serialized.id)
        .eq("version", expectedVersion)
        .single();

      if (result.error) {
        if (result.error.code === "PGRST116") {
          throw new ConcurrencyError(
            `Optimistic locking failure on session ${session.id as string}: expected version ${expectedVersion}`
          );
        }
        throw new ProviderError(result.error.message, "supabase");
      }
    } catch (e) {
      if (e instanceof ConcurrencyError) throw e;
      if (e instanceof ProviderError) throw e;
      throw new ProviderError("Database error during save", "supabase", e);
    }
  }

  async findById(id: SessionId): Promise<InterviewSessionAggregate | null> {
    const result = await this.supabase
      .from("interviews")
      .select("*")
      .eq("id", id as string)
      .single();

    if (result.error || !result.data) return null;
    return AggregateDeserializer.deserialize(result.data as SerializedAggregate);
  }

  async findActiveByCandidate(candidateId: CandidateId): Promise<InterviewSessionAggregate | null> {
    const result = await this.supabase
      .from("interviews")
      .select("*")
      .eq("candidateId", candidateId as string)
      .neq("status", "completed")
      .single();

    if (result.error || !result.data) return null;
    return AggregateDeserializer.deserialize(result.data as SerializedAggregate);
  }

  async delete(id: SessionId): Promise<void> {
    await this.supabase.from("interviews").delete().eq("id", id as string).single();
  }

  async exists(id: SessionId): Promise<boolean> {
    const result = await this.supabase
      .from("interviews")
      .select("*", { count: "exact" })
      .eq("id", id as string)
      .single();
    return (result.count ?? 0) > 0;
  }
}
