"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export function DashboardCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
}: DashboardCardProps) {
  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-text-secondary",
  };

  return (
    <Card variant="elevated" className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <h3 className="text-3xl font-semibold text-text mt-2">{value}</h3>
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {change && (
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", trendColors[change.trend])}>
              {change.trend === "up" && "+"}
              {change.value}
            </span>
            <span className="text-sm text-text-muted">vs last month</span>
          </div>
        )}
        {description && (
          <p className="text-sm text-text-secondary mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
