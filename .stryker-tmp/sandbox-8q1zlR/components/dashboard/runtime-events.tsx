// @ts-nocheck
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Zap, CheckCircle, XCircle, AlertTriangle, Trash2, Filter } from "lucide-react";

interface RuntimeEventsProps {
  eventsData: {
    eventHistory: Array<{
      event: string;
      timestamp: number;
      metadata?: Record<string, unknown>;
    }>;
  };
  onClearHistory: () => void;
  onFilterByType: (eventType: string) => void;
}

export function RuntimeEvents({
  eventsData,
  onClearHistory,
  onFilterByType
}: RuntimeEventsProps) {
  const getEventColor = (event: string) => {
    if (event.includes("Error") || event.includes("Failed")) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (event.includes("Opening") || event.includes("Failing")) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    if (event.includes("Closed") || event.includes("Started") || event.includes("Initialized")) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getEventIcon = (event: string) => {
    if (event.includes("Error") || event.includes("Failed")) {
      return <XCircle className="w-3 h-3 text-red-600" />;
    }
    if (event.includes("Opening") || event.includes("Failing")) {
      return <AlertTriangle className="w-3 h-3 text-yellow-600" />;
    }
    if (event.includes("Closed") || event.includes("Started") || event.includes("Initialized")) {
      return <CheckCircle className="w-3 h-3 text-green-600" />;
    }
    return <Zap className="w-3 h-3 text-gray-600" />;
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Runtime Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">Event Stream</div>
                <div className="text-xs text-gray-600">Runtime events</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">{eventsData.eventHistory.length} events</div>
          </div>

          <div className="space-y-2 pt-3 border-t border-gray-200">
            {eventsData.eventHistory.length === 0 ? (
              <div className="text-sm text-gray-600 text-center py-4">No events recorded</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {eventsData.eventHistory.slice(-20).reverse().map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border border-gray-200">
                    <div className="flex items-center gap-2">
                      {getEventIcon(record.event)}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(record.event)}`}>
                        {record.event}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">{new Date(record.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => onFilterByType("RuntimeError")}
                className="flex-1 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                <Filter className="w-3 h-3 inline mr-1" />
                Errors
              </button>
              <button
                onClick={() => onFilterByType("RuntimeSwitching")}
                className="flex-1 py-2 text-xs font-medium text-white bg-yellow-600 rounded hover:bg-yellow-700 transition-colors"
              >
                <Filter className="w-3 h-3 inline mr-1" />
                Switching
              </button>
              <button
                onClick={onClearHistory}
                className="flex-1 py-2 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors"
              >
                <Trash2 className="w-3 h-3 inline mr-1" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
