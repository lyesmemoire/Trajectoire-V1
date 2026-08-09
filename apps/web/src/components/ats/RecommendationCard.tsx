// apps/web/src/components/ats/RecommendationCard.tsx
//
// Carte pour afficher une recommandation IA
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Recommendation } from '@/types/ats'

interface RecommendationCardProps {
  recommendation: Recommendation
  index: number
}

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'add':
        return Plus
      case 'improve':
        return RefreshCw
      case 'remove':
        return Trash2
      default:
        return Lightbulb
    }
  }

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'add':
        return 'bg-forest-100 text-forest-700'
      case 'improve':
        return 'bg-bronze-100 text-bronze-700'
      case 'remove':
        return 'bg-brick-100 text-brick-700'
      default:
        return 'bg-ink-100 text-ink-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-brick-600'
      case 'medium':
        return 'text-amber-600'
      case 'low':
        return 'text-ink-600'
      default:
        return 'text-ink-600'
    }
  }

  const ActionIcon = getActionIcon(recommendation.actionType)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-r from-bronze-50 to-ivoire-50 p-4 rounded-xl border border-bronze-200"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg flex-shrink-0 ${getActionColor(recommendation.actionType)}`}>
          <ActionIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-ink-900">
              {recommendation.title}
            </h4>
            <span className={`text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
              {recommendation.priority === 'high' ? 'Haute' :
               recommendation.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </span>
          </div>
          <p className="text-xs text-ink-600 mb-2">
            {recommendation.description}
          </p>
          <div className="flex items-center gap-1 text-xs text-ink-500">
            <Lightbulb className="w-3 h-3" />
            <span>Impact: +{recommendation.estimatedImpact}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
