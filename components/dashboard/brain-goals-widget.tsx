"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, TrendingUp, CheckCircle, Clock } from "lucide-react";

interface BrainGoalsWidgetProps {
  goals: Array<{
    id: string;
    description: string;
    target: string;
    current: number;
    targetValue: number;
    unit: string;
    status: "pending" | "in_progress" | "achieved" | "abandoned";
    deadline?: Date;
  }>;
}

export function BrainGoalsWidget({ goals }: BrainGoalsWidgetProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "in_progress":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-emerald-100 text-emerald-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const activeGoals = goals.filter(g => g.status !== "abandoned").slice(0, 5);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Objectifs Brain</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeGoals.length > 0 ? (
            activeGoals.map((goal, index) => (
              <m.div
                key={goal.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(goal.status)}
                    <p className="text-sm font-medium text-gray-900">{goal.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-600">Progression</span>
                      <span className="text-xs font-medium text-gray-900">
                        {goal.current} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <m.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((goal.current / goal.targetValue) * 100, 100)}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
                {goal.deadline && (
                  <p className="text-xs text-gray-500 mt-2">
                    Deadline: {goal.deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                )}
              </m.div>
            ))
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">Aucun objectif actif</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
