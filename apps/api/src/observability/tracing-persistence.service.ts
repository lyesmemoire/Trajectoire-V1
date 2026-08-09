import { Injectable } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';

export interface SpanCreateInput {
  userId?: string;
  sessionId?: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  kind: 'INTERNAL' | 'SERVER' | 'CLIENT' | 'PRODUCER' | 'CONSUMER';
  startTime: Date;
  endTime?: Date;
  status?: 'OK' | 'ERROR';
  errorMessage?: string;
  attributes?: Record<string, string | number | boolean>;
  events?: Array<{ name: string; timestamp: Date; attributes?: Record<string, unknown> }>;
}

export interface SpanUpdateInput {
  endTime?: Date;
  status?: 'OK' | 'ERROR';
  errorMessage?: string;
  attributes?: Record<string, string | number | boolean>;
  events?: Array<{ name: string; timestamp: Date; attributes?: Record<string, unknown> }>;
}

@Injectable()
export class TracingPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a span record
   */
  async createSpan(input: SpanCreateInput): Promise<any> {
    const data: any = {
      type: 'trace',
      subtype: 'span',
      timestamp: input.startTime,
      payload: {
        traceId: input.traceId,
        spanId: input.spanId,
        parentSpanId: input.parentSpanId,
        operationName: input.operationName,
        kind: input.kind,
        startTime: input.startTime,
        endTime: input.endTime,
        status: input.status,
        errorMessage: input.errorMessage,
        attributes: input.attributes,
        events: input.events,
      },
    };

    if (input.userId) {
      data.userId = input.userId;
    }

    if (input.sessionId) {
      data.sessionId = input.sessionId;
    }

    const span = await this.prisma.behaviorEvent.create({
      data,
    });

    return span;
  }

  /**
   * Update a span with mandatory user filtering
   */
  async updateSpan(spanId: string, input: SpanUpdateInput, userId: string): Promise<any> {
    const whereClause: any = {
      type: 'trace',
      subtype: 'span',
      userId,
    };

    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const span = allSpans.find((s: any) => s.payload?.spanId === spanId);

    if (!span) {
      throw new Error(`Span ${spanId} not found`);
    }

    const currentPayload = span.payload as any;
    const updatedPayload: any = {
      traceId: currentPayload.traceId,
      spanId: currentPayload.spanId,
      parentSpanId: currentPayload.parentSpanId,
      operationName: currentPayload.operationName,
      kind: currentPayload.kind,
      startTime: currentPayload.startTime,
      endTime: input.endTime || currentPayload.endTime,
      status: input.status || currentPayload.status,
      errorMessage: input.errorMessage || currentPayload.errorMessage,
      attributes: input.attributes || currentPayload.attributes,
      events: input.events || currentPayload.events,
    };

    const updated = await this.prisma.behaviorEvent.update({
      where: { id: span.id },
      data: {
        payload: updatedPayload,
      },
    });

    return updated;
  }

  /**
   * Get a span by span ID with mandatory user filtering
   */
  async getSpan(spanId: string, userId: string): Promise<any | null> {
    const whereClause: any = {
      type: 'trace',
      subtype: 'span',
      userId,
    };

    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const span = allSpans.find((s: any) => s.payload?.spanId === spanId);

    return span || null;
  }

  /**
   * Get spans by trace ID with mandatory user filtering
   */
  async getSpansByTraceId(traceId: string, userId: string, limit = 100): Promise<any[]> {
    const whereClause: any = {
      type: 'trace',
      subtype: 'span',
      userId,
    };

    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'asc' },
      take: limit * 10,
    });

    return allSpans.filter((s: any) => s.payload?.traceId === traceId).slice(0, limit);
  }

  /**
   * Get spans by user ID
   */
  async getSpansByUserId(userId: string, limit = 100): Promise<any[]> {
    const spans = await this.prisma.behaviorEvent.findMany({
      where: {
        userId,
        type: 'trace',
        subtype: 'span',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return spans;
  }

  /**
   * Get spans by session ID
   */
  async getSpansBySessionId(sessionId: string, limit = 100): Promise<any[]> {
    const spans = await this.prisma.behaviorEvent.findMany({
      where: {
        sessionId,
        type: 'trace',
        subtype: 'span',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return spans;
  }

  /**
   * Get spans by operation name with mandatory user filtering
   */
  async getSpansByOperationName(operationName: string, userId: string, limit = 100): Promise<any[]> {
    const whereClause: any = {
      type: 'trace',
      subtype: 'span',
      userId,
    };

    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit * 10,
    });

    return allSpans.filter((s: any) => s.payload?.operationName === operationName).slice(0, limit);
  }

  /**
   * Delete a span by span ID with mandatory user filtering
   */
  async deleteSpan(spanId: string, userId: string): Promise<void> {
    const whereClause: any = {
      type: 'trace',
      subtype: 'span',
      userId,
    };

    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const span = allSpans.find((s: any) => s.payload?.spanId === spanId);

    if (span) {
      await this.prisma.behaviorEvent.delete({
        where: { id: span.id },
      });
    }
  }

  /**
   * Delete spans by trace ID
   */
  async deleteSpansByTraceId(traceId: string): Promise<number> {
    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: {
        type: 'trace',
        subtype: 'span',
      },
      take: 10000,
    });

    const toDelete = allSpans.filter((s: any) => s.payload?.traceId === traceId);

    if (toDelete.length === 0) {
      return 0;
    }

    await this.prisma.behaviorEvent.deleteMany({
      where: {
        id: {
          in: toDelete.map((s: any) => s.id),
        },
      },
    });

    return toDelete.length;
  }

  /**
   * Cleanup old spans
   */
  async cleanupOldSpans(daysOld = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.behaviorEvent.deleteMany({
      where: {
        type: 'trace',
        subtype: 'span',
        timestamp: { lt: cutoffDate },
      },
    });

    return result.count;
  }

  /**
   * Get trace statistics
   */
  async getTraceStatistics(userId?: string): Promise<any> {
    const whereClause: any = {
      type: 'trace',
      subtype: 'span',
    };

    if (userId) {
      whereClause.userId = userId;
    }

    const allSpans = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const totalSpans = allSpans.length;
    const uniqueTraces = new Set(allSpans.map((s: any) => s.payload?.traceId)).size;

    const spansByStatus = allSpans.reduce((acc: any, s: any) => {
      const status = s.payload?.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const spansByOperation = allSpans.reduce((acc: any, s: any) => {
      const operation = s.payload?.operationName || 'UNKNOWN';
      acc[operation] = (acc[operation] || 0) + 1;
      return acc;
    }, {});

    const errorSpans = allSpans.filter((s: any) => s.payload?.status === 'ERROR').length;
    const errorRate = totalSpans > 0 ? (errorSpans / totalSpans) * 100 : 0;

    return {
      totalSpans,
      uniqueTraces,
      spansByStatus,
      spansByOperation,
      errorRate,
    };
  }
}
