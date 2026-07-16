/**
 * Runtime Inspector Dashboard
 *
 * Purely presentational dashboard for Runtime Inspector.
 * No business logic, only displays inspector data.
 */
// @ts-nocheck


"use client";

import { useState, useEffect } from "react";

interface InspectorData {
  runtime: {
    state: string;
    uptime: number;
    transitionCount: number;
    lifecycle: string;
  };
  provider: {
    activeProvider: string | null;
    health: string;
    connectionState: string;
  };
  audio: {
    microphone: boolean;
    speaker: boolean;
    vad: string;
    streaming: boolean;
  };
  session: {
    active: boolean;
    sessionId: string | null;
    duration: number;
    messageCount: number;
  };
  pipeline: {
    currentStage: string | null;
    overallProgress: number;
    stages: Array<{ name: string; status: string }>;
  };
  diagnostics: {
    health: string;
    performance: Record<string, number>;
    timeline: string;
  };
}

export default function RuntimeInspectorDashboard() {
  const [data, setData] = useState<InspectorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching inspector data
    // In production, this would connect to the InspectorSnapshotBuilder
    const mockData: InspectorData = {
      runtime: {
        state: "Idle",
        uptime: 0,
        transitionCount: 0,
        lifecycle: "idle",
      },
      provider: {
        activeProvider: null,
        health: "healthy",
        connectionState: "disconnected",
      },
      audio: {
        microphone: false,
        speaker: false,
        vad: "unknown",
        streaming: false,
      },
      session: {
        active: false,
        sessionId: null,
        duration: 0,
        messageCount: 0,
      },
      pipeline: {
        currentStage: null,
        overallProgress: 0,
        stages: [
          { name: "Candidate", status: "pending" },
          { name: "Job Offer", status: "pending" },
          { name: "Matching", status: "pending" },
          { name: "Transferable Skills", status: "pending" },
          { name: "Gap", status: "pending" },
          { name: "Interview Preparation", status: "pending" },
          { name: "Voice Interview", status: "pending" },
          { name: "Runtime", status: "pending" },
          { name: "Provider", status: "pending" },
          { name: "Audio", status: "pending" },
          { name: "Live Analysis", status: "pending" },
          { name: "Coaching", status: "pending" },
          { name: "Final Report", status: "pending" },
        ],
      },
      diagnostics: {
        health: "healthy",
        performance: {},
        timeline: "",
      },
    };

    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading inspector data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-red-500">Failed to load inspector data</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Runtime Inspector</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Export JSON
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Export HTML
          </button>
          <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Export Markdown
          </button>
        </div>
      </div>

      {/* Runtime Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Runtime</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="State" value={data.runtime.state} />
          <MetricCard label="Uptime" value={`${Math.floor(data.runtime.uptime / 1000)}s`} />
          <MetricCard label="Transitions" value={data.runtime.transitionCount.toString()} />
          <MetricCard label="Lifecycle" value={data.runtime.lifecycle} />
        </div>
      </div>

      {/* Provider Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Provider</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Active" value={data.provider.activeProvider || "None"} />
          <MetricCard label="Health" value={data.provider.health} status={data.provider.health} />
          <MetricCard label="Connection" value={data.provider.connectionState} />
        </div>
      </div>

      {/* Audio Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Audio</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Microphone" value={data.audio.microphone ? "Active" : "Inactive"} />
          <MetricCard label="Speaker" value={data.audio.speaker ? "Active" : "Inactive"} />
          <MetricCard label="VAD" value={data.audio.vad} />
          <MetricCard label="Streaming" value={data.audio.streaming ? "Active" : "Inactive"} />
        </div>
      </div>

      {/* Session Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Session</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Active" value={data.session.active ? "Yes" : "No"} />
          <MetricCard label="Session ID" value={data.session.sessionId || "None"} />
          <MetricCard label="Duration" value={`${Math.floor(data.session.duration / 1000)}s`} />
          <MetricCard label="Messages" value={data.session.messageCount.toString()} />
        </div>
      </div>

      {/* Pipeline Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pipeline</h2>
        <div className="mb-4">
          <MetricCard label="Progress" value={`${data.pipeline.overallProgress.toFixed(0)}%`} />
        </div>
        <div className="space-y-2">
          {data.pipeline.stages.map((stage) => (
            <div key={stage.name} className="flex items-center space-x-2">
              <span className="text-lg">{getStageIcon(stage.status)}</span>
              <span>{stage.name}</span>
              <span className="text-sm text-gray-500">({stage.status})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Diagnostics</h2>
        <div className="mb-4">
          <MetricCard label="Health" value={data.diagnostics.health} status={data.diagnostics.health} />
        </div>
        <h3 className="font-semibold mb-2">Timeline</h3>
        <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-64">
          {data.diagnostics.timeline || "No timeline data available"}
        </pre>
      </div>
    </div>
  );
}

function MetricCard({ label, value, status }: { label: string; value: string; status?: string }) {
  const statusColor = status === "healthy" ? "text-green-600" : status === "warning" || status === "degraded" ? "text-orange-600" : status === "critical" || status === "unhealthy" ? "text-red-600" : "text-gray-900";

  return (
    <div className="bg-gray-50 rounded p-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-lg font-semibold ${status ? statusColor : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

function getStageIcon(status: string): string {
  switch (status) {
    case "pending":
      return "○";
    case "running":
      return "◉";
    case "completed":
      return "✓";
    case "failed":
      return "✗";
    case "skipped":
      return "⊘";
    default:
      return "○";
  }
}
