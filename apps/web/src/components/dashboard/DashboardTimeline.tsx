// apps/web/src/components/dashboard/DashboardTimeline.tsx
//
// Widget Timeline du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { FileText, MessageSquare, Target, Calendar, Clock } from 'lucide-react'
import type { DashboardTimelineEvent } from '@/types/dashboard'

interface DashboardTimelineProps {
  timeline: DashboardTimelineEvent[]
}

export function DashboardTimeline({ timeline }: DashboardTimelineProps) {
  const getIcon = (type: DashboardTimelineEvent['type']) => {
    switch (type) {
      case 'analysis':
        return <FileText className="w-4 h-4" />
      case 'interview':
        return <MessageSquare className="w-4 h-4" />
      case 'matching':
        return <Target className="w-4 h-4" />
      case 'milestone':
        return <Calendar className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: DashboardTimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-forest-100 text-forest-700 border-forest-200'
      case 'in-progress':
        return 'bg-bronze-100 text-bronze-700 border-bronze-200'
      case 'upcoming':
        return 'bg-ivoire-100 text-ink-700 border-ivoire-200'
    }
  }

  const getStatusBadge = (status: DashboardTimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé'
      case 'in-progress':
        return 'En cours'
      case 'upcoming':
        return 'À venir'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Aujourd'hui"
    if (days === 1) return "Demain"
    if (days === -1) return "Hier"
    if (days < 0) return `Il y a ${Math.abs(days)} jours`
    if (days < 7) return `Dans ${days} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const recentEvents = timeline.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink-600">Timeline</h3>
        <div className="flex items-center gap-1 text-ink-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Prochaines étapes</span>
        </div>
      </div>

      <div className="space-y-4">
        {recentEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
            className="relative pl-6 pb-4 border-l-2 border-ivoire-200 last:pb-0 last:border-l-0"
          >
            <div className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 ${
              event.status === 'completed' ? 'bg-forest-500 border-forest-500' :
              event.status === 'in-progress' ? 'bg-bronze-500 border-bronze-500' :
              'bg-white border-ivoire-300'
            } -translate-x-[9px]`} />
            
            <div className="p-3 rounded-lg border border-ivoire-200 hover:border-bronze-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-bronze-100 rounded-lg">
                    {getIcon(event.type)}
                  </div>
                  <h4 className="text-sm font-semibold text-ink-900">{event.title}</h4>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(event.status)}`}>
                  {getStatusBadge(event.status)}
                </span>
              </div>
              <p className="text-xs text-ink-600 mb-2">{event.description}</p>
              <div className="flex items-center gap-1 text-xs text-ink-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(event.date)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {timeline.length > 4 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-bronze-600 hover:text-bronze-700 transition-colors"
        >
          Voir toute la timeline
        </motion.button>
      )}
    </motion.div>
  )
}
