// apps/web/src/components/premium/UpgradeCTA.tsx
//
// CTA pour inciter à passer Premium
// Utilise PremiumModal au lieu de rediriger directement

'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"
import { PremiumModal } from "./PremiumModal"

interface UpgradeCTAProps {
  /** Fonctionnalité demandée */
  feature?: string
}

export function UpgradeCTA({ feature = 'cette fonctionnalité' }: UpgradeCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(
        'div',
        { className: 'text-center space-y-4 p-6' },
        [
          React.createElement(
            'div',
            { className: 'flex justify-center' },
            React.createElement('div', {
              className: 'bg-bronze-600/20 p-3 rounded-full',
            }, React.createElement(Lock, { className: 'w-6 h-6 text-bronze-400' }))
          ),
          React.createElement(
            'div',
            { className: 'space-y-2' },
            [
              React.createElement(
                'h3',
                { className: 'text-xl font-bold text-white' },
                'Débloquez votre analyse complète'
              ),
              React.createElement(
                'p',
                { className: 'text-sm text-ink-300 max-w-xs mx-auto' },
                'Accédez aux recommandations détaillées, au plan d\'action personnalisé et au feedback avancé.'
              ),
            ]
          ),
          React.createElement(
            Button,
            {
              onClick: () => setIsModalOpen(true),
              className: 'w-full bg-bronze-600 hover:bg-bronze-700',
            },
            [
              React.createElement(Sparkles, { className: 'w-4 h-4' }),
              'Débloquer maintenant',
            ]
          ),
        ]
      ),
      React.createElement(PremiumModal, {
        open: isModalOpen,
        onClose: () => setIsModalOpen(false),
        feature: feature,
      }),
    ]
  )
}
