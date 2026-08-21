/**
 * Quota Service
 *
 * Quotas are derived from canonical persisted application data.
 *
 * This implementation intentionally does NOT depend on the legacy
 * `user_quotas` table or `increment_quota` RPC.
 *
 * Canonical sources:
 * - simulations -> interview_sessions
 * - reports     -> reports via interview_sessions
 * - tokens      -> AIUsageLog
 *
 * Message quota is currently enforced in-memory for the lifetime of the
 * application process because the current generated Supabase contract does
 * not expose a canonical persisted message table.
 */

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger/Logger";
import { getCache, CacheKeys, TTL } from "@/lib/cache/MemoryCache";

export type QuotaType =
  | "simulations"
  | "messages"
  | "reports"
  | "tokens";

export interface QuotaConfig {
  type: QuotaType;
  limit: number;
  period: "daily" | "monthly";
}

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
}

export interface UserQuota {
  limit: number;
  used: number;
  remaining: number;
}

export const QUOTA_CONFIGS: Record<
  string,
  Record<QuotaType, QuotaConfig>
> = {
  free: {
    simulations: {
      type: "simulations",
      limit: 10,
      period: "daily",
    },
    messages: {
      type: "messages",
      limit: 50,
      period: "daily",
    },
    reports: {
      type: "reports",
      limit: 5,
      period: "daily",
    },
    tokens: {
      type: "tokens",
      limit: 100000,
      period: "monthly",
    },
  },

  premium: {
    simulations: {
      type: "simulations",
      limit: 100,
      period: "daily",
    },
    messages: {
      type: "messages",
      limit: 500,
      period: "daily",
    },
    reports: {
      type: "reports",
      limit: 50,
      period: "daily",
    },
    tokens: {
      type: "tokens",
      limit: 1000000,
      period: "monthly",
    },
  },
};

/**
 * Message usage does not currently have a canonical persisted table in the
 * generated Supabase contract.
 *
 * Keep this counter isolated so it can later be replaced by a repository
 * without changing the public quota API.
 */
const messageUsage = new Map<string, number>();

function normalizePlan(
  plan: string,
): keyof typeof QUOTA_CONFIGS {
  const normalized = plan.toLowerCase();

  if (normalized === "premium") {
    return "premium";
  }

  return "free";
}

function getConfig(
  quotaType: QuotaType,
  plan: string,
): QuotaConfig {
  const normalizedPlan = normalizePlan(plan);

  return (
    QUOTA_CONFIGS[normalizedPlan]?.[quotaType] ??
    QUOTA_CONFIGS.free[quotaType]
  );
}

function getPeriodBounds(
  period: QuotaConfig["period"],
  now = new Date(),
): {
  start: Date;
  end: Date;
} {
  if (period === "monthly") {
    return {
      start: new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ),
      end: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
      ),
    };
  }

  return {
    start: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ),
    end: new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    ),
  };
}

function getMessageUsageKey(
  userId: string,
  periodStart: Date,
): string {
  return `${userId}:${periodStart.toISOString()}`;
}

async function getSimulationUsage(
  userId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("interview_sessions")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)
    .gte("created_at", periodStart.toISOString())
    .lt("created_at", periodEnd.toISOString());

  if (error) {
    throw error;
  }

  return count ?? 0;
}

/**
 * reports does not contain user_id.
 *
 * Ownership is defined by:
 *
 * reports.session_id
 *     -> interview_sessions.id
 *     -> interview_sessions.user_id
 *
 * We therefore resolve the user's sessions first and then count reports
 * attached to those sessions.
 */
async function getReportUsage(
  userId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  const supabase = await createClient();

  const { data: sessions, error: sessionsError } =
    await supabase
      .from("interview_sessions")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", periodStart.toISOString())
      .lt("created_at", periodEnd.toISOString());

  if (sessionsError) {
    throw sessionsError;
  }

  const sessionIds = (sessions ?? []).map(
    (session) => session.id,
  );

  if (sessionIds.length === 0) {
    return 0;
  }

  const { count, error } = await supabase
    .from("reports")
    .select("id", {
      count: "exact",
      head: true,
    })
    .in("session_id", sessionIds)
    .gte("created_at", periodStart.toISOString())
    .lt("created_at", periodEnd.toISOString());

  if (error) {
    throw error;
  }

  return count ?? 0;
}

/**
 * Canonical generated Supabase contract:
 *
 * table: AIUsageLog
 *
 * columns:
 * - userId
 * - tokensInput
 * - tokensOutput
 * - createdAt
 */
async function getTokenUsage(
  userId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("AIUsageLog")
    .select("tokensInput,tokensOutput")
    .eq("userId", userId)
    .gte("createdAt", periodStart.toISOString())
    .lt("createdAt", periodEnd.toISOString());

  if (error) {
    throw error;
  }

  return (data ?? []).reduce(
    (total, row) =>
      total +
      row.tokensInput +
      row.tokensOutput,
    0,
  );
}

