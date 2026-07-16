// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { livenessCheck } from "@/lib/core/monitoring";
import { LoggerProvider } from "@/lib/core/observability/logger";

const logger = LoggerProvider.getLogger();

export async function GET(req: NextRequest) {
  try {
    const result = await livenessCheck();

    const statusCode = result.status === "pass" ? 200 : 503;

    return NextResponse.json(
      {
        status: result.status === "pass" ? "healthy" : "unhealthy",
        checks: {
          liveness: result,
        },
        timestamp: new Date(),
      },
      { status: statusCode }
    );
  } catch (error) {
    logger.error("Liveness check failed", { error });
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date(),
      },
      { status: 503 }
    );
  }
}
