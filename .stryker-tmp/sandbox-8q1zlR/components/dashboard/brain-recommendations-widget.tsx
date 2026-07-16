// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Lightbulb, TrendingUp, BookOpen, Briefcase, MessageSquare } from "lucide-react";

interface BrainRecommendationsWidgetProps {
  recommendations: Array<{
    id: string;
    type: "job" | "skill" | "interview" | "learning";
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    confidence: number;
  }>;
}

export function BrainRecommendationsWidget({ recommendations }: BrainRecommendationsWidgetProps) {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="w-4 h-4" />;
      case "skill":
        return <TrendingUp className="w-4 h-4" />;
      case "interview":
        return <MessageSquare className="w-4 h-4" />;
      case "learning":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const priorityRecommendations = recommendations.slice(0, 5);

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Recommandations IA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {priorityRecommendations.length > 0 ? (
            priorityRecommendations.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)} flex-shrink-0`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Confiance: {Math.round(rec.confidence * 100)}%</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">Aucune recommandation disponible</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
