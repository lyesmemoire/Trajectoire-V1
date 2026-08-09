// apps/web/src/components/conversion/ProgressSection.tsx
//
// Section de progression du parcours utilisateur
// MVP-009 — Conversion Funnel

'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, ArrowRight } from 'lucide-react'
import { ProgressStep } from '@/types/conversion'

interface ProgressSectionProps {
  steps?: ProgressStep[]
}

const defaultSteps: ProgressStep[] = [
  {
    step: 1,
    title: 'Analyse ATS',
    description: 'Votre CV a été analysé',
    status: 'completed',
  },
  {
    step: 2,
    title: 'Création de compte',
    description: 'Inscription gratuite',
    status: 'current',
  },
  {
    step: 3,
    title: 'Sauvegarde du rapport',
    description: 'Conservez votre analyse',
    status: 'pending',
  },
  {
    step: 4,
    title: 'Matching intelligent',
    description: 'Trouvez les offres idéales',
    status: 'pending',
  },
]

export function ProgressSection({ steps = defaultSteps }: ProgressSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-6"
    >
      <h3 className="text-sm font-medium text-ink-900 mb-4">
        Votre progression
      </h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isCurrent = step.status === 'current'
          
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="p-1 bg-forest-100 rounded-full">
                    <CheckCircle className="w-4 h-4 text-forest-600" />
                  </div>
                ) : isCurrent ? (
                  <div className="p-1 bg-bronze-100 rounded-full">
                    <Circle className="w-4 h-4 text-bronze-600 fill-bronze-600" />
                  </div>
                ) : (
                  <div className="p-1 bg-ivoire-100 rounded-full">
                    <Circle className="w-4 h-4 text-ink-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${
                    isCompleted ? 'text-forest-700' :
                    isCurrent ? 'text-bronze-700' :
                    'text-ink-500'
                  }`}>
                    {step.title}
                  </p>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 bg-bronze-100 text-bronze-700 rounded-full">
                      En cours
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-500 mt-0.5">
                  {step.description}
                </p>
              </div>
              
              {isCurrent && (
                <ArrowRight className="w-4 h-4 text-bronze-600 animate-pulse" />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
