// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { CheckCircle2, Circle } from "lucide-react";

interface ProgressStep {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressWidgetProps {
  steps: ProgressStep[];
}

export function ProgressWidget({ steps }: ProgressWidgetProps) {
  const progress = steps.filter((s) => s.completed).length;
  const total = steps.length;
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Progression</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm font-medium text-gray-900">
              Étape {progress + 1} sur {total}
            </span>
            <span className="text-sm text-gray-600">{percentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gray-900 rounded-full"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                {step.completed ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                ) : step.current ? (
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Circle className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
              <span
                className={`text-sm ${
                  step.completed
                    ? "text-gray-400 line-through"
                    : step.current
                    ? "text-gray-900 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
