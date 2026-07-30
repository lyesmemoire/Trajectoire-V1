"use client"

import { AlertTriangle, AlertCircle, Info } from "lucide-react"

interface Anomaly {
  type: string
  severity: string
  message: string
}

export function AIAnomalyTable({ anomalies }: { anomalies: Anomaly[] }) {
  if (anomalies.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-ivoire-200 p-8 shadow-premium">
        <div className="flex items-center gap-3 text-forest-600">
          <div className="w-8 h-8 rounded-xl bg-forest-50 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-sm font-black uppercase tracking-widest">
            No Intelligence Anomalies Detected
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-ivoire-200 p-8 shadow-premium space-y-6">
      <h3 className="text-sm font-black text-ink-400 uppercase tracking-widest flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-terracotta-500" /> System Anomalies
      </h3>
      <div className="space-y-3">
        {anomalies.map((a, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border flex gap-4 items-center ${
              a.severity === "high"
                ? "bg-brick-50 border-brick-100 text-brick-700"
                : "bg-terracotta-50 border-terracotta-100 text-terracotta-700"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
