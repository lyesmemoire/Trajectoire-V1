// apps/web/src/components/premium/PremiumModal.tsx
//
// Modal Premium pour présenter les bénéfices et inciter à l'upgrade
// S'ouvre quand l'utilisateur clique sur une fonctionnalité premium

'use client'

import { useState } from 'react'
import { X, Sparkles, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Permission } from '@/types/permissions'

interface PremiumModalProps {
  /** Permission requise qui a déclenché le modal */
  requiredPermission?: Permission
  /** Fonctionnalité demandée par l'utilisateur */
  feature?: string
  /** Si le modal est ouvert */
  open: boolean
  /** Callback quand le modal est fermé */
  onClose: () => void
}

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Export PDF & DOCX',
    description: 'Exportez vos rapports dans tous les formats professionnels',
  },
  {
    icon: Check,
    title: 'Historique illimité',
    description: 'Accédez à tout votre historique d’analyses et simulations',
  },
  {
    icon: Sparkles,
    title: 'Rapports avancés',
    description: 'Obtenez des insights détaillés et des recommandations personnalisées',
  },
  {
    icon: Check,
    title: 'Simulations illimitées',
    description: 'Entraînez-vous autant que vous voulez avec nos entretiens simulés',
  },
  {
    icon: Sparkles,
    title: 'Assistant IA avancé',
    description: 'Bénéficiez d’un copilot IA plus puissant et intelligent',
  },
  {
    icon: Check,
    title: 'Support prioritaire',
    description: 'Obtenez une réponse rapide à toutes vos questions',
  },
]

/**
 * Modal Premium
 *
 * Affiche les bénéfices du plan premium et incite à l'upgrade.
 * L'utilisateur ne perd pas son contexte et peut revenir immédiatement.
 */
export function PremiumModal({
  feature = 'cette fonctionnalité',
  open,
  onClose,
}: PremiumModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const handleUpgrade = () => {
    const currentPath = window.location.pathname
    window.location.href = `/pricing?redirect=${encodeURIComponent(currentPath)}&feature=${encodeURIComponent(feature)}`
  }

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-calm-bg backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-calm-line bg-calm-surface shadow-2xl shadow-calm-ink/10 transition-all duration-200 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-calm-line p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-calm-accent-soft p-2">
              <Sparkles className="h-5 w-5 text-calm-accent" />
            </div>
            <h2 className="text-xl font-bold text-calm-ink">
              Débloquez {feature}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-calm-secondary transition-colors hover:bg-calm-accent-wash hover:text-calm-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          <p className="text-center text-calm-secondary">
            Cette fonctionnalité est réservée aux abonnés Premium. Passez à niveau
            pour débloquer toutes les fonctionnalités avancées.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl bg-calm-accent-wash p-4"
              >
                <div className="mt-1 rounded-lg bg-calm-accent-soft p-2">
                  <benefit.icon className="h-4 w-4 text-calm-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-calm-ink">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-xs text-calm-secondary">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-calm-accent-line bg-gradient-to-r from-calm-accent-soft to-calm-accent-soft p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-calm-ink">À partir de</p>
                <p className="text-2xl font-bold text-calm-accent">19€/mois</p>
              </div>
              <p className="text-xs text-calm-secondary">Sans engagement</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between rounded-b-2xl border-t border-calm-line bg-calm-accent-wash p-6">
          <Button
            variant="dark-ghost"
            onClick={handleClose}
            className="ring-offset-calm-bg"
          >
            Annuler
          </Button>
          <Button
            variant="dark"
            onClick={handleUpgrade}
            className="ring-offset-calm-bg"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Voir les plans
          </Button>
        </div>
      </div>
    </div>
  )
}
