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
    blue: "bg-sky-50 text-sky-700 border border-sky-100",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border border-amber-100",
    violet: "bg-violet-50 text-violet-700 border border-violet-100",
    slate: "bg-slate-50 text-slate-700 border border-slate-200/60",
  }

  return (
    <div
      className={cn(
        "p-5 md:p-6 rounded-xl border border-border/80 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
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
            trend.isPositive ? "text-emerald-600" : "text-rose-600",
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
