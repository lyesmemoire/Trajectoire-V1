/**
 * Performance Health Check Endpoint - SPRINT-4.5
 * 
 * Returns current performance metrics and optimization status
 */

import { NextResponse } from 'next/server';
import { performanceMonitor } from '@/lib/performance/PerformanceMonitor';

export const dynamic = 'force-dynamic';

export async function GET() {
  const metrics = performanceMonitor.getCurrentMetrics();
  const currentMetrics = performanceMonitor.getCurrentMetrics();
    const targetP95 = 300;
    const slowOperations = performanceMonitor.getSlowOperations(targetP95);

    const optimizerStatus = {
      targetP95,
      currentP95: currentMetrics.latency.p95,
      isUnderTarget: currentMetrics.latency.p95 < targetP95,
      slowOperations,
      isOptimizing: false,
      needsOptimization: currentMetrics.latency.p95 > targetP95,
    };

  return NextResponse.json({
    metrics,
    optimizer: optimizerStatus,
    timestamp: new Date().toISOString(),
  });
}