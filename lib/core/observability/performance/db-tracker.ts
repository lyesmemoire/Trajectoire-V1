/**
 * Database Query Tracker
 * Wrapper to track Prisma and Supabase query performance
 */

import { getPerformanceTracker } from "./performance-tracker";
import { LoggerProvider } from "../logger";

const logger = LoggerProvider.getLogger();
const tracker = getPerformanceTracker();

export function trackPrismaQuery<T>(
  operation: string,
  model: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const timerId = tracker.start(`prisma:${model}:${operation}`);

  return queryFn()
    .then((result) => {
      tracker.stop(timerId, `prisma:${model}:${operation}`, { model, operation });
      return result;
    })
    .catch((error) => {
      tracker.stop(timerId, `prisma:${model}:${operation}`, {
        model,
        operation,
        error: "failed",
      });
      logger.error("Prisma query failed", { model, operation, error });
      throw error;
    });
}

export function trackSupabaseQuery<T>(
  operation: string,
  table: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const timerId = tracker.start(`supabase:${table}:${operation}`);

  return queryFn()
    .then((result) => {
      tracker.stop(timerId, `supabase:${table}:${operation}`, { table, operation });
      return result;
    })
    .catch((error) => {
      tracker.stop(timerId, `supabase:${table}:${operation}`, {
        table,
        operation,
        error: "failed",
      });
      logger.error("Supabase query failed", { table, operation, error });
      throw error;
    });
}
