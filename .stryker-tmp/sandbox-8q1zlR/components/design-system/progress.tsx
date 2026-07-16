// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ProgressVariant = "default" | "success" | "warning" | "error";

interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  animated?: boolean;
}

const variantStyles: Record<ProgressVariant, { bg: string; fill: string }> = {
  default: {
    bg: "bg-gray-200",
    fill: "bg-primary",
  },
  success: {
    bg: "bg-gray-200",
    fill: "bg-success",
  },
  warning: {
    bg: "bg-gray-200",
    fill: "bg-warning",
  },
  error: {
    bg: "bg-gray-200",
    fill: "bg-error",
  },
};

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  className,
  showLabel = false,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const styles = variantStyles[variant];

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Progression</span>
          <span className="font-medium text-text">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full overflow-hidden", sizeStyles[size], styles.bg)}>
        <motion.div
          className={cn("h-full rounded-full", styles.fill)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Circular progress for more visual feedback
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: ProgressVariant;
  className?: string;
  showLabel?: boolean;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  className,
  showLabel = true,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap: Record<ProgressVariant, string> = {
    default: "#1E40AF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  const color = colorMap[variant];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-text">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}

// Stepped progress for multi-step processes
interface Step {
  id: string;
  label: string;
  status?: "pending" | "current" | "completed";
}

interface SteppedProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function SteppedProgress({ steps, currentStep, className }: SteppedProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors",
                    isCompleted && "bg-success text-white",
                    isCurrent && "bg-primary text-white",
                    isPending && "bg-gray-200 text-text-muted"
                  )}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium text-center",
                    isCurrent && "text-primary",
                    isCompleted && "text-success",
                    isPending && "text-text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    isCompleted ? "bg-success" : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Loading bar for page transitions
export function LoadingBar({ isLoading }: { isLoading: boolean }) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isLoading ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
