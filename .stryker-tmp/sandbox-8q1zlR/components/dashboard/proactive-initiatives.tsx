// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertCircle, TrendingUp, Clock, Target, Zap, Lightbulb } from "lucide-react";

export interface Initiative {
  type: "celebrate" | "warn" | "remind" | "encourage" | "challenge" | "advise";
  priority: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  justification: string;
  dataUsed: string[];
  proposedAction: string;
}

interface ProactiveInitiativesProps {
  initiatives: Initiative[];
}

const typeIcons = {
  celebrate: TrendingUp,
  warn: AlertCircle,
  remind: Clock,
  encourage: Target,
  challenge: Zap,
  advise: Lightbulb,
};

const typeColors = {
  celebrate: "bg-green-100 text-green-700 border-green-200",
  warn: "bg-red-100 text-red-700 border-red-200",
  remind: "bg-amber-100 text-amber-700 border-amber-200",
  encourage: "bg-blue-100 text-blue-700 border-blue-200",
  challenge: "bg-purple-100 text-purple-700 border-purple-200",
  advise: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

const priorityColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-gray-500",
};

export function ProactiveInitiatives({ initiatives }: ProactiveInitiativesProps) {
  if (!initiatives || initiatives.length === 0) {
    return null;
  }

  const sortedInitiatives = initiatives
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 3);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader className="border-b border-gray-200/60">
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Initiatives du Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {sortedInitiatives.map((initiative, index) => {
          const Icon = typeIcons[initiative.type];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${typeColors[initiative.type]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{initiative.title}</h3>
                    <span
                      className={`w-2 h-2 rounded-full ${priorityColors[initiative.priority]}`}
                      title={`Priorité: ${initiative.priority}`}
                    />
                  </div>
                  <p className="text-sm mb-2">{initiative.message}</p>
                  {initiative.justification && (
                    <p className="text-xs opacity-75 mb-2">{initiative.justification}</p>
                  )}
                  {initiative.proposedAction && (
                    <p className="text-xs font-medium mt-2 pt-2 border-t border-current opacity-75">
                      Action proposée: {initiative.proposedAction}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
