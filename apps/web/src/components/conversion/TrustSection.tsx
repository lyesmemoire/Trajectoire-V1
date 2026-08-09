// apps/web/src/components/conversion/TrustSection.tsx
//
// Section de confiance (statistiques, témoignages)
// MVP-009 — Conversion Funnel

'use client'

import { motion } from 'framer-motion'
import { Users, Star, Shield, Award } from 'lucide-react'
import { TrustElement } from '@/types/conversion'

interface TrustSectionProps {
  elements?: TrustElement[]
}

const defaultElements: TrustElement[] = [
  {
    type: 'statistic',
    content: '50,000+',
    subtitle: 'Utilisateurs actifs',
    value: 50000,
  },
  {
    type: 'statistic',
    content: '4.8/5',
    subtitle: 'Note moyenne',
    value: 4.8,
  },
  {
    type: 'badge',
    content: 'RGPD Compliant',
    subtitle: 'Vos données sont protégées',
  },
  {
    type: 'badge',
    content: '100% Gratuit',
    subtitle: 'Pas de carte bancaire requise',
  },
]

const iconMap: Record<string, any> = {
  Users,
  Star,
  Shield,
  Award,
}

export function TrustSection({ elements = defaultElements }: TrustSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-8 pt-8 border-t border-ivoire-200"
    >
      <h3 className="text-sm font-medium text-ink-900 mb-4 text-center">
        Rejoignez des milliers de candidats
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {elements.map((element, index) => {
          const Icon = element.type === 'statistic' ? Users : Shield
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="text-center p-4 bg-ivoire-50 rounded-lg"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-white rounded-full">
                  <Icon className="w-5 h-5 text-bronze-600" />
                </div>
              </div>
              <p className="text-lg font-bold text-ink-900">
                {element.content}
              </p>
              <p className="text-xs text-ink-600 mt-1">
                {element.subtitle}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
