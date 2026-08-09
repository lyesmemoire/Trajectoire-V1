/**
 * Performance Middleware - SPRINT-4.5
 * 
 * Next.js middleware for automatic performance monitoring
 */

import { performanceMonitor } from './PerformanceMonitor';

export function withPerformanceTracking(handler: (...args: any[]) => Promise<any>) {
  return async (req: Request, ...args: any[]) => {
    const start = Date.now();
    const operation = `${req.method} ${new URL(req.url).pathname}`;

    try {
      const result = await handler(req, ...args);
      const duration = Date.now() - start;
      performanceMonitor.recordOperation(operation, duration, true);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      performanceMonitor.recordOperation(operation, duration, false);
      throw error;
    }
  };
}

export function measureMiddleware(req: Request, res: any, next: () => void) {
  const start = Date.now();
  const operation = `${req.method} ${new URL(req.url).pathname}`;

  res.on('finish', () => {
    const duration = Date.now() - start;
    performanceMonitor.recordOperation(operation, duration, res.statusCode < 400);
  });

  next();
}