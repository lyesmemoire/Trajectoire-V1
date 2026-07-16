/**
 * Diagnostic Dashboard
 *
 * Purely presentational dashboard for diagnostic data.
 * No business logic, only displays data collected by Diagnostic Mode.
 */
// @ts-nocheck


"use client";

import { useState, useEffect } from "react";

interface DiagnosticData {
  runtime: {
    currentState: string;
    previousState: string;
    uptime: number;
    transitionCount: number;
  };
  provider: {
    activeProvider: string | null;
    connectionState: string;
    errorCount: number;
  };
  audio: {
    inputBufferSize: number;
    outputBufferSize: number;
    overflowCount: number;
    underflowCount: number;
  };
  streaming: {
    chunksSent: number;
    chunksReceived: number;
    chunksPerSecond: number;
  };
  voiceActivity: {
    vadState: string;
    bargeInState: string;
    interruptionCount: number;
  };
  latency: {
    microphoneToProvider: number;
    providerToFirstToken: number;
    firstTokenToFirstAudio: number;
    totalResponseTime: number;
    averageLatency: number;
  };
}

export default function DiagnosticDashboard() {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching diagnostic data
    // In production, this would connect to the DiagnosticCollector
    const mockData: DiagnosticData = {
      runtime: {
        currentState: "Idle",
        previousState: "Idle",
        uptime: 0,
        transitionCount: 0,
      },
      provider: {
        activeProvider: null,
        connectionState: "disconnected",
        errorCount: 0,
      },
      audio: {
        inputBufferSize: 0,
        outputBufferSize: 0,
        overflowCount: 0,
        underflowCount: 0,
      },
      streaming: {
        chunksSent: 0,
        chunksReceived: 0,
        chunksPerSecond: 0,
      },
      voiceActivity: {
        vadState: "unknown",
        bargeInState: "idle",
        interruptionCount: 0,
      },
      latency: {
        microphoneToProvider: 0,
        providerToFirstToken: 0,
        firstTokenToFirstAudio: 0,
        totalResponseTime: 0,
        averageLatency: 0,
      },
    };

    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading diagnostic data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-red-500">Failed to load diagnostic data</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Runtime Diagnostic Dashboard</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Export Snapshot
        </button>
      </div>

      {/* Runtime Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Runtime Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Current State" value={data.runtime.currentState} />
          <MetricCard label="Previous State" value={data.runtime.previousState} />
          <MetricCard label="Uptime" value={`${Math.floor(data.runtime.uptime / 1000)}s`} />
          <MetricCard label="Transitions" value={data.runtime.transitionCount.toString()} />
        </div>
      </div>

      {/* Provider Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Provider Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Active Provider" value={data.provider.activeProvider || "None"} />
          <MetricCard label="Connection State" value={data.provider.connectionState} />
          <MetricCard label="Error Count" value={data.provider.errorCount.toString()} />
        </div>
      </div>

      {/* Audio Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Audio Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Input Buffer" value={data.audio.inputBufferSize.toString()} />
          <MetricCard label="Output Buffer" value={data.audio.outputBufferSize.toString()} />
          <MetricCard label="Overflow Count" value={data.audio.overflowCount.toString()} />
          <MetricCard label="Underflow Count" value={data.audio.underflowCount.toString()} />
        </div>
      </div>

      {/* Streaming Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Streaming Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Chunks Sent" value={data.streaming.chunksSent.toString()} />
          <MetricCard label="Chunks Received" value={data.streaming.chunksReceived.toString()} />
          <MetricCard label="Chunks/sec" value={data.streaming.chunksPerSecond.toFixed(2)} />
        </div>
      </div>

      {/* Voice Activity Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Voice Activity Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="VAD State" value={data.voiceActivity.vadState} />
          <MetricCard label="Barge-In State" value={data.voiceActivity.bargeInState} />
          <MetricCard label="Interruptions" value={data.voiceActivity.interruptionCount.toString()} />
        </div>
      </div>

      {/* Latency Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Latency Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Mic → Provider" value={`${data.latency.microphoneToProvider}ms`} />
          <MetricCard label="Provider → Token" value={`${data.latency.providerToFirstToken}ms`} />
          <MetricCard label="Token → Audio" value={`${data.latency.firstTokenToFirstAudio}ms`} />
          <MetricCard label="Total Response" value={`${data.latency.totalResponseTime}ms`} />
          <MetricCard label="Average Latency" value={`${data.latency.averageLatency.toFixed(2)}ms`} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
