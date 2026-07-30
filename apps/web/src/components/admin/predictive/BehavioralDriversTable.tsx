"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface Driver {
  driver: string
  impact: number
}

export function BehavioralDriversTable({ drivers }: { drivers: Driver[] }) {
  return (
    <div className="bg-white rounded-[3rem] border border-ivoire-100 p-10 shadow-sm space-y-8">
      <h3 className="text-sm font-black text-ink-400 uppercase tracking-widest">
        Behavioral Drivers Analysis
      </h3>
      <div className="space-y-4">
        {drivers.map((d, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-6 bg-ivoire-50 rounded-2xl border border-ivoire-100"
          >
            <span className="font-black text-ink-900">{d.driver}</span>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-black ${d.impact > 0 ? "text-forest-600" : "text-brick-600"}`}
              >
                {d.impact > 0 ? `+${d.impact}%` : `${d.impact}%`}
              </span>
              {d.impact > 0 ? (
                <TrendingUp className="w-4 h-4 text-forest-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-brick-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
