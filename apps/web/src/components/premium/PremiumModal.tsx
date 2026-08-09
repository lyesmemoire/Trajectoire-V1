// apps/web/src/components/premium/PremiumModal.tsx
//
// Modal Premium pour présenter les bénéfices et inciter à l'upgrade
// S'ouvre quand l'utilisateur clique sur une fonctionnalité premium

'use client'

import React, { useState } from 'react'
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

/**
 * Modal Premium
 * 
 * Affiche les bénéfices du plan premium et incite à l'upgrade.
 * L'utilisateur ne perd pas son contexte et peut revenir immédiatement.
 */
export function PremiumModal({ 
  requiredPermission, 
  feature = 'cette fonctionnalité', 
  open, 
  onClose 
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
    // Naviguer vers pricing avec un paramètre de retour
    const currentPath = window.location.pathname
    window.location.href = `/pricing?redirect=${encodeURIComponent(currentPath)}&feature=${encodeURIComponent(feature)}`
  }

  if (!open) return null

  const benefits = [
    {
      icon: Sparkles,
      title: 'Export PDF & DOCX',
      description: 'Exportez vos rapports dans tous les formats professionnels',
    },
    {
      icon: Check,
      title: 'Historique illimité',
      description: 'Accédez à tout votre historique d\'analyses et simulations',
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
      description: 'Bénéficiez d\'un copilot IA plus puissant et intelligent',
    },
    {
      icon: Check,
      title: 'Support prioritaire',
      description: 'Obtenez une réponse rapide à toutes vos questions',
    },
  ]

  return React.createElement(
    'div',
    {
      className: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`,
      onClick: handleClose,
    },
    React.createElement(
      'div',
      {
        className: `bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-200 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      },
      [
        // Header
        React.createElement(
          'div',
          {
            className: 'flex items-center justify-between p-6 border-b border-ivoire-200',
          },
          [
            React.createElement(
              'div',
              { className: 'flex items-center gap-3' },
              [
                React.createElement('div', {
                  className: 'bg-bronze-100 p-2 rounded-full',
                }, React.createElement(Sparkles, { className: 'w-5 h-5 text-bronze-600' })),
                React.createElement(
                  'h2',
                  { className: 'text-xl font-bold text-ink-900' },
                  'Débloquez ' + feature
                ),
              ]
            ),
            React.createElement(
              'button',
              {
                onClick: handleClose,
                className: 'text-ink-400 hover:text-ink-600 transition-colors p-2 hover:bg-ivoire-100 rounded-lg',
              },
              React.createElement(X, { className: 'w-5 h-5' })
            ),
          ]
        ),

        // Content
        React.createElement(
          'div',
          { className: 'p-6 space-y-6' },
          [
            // Description
            React.createElement(
              'p',
              { className: 'text-ink-600 text-center' },
              'Cette fonctionnalité est réservée aux abonnés Premium. Passez à niveau pour débloquer toutes les fonctionnalités avancées.'
            ),

            // Benefits grid
            React.createElement(
              'div',
              { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
              benefits.map((benefit, index) =>
                React.createElement(
                  'div',
                  {
                    key: index,
                    className: 'flex items-start gap-3 p-4 bg-ivoire-50 rounded-xl',
                  },
                  [
                    React.createElement('div', {
                      className: 'bg-bronze-100 p-2 rounded-lg mt-1',
                    }, React.createElement(benefit.icon, { className: 'w-4 h-4 text-bronze-600' })),
                    React.createElement(
                      'div',
                      { className: 'flex-1' },
                      [
                        React.createElement(
                          'h3',
                          { className: 'font-semibold text-ink-900 text-sm' },
                          benefit.title
                        ),
                        React.createElement(
                          'p',
                          { className: 'text-xs text-ink-600 mt-1' },
                          benefit.description
                        ),
                      ]
                    ),
                  ]
                )
              )
            ),

            // Price highlight
            React.createElement(
              'div',
              { className: 'bg-gradient-to-r from-bronze-50 to-ivoire-50 p-4 rounded-xl border border-bronze-200' },
              [
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between' },
                  [
                    React.createElement(
                      'div',
                      null,
                      [
                        React.createElement('p', { className: 'text-sm font-semibold text-ink-900' }, 'À partir de'),
                        React.createElement('p', { className: 'text-2xl font-bold text-bronze-600' }, '19€/mois'),
                      ]
                    ),
                    React.createElement(
                      'p',
                      { className: 'text-xs text-ink-600' },
                      'Sans engagement'
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),

        // Footer
        React.createElement(
          'div',
          { className: 'flex items-center justify-between p-6 border-t border-ivoire-200 bg-ivoire-50 rounded-b-2xl' },
          [
            React.createElement(
              Button,
              {
                variant: 'ghost',
                onClick: handleClose,
                className: 'text-ink-600 hover:text-ink-900',
              },
              'Annuler'
            ),
            React.createElement(
              Button,
              {
                onClick: handleUpgrade,
                className: 'bg-bronze-600 hover:bg-bronze-700 text-white',
              },
              [
                React.createElement(ArrowRight, { className: 'w-4 h-4 mr-2' }),
                'Voir les plans',
              ]
            ),
          ]
        ),
      ]
    )
  )
}
