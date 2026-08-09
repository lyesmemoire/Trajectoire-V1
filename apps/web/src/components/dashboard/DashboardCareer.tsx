// apps/web/src/components/dashboard/DashboardCareer.tsx
//
// Widget Progression Carrière du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, ArrowRight } from 'lucide-react'
import type { DashboardCareer } from '@/types/dashboard'

interface DashboardCareerProps {
  career: DashboardCareer
}

export function DashboardCareer({ career }: DashboardCareerProps) {
  const getTrendIcon = () => {
    switch (career.evolution.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-forest-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-brick-600" />
      default:
        return null
    }
  }

  const getEmployabilityColor = (score: number) => {
    if (score >= 80) return 'text-forest-600'
    if (score >= 60) return 'text-bronze-600'
    if (score >= 40) return 'text-sky-600'
    return 'text-brick-600'
  }

  const getEmployabilityBgColor = (score: number) => {
    if (score >= 80) return 'bg-forest-100'
    if (score >= 60) return 'bg-bronze-100'
    if (score >= 40) return 'bg-sky-100'
    return 'bg-brick-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink-600">Progression carrière</h3>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <span className="text-sm font-medium text-ink-700">
            Score employabilité
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-600">Niveau actuel</span>
          <span className="text-sm font-semibold text-ink-900">{career.currentLevel}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-ink-600">Niveau suivant</span>
          <span className="text-sm font-semibold text-ink-900">{career.nextLevel}</span>
        </div>
        <div className="w-full h-2 bg-ivoire-200 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${career.progressToNext}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full bg-bronze-500"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>Progression</span>
          <span>{career.progressToNext}%</span>
        </div>
      </div>

      <div className={`p-4 rounded-xl ${getEmployabilityBgColor(career.evolution.employabilityScore)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Score employabilité</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getEmployabilityColor(career.evolution.employabilityScore)}`}>
              {career.evolution.employabilityScore}
            </span>
            <span className={`text-sm ${getEmployabilityColor(career.evolution.employabilityScore)}`}>/100</span>
          </div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-bronze-600 hover:text-bronze-700 transition-colors"
      >
        Voir le détail <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}
