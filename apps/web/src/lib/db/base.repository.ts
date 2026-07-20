// @ts-nocheck - Supabase generic type inference issues with repository pattern
import type { SupabaseClient } from "@supabase/supabase-js";

export class BaseRepository<TTable extends Record<string, any>> {
  constructor(
    protected readonly db: SupabaseClient<any, any, any>,
    protected readonly table: string
  ) {}

  async findById<T = TTable["Row"]>(id: string) {
    const { data, error } = await this.db
      .from(this.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as T;
  }

  async findMany<T = TTable["Row"]>(filters?: {
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }) {
    let query = this.db.from(this.table).select("*");

    if (filters?.orderBy) {
      query = query.order(filters.orderBy.column, {
        ascending: filters.orderBy.ascending ?? true,
      });
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data as T[];
  }

  async insert<T = TTable["Insert"]>(payload: T) {
    const { data, error } = await this.db
      .from(this.table)
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data as TTable["Row"];
  }

  async update<T = Partial<TTable["Update"]>>(id: string, payload: T) {
    const { data, error } = await this.db
      .from(this.table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as TTable["Row"];
  }

  async delete(id: string) {
    const { error } = await this.db
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }
}
