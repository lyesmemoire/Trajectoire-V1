// apps/web/src/components/dashboard/DashboardHistory.tsx
//
// Widget Historique du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, ArrowRight } from 'lucide-react'
import type { DashboardHistoryItem } from '@/types/dashboard'

interface DashboardHistoryProps {
  history: DashboardHistoryItem[]
}

export function DashboardHistory({ history }: DashboardHistoryProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Aujourd'hui"
    if (days === 1) return "Hier"
    if (days < 7) return `Il y a ${days} jours`
    return date.toLocaleDateString('fr-FR')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-forest-600 bg-forest-100'
    if (score >= 60) return 'text-bronze-600 bg-bronze-100'
    if (score >= 40) return 'text-sky-600 bg-sky-100'
    return 'text-brick-600 bg-brick-100'
  }

  const recentHistory = history.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink-600">Historique</h3>
        <div className="flex items-center gap-1 text-ink-500">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">{history.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {recentHistory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            className="p-3 rounded-lg border border-ivoire-200 hover:border-bronze-300 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-ink-500 flex-shrink-0" />
                  <h4 className="text-sm font-medium text-ink-900 truncate">{item.fileName}</h4>
                </div>
                {item.targetJob && (
                  <p className="text-xs text-ink-600 truncate">{item.targetJob}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-ink-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(item.score)}`}>
                {item.score}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {history.length > 3 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-bronze-600 hover:text-bronze-700 transition-colors"
        >
          Voir tout l'historique <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}
