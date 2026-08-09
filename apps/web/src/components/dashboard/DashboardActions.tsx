// apps/web/src/components/dashboard/DashboardActions.tsx
//
// Widget Actions Rapides du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { FileText, Search, MessageSquare, Mic, ArrowRight } from 'lucide-react'
import type { DashboardAction } from '@/types/dashboard'

interface DashboardActionsProps {
  actions: DashboardAction[]
}

export function DashboardActions({ actions }: DashboardActionsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5" />
      case 'Search':
        return <Search className="w-5 h-5" />
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />
      case 'Mic':
        return <Mic className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getColorClass = (color: DashboardAction['color']) => {
    switch (color) {
      case 'bronze':
        return 'bg-bronze-100 text-bronze-700 hover:bg-bronze-200'
      case 'forest':
        return 'bg-forest-100 text-forest-700 hover:bg-forest-200'
      case 'brick':
        return 'bg-brick-100 text-brick-700 hover:bg-brick-200'
      case 'ink':
        return 'bg-ink-100 text-ink-700 hover:bg-ink-200'
      case 'sky':
        return 'bg-sky-100 text-sky-700 hover:bg-sky-200'
      default:
        return 'bg-bronze-100 text-bronze-700 hover:bg-bronze-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <h3 className="text-sm font-medium text-ink-600 mb-4">Actions rapides</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.a
            key={action.id}
            href={action.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
            className={`p-4 rounded-xl border border-ivoire-200 hover:border-bronze-300 transition-all cursor-pointer group ${getColorClass(action.color)}`}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                {getIcon(action.icon)}
              </div>
              <div>
                <h4 className="text-sm font-semibold">{action.title}</h4>
                <p className="text-xs opacity-80 line-clamp-2">{action.description}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}
