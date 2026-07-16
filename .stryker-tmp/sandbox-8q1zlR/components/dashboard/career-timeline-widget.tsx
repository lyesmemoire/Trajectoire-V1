// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { FileText, MessageSquare, Target, TrendingUp, TrendingDown, CheckCircle, XCircle, Brain, Calendar } from "lucide-react";

interface CareerTimelineItem {
  id: string;
  date: Date;
  type: "cv_analyzed" | "interview" | "ats_analysis" | "progression" | "goal_achieved" | "goal_failed" | "improvement" | "regression" | "ai_event";
  title: string;
  description: string;
  details?: string;
  impact?: "positive" | "negative" | "neutral";
}

interface CareerTimelineWidgetProps {
  items: CareerTimelineItem[];
}

export function CareerTimelineWidget({ items }: CareerTimelineWidgetProps) {
  const getEventIcon = (type: CareerTimelineItem["type"]) => {
    switch (type) {
      case "cv_analyzed":
        return <FileText className="w-4 h-4" />;
      case "interview":
        return <MessageSquare className="w-4 h-4" />;
      case "ats_analysis":
        return <Target className="w-4 h-4" />;
      case "progression":
        return <TrendingUp className="w-4 h-4" />;
      case "goal_achieved":
        return <CheckCircle className="w-4 h-4" />;
      case "goal_failed":
        return <XCircle className="w-4 h-4" />;
      case "improvement":
        return <TrendingUp className="w-4 h-4" />;
      case "regression":
        return <TrendingDown className="w-4 h-4" />;
      case "ai_event":
        return <Brain className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: CareerTimelineItem["type"], _impact?: CareerTimelineItem["impact"]) => {
    switch (type) {
      case "cv_analyzed":
        return "bg-blue-100 text-blue-600";
      case "interview":
        return "bg-purple-100 text-purple-600";
      case "ats_analysis":
        return "bg-amber-100 text-amber-600";
      case "progression":
        return "bg-emerald-100 text-emerald-600";
      case "goal_achieved":
        return "bg-emerald-100 text-emerald-600";
      case "goal_failed":
        return "bg-red-100 text-red-600";
      case "improvement":
        return "bg-emerald-100 text-emerald-600";
      case "regression":
        return "bg-red-100 text-red-600";
      case "ai_event":
        return "bg-indigo-100 text-indigo-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getImpactColor = (impact?: CareerTimelineItem["impact"]) => {
    switch (impact) {
      case "positive":
        return "text-emerald-600";
      case "negative":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  // Sort items by date descending
  const sortedItems = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Timeline de Carrière</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedItems.length > 0 ? (
            sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${getEventColor(item.type, item.impact)} flex items-center justify-center`}>
                    {getEventIcon(item.type)}
                  </div>
                  {index < sortedItems.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                    <span className="text-xs text-gray-400">{item.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {item.details && (
                    <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                  )}
                  {item.impact && (
                    <span className={`text-xs font-medium ${getImpactColor(item.impact)} mt-2 inline-block`}>
                      {item.impact === "positive" ? "Impact positif" : item.impact === "negative" ? "Impact négatif" : "Impact neutre"}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">Aucun événement de carrière enregistré</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
