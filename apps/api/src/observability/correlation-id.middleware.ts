/**
 * Correlation ID Middleware
 * Adds correlation ID to all incoming requests for distributed tracing
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const CORRELATION_ID_HEADER = 'x-correlation-id';
export const SPAN_ID_HEADER = 'x-span-id';
export const GRAPH_EXECUTION_ID_HEADER = 'x-graph-execution-id';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      spanId?: string;
      graphExecutionId?: string;
    }
  }
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    // Get or generate correlation ID
    const correlationId =
      (req.headers[CORRELATION_ID_HEADER] as string) || uuidv4();

    // Get or generate span ID
    const spanId = (req.headers[SPAN_ID_HEADER] as string) || uuidv4();

    // Get graph execution ID if present
    const graphExecutionId = req.headers[GRAPH_EXECUTION_ID_HEADER] as string;

    // Add to request object
    req.correlationId = correlationId;
    req.spanId = spanId;
    req.graphExecutionId = graphExecutionId;

    // Add to response headers
    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    res.setHeader(SPAN_ID_HEADER, spanId);

    if (graphExecutionId) {
      res.setHeader(GRAPH_EXECUTION_ID_HEADER, graphExecutionId);
    }

    // Log correlation information
    this.logger.debug(
      `Request: ${req.method} ${req.path} - Correlation ID: ${correlationId}, Span ID: ${spanId}`,
    );

    next();
  }
}
