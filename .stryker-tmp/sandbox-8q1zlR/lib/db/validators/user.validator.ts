// @ts-nocheck
import { z } from "zod";
import type { PrismaUserRow, SupabaseProfileRow } from "@/domain/user.contract";

/**
 * Validates raw data from Prisma User table.
 */
export const PrismaUserSchema = z.object({
  id: z.string().uuid().or(z.string().cuid()),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  role: z.enum(["USER", "ADMIN_SUPPORT", "ADMIN_PRODUCT", "ADMIN_FOUNDER"]),
  referralCode: z.string(),
  referredBy: z.string().nullable(),
  referralCount: z.number().int().nonnegative(),
  stripeCustomerId: z.string().nullable(),
  plan: z.string().optional(), // DEPRECATED read-only field
});

/**
 * Validates raw data from Supabase profiles table.
 */
export const SupabaseProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  plan: z.string().nullable(),
  credits: z.number().int().nonnegative(),
  has_used_premium_trial: z.boolean(),
  cv_editor_completed: z.boolean(),
});

/**
 * Helper to validate DB row before passing to domain mapper.
 */
export function validatePrismaUser(data: unknown): PrismaUserRow {
  return PrismaUserSchema.parse(data) as PrismaUserRow;
}

export function validateSupabaseProfile(data: unknown): SupabaseProfileRow {
  return SupabaseProfileSchema.parse(data) as SupabaseProfileRow;
}
