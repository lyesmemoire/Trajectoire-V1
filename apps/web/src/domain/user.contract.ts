/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DOMAIN CONTRACT — User                                         ║
 * ║                                                                  ║
 * ║  Ce fichier définit la VÉRITÉ MÉTIER du domaine User.            ║
 * ║  Aucun accès DB ici. Types purs + merge rules.                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════
// SOURCE ROLES — Documentation formelle des 2 sources
// ═══════════════════════════════════════════════════════════════════

/**
 * SOURCE 1: User (Prisma)
 *   Role:       Identity & Authorization
 *   Truth for:  role, email, name, referralCode, referredBy, referralCount, stripeCustomerId
 *   Write path: /api/register, /api/admin/*, stripe webhook
 *   Read path:  auth checks, admin panels, referral engine
 *
 * SOURCE 2: profiles (Supabase)
 *   Role:       Runtime Operational State
 *   Truth for:  credits, plan, has_used_premium_trial, cv_editor_completed
 *   Write path: RPCs atomiques (credits), middleware (flags), stripe webhook (plan)
 *   Read path:  session-logic, credit checks, feature gates
 *   Linked to:  Supabase Auth (same UUID as auth.users.id)
 *
 * ═══════════════════════════════════════════════════════════════════
 * KNOWN DRIFT — User.plan
 * ═══════════════════════════════════════════════════════════════════
 *
 *   User.plan (Prisma)    — EXISTS but is DEPRECATED READ-ONLY
 *   profiles.plan (Supa)  — AUTHORITATIVE for all runtime decisions
 *
 *   Rule: Any code that checks the user's plan MUST read profiles.plan.
 *         User.plan exists for backward compatibility only.
 *         Do NOT add new writes to User.plan.
 *         Do NOT use User.plan for authorization or feature gating.
 *
 *   Future: Either remove User.plan from Prisma schema, or add a
 *           one-way sync trigger (profiles → User). Not in current scope.
 * ═══════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════
// CANONICAL TYPES
// ═══════════════════════════════════════════════════════════════════

export type UserRole =
  | "USER"
  | "ADMIN_SUPPORT"
  | "ADMIN_PRODUCT"
  | "ADMIN_FOUNDER";

export type UserPlan = "free" | "pro" | "expert";

/**
 * CanonicalUser — the shape the application consumes.
 *
 * This is NOT a DB model. It is a merged projection of Prisma User + Supabase profiles.
 * Built exclusively by mergeUserSources().
 */
export interface CanonicalUser {
  // ── Identity (from Prisma User) ──
  id: string;
  email: string;
  name: string | null;
  image: string | null;

  // ── Authorization (from Prisma User) ──
  role: UserRole;

  // ── Operational State (from Supabase profiles) ──
  plan: UserPlan;
  credits: number;
  hasUsedPremiumTrial: boolean;
  cvEditorCompleted: boolean;

  // ── Referral (from Prisma User) ──
  referralCode: string;
  referredBy: string | null;
  referralCount: number;

  // ── Billing link (from Prisma User) ──
  stripeCustomerId: string | null;
}

/**
 * Minimal shape for auth checks (avoids loading full profile).
 */
