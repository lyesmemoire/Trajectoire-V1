import React from "react"
import { stats } from "./landing-config"

export default function StatsSection() {
  return (
    <section className="py-12 border-y border-ivoire-100 bg-ivoire-50/40 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-3xl md:text-4xl font-black font-display text-ink-900">
              {stat.value}
            </p>
            <p className="text-xs text-ink-500 font-semibold uppercase mt-1 tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
