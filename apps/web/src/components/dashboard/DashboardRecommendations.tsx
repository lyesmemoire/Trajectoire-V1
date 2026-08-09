// apps/web/src/components/dashboard/DashboardRecommendations.tsx
//
// Widget Recommandations du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Plus, Minus, Highlighter, ArrowRight } from 'lucide-react'
import type { DashboardRecommendation } from '@/types/dashboard'

interface DashboardRecommendationsProps {
  recommendations: DashboardRecommendation[]
}

export function DashboardRecommendations({ recommendations }: DashboardRecommendationsProps) {
  const getActionIcon = (actionType: DashboardRecommendation['actionType']) => {
    switch (actionType) {
      case 'improve':
        return <Highlighter className="w-4 h-4" />
      case 'add':
        return <Plus className="w-4 h-4" />
      case 'remove':
        return <Minus className="w-4 h-4" />
      case 'highlight':
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: DashboardRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-brick-100 text-brick-700 border-brick-200'
      case 'medium':
        return 'bg-bronze-100 text-bronze-700 border-bronze-200'
      case 'low':
        return 'bg-sky-100 text-sky-700 border-sky-200'
    }
  }

  const getPriorityBadge = (priority: DashboardRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'Priorité haute'
      case 'medium':
        return 'Priorité moyenne'
      case 'low':
        return 'Priorité basse'
    }
  }

  const topRecommendations = recommendations.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink-600">Recommandations</h3>
        <div className="flex items-center gap-1 text-bronze-600">
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">IA</span>
        </div>
      </div>

      <div className="space-y-3">
        {topRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className="p-3 rounded-lg border border-ivoire-200 hover:border-bronze-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-bronze-100 rounded-lg flex-shrink-0">
                {getActionIcon(rec.actionType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-ink-900">{rec.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(rec.priority)}`}>
                    {getPriorityBadge(rec.priority)}
                  </span>
                </div>
                <p className="text-xs text-ink-600 line-clamp-2">{rec.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-ink-500">
                    Impact estimé : +{rec.estimatedImpact}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {recommendations.length > 4 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-bronze-600 hover:text-bronze-700 transition-colors"
        >
          Voir toutes les recommandations <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}
