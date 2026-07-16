// @ts-nocheck
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/design-system"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/design-system"

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
    <Modal open={true} onOpenChange={() => {}}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{customTitle ?? "Fonctionnalité Premium"}</ModalTitle>
          <ModalDescription>{customMessage ?? "Cette fonctionnalité est disponible avec un abonnement Premium."}</ModalDescription>
        </ModalHeader>
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
      </ModalContent>
    </Modal>
  )
}
