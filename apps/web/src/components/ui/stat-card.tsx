import { cn } from "@/lib/utils"

interface StatCardProps {
  value: string | number
  label: string
  icon?: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  color?: "blue" | "green" | "amber" | "violet" | "slate"
  className?: string
}

export function StatCard({
  value, label, icon, trend, color = "blue", className }: StatCardProps) {
  const colors = {
    blue: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
    green: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
    amber: "bg-calm-warn-soft text-calm-warn border border-calm-warn-line",
    violet: "bg-calm-accent-soft text-calm-accent-deep border border-calm-accent-line",
    slate: "bg-calm-accent-wash text-calm-ink border border-calm-line",
  }

  return (
    <div
      className={cn(
        "p-5 md:p-6 rounded-xl border border-border/80 bg-calm-surface shadow-[0_1px_2px_0_rgba(31,42,55,0.03)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground tabular-nums">{value}</div>
          <div className="text-xs md:text-sm font-medium text-foreground-muted mt-1">
            {label}
          </div>
        </div>
        {icon && (
          <div
            className={cn(
              "size-10 rounded-lg flex items-center justify-center shrink-0",
              colors[color],
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-semibold",
            trend.isPositive ? "text-calm-accent-deep" : "text-calm-warn",
          )}
        >
          <svg
            className={cn("w-4 h-4", !trend.isPositive && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          {trend.isPositive ? "+" : "-"}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
}
