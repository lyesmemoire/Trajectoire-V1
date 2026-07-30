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
  color?: "bronze" | "forest" | "terracotta" | "brick" | "ink"
  className?: string
}

export function Progress({
  value, max = 100, label, showValue = true, size = "md", color = "bronze", className }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const colors = {
    bronze: "bg-gradient-to-r from-forest-500 to-forest-600",
    forest: "bg-gradient-to-r from-forest-500 to-forest-600",
    terracotta: "bg-gradient-to-r from-terracotta-500 to-terracotta-600",
    brick: "bg-gradient-to-r from-brick-500 to-brick-600",
    ink: "bg-gradient-to-r from-ink-500 to-ink-600",
  }

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-semibold text-ink-700">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-bold text-ink-900">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-ivoire-200 rounded-full overflow-hidden",
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
  color?: "bronze" | "forest" | "terracotta" | "brick" | "ink"
  className?: string
}

export function CircularProgress({
  value, max = 100, size = 120, strokeWidth = 8, label, color = "bronze", className }: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const colors = {
    bronze: "#A67C3D",
    forest: "#2F6844",
    terracotta: "#C25E00",
    brick: "#8B3A3A",
    ink: "#1C1917",
  }

  return (
    <div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E7E2DB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-ink-900">
          {Math.round(percentage)}%
        </span>
        {label && (
          <span className="text-xs text-ink-500 font-semibold">{label}</span>
        )}
      </div>
    </div>
  )
}
