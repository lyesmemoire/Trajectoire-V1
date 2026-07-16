// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface CreditBadgeProps {
  userId: string;
  className?: string;
}

export function CreditBadge({ userId, className = "" }: CreditBadgeProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lecture initiale
    supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single()
      .then(({ data }: any) => {
        const profile = data as any;
        setCredits(profile?.credits ?? 0);
        setLoading(false);
      });

    // Abonnement temps réel aux changements de crédits
    const channel = supabase
      .channel(`profile-credits-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload: any) => {
          const newCredits = (payload.new as { credits: number }).credits;
          setCredits(newCredits);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div
        className={`h-6 w-16 animate-pulse rounded-full bg-gray-200 ${className}`}
      />
    );
  }

  const isLow = (credits ?? 0) <= 1;
  const isEmpty = (credits ?? 0) === 0;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium
        ${
          isEmpty
            ? "bg-red-100 text-red-700 ring-1 ring-red-200"
            : isLow
              ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200"
              : "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
        }
        ${className}
      `}
    >
      <span className="text-base leading-none">
        {isEmpty ? "⚠️" : isLow ? "🟡" : "✨"}
      </span>
      <span>
        {credits} crédit{credits !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
