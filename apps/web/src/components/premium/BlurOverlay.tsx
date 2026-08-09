// apps/web/src/components/premium/BlurOverlay.tsx
//
// Composant pour flouter et verrouiller le contenu Premium
// Affiche un overlay avec CTA utilisant PremiumModal

'use client'

import React, { useState } from "react"
import { UpgradeCTA } from "./UpgradeCTA"

interface BlurOverlayProps {
  children: React.ReactNode
  /** Fonctionnalité demandée */
  feature?: string
}

export function BlurOverlay({ children, feature = 'cette fonctionnalité' }: BlurOverlayProps) {
  return React.createElement(
    'div',
    { className: 'relative' },
    [
      React.createElement(
        'div',
        { className: 'blur-sm pointer-events-none select-none' },
        children
      ),
      React.createElement(
        'div',
        { className: 'absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg' },
        React.createElement(UpgradeCTA, { feature })
      ),
    ]
  )
}
