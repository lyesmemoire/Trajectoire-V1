import { ReactNode } from "react"

export function KpiCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string
  value: string
  icon: ReactNode
  tone?: "default" | "bronze"
}) {
  const iconBg =
    tone === "bronze"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60"
      : "bg-primary-50 text-primary ring-1 ring-primary-100/60"

  return (
    <div className="rounded-xl border border-border/70 bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-foreground-muted">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground tabular-nums">
            {value}
          </p>
        </div>
        <div
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            iconBg,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