export interface AuthIdentity {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Minimal shape for credit checks.
 */
export interface CreditState {
  credits: number;
  plan: UserPlan;
}

// ── Raw source shapes (for mapper input typing) ──

/** Shape of relevant Prisma User fields */
export interface PrismaUserRow {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  stripeCustomerId: string | null;
  plan?: string; // DEPRECATED — exists but not authoritative
}

/** Shape of relevant Supabase profiles fields */
export interface SupabaseProfileRow {
  id: string;
  email: string;
  plan: string | null;
  credits: number;
  has_used_premium_trial: boolean;
  cv_editor_completed: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// INVARIANTS
// ═══════════════════════════════════════════════════════════════════

/**
 * 1. A user exists in BOTH Prisma User AND Supabase profiles, or in NEITHER
 *    (exception: Supabase Auth may create profiles before Prisma User during registration)
 *
 * 2. profiles.id === User.id === auth.users.id (same UUID everywhere)
 *
 * 3. profiles.credits is mutated ONLY by atomic RPCs (see billing.contract)
 *
 * 4. User.role is the SOLE source for admin authorization
 *    profiles does NOT contain role information
 *
 * 5. profiles.plan is AUTHORITATIVE for plan checks
 *    User.plan is DEPRECATED READ-ONLY (see KNOWN DRIFT above)
 *
 * 6. referralCode is UNIQUE and IMMUTABLE after creation
 */

// ═══════════════════════════════════════════════════════════════════
// MERGE RULES — Pure transformation, zero DB access
// ═══════════════════════════════════════════════════════════════════

const VALID_PLANS = new Set<UserPlan>(["free", "pro", "expert"]);

/**
 * Normalizes a raw plan string to a valid UserPlan.
 * Defaults to "free" if unknown or null.
 */
function normalizePlan(raw: string | null | undefined): UserPlan {
  const lower = (raw ?? "free").toLowerCase() as UserPlan;
  return VALID_PLANS.has(lower) ? lower : "free";
}

/**
 * Merges Prisma User + Supabase profiles into a single CanonicalUser.
 *
 * Merge strategy:
 *   - Identity fields (email, name, image) → Prisma User
 *   - Authorization (role) → Prisma User
 *   - Operational state (plan, credits, flags) → Supabase profiles
 *   - On plan conflict: profiles.plan WINS (authoritative)
 *   - referral fields → Prisma User
 */
export function mergeUserSources(prismaUser: PrismaUserRow, profile: SupabaseProfileRow, ): CanonicalUser {
  // Sanity check: IDs must match
  if (prismaUser.id !== profile.id) {
    throw new UserContractError(
      `ID mismatch: Prisma=${prismaUser.id}, Profile=${profile.id}`,
    );
  }

  return {
    // Identity (Prisma)
    id: prismaUser.id,
    email: prismaUser.email,
    name: prismaUser.name,
    image: prismaUser.image,

    // Authorization (Prisma)
    role: prismaUser.role,

    // Operational state (profiles — authoritative)
    plan: normalizePlan(profile.plan),
    credits: profile.credits ?? 0,
    hasUsedPremiumTrial: profile.has_used_premium_trial ?? false,
    cvEditorCompleted: profile.cv_editor_completed ?? false,

    // Referral (Prisma)
    referralCode: prismaUser.referralCode,
    referredBy: prismaUser.referredBy,
    referralCount: prismaUser.referralCount,

    // Billing link (Prisma)
    stripeCustomerId: prismaUser.stripeCustomerId,
  };
}

/**
 * Extracts auth-relevant fields from a Prisma User row.
 * Use this when you only need authorization, not the full profile.
 */
export function toAuthIdentity(prismaUser: PrismaUserRow): AuthIdentity {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    role: prismaUser.role,
  };
}

/**
 * Extracts credit-relevant fields from a Supabase profile row.
 * Use this when you only need credit/plan state.
 */
export function toCreditState(profile: SupabaseProfileRow): CreditState {
  return {
    credits: profile.credits ?? 0,
    plan: normalizePlan(profile.plan),
  };
}

/**
 * Checks if a user has admin privileges.
 */
export function isAdmin(role: UserRole): boolean {
  return role !== "USER";
}

/**
 * Checks if a user is on a paid plan.
 */
export function isPaidPlan(plan: UserPlan): boolean {
  return plan === "pro" || plan === "expert";
}

// ═══════════════════════════════════════════════════════════════════
// ERRORS
// ═══════════════════════════════════════════════════════════════════

export class UserContractError extends Error {
  constructor(message: string) {
    super(`[UserContract] ${message}`);
    this.name = "UserContractError";
  }
}
