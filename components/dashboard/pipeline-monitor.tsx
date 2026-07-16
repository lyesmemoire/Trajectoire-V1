"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight, ChevronRight, Activity } from "lucide-react";

interface PipelineMonitorProps {
  pipelineState: {
    currentStage: string;
    previousStage: string;
    startedAt: string;
    completedAt: string | null;
    error: string | null;
    cancelled: boolean;
  };
  executionOrder: Array<{
    id: string;
    name: string;
    order: number;
    dependencies: string[];
    engine: string;
    inputContext: string[];
    outputContext: string;
    required: boolean;
  }>;
  events: Array<{
    id: string;
    type: string;
    timestamp: string;
    stage: string;
    data: Record<string, unknown>;
  }>;
  onStartPipeline: () => void;
  onCancelPipeline: () => void;
  onResetPipeline: () => void;
}

export function PipelineMonitor({
  pipelineState,
  executionOrder,
  events,
  onStartPipeline,
  onCancelPipeline,
  onResetPipeline
}: PipelineMonitorProps) {
  const getStageStatus = (stageName: string): "pending" | "in-progress" | "completed" | "error" => {
    if (pipelineState.error && pipelineState.currentStage === stageName) return "error";
    if (pipelineState.cancelled) return "pending";
    if (pipelineState.currentStage === stageName) return "in-progress";
    const stageIndex = executionOrder.findIndex(step => step.name === stageName);
    const currentIndex = executionOrder.findIndex(step => step.name === pipelineState.currentStage);
    if (stageIndex < currentIndex) return "completed";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const isPipelineActive = pipelineState.currentStage !== "Idle" && !pipelineState.error && !pipelineState.cancelled;

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">Pipeline Monitor</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={onStartPipeline}
              disabled={isPipelineActive}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Start</span>
            </button>
            <button
              onClick={onCancelPipeline}
              disabled={!isPipelineActive}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="w-4 h-4" />
              <span className="text-sm font-medium">Cancel</span>
            </button>
            <button
              onClick={onResetPipeline}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm font-medium">Reset</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pipeline Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Status</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pipelineState.error ? "error" : pipelineState.cancelled ? "pending" : isPipelineActive ? "in-progress" : "completed")}`}>
              {pipelineState.error ? "Error" : pipelineState.cancelled ? "Cancelled" : isPipelineActive ? "Active" : "Idle"}
            </div>
          </div>

          {/* Current Stage */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Current Stage</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-900">{pipelineState.currentStage}</div>
              <div className="text-xs text-purple-700 mt-1">Previous: {pipelineState.previousStage}</div>
            </div>
          </div>

          {/* Error Display */}
          {pipelineState.error && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Error</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm text-red-900">{pipelineState.error}</div>
              </div>
            </div>
          )}

          {/* Execution Order */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Execution Order</span>
            </div>
            <div className="space-y-2">
              {executionOrder.map((step, index) => {
                const status = getStageStatus(step.name);
                return (
                  <m.div
                    key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor(status)}`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/50">
                      {getStatusIcon(status)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{step.name}</div>
                      <div className="text-xs opacity-75">{step.engine}</div>
                    </div>
                    <div className="text-xs font-medium opacity-75">{step.order}</div>
                  </m.div>
                );
              })}
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Recent Events</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {events.slice(-5).reverse().map((event, index) => (
                <div key={event.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-900">{event.type}</span>
                    <span className="text-xs text-blue-700">{event.timestamp}</span>
                  </div>
                  <div className="text-xs text-blue-700">Stage: {event.stage}</div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No events yet
                </div>
              )}
            </div>
          </div>

          {/* Pipeline Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900">Pipeline Info</span>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-indigo-700">Started At</div>
                  <div className="text-sm font-medium text-indigo-900">{pipelineState.startedAt}</div>
                </div>
                <div>
                  <div className="text-xs text-indigo-700">Completed At</div>
                  <div className="text-sm font-medium text-indigo-900">{pipelineState.completedAt || "Not completed"}</div>
                </div>
                <div>
                  <div className="text-xs text-indigo-700">Total Steps</div>
                  <div className="text-sm font-medium text-indigo-900">{executionOrder.length}</div>
                </div>
                <div>
                  <div className="text-xs text-indigo-700">Total Events</div>
                  <div className="text-sm font-medium text-indigo-900">{events.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
