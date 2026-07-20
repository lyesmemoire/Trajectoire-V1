// apps/web/src/hooks/usePremium.ts
//
// Hook côté client pour vérifier le statut Premium
// Appelle l'API route /api/user/subscription pour obtenir le statut

"use client";

import { useEffect, useState } from "react";

export interface PremiumStatus {
  isPremium: boolean;
  plan: string | null;
  status: string;
  loading: boolean;
}

export function usePremium(): PremiumStatus {
  const [status, setStatus] = useState<PremiumStatus>({
    isPremium: false,
    plan: null,
    status: "none",
    loading: true,
  });

  useEffect(() => {
    async function checkPremium() {
      try {
        const response = await fetch("/api/user/subscription");
        if (response.ok) {
          const data = await response.json();
          setStatus({
            isPremium: data.hasAccess || data.plan !== "FREE",
            plan: data.plan,
            status: data.status,
            loading: false,
          });
        } else {
          setStatus({
            isPremium: false,
            plan: "FREE",
            status: "none",
            loading: false,
          });
        }
      } catch {
        setStatus({
          isPremium: false,
          plan: "FREE",
          status: "none",
          loading: false,
        });
      }
    }

    checkPremium();
  }, []);

  return status;
}
