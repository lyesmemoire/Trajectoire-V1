import { Injectable } from '@nestjs/common';
import { PrismaService } from '../runtime/kg/prisma.service';

export interface MetricCreateInput {
  userId?: string;
  metricName: string;
  metricType: 'counter' | 'histogram' | 'gauge' | 'up_down_counter';
  value: number;
  attributes?: Record<string, string | number | boolean>;
  timestamp?: Date;
}

export interface MetricAggregateInput {
  metricName: string;
  metricType: 'counter' | 'histogram' | 'gauge' | 'up_down_counter';
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
  startTime: Date;
  endTime: Date;
  attributes?: Record<string, string | number | boolean>;
}

@Injectable()
export class MetricsPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a metric record
   */
  async createMetric(input: MetricCreateInput): Promise<any> {
    const data: any = {
      type: 'metric',
      subtype: input.metricType,
      timestamp: input.timestamp || new Date(),
      payload: {
        metricName: input.metricName,
        value: input.value,
        attributes: input.attributes,
      },
    };

    if (input.userId) {
      data.userId = input.userId;
    }

    const metric = await this.prisma.behaviorEvent.create({
      data,
    });

    return metric;
  }

  /**
   * Create multiple metrics in bulk
   */
  async createMetrics(inputs: MetricCreateInput[]): Promise<any[]> {
    const data = inputs.map((input) => {
      const item: any = {
        type: 'metric',
        subtype: input.metricType,
        timestamp: input.timestamp || new Date(),
        payload: {
          metricName: input.metricName,
          value: input.value,
          attributes: input.attributes,
        },
      };

      if (input.userId) {
        item.userId = input.userId;
      }

      return item;
    });

    const metrics = await this.prisma.behaviorEvent.createMany({
      data,
      skipDuplicates: true,
    });

    return [];
  }

  /**
   * Get metrics by name with mandatory user filtering
   */
  async getMetricsByName(metricName: string, userId: string, limit = 100): Promise<any[]> {
    const whereClause: any = {
      type: 'metric',
      userId,
    };

    const allMetrics = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit * 10,
    });

    return allMetrics.filter((m: any) => m.payload?.metricName === metricName).slice(0, limit);
  }

  /**
   * Get metrics by type with mandatory user filtering
   */
  async getMetricsByType(metricType: string, userId: string, limit = 100): Promise<any[]> {
    const whereClause: any = {
      type: 'metric',
      subtype: metricType,
      userId,
    };

    const metrics = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return metrics;
  }

  /**
   * Get metrics by time range with mandatory user filtering
   */
  async getMetricsByTimeRange(startTime: Date, endTime: Date, userId: string, limit = 100): Promise<any[]> {
    const whereClause: any = {
      type: 'metric',
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
      userId,
    };

    const metrics = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return metrics;
  }

  /**
   * Aggregate metrics
   */
  async aggregateMetrics(input: MetricAggregateInput): Promise<any> {
    const whereClause: any = {
      type: 'metric',
      subtype: input.metricType,
      timestamp: {
        gte: input.startTime,
        lte: input.endTime,
      },
    };

    const allMetrics = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const filteredMetrics = allMetrics.filter((m: any) => m.payload?.metricName === input.metricName);

    if (filteredMetrics.length === 0) {
      return {
        metricName: input.metricName,
        aggregation: input.aggregation,
        value: 0,
        count: 0,
      };
    }

    const values = filteredMetrics.map((m: any) => m.payload?.value || 0);

    let result: number;
    switch (input.aggregation) {
      case 'sum':
        result = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'avg':
        result = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'min':
        result = Math.min(...values);
        break;
      case 'max':
        result = Math.max(...values);
        break;
      case 'count':
        result = values.length;
        break;
      default:
        result = 0;
    }

    return {
      metricName: input.metricName,
      aggregation: input.aggregation,
      value: result,
      count: values.length,
    };
  }

  /**
   * Delete metrics by name with mandatory user filtering
   */
  async deleteMetricsByName(metricName: string, userId: string): Promise<number> {
    const whereClause: any = {
      type: 'metric',
      userId,
    };

    const allMetrics = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const toDelete = allMetrics.filter((m: any) => m.payload?.metricName === metricName);

    if (toDelete.length === 0) {
      return 0;
    }

    await this.prisma.behaviorEvent.deleteMany({
      where: {
        id: {
          in: toDelete.map((m: any) => m.id),
        },
      },
    });

    return toDelete.length;
  }

  /**
   * Delete metrics by time range with mandatory user filtering
   */
  async deleteMetricsByTimeRange(startTime: Date, endTime: Date, userId: string): Promise<number> {
    const whereClause: any = {
      type: 'metric',
      timestamp: {
        gte: startTime,
        lte: endTime,
      },
      userId,
    };

    const result = await this.prisma.behaviorEvent.deleteMany({
      where: whereClause,
    });

    return result.count;
  }

  /**
   * Cleanup old metrics
   */
  async cleanupOldMetrics(daysOld = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.behaviorEvent.deleteMany({
      where: {
        type: 'metric',
        timestamp: { lt: cutoffDate },
      },
    });

    return result.count;
  }

  /**
   * Get metric statistics
   */
  async getMetricStatistics(metricName?: string): Promise<any> {
    const whereClause: any = {
      type: 'metric',
    };

    const allMetrics = await this.prisma.behaviorEvent.findMany({
      where: whereClause,
      take: 10000,
    });

    const filteredMetrics = metricName
      ? allMetrics.filter((m: any) => m.payload?.metricName === metricName)
      : allMetrics;

    const totalMetrics = filteredMetrics.length;
    const metricsByType = filteredMetrics.reduce((acc: any, m: any) => {
      const type = m.subtype;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const uniqueMetricNames = new Set(filteredMetrics.map((m: any) => m.payload?.metricName)).size;

    return {
      totalMetrics,
      metricsByType,
      uniqueMetricNames,
    };
  }
}
