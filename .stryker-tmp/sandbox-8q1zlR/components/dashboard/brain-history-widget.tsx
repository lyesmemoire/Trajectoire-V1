// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Brain, Clock, TrendingUp, AlertTriangle } from "lucide-react";

interface BrainHistoryWidgetProps {
  observations: Array<{
    id: string;
    timestamp: Date;
    source: string;
    type: string;
  }>;
  insights: Array<{
    id: string;
    timestamp: Date;
    type: string;
    description: string;
  }>;
  events: Array<{
    id: string;
    timestamp: Date;
    type: string;
    description: string;
  }>;
}

type CombinedEvent = {
  id: string;
  timestamp: Date;
  category: "observation" | "insight" | "event";
  description: string;
  source?: string;
  type: string;
};

export function BrainHistoryWidget({ observations, insights, events }: BrainHistoryWidgetProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "observation":
        return <Brain className="w-4 h-4" />;
      case "insight":
        return <TrendingUp className="w-4 h-4" />;
      case "contradiction":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "observation":
        return "bg-blue-100 text-blue-600";
      case "insight":
        return "bg-emerald-100 text-emerald-600";
      case "contradiction":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Combine and sort all events by timestamp
  const allEvents: CombinedEvent[] = [
    ...observations.map(o => ({ ...o, category: "observation" as const, description: `Observation: ${o.type}` })),
    ...insights.map(i => ({ ...i, category: "insight" as const })),
    ...events.map(e => ({ ...e, category: "event" as const })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Historique Brain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allEvents.length > 0 ? (
            allEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full ${getEventColor(event.category)} flex items-center justify-center flex-shrink-0`}>
                  {getEventIcon(event.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.source || event.type} • {event.timestamp.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">Aucun événement récent</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
