// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getQueueClient } from "@/lib/queue";
import { JobType } from "@/lib/queue/job-types";
import { LoggerProvider } from "@/lib/core/observability/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const log = LoggerProvider.getLogger();
  
  try {
    const body = await req.json();
    const { type, payload, delay } = body;

    if (!type || !payload) {
      return NextResponse.json(
        { error: "Missing type or payload" },
        { status: 400 }
      );
    }

    const queueClient = getQueueClient();
    
    if (!queueClient.isConfigured()) {
      log.warn("Queue not configured, job will not be enqueued", { type });
      return NextResponse.json(
        { 
          warning: "Queue not configured",
          jobId: "dummy_job_id",
          message: "Job would be enqueued in production"
        },
        { status: 200 }
      );
    }

    const jobId = await queueClient.enqueue(
      type as JobType,
      payload,
      delay
    );

    log.info("Job enqueued", { type, jobId, delay });
    
    return NextResponse.json({
      success: true,
      jobId,
      type,
      scheduledAt: delay ? new Date(Date.now() + delay).toISOString() : new Date().toISOString(),
    });
  } catch (error) {
    log.error("Failed to enqueue job", { error });
    return NextResponse.json(
      { error: "Failed to enqueue job" },
      { status: 500 }
    );
  }
}
