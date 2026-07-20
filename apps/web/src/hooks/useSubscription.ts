// apps/web/src/hooks/useSubscription.ts
//
// Hook côté client pour vérifier le statut d'abonnement
// Utilisé par les composants UI (PaywallGate, UpgradePrompt)

'use client'

import { useEffect, useState } from 'react'
import type { SubscriptionCheck } from '@/lib/subscription/check-subscription'

interface UseSubscriptionReturn {
  subscription: SubscriptionCheck | null
  isLoading: boolean
  hasAccess: boolean
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionCheck | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch('/api/user/subscription')

        if (!response.ok) {
          setSubscription({ hasAccess: false, status: 'none', plan: null })
          return
        }

        const data = await response.json()
        setSubscription(data)

      } catch {
        setSubscription({ hasAccess: false, status: 'none', plan: null })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  return {
    subscription,
    isLoading,
    hasAccess: subscription?.hasAccess ?? false,
  }
}
