// apps/web/src/components/ats/ATSSummary.tsx
//
// Résumé pour recruteur
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { RecruiterSummary } from '@/types/ats'

interface ATSSummaryProps {
  summary: RecruiterSummary
}

export function ATSSummary({ summary }: ATSSummaryProps) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'hire':
        return 'bg-forest-50 border-forest-200 text-forest-700'
      case 'consider':
        return 'bg-amber-50 border-amber-200 text-amber-700'
      case 'reject':
        return 'bg-brick-50 border-brick-200 text-brick-700'
      default:
        return 'bg-ivoire-50 border-ivoire-200 text-ink-700'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'hire':
        return CheckCircle2
      case 'consider':
        return AlertCircle
      case 'reject':
        return AlertCircle
      default:
        return UserCheck
    }
  }

  const getRecommendationLabel = (recommendation: string) => {
    switch (recommendation) {
      case 'hire':
        return 'Recommandé pour l\'embauche'
      case 'consider':
        return 'À considérer'
      case 'reject':
        return 'À améliorer avant entretien'
      default:
        return 'En attente d\'analyse'
    }
  }

  const RecommendationIcon = getRecommendationIcon(summary.recommendation)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`p-6 rounded-xl border ${getRecommendationColor(summary.recommendation)}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg flex-shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3">Résumé Recruteur</h3>
          
          {/* Recommandation */}
          <div className="flex items-center gap-2 mb-4">
            <RecommendationIcon className="w-5 h-5" />
            <span className="font-medium">{getRecommendationLabel(summary.recommendation)}</span>
          </div>

          {/* Score et percentile */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs opacity-70 mb-1">Score ATS</p>
              <p className="text-2xl font-bold">{summary.score}/100</p>
            </div>
            <div>
              <p className="text-xs opacity-70 mb-1">Percentile</p>
              <p className="text-2xl font-bold">{summary.percentile}%</p>
            </div>
          </div>

          {/* Points forts */}
          {summary.keyStrengths.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium mb-2 opacity-70">Points forts</p>
              <ul className="space-y-1">
                {summary.keyStrengths.map((strength, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points d'attention */}
          {summary.attentionPoints.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2 opacity-70">Points d'attention</p>
              <ul className="space-y-1">
                {summary.attentionPoints.map((point, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
