/**
 * Monitoring Dashboard
 * Displays runtime and graph metrics for the application
 */

'use client';

import { useEffect, useState } from 'react';

interface RuntimeMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  uptime: number;
  errors: {
    total: number;
    byType: Record<string, number>;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
}

interface OperationMetrics {
  matching: {
    time: number;
    count: number;
    errors: number;
  };
  search: {
    time: number;
    count: number;
    errors: number;
  };
  graph: {
    time: number;
    count: number;
    errors: number;
  };
  reasoning: {
    time: number;
    count: number;
    errors: number;
  };
}

interface GraphMetrics {
  nodes: {
    total: number;
    byType: Record<string, number>;
  };
  edges: {
    total: number;
    byType: Record<string, number>;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  graphs: {
    total: number;
    active: number;
  };
}

interface AllMetrics {
  runtime: RuntimeMetrics;
  operations: OperationMetrics;
  graph: GraphMetrics;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<AllMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/monitoring/all');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-calm-warn">Error: {error}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">No metrics available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-calm-surface text-calm-ink p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Monitoring Dashboard</h1>

        {/* CPU & Memory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-calm-accent-wash rounded-lg p-6">
            <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">CPU</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Usage</span>
                  <span>{(metrics.runtime.cpu.usage * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-calm-accent-soft rounded-full h-2">
                  <div
                    className="bg-calm-accent h-2 rounded-full"
                    style={{ width: `${metrics.runtime.cpu.usage * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <span className="block mb-2">Load Average</span>
                <div className="flex gap-4">
                  {metrics.runtime.cpu.loadAverage.map((load, i) => (
                    <div key={i} className="bg-calm-accent-soft px-3 py-1 rounded">
                      {load.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-calm-accent-wash rounded-lg p-6">
            <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Memory</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Usage</span>
                  <span>{(metrics.runtime.memory.usage * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-calm-accent-soft rounded-full h-2">
                  <div
                    className="bg-calm-accent h-2 rounded-full"
                    style={{ width: `${metrics.runtime.memory.usage * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-calm-secondary">Total</span>
                  <span className="text-lg">{formatBytes(metrics.runtime.memory.total)}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Used</span>
                  <span className="text-lg">{formatBytes(metrics.runtime.memory.used)}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Free</span>
                  <span className="text-lg">{formatBytes(metrics.runtime.memory.free)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div className="bg-calm-accent-wash rounded-lg p-6 mb-8">
          <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(metrics.operations).map(([key, value]) => (
              <div key={key} className="bg-calm-accent-soft rounded-lg p-4">
                <h3 className="text-lg font-semibold capitalize mb-2">{key}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-calm-secondary">Time</span>
                    <span>{value.time.toFixed(2)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-calm-secondary">Count</span>
                    <span>{value.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-calm-secondary">Errors</span>
                    <span className="text-calm-warn">{value.errors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latency */}
        <div className="bg-calm-accent-wash rounded-lg p-6 mb-8">
          <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Latency</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">P50</span>
              <span className="text-2xl">{metrics.runtime.latency.p50.toFixed(2)}ms</span>
            </div>
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">P95</span>
              <span className="text-2xl">{metrics.runtime.latency.p95.toFixed(2)}ms</span>
            </div>
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">P99</span>
              <span className="text-2xl">{metrics.runtime.latency.p99.toFixed(2)}ms</span>
            </div>
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">Average</span>
              <span className="text-2xl">{metrics.runtime.latency.avg.toFixed(2)}ms</span>
            </div>
          </div>
        </div>

        {/* Graph Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-calm-accent-wash rounded-lg p-6">
            <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Graph</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-calm-secondary">Nodes</span>
                  <span className="text-2xl">{metrics.graph.nodes.total}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Edges</span>
                  <span className="text-2xl">{metrics.graph.edges.total}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Total Graphs</span>
                  <span className="text-2xl">{metrics.graph.graphs.total}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Active Graphs</span>
                  <span className="text-2xl">{metrics.graph.graphs.active}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-calm-accent-wash rounded-lg p-6">
            <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Cache</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="block text-calm-secondary">Hits</span>
                  <span className="text-2xl text-calm-accent">{metrics.graph.cache.hits}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Misses</span>
                  <span className="text-2xl text-calm-warn">{metrics.graph.cache.misses}</span>
                </div>
                <div>
                  <span className="block text-calm-secondary">Hit Rate</span>
                  <span className="text-2xl">{(metrics.graph.cache.hitRate * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Hit Rate</span>
                  <span>{(metrics.graph.cache.hitRate * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-calm-accent-soft rounded-full h-2">
                  <div
                    className="bg-calm-accent h-2 rounded-full"
                    style={{ width: `${metrics.graph.cache.hitRate * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="bg-calm-accent-wash rounded-lg p-6 mb-8">
          <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Errors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">Total Errors</span>
              <span className="text-2xl text-calm-warn">{metrics.runtime.errors.total}</span>
            </div>
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">By Type</span>
              <div className="mt-2 space-y-1">
                {Object.entries(metrics.runtime.errors.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}</span>
                    <span className="text-calm-warn">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-calm-accent-wash rounded-lg p-6">
          <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-calm-accent-soft rounded-lg p-4">
              <span className="block text-calm-secondary">Uptime</span>
              <span className="text-2xl">{formatTime(metrics.runtime.uptime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
