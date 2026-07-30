"use client"

import { motion } from "framer-motion"
import { XCircle, CheckCircle2, ChevronRight } from "lucide-react"
import { COMPARISON_DATA } from "@/lib/marketing/homepage-copy"

export function ComparisonSection() {
  return (
    <section className="section px-6 bg-[var(--bg-base)]">
      <div className="max-w-6xl mx-auto space-y-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-7xl font-black text-[var(--text-primary)] leading-tight tracking-tight">
            {COMPARISON_DATA.title} <br />
            <span className="text-[var(--primary)] italic">
              {COMPARISON_DATA.subtitle}
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Tools */}
          <motion.div
            whileHover={{ y: -10 }}
            className="p-10 rounded-[var(--radius-card)] bg-[var(--bg-card)] border border-[var(--border)] space-y-8 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-ink-500" />
              </div>
              <h3 className="text-xl font-black text-ink-500">
                Outils IA Classiques
              </h3>
            </div>
            <ul className="space-y-4">
              {COMPARISON_DATA.traditional.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-ink-500 font-medium"
                >
                  <XCircle className="w-5 h-5 flex-shrink-0 opacity-30" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* StudioEntretien */}
          <motion.div
            whileHover={{ y: -10 }}
            className="p-10 rounded-[var(--radius-card)] bg-[var(--primary)] border border-[var(--primary)] space-y-8 shadow-2xl shadow-[var(--primary)]/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-forest-600" />
              </div>
              <h3 className="text-xl font-black text-[var(--text-primary)]">Trajectoire</h3>
            </div>
            <ul className="space-y-4">
              {COMPARISON_DATA.studio.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 text-[var(--text-primary)] font-black"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <div className="bg-[var(--bg-base)] rounded-2xl p-4 border border-[var(--border)]">
                <p className="text-xs font-bold text-[var(--text-primary)]/90 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" /> Analyse du stress en
                  temps réel
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
