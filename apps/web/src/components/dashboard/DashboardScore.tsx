// apps/web/src/components/dashboard/DashboardScore.tsx
//
// Widget Score ATS du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { DashboardScore as DashboardScoreType } from '@/types/dashboard'

interface DashboardScoreProps {
  score: DashboardScoreType
}

export function DashboardScore({ score }: DashboardScoreProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-forest-600'
    if (value >= 60) return 'text-bronze-600'
    if (value >= 40) return 'text-sky-600'
    return 'text-brick-600'
  }

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return 'bg-forest-100'
    if (value >= 60) return 'bg-bronze-100'
    if (value >= 40) return 'bg-sky-100'
    return 'bg-brick-100'
  }

  const getTrendIcon = () => {
    switch (score.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-forest-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-brick-600" />
      default:
        return <Minus className="w-4 h-4 text-ink-400" />
    }
  }

  const getTrendText = () => {
    if (score.previousScore === undefined) return null
    const diff = score.currentScore - score.previousScore
    const sign = diff > 0 ? '+' : ''
    return `${sign}${diff} pts`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink-600">Score ATS</h3>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          {score.previousScore !== undefined && (
            <span className="text-sm font-medium text-ink-700">
              {getTrendText()}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className={`p-8 rounded-full ${getScoreBgColor(score.currentScore)}`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
            className="text-center"
          >
            <span className={`text-5xl font-bold ${getScoreColor(score.currentScore)}`}>
              {score.currentScore}
            </span>
            <span className={`text-lg ${getScoreColor(score.currentScore)}`}>/100</span>
          </motion.div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-600">Progression</span>
          <span className="font-medium text-ink-900">{score.progressPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-ivoire-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score.progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${
              score.progressPercentage >= 80
                ? 'bg-forest-500'
                : score.progressPercentage >= 60
                ? 'bg-bronze-500'
                : score.progressPercentage >= 40
                ? 'bg-sky-500'
                : 'bg-brick-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  )
}
