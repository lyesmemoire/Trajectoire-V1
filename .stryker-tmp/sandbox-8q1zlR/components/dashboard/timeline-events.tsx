// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, CheckCircle, XCircle, ChevronRight, Activity } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: string;
  timestamp: string;
  stage: string;
  data: Record<string, unknown>;
}

interface TimelineEventsProps {
  events: TimelineEvent[];
  currentStage: string;
}

export function TimelineEvents({ events, currentStage }: TimelineEventsProps) {
  const getEventIcon = (eventType: string) => {
    if (eventType.includes("Error") || eventType.includes("Cancelled")) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    if (eventType.includes("Completed") || eventType.includes("Generated")) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (eventType.includes("Started")) {
      return <Activity className="w-4 h-4 text-blue-600" />;
    }
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes("Error") || eventType.includes("Cancelled")) {
      return "border-red-200 bg-red-50";
    }
    if (eventType.includes("Completed") || eventType.includes("Generated")) {
      return "border-green-200 bg-green-50";
    }
    if (eventType.includes("Started")) {
      return "border-blue-200 bg-blue-50";
    }
    return "border-gray-200 bg-gray-50";
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Timeline Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              No events yet
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              {/* Events */}
              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="relative pl-10"
                  >
                    {/* Event Dot */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                      {getEventIcon(event.type)}
                    </div>
                    
                    {/* Event Card */}
                    <div className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-900">{event.type}</span>
                        <span className="text-xs text-gray-600">{event.timestamp}</span>
                      </div>
                      <div className="text-xs text-gray-700">Stage: {event.stage}</div>
                      {Object.keys(event.data).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          {Object.entries(event.data).map(([key, value]) => (
                            <div key={key} className="text-xs text-gray-600">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Current Stage Indicator */}
          {currentStage !== "Idle" && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Current Stage</span>
              </div>
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-900">{currentStage}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
