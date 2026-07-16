/**
 * Readiness Check
 * Checks if the application is ready to accept traffic
 */
// @ts-nocheck


import { getHealthChecker, CheckResult } from "./health-check";
import { LoggerProvider } from "@/lib/core/observability/logger";
import { envServer } from "@/lib/env.server";

const logger = LoggerProvider.getLogger();

export function setupReadinessChecks(): void {
  const healthChecker = getHealthChecker();

  // Database readiness check
  healthChecker.register("database", async (): Promise<CheckResult> => {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: "pass",
        message: "Database connection successful",
      };
    } catch (error) {
      logger.error("Database readiness check failed", { error });
      return {
        status: "fail",
        message: error instanceof Error ? error.message : "Database connection failed",
      };
    }
  });

  // Redis readiness check
  healthChecker.register("redis", async (): Promise<CheckResult> => {
    try {
      if (!envServer.UPSTASH_REDIS_REST_URL || !envServer.UPSTASH_REDIS_REST_TOKEN) {
        return {
          status: "warn",
          message: "Redis not configured",
        };
      }

      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({
        url: envServer.UPSTASH_REDIS_REST_URL,
        token: envServer.UPSTASH_REDIS_REST_TOKEN,
      });

      await redis.ping();
      return {
        status: "pass",
        message: "Redis connection successful",
      };
    } catch (error) {
      logger.error("Redis readiness check failed", { error });
      return {
        status: "fail",
        message: error instanceof Error ? error.message : "Redis connection failed",
      };
    }
  });

  // Supabase readiness check
  healthChecker.register("supabase", async (): Promise<CheckResult> => {
    try {
      const { createAdminClientSupabase } = await import("@/lib/supabase/admin");
      const supabase = createAdminClientSupabase();
      
      const { error } = await supabase.from("users").select("id").limit(1);
      
      if (error) {
        throw error;
      }

      return {
        status: "pass",
        message: "Supabase connection successful",
      };
    } catch (error) {
      logger.error("Supabase readiness check failed", { error });
      return {
        status: "fail",
        message: error instanceof Error ? error.message : "Supabase connection failed",
      };
    }
  });

  // AI providers readiness check
  healthChecker.register("ai_providers", async (): Promise<CheckResult> => {
    const providers: string[] = [];
    const failedProviders: string[] = [];

    if (envServer.OPENAI_API_KEY) {
      providers.push("OpenAI");
    }
    if (envServer.ANTHROPIC_API_KEY) {
      providers.push("Anthropic");
    }
    if (envServer.MISTRAL_API_KEY) {
      providers.push("Mistral");
    }
    if (envServer.GROQ_API_KEY) {
      providers.push("Groq");
    }

    if (providers.length === 0) {
      return {
        status: "warn",
        message: "No AI providers configured",
      };
    }

    return {
      status: "pass",
      message: `${providers.length} AI providers configured`,
      metadata: { providers },
    };
  });
}
