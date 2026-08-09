// apps/web/src/components/conversion/SecuritySection.tsx
//
// Section de sécurité
// MVP-009 — Conversion Funnel

'use client'

import { motion } from 'framer-motion'
import { Lock, ShieldCheck, EyeOff, Server } from 'lucide-react'
import { SecurityElement } from '@/types/conversion'

interface SecuritySectionProps {
  elements?: SecurityElement[]
}

const defaultElements: SecurityElement[] = [
  {
    title: 'Chiffrement des données',
    description: 'Vos informations sont cryptées et sécurisées',
    icon: 'Lock',
  },
  {
    title: 'Conformité RGPD',
    description: 'Respect strict des réglementations européennes',
    icon: 'ShieldCheck',
  },
  {
    title: 'Confidentialité totale',
    description: 'Nous ne partageons jamais vos données',
    icon: 'EyeOff',
  },
  {
    title: 'Hébergement sécurisé',
    description: 'Infrastructure certifiée et surveillée 24/7',
    icon: 'Server',
  },
]

const iconMap: Record<string, any> = {
  Lock,
  ShieldCheck,
  EyeOff,
  Server,
}

export function SecuritySection({ elements = defaultElements }: SecuritySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-6 p-4 bg-forest-50 rounded-xl border border-forest-200"
    >
      <h3 className="text-sm font-semibold text-forest-900 mb-3 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        Votre sécurité est notre priorité
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {elements.map((element, index) => {
          const Icon = iconMap[element.icon] || Lock
          
          return (
            <div key={index} className="flex items-start gap-2">
              <div className="p-1.5 bg-white rounded-md flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-forest-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-forest-900">
                  {element.title}
                </p>
                <p className="text-xs text-forest-700">
                  {element.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
