
/**
 * ProfileRepository
 * Repository for profiles table
 * Handles all database operations for user profiles
 */

import { createClient } from "@/lib/supabase/server";
import { IRepository, QueryOptions } from "@/core/interfaces/IRepository";
import { AppError, ErrorCode } from "@/core/errors";
import { ITransaction } from "@/core/database/Transaction";

export interface Profile {
  id: string;
  user_id: string;
  firstname?: string;
  lastname?: string;
  consent_given?: boolean;
  consent_date?: string | null;
  created_at: string;
  updated_at: string;
}

export class ProfileRepository implements IRepository<Profile> {
  /**
   * Find profile by ID
   */
  async findById(id: string): Promise<Profile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Not found
      }
      throw new AppError(
        `Failed to fetch profile: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Find profiles matching criteria
   */
  async find(criteria: Partial<Profile>, options?: QueryOptions): Promise<Profile[]> {
    const supabase = await createClient();
    let query = supabase.from("profiles").select("*");

    if (criteria.user_id) {
      query = query.eq("user_id", criteria.user_id);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to fetch profiles: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data || [];
  }

  /**
   * Find one profile matching criteria
   */
  async findOne(criteria: Partial<Profile>): Promise<Profile | null> {
    const profiles = await this.find(criteria, { limit: 1 });
    return profiles[0] || null;
  }

  /**
   * Create a new profile
   * @param entity - Profile data
   * @param transaction - Optional transaction
   */
  async create(
    entity: Omit<Profile, "id" | "created_at" | "updated_at">,
    transaction?: ITransaction
  ): Promise<Profile> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        ...entity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new AppError(
        `Failed to create profile: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Update a profile
   * @param id - Profile ID
   * @param updates - Updates to apply
   * @param transaction - Optional transaction
   */
  async update(
    id: string,
    updates: Partial<Profile>,
    transaction?: ITransaction
  ): Promise<Profile> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError(
        `Failed to update profile: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return data;
  }

  /**
   * Delete a profile
   * @param id - Profile ID
   * @param transaction - Optional transaction
   */
  async delete(id: string, transaction?: ITransaction): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      throw new AppError(
        `Failed to delete profile: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return true;
  }

  /**
   * Count profiles matching criteria
   */
  async count(criteria?: Partial<Profile>): Promise<number> {
    const supabase = await createClient();
    let query = supabase.from("profiles").select("*", { count: "exact", head: true });

    if (criteria?.user_id) {
      query = query.eq("user_id", criteria.user_id);
    }

    const { count, error } = await query;

    if (error) {
      throw new AppError(
        `Failed to count profiles: ${error.message}`,
        ErrorCode.DATABASE_ERROR,
        500
      );
    }

    return count || 0;
  }

  /**
   * Get profile by user ID
   */
  async getByUserId(userId: string): Promise<Profile | null> {
    return this.findOne({ user_id: userId });
  }

  /**
   * Update consent
   */
  async updateConsent(userId: string, consentGiven: boolean): Promise<Profile> {
    const profile = await this.getByUserId(userId);
    if (!profile) {
      throw new AppError("Profile not found", ErrorCode.NOT_FOUND, 404);
    }

    return this.update(profile.id, {
      consent_given: consentGiven,
      consent_date: consentGiven ? new Date().toISOString() : null,
    });
  }
}
