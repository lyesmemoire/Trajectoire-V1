/**
 * Blueprint DSL CPR Distributed Profiler
 * 
 * Profiles performance across distributed nodes.
 */

import { ClusterManager } from './cluster-manager';

export interface ProfileData {
  nodeId: string;
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  executionTime: number;
  operationCount: number;
  customMetrics: Map<string, number>;
}

export interface ProfileReport {
  nodeId: string;
  startTime: number;
  endTime: number;
  dataPoints: ProfileData[];
  statistics: ProfileStatistics;
}

export interface ProfileStatistics {
  averageCpu: number;
  averageMemory: number;
  averageExecutionTime: number;
  totalOperations: number;
  peakCpu: number;
  peakMemory: number;
}

export class DistributedProfiler {
  private clusterManager: ClusterManager;
  private reports: Map<string, ProfileReport> = new Map();
  private currentData: Map<string, ProfileData[]> = new Map();
  private reportCounter: number = 0;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  /**
   * Start profiling for node
   */
  public startProfiling(nodeId: string): void {
    this.currentData.set(nodeId, []);
  }

  /**
   * Stop profiling for node
   */
  public stopProfiling(nodeId: string): ProfileReport | null {
    const data = this.currentData.get(nodeId);

    if (!data || data.length === 0) {
      return null;
    }

    const report: ProfileReport = {
      nodeId,
      startTime: data[0].timestamp,
      endTime: data[data.length - 1].timestamp,
      dataPoints: [...data],
      statistics: this.calculateStatistics(data),
    };

    this.reports.set(`report_${this.reportCounter++}`, report);
    this.currentData.delete(nodeId);

    return report;
  }

  /**
   * Collect profile data
   */
  public collect(nodeId: string, metrics: Partial<ProfileData>): void {
    const data = this.currentData.get(nodeId);

    if (!data) {
      return;
    }

    const profileData: ProfileData = {
      nodeId,
      timestamp: Date.now(),
      cpuUsage: metrics.cpuUsage || 0,
      memoryUsage: metrics.memoryUsage || 0,
      executionTime: metrics.executionTime || 0,
      operationCount: metrics.operationCount || 0,
      customMetrics: metrics.customMetrics || new Map(),
    };

    data.push(profileData);
  }

  /**
   * Calculate statistics from profile data
   */
  private calculateStatistics(data: ProfileData[]): ProfileStatistics {
    if (data.length === 0) {
      return {
        averageCpu: 0,
        averageMemory: 0,
        averageExecutionTime: 0,
        totalOperations: 0,
        peakCpu: 0,
        peakMemory: 0,
      };
    }

    const totalCpu = data.reduce((sum, d) => sum + d.cpuUsage, 0);
    const totalMemory = data.reduce((sum, d) => sum + d.memoryUsage, 0);
    const totalExecutionTime = data.reduce((sum, d) => sum + d.executionTime, 0);
    const totalOperations = data.reduce((sum, d) => sum + d.operationCount, 0);
    const peakCpu = Math.max(...data.map(d => d.cpuUsage));
    const peakMemory = Math.max(...data.map(d => d.memoryUsage));

    return {
      averageCpu: totalCpu / data.length,
      averageMemory: totalMemory / data.length,
      averageExecutionTime: totalExecutionTime / data.length,
      totalOperations,
      peakCpu,
      peakMemory,
    };
  }

  /**
   * Get report by id
   */
  public getReport(reportId: string): ProfileReport | null {
    const report = this.reports.get(reportId);
    return report ? { ...report, dataPoints: [...report.dataPoints] } : null;
  }

  /**
   * Get all reports
   */
  public getAllReports(): ProfileReport[] {
    return Array.from(this.reports.values()).map(r => ({ ...r, dataPoints: [...r.dataPoints] }));
  }

  /**
   * Get reports by node
   */
  public getReportsByNode(nodeId: string): ProfileReport[] {
    return Array.from(this.reports.values())
      .filter(r => r.nodeId === nodeId)
      .map(r => ({ ...r, dataPoints: [...r.dataPoints] }));
  }

  /**
   * Get reports in time range
   */
  public getReportsInRange(start: number, end: number): ProfileReport[] {
    return Array.from(this.reports.values())
      .filter(r => r.startTime >= start && r.endTime <= end)
      .map(r => ({ ...r, dataPoints: [...r.dataPoints] }));
  }

  /**
   * Get aggregate statistics across all reports
   */
  public getAggregateStatistics(): ProfileStatistics {
    const allData: ProfileData[] = [];

    for (const report of this.reports.values()) {
      allData.push(...report.dataPoints);
    }

    return this.calculateStatistics(allData);
  }

  /**
   * Compare two reports
   */
  public compareReports(reportId1: string, reportId2: string): {
    cpuDiff: number;
    memoryDiff: number;
    executionTimeDiff: number;
    operationsDiff: number;
  } | null {
    const r1 = this.reports.get(reportId1);
    const r2 = this.reports.get(reportId2);

    if (!r1 || !r2) {
      return null;
    }

    return {
      cpuDiff: r2.statistics.averageCpu - r1.statistics.averageCpu,
      memoryDiff: r2.statistics.averageMemory - r1.statistics.averageMemory,
      executionTimeDiff: r2.statistics.averageExecutionTime - r1.statistics.averageExecutionTime,
      operationsDiff: r2.statistics.totalOperations - r1.statistics.totalOperations,
    };
  }

  /**
   * Delete report
   */
  public deleteReport(reportId: string): boolean {
    return this.reports.delete(reportId);
  }

  /**
   * Clear all reports
   */
  public clear(): void {
    this.reports.clear();
    this.currentData.clear();
    this.reportCounter = 0;
  }

  /**
   * Validate profiler state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [id, report] of this.reports) {
      if (!this.clusterManager.getNode(report.nodeId)) {
        errors.push(`Report ${id} references non-existent node ${report.nodeId}`);
      }

      if (report.startTime < 0) {
        errors.push(`Invalid start time in report ${id}`);
      }

      if (report.endTime < report.startTime) {
        errors.push(`Invalid end time in report ${id}`);
      }

      for (const data of report.dataPoints) {
        if (data.timestamp < 0) {
          errors.push(`Invalid timestamp in report ${id}`);
        }

        if (data.cpuUsage < 0 || data.cpuUsage > 1) {
          errors.push(`Invalid CPU usage in report ${id}`);
        }

        if (data.memoryUsage < 0 || data.memoryUsage > 1) {
          errors.push(`Invalid memory usage in report ${id}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export reports to JSON
   */
  public export(): string {
    const data = Array.from(this.reports.values()).map(r => ({
      ...r,
      dataPoints: r.dataPoints.map(d => ({
        ...d,
        customMetrics: Array.from(d.customMetrics.entries()),
      })),
    }));
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import reports from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json) as ProfileReport[];

    for (const report of data) {
      this.reports.set(`report_${this.reportCounter++}`, {
        ...report,
        dataPoints: report.dataPoints.map(d => ({
          ...d,
          customMetrics: new Map(d.customMetrics),
        })),
      });
    }
  }

  /**
   * Set cluster manager
   */
  public setClusterManager(clusterManager: ClusterManager): void {
    this.clusterManager = clusterManager;
  }

  /**
   * Get cluster manager
   */
  public getClusterManager(): ClusterManager {
    return this.clusterManager;
  }
}
