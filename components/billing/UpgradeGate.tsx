"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"

interface UpgradeGateProps {
  /** false = locked, true = allowed */
  isAllowed: boolean
  /** Display mode — "blur" shows content blurred, others hide it */
  mode?: "blur" | "hide"
  customTitle?: string
  customMessage?: string
  children: React.ReactNode
}

export function UpgradeGate({ isAllowed, mode = "hide", customTitle, customMessage, children }: UpgradeGateProps) {
  const router = useRouter()

  if (isAllowed) {
    return <>{children}</>
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={() => {}} 
      title={customTitle ?? "Fonctionnalité Premium"}
      description={customMessage ?? "Cette fonctionnalité est disponible avec un abonnement Premium."}
    >
      <div className="flex gap-3 justify-end mt-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Retour
        </Button>
        <Button
          onClick={() => router.push("/pricing")}
        >
          Voir les offres
        </Button>
      </div>
    </Modal>
  )
}
