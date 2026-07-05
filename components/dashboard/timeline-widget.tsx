"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Calendar, Clock, CheckCircle } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  time: string;
  status: "completed" | "upcoming" | "pending";
  type: "session" | "deadline" | "milestone";
}

interface TimelineWidgetProps {
  items: TimelineItem[];
}

export function TimelineWidget({ items }: TimelineWidgetProps) {
  const getStatusColor = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "upcoming":
        return "bg-blue-100 text-blue-600";
      case "pending":
        return "bg-gray-100 text-gray-400";
    }
  };

  const getTypeIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "session":
        return <Clock className="w-4 h-4" />;
      case "deadline":
        return <Calendar className="w-4 h-4" />;
      case "milestone":
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${getStatusColor(item.status)} flex items-center justify-center`}>
                  {getTypeIcon(item.type)}
                </div>
                {index < items.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 my-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <p className="text-sm text-gray-600">{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
