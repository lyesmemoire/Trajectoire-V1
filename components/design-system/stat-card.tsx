"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period?: string;
  };
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-surface border-gray-200",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    error: "bg-error/5 border-error/20",
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (change.value > 0) return <TrendingUp className="h-4 w-4" />;
    if (change.value < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!change) return "text-text-secondary";
    if (change.value > 0) return "text-success";
    if (change.value < 0) return "text-error";
    return "text-text-muted";
  };

  return (
    <Card variant="elevated" className={cn(variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
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

        {change && (
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center gap-1", getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {Math.abs(change.value)}%
              </span>
            </div>
            <span className="text-sm text-text-muted">
              {change.period || "vs last month"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