async function getUsage(
  userId: string,
  quotaType: QuotaType,
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  switch (quotaType) {
    case "simulations":
      return getSimulationUsage(
        userId,
        periodStart,
        periodEnd,
      );

    case "reports":
      return getReportUsage(
        userId,
        periodStart,
        periodEnd,
      );

    case "tokens":
      return getTokenUsage(
        userId,
        periodStart,
        periodEnd,
      );

    case "messages":
      return (
        messageUsage.get(
          getMessageUsageKey(
            userId,
            periodStart,
          ),
        ) ?? 0
      );

    default: {
      const exhaustiveCheck: never = quotaType;
      return exhaustiveCheck;
    }
  }
}

/**
 * Check whether a user may consume the requested resource.
 */
export async function checkQuota(
  userId: string,
  quotaType: QuotaType,
  plan: string = "free",
): Promise<QuotaResult> {
  const cache = getCache();

  const cacheKey = CacheKeys.userQuota(
    userId,
    quotaType,
  );

  const cached =
    cache.get<QuotaResult>(cacheKey);

  if (cached) {
    logger.debug("Quota cache hit", {
      userId,
      quotaType,
    });

    return cached;
  }

  const config = getConfig(
    quotaType,
    plan,
  );

  const {
    start: periodStart,
    end: periodEnd,
  } = getPeriodBounds(config.period);

  try {
    const used = await getUsage(
      userId,
      quotaType,
      periodStart,
      periodEnd,
    );

    const remaining = Math.max(
      0,
      config.limit - used,
    );

    const result: QuotaResult = {
      allowed: remaining > 0,
      remaining,
      resetTime: periodEnd,
    };

    cache.set(
      cacheKey,
      result,
      TTL.SHORT,
    );

    return result;
  } catch (error) {
    logger.error("Quota check error", {
      userId,
      quotaType,
      error,
    });

    /*
     * Fail-open preserves the historical application behaviour.
     * A database/telemetry failure must not incorrectly lock a user out.
     */
    return {
      allowed: true,
      remaining: config.limit,
      resetTime: periodEnd,
    };
  }
}

/**
 * Notify the quota layer that a resource has been consumed.
 *
 * Persisted resources do not require a separate counter because their
 * canonical database records are the source of truth.
 *
 * Messages currently use an isolated in-memory counter.
 */
export async function incrementQuota(
  userId: string,
  quotaType: QuotaType,
  amount: number = 1,
): Promise<void> {
  const cache = getCache();

  cache.delete(
    CacheKeys.userQuota(
      userId,
      quotaType,
    ),
  );

  if (quotaType !== "messages") {
    return;
  }

  const config =
    QUOTA_CONFIGS.free.messages;

  const { start } = getPeriodBounds(
    config.period,
  );

  const key = getMessageUsageKey(
    userId,
    start,
  );

  const current =
    messageUsage.get(key) ?? 0;

  messageUsage.set(
    key,
    current + amount,
  );
}

/**
 * No database cleanup is necessary anymore because quotas are calculated
 * from canonical resource timestamps rather than quota rows.
 *
 * Expired in-memory message counters are removed here.
 */
export async function cleanupExpiredQuotas(): Promise<void> {
  const today =
    getPeriodBounds("daily").start;

  for (const key of messageUsage.keys()) {
    const separatorIndex =
      key.lastIndexOf(":");

    if (separatorIndex === -1) {
      messageUsage.delete(key);
      continue;
    }

    const dateValue = key.slice(
      separatorIndex + 1,
    );

    const periodStart =
      new Date(dateValue);

    if (
      Number.isNaN(
        periodStart.getTime(),
      ) ||
      periodStart < today
    ) {
      messageUsage.delete(key);
    }
  }
}

/**
 * Return the current Free-plan quota snapshot.
 *
 * This preserves the historical public function signature.
 */
export async function getUserQuotas(
  userId: string,
): Promise<
  Record<QuotaType, UserQuota>
> {
  const quotaTypes: QuotaType[] = [
    "simulations",
    "messages",
    "reports",
    "tokens",
  ];

  const entries = await Promise.all(
    quotaTypes.map(
      async (quotaType) => {
        const config =
          QUOTA_CONFIGS.free[
            quotaType
          ];

        const {
          start,
          end,
        } = getPeriodBounds(
          config.period,
        );

        try {
          const used = await getUsage(
            userId,
            quotaType,
            start,
            end,
          );

          return [
            quotaType,
            {
              limit: config.limit,
              used,
              remaining: Math.max(
                0,
                config.limit - used,
              ),
            },
          ] as const;
        } catch (error) {
          logger.error(
            "Get user quota error",
            {
              userId,
              quotaType,
              error,
            },
          );

          return [
            quotaType,
            {
              limit: config.limit,
              used: 0,
              remaining:
                config.limit,
            },
          ] as const;
        }
      },
    ),
  );

  return Object.fromEntries(
    entries,
  ) as Record<
    QuotaType,
    UserQuota
  >;
}
