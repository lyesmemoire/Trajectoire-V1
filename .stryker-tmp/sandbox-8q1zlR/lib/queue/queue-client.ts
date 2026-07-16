/**
 * Queue Client using Upstash QStash
 * Provides a simple interface for enqueuing background jobs
 */
// @ts-nocheck


import { envServer } from "@/lib/env.server";
import { LoggerProvider } from "@/lib/core/observability/logger";
import { JobType, JobPayload } from "./job-types";

const logger = LoggerProvider.getLogger();

/**
 * Simple queue client using Upstash QStash
 * For production, this would use the official @upstash/qstash SDK
 */
export class QueueClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = envServer.QSTASH_URL || "https://qstash.upstash.io";
    this.token = envServer.QSTASH_TOKEN || "";
  }

  /**
   * Enqueue a job for background processing
   */
  async enqueue(type: JobType, payload: JobPayload, delay?: number): Promise<string> {
    if (!this.token) {
      logger.warn("Queue client not configured, job will not be enqueued", { type });
      // In development, return a dummy job ID
      return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    try {
      const job = {
        type,
        payload,
        scheduledAt: delay ? new Date(Date.now() + delay) : undefined,
        attempts: 0,
        maxAttempts: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch(`${this.baseUrl}/v2/publish/${type}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });

      if (!response.ok) {
        throw new Error(`Queue request failed: ${response.statusText}`);
      }

      const data = await response.json();
      logger.info("Job enqueued successfully", { type, jobId: data.messageId });
      return data.messageId;
    } catch (error) {
      logger.error("Failed to enqueue job", { type, error });
      throw error;
    }
  }

  /**
   * Enqueue a job with a delay
   */
  async enqueueWithDelay(type: JobType, payload: JobPayload, delayMs: number): Promise<string> {
    return this.enqueue(type, payload, delayMs);
  }

  /**
   * Check if queue is configured
   */
  isConfigured(): boolean {
    return !!this.token;
  }
}

// Singleton instance
let queueClient: QueueClient | null = null;

export function getQueueClient(): QueueClient {
  if (!queueClient) {
    queueClient = new QueueClient();
  }
  return queueClient;
}
