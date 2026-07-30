"use client";

import { useState, useEffect } from "react";

export type BillingState = {
  credits: number;
  plan: string;
  loading: boolean;
};

export function useBillingState(userId: string): BillingState {
  const [state, setState] = useState<BillingState>({
    credits: 0,
    plan: "free",
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchState = async () => {
      try {
        const res = await fetch("/api/billing/state");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setState({
              credits: data.balance ?? 0,
              plan: data.plan ?? "free",
              loading: false,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch billing state", error);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  return state;
}
