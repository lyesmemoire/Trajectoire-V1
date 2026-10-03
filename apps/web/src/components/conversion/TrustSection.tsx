// apps/web/src/components/conversion/TrustSection.tsx
//
// Engagements affichés avec l'aperçu gratuit. Aucun chiffre ni note : seulement des faits vérifiables dans le code
// (un test d'invariants interdit toute preuve sociale chiffrée ou superlative, voir lib/design-invariants.test.ts).
//  - Diagnostic gratuit sans carte : /api/public/analyze-preview est anonyme et sans paiement.
//  - Texte du CV non conservé : seul le RÉSULTAT de l'aperçu est enregistré (PreviewAnalysisService, 24 h).
//  - Suppression du compte : /api/account/delete (AccountService + purge-user-data), depuis les paramètres.

'use client'

import { motion } from 'framer-motion'
import { CreditCard, FileText, Trash2, type LucideIcon } from 'lucide-react'
import { TrustElement } from '@/types/conversion'

interface TrustSectionProps {
  elements?: TrustElement[]
}

const defaultElements: TrustElement[] = [
  { type: 'badge', content: 'Diagnostic gratuit, sans carte bancaire' },
  { type: 'badge', content: 'Le texte de votre CV n’est pas conservé' },
  { type: 'badge', content: 'Suppression de votre compte et de vos données à tout moment' },
]

const icons: LucideIcon[] = [CreditCard, FileText, Trash2]

export function TrustSection({ elements = defaultElements }: TrustSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-8 border-t border-calm-line pt-8"
    >
      <h3 className="mb-4 text-center text-sm text-calm-ink">Nos engagements</h3>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {elements.map((element, index) => {
          const Icon = icons[index % icons.length]

          return (
            <motion.li
              key={element.content}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="rounded-[6px] bg-calm-alt p-4 text-center"
            >
              <div className="mb-2 flex justify-center">
                <div className="rounded-full bg-calm-surface p-2">
                  <Icon className="h-5 w-5 text-calm-accent" aria-hidden="true" />
                </div>
              </div>
              <p className="text-sm text-calm-ink">{element.content}</p>
              {element.subtitle && <p className="mt-1 text-xs text-calm-secondary">{element.subtitle}</p>}
            </motion.li>
          )
        })}
      </ul>
    </motion.div>
  )
}
