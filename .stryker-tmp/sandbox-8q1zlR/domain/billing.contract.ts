/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DOMAIN CONTRACT — Billing                                      ║
 * ║                                                                  ║
 * ║  Ce fichier définit la VÉRITÉ MÉTIER du domaine Billing.         ║
 * ║  Aucun accès DB ici. Types purs + validation pure.               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
// @ts-nocheck


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

export function enforceBillingInvariants(state: BillingState): void {
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
export function isTransactionExpired(
  tx: CreditTransaction,
  thresholdMinutes: number = 10,
): boolean {
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
