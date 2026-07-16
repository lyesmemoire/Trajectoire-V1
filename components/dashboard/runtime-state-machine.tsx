"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { GitBranch, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface RuntimeStateMachineProps {
  stateMachineData: {
    currentState: string;
    stateHistory: Array<{
      from: string;
      to: string;
      event: string;
      timestamp: number;
    }>;
  };
  onReset: () => void;
}

export function RuntimeStateMachine({
  stateMachineData,
  onReset
}: RuntimeStateMachineProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case "Running":
        return "bg-green-100 text-green-700 border-green-200";
      case "Initializing":
      case "Switching":
      case "FailingOver":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CircuitBreakerOpen":
        return "bg-red-100 text-red-700 border-red-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "Running":
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case "Initializing":
      case "Switching":
      case "FailingOver":
        return <AlertTriangle className="w-3 h-3 text-yellow-600" />;
      case "CircuitBreakerOpen":
        return <XCircle className="w-3 h-3 text-red-600" />;
      case "Error":
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <GitBranch className="w-3 h-3 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Runtime State Machine</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Current State</div>
                <div className="text-xs text-gray-600">State transitions</div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(stateMachineData.currentState)}`}>
              {stateMachineData.currentState}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-900">State History</div>
            {stateMachineData.stateHistory.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No state transitions</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stateMachineData.stateHistory.slice(-10).reverse().map((transition, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border border-gray-200">
                    <div className="flex items-center gap-2">
                      {getStateIcon(transition.from)}
                      <div className="text-xs text-gray-600">{transition.from}</div>
                      <div className="text-xs text-gray-400">→</div>
                      {getStateIcon(transition.to)}
                      <div className="text-xs text-gray-900 font-medium">{transition.to}</div>
                    </div>
                    <div className="text-xs text-gray-600">{new Date(transition.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <button
              onClick={onReset}
              className="w-full py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3 inline mr-1" />
              Reset State Machine
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
