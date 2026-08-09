// apps/web/src/components/conversion/BenefitsList.tsx
//
// Liste des avantages de la création de compte
// MVP-009 — Conversion Funnel

'use client'

import { motion } from 'framer-motion'
import { Check, Save, Target, MessageSquare, Briefcase, TrendingUp } from 'lucide-react'
import { Benefit } from '@/types/conversion'

interface BenefitsListProps {
  benefits?: Benefit[]
}

const defaultBenefits: Benefit[] = [
  {
    title: 'Sauvegarder ce rapport',
    description: 'Conservez votre analyse ATS et retrouvez-la à tout moment',
    icon: 'Save',
  },
  {
    title: 'Lancer un matching',
    description: 'Trouvez les offres qui correspondent parfaitement à votre profil',
    icon: 'Target',
  },
  {
    title: 'Discuter avec le Copilot RH',
    description: 'Obtenez des conseils personnalisés pour votre carrière',
    icon: 'MessageSquare',
  },
  {
    title: 'Préparer vos entretiens IA',
    description: 'Entraînez-vous avec des simulations d\'entretien réalistes',
    icon: 'Briefcase',
  },
  {
    title: 'Suivre votre progression',
    description: 'Améliorez votre CV et mesurez vos progrès dans le temps',
    icon: 'TrendingUp',
  },
]

const iconMap: Record<string, any> = {
  Save,
  Target,
  MessageSquare,
  Briefcase,
  TrendingUp,
}

export function BenefitsList({ benefits = defaultBenefits }: BenefitsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink-900 mb-4">
        Créez gratuitement votre compte pour :
      </h3>
      
      {benefits.map((benefit, index) => {
        const Icon = iconMap[benefit.icon] || Check
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-ivoire-50 rounded-lg hover:bg-ivoire-100 transition-colors"
          >
            <div className="p-2 bg-forest-100 rounded-lg flex-shrink-0">
              <Icon className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-ink-900 mb-1">
                {benefit.title}
              </h4>
              <p className="text-xs text-ink-600">
                {benefit.description}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
