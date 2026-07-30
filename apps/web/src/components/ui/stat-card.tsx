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
    blue: "bg-ivoire-50 border-ivoire-200 text-ink-600",
    green: "bg-forest-50 border-forest-100 text-forest-600",
    amber: "bg-terracotta-50 border-terracotta-100 text-terracotta-600",
    violet: "bg-ivoire-50 border-ivoire-200 text-ink-600",
    slate: "bg-ivoire-50 border-ivoire-200 text-ink-600",
  }

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border bg-white/70 backdrop-blur-xl shadow-premium",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-serif font-black text-ink-900">{value}</div>
          <div className="text-sm font-semibold text-ink-400 mt-1">
            {label}
          </div>
        </div>
        {icon && (
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
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
            "mt-3 flex items-center gap-1 text-sm font-bold",
            trend.isPositive ? "text-forest-600" : "text-brick-600",
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
