/**
 * Performance Health Check Endpoint - SPRINT-4.5
 * 
 * Returns current performance metrics and optimization status
 */

import { NextResponse } from 'next/server';
import { performanceMonitor, autoOptimizer } from '@/lib/performance';

export const dynamic = 'force-dynamic';

export async function GET() {
  const metrics = performanceMonitor.getCurrentMetrics();
  const optimizerStatus = autoOptimizer.getStatus();

  return NextResponse.json({
    metrics,
    optimizer: optimizerStatus,
    timestamp: new Date().toISOString(),
  });
}