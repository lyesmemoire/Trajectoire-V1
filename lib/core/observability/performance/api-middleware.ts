/**
 * API Performance Middleware
 * Middleware to track API request/response performance
 */

import { NextRequest, NextResponse } from "next/server";
import { getPerformanceTracker } from "./performance-tracker";
import { LoggerProvider } from "../logger";

const logger = LoggerProvider.getLogger();
const tracker = getPerformanceTracker();

export function withPerformanceTracking(
  handler: (req: NextRequest) => Promise<NextResponse>,
  routeName: string
) {
  return async (req: NextRequest) => {
    const timerId = tracker.start(`api:${routeName}`);
    const startTime = Date.now();

    try {
      const response = await handler(req);
      const duration = tracker.stop(timerId, `api:${routeName}`, {
        method: req.method,
        path: req.nextUrl.pathname,
        status: response.status,
      });

      logger.info("API request completed", {
        route: routeName,
        method: req.method,
        path: req.nextUrl.pathname,
        status: response.status,
        duration,
      });

      return response;
    } catch (error) {
      const duration = tracker.stop(timerId, `api:${routeName}`, {
        method: req.method,
        path: req.nextUrl.pathname,
        error: "failed",
      });

      logger.error("API request failed", {
        route: routeName,
        method: req.method,
        path: req.nextUrl.pathname,
        duration,
        error,
      });

      throw error;
    }
  };
}
