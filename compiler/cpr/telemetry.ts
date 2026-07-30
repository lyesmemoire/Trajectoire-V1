/**
 * Blueprint DSL CPR Telemetry
 * 
 * Collects and manages telemetry data across the cluster.
 */

import { ClusterManager } from './cluster-manager';

export interface TelemetryData {
  nodeId: string;
  timestamp: number;
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  customMetrics: Map<string, number>;
}

export interface TelemetryStatistics {
  averageCpu: number;
  averageMemory: number;
  averageNetwork: number;
  averageDisk: number;
  peakCpu: number;
  peakMemory: number;
  dataPoints: number;
}

export class Telemetry {
  private clusterManager: ClusterManager;
  private data: Map<string, TelemetryData[]> = new Map();
  private maxDataPoints: number = 1000;

  constructor(clusterManager: ClusterManager, maxDataPoints: number = 1000) {
    this.clusterManager = clusterManager;
    this.maxDataPoints = maxDataPoints;
  }

  /**
   * Collect telemetry data
   */
  public collect(nodeId: string, metrics: Partial<TelemetryData>): void {
    const telemetry: TelemetryData = {
      nodeId,
      timestamp: Date.now(),
      cpu: metrics.cpu || 0,
      memory: metrics.memory || 0,
      network: metrics.network || 0,
      disk: metrics.disk || 0,
      customMetrics: metrics.customMetrics || new Map(),
    };

    const nodeData = this.data.get(nodeId) || [];
    nodeData.push(telemetry);

    // Evict old data if needed
    if (nodeData.length > this.maxDataPoints) {
      nodeData.shift();
    }

    this.data.set(nodeId, nodeData);
  }

  /**
   * Get telemetry data for node
   */
  public getData(nodeId: string): TelemetryData[] {
    return this.data.get(nodeId) || [];
  }

  /**
   * Get telemetry data in time range
   */
  public getDataInRange(nodeId: string, start: number, end: number): TelemetryData[] {
    const nodeData = this.data.get(nodeId) || [];
    return nodeData.filter(d => d.timestamp >= start && d.timestamp <= end);
  }

  /**
   * Get latest telemetry data
   */
  public getLatest(nodeId: string): TelemetryData | null {
    const nodeData = this.data.get(nodeId);
    return nodeData && nodeData.length > 0 ? nodeData[nodeData.length - 1] : null;
  }

  /**
   * Get telemetry statistics for node
   */
  public getStatistics(nodeId: string): TelemetryStatistics {
    const nodeData = this.data.get(nodeId) || [];

    if (nodeData.length === 0) {
      return {
        averageCpu: 0,
        averageMemory: 0,
        averageNetwork: 0,
        averageDisk: 0,
        peakCpu: 0,
        peakMemory: 0,
        dataPoints: 0,
      };
    }

    const totalCpu = nodeData.reduce((sum, d) => sum + d.cpu, 0);
    const totalMemory = nodeData.reduce((sum, d) => sum + d.memory, 0);
    const totalNetwork = nodeData.reduce((sum, d) => sum + d.network, 0);
    const totalDisk = nodeData.reduce((sum, d) => sum + d.disk, 0);
    const peakCpu = Math.max(...nodeData.map(d => d.cpu));
    const peakMemory = Math.max(...nodeData.map(d => d.memory));

    return {
      averageCpu: totalCpu / nodeData.length,
      averageMemory: totalMemory / nodeData.length,
      averageNetwork: totalNetwork / nodeData.length,
      averageDisk: totalDisk / nodeData.length,
      peakCpu,
      peakMemory,
      dataPoints: nodeData.length,
    };
  }

  /**
   * Get aggregate statistics across all nodes
   */
  public getAggregateStatistics(): TelemetryStatistics {
    const allData: TelemetryData[] = [];

    for (const nodeData of this.data.values()) {
      allData.push(...nodeData);
    }

    if (allData.length === 0) {
      return {
        averageCpu: 0,
        averageMemory: 0,
        averageNetwork: 0,
        averageDisk: 0,
        peakCpu: 0,
        peakMemory: 0,
        dataPoints: 0,
      };
    }

    const totalCpu = allData.reduce((sum, d) => sum + d.cpu, 0);
    const totalMemory = allData.reduce((sum, d) => sum + d.memory, 0);
    const totalNetwork = allData.reduce((sum, d) => sum + d.network, 0);
    const totalDisk = allData.reduce((sum, d) => sum + d.disk, 0);
    const peakCpu = Math.max(...allData.map(d => d.cpu));
    const peakMemory = Math.max(...allData.map(d => d.memory));

    return {
      averageCpu: totalCpu / allData.length,
      averageMemory: totalMemory / allData.length,
      averageNetwork: totalNetwork / allData.length,
      averageDisk: totalDisk / allData.length,
      peakCpu,
      peakMemory,
      dataPoints: allData.length,
    };
  }

  /**
   * Clear telemetry data for node
   */
  public clearNode(nodeId: string): void {
    this.data.delete(nodeId);
  }

  /**
   * Clear all telemetry data
   */
  public clear(): void {
    this.data.clear();
  }

  /**
   * Set max data points
   */
  public setMaxDataPoints(max: number): void {
    this.maxDataPoints = max;

    // Evict old data if needed
    for (const [nodeId, nodeData] of this.data) {
      while (nodeData.length > this.maxDataPoints) {
        nodeData.shift();
      }
    }
  }

  /**
   * Get max data points
   */
  public getMaxDataPoints(): number {
    return this.maxDataPoints;
  }

  /**
   * Validate telemetry state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [nodeId, nodeData] of this.data) {
      if (!this.clusterManager.getNode(nodeId)) {
        errors.push(`Telemetry data for non-existent node ${nodeId}`);
      }

      for (const data of nodeData) {
        if (data.timestamp < 0) {
          errors.push(`Invalid timestamp in telemetry data for node ${nodeId}`);
        }

        if (data.cpu < 0 || data.cpu > 1) {
          errors.push(`Invalid CPU value in telemetry data for node ${nodeId}`);
        }

        if (data.memory < 0 || data.memory > 1) {
          errors.push(`Invalid memory value in telemetry data for node ${nodeId}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export telemetry data to JSON
   */
  public export(): string {
    const data = Array.from(this.data.entries()).map(([nodeId, nodeData]) => ({
      nodeId,
      data: nodeData.map(d => ({
        ...d,
        customMetrics: Array.from(d.customMetrics.entries()),
      })),
    }));
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import telemetry data from JSON
   */
  public import(json: string): void {
    const data = JSON.parse(json);

    for (const entry of data) {
      const nodeData = entry.data.map((d: unknown) => ({
        ...d,
        customMetrics: new Map(d.customMetrics),
      }));
      this.data.set(entry.nodeId, nodeData);
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
