// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Clock, CheckCircle, XCircle, Zap, Server, Heart, Activity } from "lucide-react";

interface ProviderTimelineEvent {
  id: string;
  type: string;
  timestamp: number;
  providerId: string;
  data: Record<string, unknown>;
}

interface ProviderTimelineProps {
  events: ProviderTimelineEvent[];
}

export function ProviderTimeline({ events }: ProviderTimelineProps) {
  const getEventIcon = (eventType: string) => {
    if (eventType.includes("Registered")) {
      return <Server className="w-4 h-4 text-green-600" />;
    }
    if (eventType.includes("Selected")) {
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
    if (eventType.includes("Failed")) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    if (eventType.includes("Switched")) {
      return <Activity className="w-4 h-4 text-purple-600" />;
    }
    if (eventType.includes("Recovery")) {
      return <Heart className="w-4 h-4 text-green-600" />;
    }
    if (eventType.includes("Health")) {
      return <Activity className="w-4 h-4 text-yellow-600" />;
    }
    if (eventType.includes("Latency")) {
      return <Zap className="w-4 h-4 text-orange-600" />;
    }
    if (eventType.includes("Timeout")) {
      return <Clock className="w-4 h-4 text-red-600" />;
    }
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes("Registered") || eventType.includes("Recovery")) {
      return "border-green-200 bg-green-50";
    }
    if (eventType.includes("Selected")) {
      return "border-blue-200 bg-blue-50";
    }
    if (eventType.includes("Failed") || eventType.includes("Timeout")) {
      return "border-red-200 bg-red-50";
    }
    if (eventType.includes("Switched")) {
      return "border-purple-200 bg-purple-50";
    }
    if (eventType.includes("Health")) {
      return "border-yellow-200 bg-yellow-50";
    }
    if (eventType.includes("Latency")) {
      return "border-orange-200 bg-orange-50";
    }
    return "border-gray-200 bg-gray-50";
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Provider Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              No events yet
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-4">
                {events.slice(-10).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="relative pl-10"
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                      {getEventIcon(event.type)}
                    </div>
                    
                    <div className={`p-3 rounded-lg border ${getEventColor(event.type)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-900">{event.type}</span>
                        <span className="text-xs text-gray-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-xs text-gray-700">Provider: {event.providerId}</div>
                      {Object.keys(event.data).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          {Object.entries(event.data).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="text-xs text-gray-600 truncate">
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
        </div>
      </CardContent>
    </Card>
  );
}
