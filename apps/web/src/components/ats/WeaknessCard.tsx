// apps/web/src/components/ats/WeaknessCard.tsx
//
// Carte pour afficher une faiblesse du CV
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown } from 'lucide-react'
import { Weakness } from '@/types/ats'

interface WeaknessCardProps {
  weakness: Weakness
  index: number
}

export function WeaknessCard({ weakness, index }: WeaknessCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-brick-100 text-brick-700 border-brick-300'
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300'
      case 'low':
        return 'bg-ivoire-100 text-ink-700 border-ivoire-300'
      default:
        return 'bg-ivoire-100 text-ink-700 border-ivoire-300'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Priorité haute'
      case 'medium':
        return 'Priorité moyenne'
      case 'low':
        return 'Priorité basse'
      default:
        return 'Priorité'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white p-4 rounded-xl border ${getPriorityColor(weakness.priority)} hover:opacity-80 transition-opacity`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-brick-100 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-brick-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-900 mb-1">
            {weakness.description}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(weakness.priority)}`}>
              {getPriorityLabel(weakness.priority)}
            </span>
            <div className="flex items-center gap-1 text-xs text-ink-500">
              <TrendingDown className="w-3 h-3" />
              <span>-{weakness.impact}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
