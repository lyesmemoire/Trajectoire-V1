// apps/web/src/components/dashboard/DashboardProgress.tsx
//
// Widget Progression du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, Lock } from 'lucide-react'
import type { DashboardProgress } from '@/types/dashboard'

interface DashboardProgressProps {
  progress: DashboardProgress
}

export function DashboardProgress({ progress }: DashboardProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-ink-600">Progression</h3>
        <span className="text-sm font-semibold text-ink-900">
          {progress.percentage}%
        </span>
      </div>

      <div className="w-full h-3 bg-ivoire-200 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 1, delay: 0.9 }}
          className="h-full rounded-full bg-gradient-to-r from-bronze-400 to-bronze-600"
        />
      </div>

      <div className="space-y-3">
        {progress.steps.map((step, index) => (
          <motion.div
            key={step.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <div className="p-1.5 bg-forest-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-forest-600" />
                </div>
              ) : (
                <div className="p-1.5 bg-ivoire-100 rounded-full">
                  <Circle className="w-4 h-4 text-ink-400" />
                </div>
              )}
            </div>
            <span
              className={`text-sm ${
                step.completed ? 'text-ink-900' : 'text-ink-500'
              }`}
            >
              {step.name}
            </span>
            {!step.completed && index > progress.completedSteps && (
              <Lock className="w-3 h-3 text-ink-400 ml-auto" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="mt-4 pt-4 border-t border-ivoire-200"
      >
        <p className="text-xs text-ink-500 text-center">
          {progress.completedSteps} étapes complétées sur {progress.totalSteps}
        </p>
      </motion.div>
    </motion.div>
  )
}
