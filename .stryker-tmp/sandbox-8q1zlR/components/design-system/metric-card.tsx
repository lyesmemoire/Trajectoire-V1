// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";

const metricCardVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "border-gray-200",
        elevated: "border-gray-200 shadow-md",
        outlined: "border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof metricCardVariants> {
  title: string;
  value: number;
  max?: number;
  unit?: string;
  icon?: LucideIcon;
  description?: string;
  color?: "default" | "primary" | "success" | "warning" | "error";
  showProgress?: boolean;
}

export function MetricCard({
  variant = "default",
  title,
  value,
  max = 100,
  unit,
  icon: Icon,
  description,
  color = "primary",
  showProgress = true,
  className,
  ...props
}: MetricCardProps) {
  const percentage = (value / max) * 100;

  const colorStyles = {
    default: "text-gray-900",
    primary: "text-blue-700",
    success: "text-green-600",
    warning: "text-amber-600",
    error: "text-red-600",
  };

  return (
    <Card
      className={cn(metricCardVariants({ variant }), className)}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {Icon && (
          <div className="p-2 rounded-lg bg-gray-100">
            <Icon className={cn("h-4 w-4", colorStyles[color])} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-3xl font-bold", colorStyles[color])}>
            {value}
          </span>
          {unit && (
            <span className="text-sm text-gray-500">{unit}</span>
          )}
        </div>
        {showProgress && (
          <div className="mt-4">
            <Progress value={value} max={max} variant={color === "primary" ? "default" : color as "default" | "success" | "warning" | "error"} />
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export interface MetricCardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  color?: "default" | "primary" | "success" | "warning" | "error";
}

export function MetricCardIcon({ icon: Icon, color = "primary", className, ...props }: MetricCardIconProps) {
  const colorStyles = {
    default: "bg-gray-100 text-gray-600",
    primary: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-amber-50 text-amber-600",
    error: "bg-red-50 text-red-600",
  };

  return (
    <div className={cn("p-2 rounded-lg", colorStyles[color], className)} {...props}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

export interface MetricCardValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  unit?: string;
  color?: "default" | "primary" | "success" | "warning" | "error";
}

export function MetricCardValue({ value, unit, color = "primary", className, ...props }: MetricCardValueProps) {
  const colorStyles = {
    default: "text-gray-900",
    primary: "text-blue-700",
    success: "text-green-600",
    warning: "text-amber-600",
    error: "text-red-600",
  };

  return (
    <div className={cn("flex items-baseline gap-2", className)} {...props}>
      <span className={cn("text-3xl font-bold", colorStyles[color])}>
        {value}
      </span>
      {unit && (
        <span className="text-sm text-gray-500">{unit}</span>
      )}
    </div>
  );
}
