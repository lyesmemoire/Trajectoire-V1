/**
 * Blueprint V3 Enterprise TypeScript SDK
 * 
 * Auto-generated from contracts
 */

// billing
/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DOMAIN CONTRACT — Billing                                      ║
 * ║                                                                  ║
 * ║  Ce fichier définit la VÉRITÉ MÉTIER du domaine Billing.         ║
 * ║  Aucun accès DB ici. Types purs + validation pure.               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════
// SOURCE ROLES — Documentation formelle
// ═══════════════════════════════════════════════════════════════════

/**
 * SOURCE 1: profiles.credits (Supabase)
 *   Role:       SOURCE OF TRUTH — solde utilisateur
 *   Write path: UNIQUEMENT via RPCs atomiques (deduct_credits_atomic, add_credits_atomic)
 *   Read path:  services/credits.ts → getCredits()
 *   ⚠️  JAMAIS muté par un UPDATE direct SQL ou .update() Supabase
 *
 * SOURCE 2: credit_usage (Supabase)
 *   Role:       Audit Trail — append-only
 *   Write path: services/credits.ts → logCreditUsage() (après chaque opération réussie)
 *   Read path:  admin reporting uniquement
 *   ⚠️  JAMAIS de UPDATE ni DELETE sur cette table
 *
 * SOURCE 3: credit_transactions (Supabase)
 *   Role:       Two-Phase Commit — reserve → commit | rollback
 *   Write path: deduction flow (reserve), cron cleanup (rollback)
 *   Read path:  cron cleanup-transactions
 *   State machine: "reserved" → "committed" | "rolled_back"
 *   Timeout: 10 minutes (nettoyé par cron)
 *
 * SOURCE 4: credit_ledger (Supabase)
 *   Role:       Eventual-Consistency Audit Layer — PAS source of truth
 *   Write path: triggers / RPCs internes
 *   Read path:  admin dashboard-metrics UNIQUEMENT
 *   ⚠️  Le ledger est une vue dérivée, pas un event-sourcing backbone.
 *       La source of truth reste profiles.credits.
 */

// ═══════════════════════════════════════════════════════════════════
// CANONICAL TYPES — Redéfinis manuellement (découplés de Supabase CLI)
// ═══════════════════════════════════════════════════════════════════

/**
 * Actions crédit reconnues par le système.
 * Redéfini ici pour découpler le domaine de l'artefact généré Supabase (types/database.ts).
 */
export type CreditAction =
  | "ats_check"
  | "cv_optimize"
  | "interview_generate"
  | "interview_feedback";

/**
 * Coûts fixes par action.
 * Source de vérité pour toute l'application.
 */
export const CREDIT_COSTS: Record<CreditAction, number> = {
  ats_check: 0,
  cv_optimize: 1,
  interview_generate: 1,
  interview_feedback: 2,
} as const;

/**
 * Opération de crédit demandée par le code applicatif.
 */
export interface CreditOperation {
  operationId: string;
  userId: string;
  action: CreditAction;
  amount: number;
  metadata?: Record<string, unknown>;
}

/**
 * Résultat d'une opération de crédit.
 */
export interface CreditOperationResult {
  success: boolean;
  remainingCredits?: number;
  error?: string;
  code?: CreditErrorCode;
}

export type CreditErrorCode =
  | "INSUFFICIENT_CREDITS"
  | "USER_NOT_FOUND"
  | "DB_ERROR";

/**
 * Enregistrement d'usage (shape de credit_usage).
 */
export interface CreditUsageRecord {
  user_id: string;
  action: CreditAction;
  credits_spent: number;
  tokens_used: number;
  estimated_cost_eur: number;
  metadata: Record<string, unknown>;
}

/**
 * Transaction de crédit (shape de credit_transactions).
 */
export type TransactionState = "reserved" | "committed" | "rolled_back";

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  action: CreditAction;
  state: TransactionState;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════════
// INVARIANTS
// ═══════════════════════════════════════════════════════════════════

