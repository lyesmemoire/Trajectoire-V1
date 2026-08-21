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
  const badge =
    tone === "bronze"
      ? "bg-bronze-400/12 text-bronze-700 ring-1 ring-bronze-400/25"
      : "bg-ivoire-50 text-ink-900 ring-1 ring-ivoire-200"

  return (
    <div className="rounded-2xl border border-ivoire-200 bg-white/85 p-4 shadow-premium backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
        </div>
        <div className={["flex size-10 items-center justify-center rounded-2xl", badge].join(" ")}>
          {icon}
        </div>
      </div>
    </div>
  )
}
