// @ts-nocheck
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: "blue" | "green" | "amber" | "violet" | "slate";
  className?: string;
}

export function StatCard({
  value,
  label,
  icon,
  trend,
  color = "blue",
  className,
}: StatCardProps) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
    violet: "bg-violet-50 border-violet-200 text-violet-600",
    slate: "bg-slate-50 border-slate-200 text-slate-600",
  };

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border bg-white shadow-soft-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-3xl font-black text-slate-900">{value}</div>
          <div className="text-sm font-semibold text-slate-500 mt-1">
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
            trend.isPositive ? "text-green-600" : "text-red-600",
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
  );
}
