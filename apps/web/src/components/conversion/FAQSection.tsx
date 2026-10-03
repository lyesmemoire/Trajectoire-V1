// apps/web/src/components/conversion/FAQSection.tsx
//
// Section FAQ rapide
// MVP-009 — Conversion Funnel

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FAQItem } from '@/types/conversion'

interface FAQSectionProps {
  items?: FAQItem[]
}

const defaultItems: FAQItem[] = [
  {
    question: 'Est-ce vraiment gratuit ?',
    answer: 'La création du compte et le diagnostic de votre CV sont gratuits, sans carte bancaire. Les simulations d’entretien font partie des offres payantes.',
    category: 'pricing',
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Votre connexion est protégée par HTTPS et l’accès à vos données est limité à votre compte.',
    category: 'security',
  },
  {
    question: 'Puis-je supprimer mon compte ?',
    answer: 'Oui, vous pouvez supprimer votre compte et vos données depuis les paramètres.',
    category: 'account',
  },
  {
    question: 'Que puis-je faire avec mon compte ?',
    answer: 'Sauvegarder vos analyses, lancer du matching, discuter avec le Copilot RH, et préparer vos entretiens.',
    category: 'features',
  },
]

export function FAQSection({ items = defaultItems }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="mt-6"
    >
      <h3 className="text-sm font-medium text-ink-900 mb-4">
        Questions fréquentes
      </h3>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-ivoire-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-ivoire-50 transition-colors"
            >
              <span className="text-sm font-medium text-ink-900">
                {item.question}
              </span>
              {openIndex === index ? (
                <ChevronUp className="w-4 h-4 text-ink-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-ink-500 flex-shrink-0" />
              )}
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 pt-0">
                    <p className="text-sm text-ink-600">
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
