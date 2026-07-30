// apps/web/src/components/premium/UpgradeCTA.tsx
//
// CTA pour inciter à passer Premium
// Bouton vers /pricing

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles } from "lucide-react"

export function UpgradeCTA() {
  return (
    <div className="text-center space-y-4 p-6">
      <div className="flex justify-center">
        <div className="bg-bronze-600/20 p-3 rounded-full">
          <Lock className="w-6 h-6 text-bronze-400" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          Débloquez votre analyse complète
        </h3>
        <p className="text-sm text-ink-300 max-w-xs mx-auto">
          Accédez aux recommandations détaillées, au plan d'action personnalisé et au feedback avancé.
        </p>
      </div>

      <Link href="/pricing" className="flex items-center gap-2">
        <Button className="w-full bg-bronze-600 hover:bg-bronze-700">
          <Sparkles className="w-4 h-4" />
          Débloquer maintenant
        </Button>
      </Link>
    </div>
  )
}