/**
 * 1. profiles.credits >= 0           (enforced by RPC, never by app code)
 * 2. All deductions go through       deduct_credits_atomic RPC
 * 3. All additions go through        add_credits_atomic RPC
 * 4. credit_usage is append-only     (NEVER update, NEVER delete)
 * 5. credit_transactions timeout     after 10 minutes (cron cleanup)
 * 6. credit_ledger is read-only      from app code (eventual-consistency audit layer)
 * 7. Application code NEVER writes   profiles.credits directly (no .update({credits: ...}))
 *
 * ACCOUNTING INVARIANT (eventual):
 *   profiles.credits ≈ Σ(ledger.credit) - Σ(ledger.debit)
 *   This holds eventually, not transactionally.
 *   profiles.credits is authoritative when they diverge.
 */

// ═══════════════════════════════════════════════════════════════════
// GUARDS — Pure validation, zero DB access
// ═══════════════════════════════════════════════════════════════════

export interface BillingState {
  credits: number;
  transactionState?: TransactionState;
  transactionAgeMinutes?: number;
}

export function enforceBillingInvariants(state: _BillingState): void {
  // 1. credits >= 0
  if (state.credits < 0) {
    throw new CreditContractError("Invariant violated: credits cannot be negative");
  }

  // 2. rollback possible uniquement si reserved (timeout = 10 min max)
  if (state.transactionState && state.transactionAgeMinutes !== undefined) {
    if (state.transactionState !== "reserved" && state.transactionAgeMinutes > 10) {
      throw new CreditContractError("Invariant violated: transaction stuck > 10 min without being resolved");
    }
  }
}

const VALID_ACTIONS = new Set<CreditAction>([
  "ats_check",
  "cv_optimize",
  "interview_generate",
  "interview_feedback",
]);

/**
 * Validates that a CreditOperation is structurally correct.
 * Throws if invalid.
 */
export function assertValidCreditOperation(op: CreditOperation): void {
  if (!op.operationId || typeof op.operationId !== "string") {
    throw new CreditContractError("operationId is required and must be a string");
  }

  if (!op.userId || typeof op.userId !== "string") {
    throw new CreditContractError("userId is required and must be a string");
  }

  if (!VALID_ACTIONS.has(op.action)) {
    throw new CreditContractError(
      `Invalid credit action: "${op.action}". Valid: ${Array.from(VALID_ACTIONS).join(", ")}`,
    );
  }

  if (typeof op.amount !== "number" || op.amount < 0) {
    throw new CreditContractError(
      `amount must be a non-negative number, got: ${op.amount}`,
    );
  }
}

/**
 * Returns the credit cost for a given action.
 * Centralized here so no consumer hard-codes costs.
 */
export function getCreditCost(action: CreditAction): number {
  const cost = CREDIT_COSTS[action];
  if (cost === undefined) {
    throw new CreditContractError(`Unknown credit action: "${action}"`);
  }
  return cost;
}

/**
 * Checks whether a transaction is expired (past timeout threshold).
 */
export function isTransactionExpired(tx: CreditTransaction, thresholdMinutes: number = 10, ): boolean {
  const created = new Date(tx.created_at).getTime();
  const now = Date.now();
  return tx.state === "reserved" && now - created > thresholdMinutes * 60 * 1000;
}

// ═══════════════════════════════════════════════════════════════════
// ERRORS
// ═══════════════════════════════════════════════════════════════════

export class CreditContractError extends Error {
  constructor(message: string) {
    super(`[BillingContract] ${message}`);
    this.name = "CreditContractError";
  }
}


// decision-graph
export type NodeType =
  | "event"
  | "agent_opinion"
  | "consensus_step"
  | "override"
  | "final_decision";

export interface DecisionNode {
  id: string;
  type: NodeType;
  agent?: string;
  input: unknown;
  output: unknown;
  score?: number;
  weight?: number;
  parentIds: string[];
  timestamp: number;
}

// Canonical Reference: BCM-GRAPH-009 (blueprint.graph.decision)
// Owner: Chief Cognitive Architect
export interface DecisionGraph {
  traceId: string;
  userId: string;
  sessionId?: string;
  nodes: DecisionNode[];
  finalDecision: {
    status: "allow" | "block" | "freeze" | "review";
    globalScore: number;
    reason: string;
  };
  createdAt: number;
}


// fraud-kernel
export interface FraudSignal {
  type:
    | "velocity"
    | "ip_anomaly"
    | "device_change"
    | "billing_inconsistency"
    | "behavioral_jump"
    | "replay_mismatch"

