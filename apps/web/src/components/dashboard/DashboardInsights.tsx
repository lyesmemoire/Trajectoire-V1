// apps/web/src/components/dashboard/DashboardInsights.tsx
//
// Widget Insights du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Lightbulb, Award } from 'lucide-react'
import type { DashboardInsight } from '@/types/dashboard'

interface DashboardInsightsProps {
  insights: DashboardInsight[]
}

export function DashboardInsights({ insights }: DashboardInsightsProps) {
  const getIcon = (type: DashboardInsight['type']) => {
    switch (type) {
      case 'strength':
        return <Award className="w-4 h-4" />
      case 'weakness':
        return <AlertTriangle className="w-4 h-4" />
      case 'opportunity':
        return <Lightbulb className="w-4 h-4" />
      case 'achievement':
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getColorClass = (type: DashboardInsight['type']) => {
    switch (type) {
      case 'strength':
        return 'bg-forest-100 text-forest-700 border-forest-200'
      case 'weakness':
        return 'bg-brick-100 text-brick-700 border-brick-200'
      case 'opportunity':
        return 'bg-sky-100 text-sky-700 border-sky-200'
      case 'achievement':
        return 'bg-bronze-100 text-bronze-700 border-bronze-200'
    }
  }

  const topInsights = insights.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <h3 className="text-sm font-medium text-ink-600 mb-4">Insights</h3>

      <div className="space-y-3">
        {topInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
            className={`p-3 rounded-lg border ${getColorClass(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg flex-shrink-0">
                {getIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <p className="text-xs opacity-80 mt-1">{insight.description}</p>
                {insight.value !== undefined && (
                  <div className="mt-2">
                    <span className="text-lg font-bold">{insight.value}</span>
                    {insight.unit && <span className="text-xs ml-1">{insight.unit}</span>}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
