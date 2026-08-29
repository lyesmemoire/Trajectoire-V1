import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ReadinessCheck {
  name: string;
  status: "ok" | "error";
  message?: string;
}

interface ReadinessStatus {
  status: "ready" | "not_ready";
  checks: ReadinessCheck[];
  timestamp: string;
}

const CHECK_TIMEOUT_MS = 5_000;

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  return AbortSignal.timeout(timeoutMs);
}

async function checkDatabase(): Promise<ReadinessCheck> {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      name: "database",
      status: "ok",
    };
  } catch (error) {
    return {
      name: "database",
      status: "error",
      message: describeError(error),
    };
  }
}

async function checkRedis(): Promise<ReadinessCheck> {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(
    /\/+$/,
    "",
  );

  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!restUrl || !token) {
    return {
      name: "redis",
      status: "ok",
      message: "not configured",
    };
  }

  try {
    const response = await fetch(`${restUrl}/ping`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: createTimeoutSignal(CHECK_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        name: "redis",
        status: "error",
        message: `HTTP ${response.status}`,
      };
    }

    const payload = (await response.json()) as {
      result?: unknown;
      error?: unknown;
    };

    if (payload.error) {
      return {
        name: "redis",
        status: "error",
        message: String(payload.error),
      };
    }

    if (payload.result !== "PONG") {
      return {
        name: "redis",
        status: "error",
        message: `Unexpected response: ${String(payload.result)}`,
      };
    }

    return {
      name: "redis",
      status: "ok",
    };
  } catch (error) {
    return {
      name: "redis",
      status: "error",
      message: describeError(error),
    };
  }
}

async function checkSupabase(): Promise<ReadinessCheck> {
  const baseUrl =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!baseUrl || !serviceRoleKey) {
    return {
      name: "supabase",
      status: "error",
      message: "Supabase server configuration missing",
    };
  }

  const restUrl =
    `${baseUrl.replace(/\/+$/, "")}` +
    "/rest/v1/interview_sessions?select=id&limit=1";

  try {
    const response = await fetch(restUrl, {
      method: "GET",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: createTimeoutSignal(CHECK_TIMEOUT_MS),
    });

    if (!response.ok) {
      let detail = "";

      try {
        detail = await response.text();
      } catch {
        detail = "";
      }

      return {
        name: "supabase",
        status: "error",
        message: detail
          ? `HTTP ${response.status}: ${detail.slice(0, 300)}`
          : `HTTP ${response.status}`,
      };
    }

    return {
      name: "supabase",
      status: "ok",
    };
  } catch (error) {
    return {
      name: "supabase",
      status: "error",
      message: describeError(error),
    };
  }
}

function checkOpenAI(): ReadinessCheck {
  const key = process.env.OPENAI_API_KEY?.trim();

  if (!key) {
    return {
      name: "openai",
      status: "ok",
      message: "not configured",
    };
  }

  if (!key.startsWith("sk-")) {
    return {
      name: "openai",
      status: "error",
      message: "Invalid API key format",
    };
  }

  return {
    name: "openai",
    status: "ok",
  };
}

function checkStripe(): ReadinessCheck {
  const key = process.env.STRIPE_SECRET_KEY?.trim();

  if (!key) {
    return {
      name: "stripe",
      status: "ok",
      message: "not configured",
    };
  }

  if (!key.startsWith("sk_")) {
    return {
      name: "stripe",
      status: "error",
      message: "Invalid API key format",
    };
  }

  return {
    name: "stripe",
    status: "ok",
  };
}

export async function GET() {
  try {
    const checks: ReadinessCheck[] = [];

    checks.push(await checkDatabase());
    checks.push(await checkRedis());
    checks.push(await checkSupabase());
    checks.push(checkOpenAI());
    checks.push(checkStripe());

    const hasFailure = checks.some((check) => check.status === "error");

    const result: ReadinessStatus = {
      status: hasFailure ? "not_ready" : "ready",
      checks,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      status: hasFailure ? 503 : 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const result: ReadinessStatus = {
      status: "not_ready",
      checks: [
        {
          name: "readiness",
          status: "error",
          message: describeError(error),
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }
}
