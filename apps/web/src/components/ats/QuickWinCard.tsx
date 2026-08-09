// apps/web/src/components/ats/QuickWinCard.tsx
//
// Carte pour afficher un quick win (action rapide)
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { Zap, Clock } from 'lucide-react'
import { QuickWin } from '@/types/ats'

interface QuickWinCardProps {
  quickWin: QuickWin
  index: number
}

export function QuickWinCard({ quickWin, index }: QuickWinCardProps) {
  const getImpactColor = (impact: number) => {
    if (impact >= 15) return 'text-forest-600'
    if (impact >= 10) return 'text-bronze-600'
    if (impact >= 5) return 'text-amber-600'
    return 'text-ink-600'
  }

  const getImpactBg = (impact: number) => {
    if (impact >= 15) return 'bg-forest-100'
    if (impact >= 10) return 'bg-bronze-100'
    if (impact >= 5) return 'bg-amber-100'
    return 'bg-ivoire-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white p-4 rounded-xl border border-ivoire-200 hover:border-bronze-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
          <Zap className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ink-900 mb-1">
            {quickWin.title}
          </h4>
          <p className="text-xs text-ink-600 mb-2">
            {quickWin.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-ink-500">
              <Clock className="w-3 h-3" />
              <span>{quickWin.estimatedTime} min</span>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${getImpactBg(quickWin.impact)} ${getImpactColor(quickWin.impact)}`}>
              <span>+{quickWin.impact}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
