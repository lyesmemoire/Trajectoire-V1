"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Target, Plus, ChevronRight } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  priority: "high" | "medium" | "low";
}

interface GoalsWidgetProps {
  goals: Goal[];
}

export function GoalsWidget({ goals }: GoalsWidgetProps) {
  const getPriorityColor = (priority: Goal["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      case "low":
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900">Objectifs</CardTitle>
          <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors duration-200">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <m.div
              key={goal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                </div>
                <span className="text-xs text-gray-400">{goal.deadline}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <m.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gray-900 rounded-full"
                  />
                </div>
                <span className="text-xs font-medium text-gray-900">{goal.progress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(goal.priority)}`}
                >
                  {goal.priority === "high" ? "Prioritaire" : "Normal"}
                </span>
                <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-1">
                  Voir détails
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </m.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
