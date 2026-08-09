// apps/web/src/components/ats/StrengthCard.tsx
//
// Carte pour afficher une force du CV
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { CheckCircle, TrendingUp } from 'lucide-react'
import { Strength } from '@/types/ats'

interface StrengthCardProps {
  strength: Strength
  index: number
}

export function StrengthCard({ strength, index }: StrengthCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'structure':
        return 'bg-bronze-100 text-bronze-700'
      case 'keywords':
        return 'bg-forest-100 text-forest-700'
      case 'content':
        return 'bg-ink-100 text-ink-700'
      case 'format':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-ivoire-100 text-ink-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white p-4 rounded-xl border border-ivoire-200 hover:border-bronze-300 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-forest-100 rounded-lg flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-forest-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink-900 mb-1">
            {strength.description}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(strength.category)}`}>
              {strength.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-ink-500">
              <TrendingUp className="w-3 h-3" />
              <span>+{strength.impact}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