  severity: number // 0 → 1
  confidence: number // 0 → 1
  metadata: Record<string, unknown>
}

export interface FraudAssessment {
  userId: string
  riskScore: number // 0 → 1
  signals: FraudSignal[]
  veto: boolean
  reason: string
  timestamp: number
}

export interface FraudKernelConfig {
  hardVetoThreshold: number // ex: 0.85
  softFreezeThreshold: number // ex: 0.65
  velocityWindowMs: number
}


// interview
export type InterviewState =
  | "created"
  | "running"
  | "paused"
  | "analyzing"
  | "completed";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface StandardInterviewSession {
  id: string;
  userId: string;
  questions: string[];
  answers: string[];
  status: InterviewState;
  score?: number;
  feedback?: string;
}

export interface PremiumInterviewSession {
  id: string;
  userId: string;
  transcript: Message[];
  memory: Record<string, unknown>;
  persona: string;
  phases: string[];
  scores?: {
    technical: number;
    communication: number;
    confidence: number;
    stress: number;
  };
  status: InterviewState;
}

export interface InterviewAnalyticsProjection {
  sessionId: string;
  userId: string;

  behavioralScores: {
    clarity: number;
    confidence: number;
    ownership: number;
    specificity: number;
    authenticity: number;
  };

  archetype: string;
  pressureCurve: number[];
  progressionIndex: number;
  modelVersion?: number;
}

export interface UnifiedInterviewView {
  id: string;
  userId: string;
  type: "standard" | "premium";
  status: InterviewState;
  
  // Unified data for UI consumption
  history: Message[];
  score?: number;
  analytics?: InterviewAnalyticsProjection;
  
  createdAt: string;
  completedAt?: string;
}

export function mergeInterviewViews(standard?: StandardInterviewSession, premium?: PremiumInterviewSession, analytics?: InterviewAnalyticsProjection): UnifiedInterviewView {
  if (!standard && !premium) {
    throw new Error("Must provide at least one session type");
  }

  const session = premium || standard!;
  const isPremium = !!premium;

  return {
    id: session.id,
    userId: session.userId,
    type: isPremium ? "premium" : "standard",
    status: session.status,
    history: isPremium ? (session as PremiumInterviewSession).transcript : [],
    score: isPremium && (session as PremiumInterviewSession).scores 
      ? (session as PremiumInterviewSession).scores!.technical 
      : (session as StandardInterviewSession).score,
    analytics,
    createdAt: new Date().toISOString(), // Mocking for now, normally taken from db
  };
}


// orchestration
/**
 * Orchestration Contract
 * Defines the types for the Multi-Agent Evaluation System
 */

export type AgentType = "interview" | "cv" | "billing" | "fraud" | "behavior";

export type AgentRecommendation = "allow" | "warn" | "block" | "escalate" | "veto";

export interface AgentOpinion {
  agent: AgentType;
  confidence: number;        // 0–1
  severity: number;          // 0–1
  recommendation: AgentRecommendation;
  reasoning: string;
  signals: Record<string, number>;
}

export type DecisionStatus = "allow" | "block" | "freeze" | "review";

export interface SystemDecision {
  status: DecisionStatus;
  globalScore: number;
  agentVotes: AgentOpinion[];
  overrideSource?: "fraud" | "fraud-kernel" | "billing" | "system";
  explanationGraph: string[];
  confidence: number;
}

/**
 * Context object passed to the AgentEvaluator containing
 * all necessary signals for the agents to form their opinions.
 */
export interface EvaluationContext {
  userId: string;
  sessionId?: string;
  
  // Fraud Kernel Signals
  metrics?: { requestsLastMinute: number };
  billing?: { negativeBalance: boolean };
  
  // Interview Signals
  interviewScore?: number;
  interviewConfidence?: number;
  
  // CV Signals
  cvMatchScore?: number;
  
  // Billing Signals
  hasBillingInconsistency?: boolean;
  creditBalance?: number;
  
  // Fraud Signals
  ipAnomalies?: number;
  velocityAnomalies?: number;
  
  // Behavior Signals
  driftScore?: number;
  stabilityScore?: number;
}


// user
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


