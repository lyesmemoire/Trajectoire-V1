/**
 * Liveness Probe Endpoint
 * Checks if the application is alive and running
 * Lightweight check that doesn't depend on external services
 * 
 * GET /api/health/liveness
 * Returns: status, uptime, memory, timestamp
 */

import { NextResponse } from "next/server";

const START_TIME = Date.now();

interface LivenessStatus {
  status: "alive" | "dead";
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  timestamp: string;
}

export async function GET() {
  const status: LivenessStatus = {
    status: "alive",
    uptime: Date.now() - START_TIME,
    memory: {
      used: 0,
      total: 0,
      percentage: 0,
    },
    timestamp: new Date().toISOString(),
  };

  // Check memory usage
  if (typeof process !== "undefined" && process.memoryUsage) {
    const memoryUsage = process.memoryUsage();
    status.memory.used = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB
    status.memory.total = Math.round(memoryUsage.heapTotal / 1024 / 1024); // MB
    status.memory.percentage = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);

    // If memory usage is critically high, mark as dead
    if (status.memory.percentage > 95) {
      status.status = "dead";
    }
  }

  const statusCode = status.status === "alive" ? 200 : 503;

  return NextResponse.json(status, { status: statusCode });
}
