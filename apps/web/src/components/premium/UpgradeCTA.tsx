// apps/web/src/components/premium/UpgradeCTA.tsx
//
// CTA pour inciter à passer Premium
// Utilise PremiumModal au lieu de rediriger directement

'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"
import { PremiumModal } from "./PremiumModal"

interface UpgradeCTAProps {
  /** Fonctionnalité demandée */
  feature?: string
}

export function UpgradeCTA({ feature = 'cette fonctionnalité' }: UpgradeCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="space-y-4 p-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-indigo-600/10 p-3">
            <Lock className="h-6 w-6 text-indigo-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white/80">
            Débloquez votre analyse complète
          </h3>
          <p className="mx-auto max-w-xs text-sm text-white/50">
            Accédez aux recommandations détaillées, au plan d&apos;action
            personnalisé et au feedback avancé.
          </p>
        </div>
        <Button
          variant="dark"
          onClick={() => setIsModalOpen(true)}
          className="w-full ring-offset-zinc-900"
        >
          <Sparkles className="h-4 w-4" />
          Débloquer maintenant
        </Button>
      </div>
      <PremiumModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feature={feature}
      />
    </>
  )
}
