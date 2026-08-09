// apps/web/src/components/ats/ATSHeader.tsx
//
// Header du rapport ATS avec score et progression
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, Award } from 'lucide-react'
import { ATSReportData } from '@/types/ats'

interface ATSHeaderProps {
  data: ATSReportData
}

export function ATSHeader({ data }: ATSHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-forest-600'
    if (score >= 60) return 'text-bronze-600'
    if (score >= 40) return 'text-amber-600'
    return 'text-brick-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-forest-100'
    if (score >= 60) return 'bg-bronze-100'
    if (score >= 40) return 'bg-amber-100'
    return 'bg-brick-100'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      {/* Hero Score */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">
            Analyse ATS
          </h1>
          <p className="text-ink-600">
            {data.fileName || 'CV analysé'} • {data.analyzedAt ? new Date(data.analyzedAt).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}
          </p>
        </div>

        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${getScoreBg(data.score)}`}>
          <div className="text-center">
            <p className="text-sm font-medium text-ink-600 mb-1">Score ATS</p>
            <p className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
              {data.score}
            </p>
            <p className="text-xs text-ink-500 mt-1">/ 100</p>
          </div>
        </div>
      </div>

      {/* Progression et compatibilité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progression */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white p-5 rounded-xl border border-ivoire-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-bronze-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-bronze-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">Progression</p>
              <p className="text-xs text-ink-500">Vers l'optimal</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="w-full bg-ivoire-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-2 rounded-full bg-gradient-to-r from-bronze-400 to-bronze-600"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-bronze-600">
              {data.gapToOptimal} pts
            </span>
          </div>
        </motion.div>

        {/* Compatibilité */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white p-5 rounded-xl border border-ivoire-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-forest-100 rounded-lg">
              <Target className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">Compatibilité</p>
              <p className="text-xs text-ink-500">Percentile</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="w-full bg-ivoire-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.percentile}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-2 rounded-full bg-gradient-to-r from-forest-400 to-forest-600"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-forest-600">
              {data.percentile}%
            </span>
          </div>
        </motion.div>

        {/* Recommandation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white p-5 rounded-xl border border-ivoire-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-ink-100 rounded-lg">
              <Award className="w-5 h-5 text-ink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900">Recommandation</p>
              <p className="text-xs text-ink-500">Recruteur</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${
              data.recruiterSummary.recommendation === 'hire' ? 'text-forest-600' :
              data.recruiterSummary.recommendation === 'consider' ? 'text-amber-600' :
              'text-brick-600'
            }`}>
              {data.recruiterSummary.recommendation === 'hire' ? 'À embaucher' :
               data.recruiterSummary.recommendation === 'consider' ? 'À considérer' :
               'À améliorer'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Message personnalisé */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-bronze-50 to-ivoire-50 rounded-xl border border-bronze-200"
      >
        <p className="text-sm text-ink-700 text-center">
          {data.message}
        </p>
      </motion.div>
    </motion.div>
  )
}
