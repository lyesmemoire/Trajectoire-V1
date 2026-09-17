"use client"

import { cn } from "@/lib/utils"

// ============================================
// PROGRESS BAR
// ============================================

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: "sm" | "md" | "lg"
  color?: "primary" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  color = "primary",
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizes = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2.5",
  }

  const colors = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
  }

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground-muted">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-surface-muted rounded-full overflow-hidden",
          sizes[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colors[color],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// ============================================
// CIRCULAR PROGRESS
// ============================================

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  color?: "primary" | "success" | "warning" | "danger"
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  color = "primary",
  className,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const strokeColors = {
    primary: "#7C3AED",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  }

  return (
    <div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--surface-muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-xs font-medium text-foreground-muted">{label}</span>
        )}
      </div>
    </div>
  )
}
