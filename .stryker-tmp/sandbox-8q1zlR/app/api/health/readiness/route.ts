// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getHealthChecker, setupReadinessChecks } from "@/lib/core/monitoring";
import { LoggerProvider } from "@/lib/core/observability/logger";

const logger = LoggerProvider.getLogger();

// Setup readiness checks on module load
setupReadinessChecks();

export async function GET(req: NextRequest) {
  try {
    const healthChecker = getHealthChecker();
    const result = await healthChecker.check();

    const statusCode = result.status === "healthy" ? 200 : result.status === "degraded" ? 200 : 503;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    logger.error("Readiness check failed", { error });
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
