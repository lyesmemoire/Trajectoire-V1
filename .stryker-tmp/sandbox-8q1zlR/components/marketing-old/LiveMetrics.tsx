// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Star, Zap } from "lucide-react";
import MetricCard from "./MetricCard";
import { Metrics } from "@/lib/metrics/types";

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger les métriques
  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics");
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Polling toutes les 30 secondes (seulement si la page est visible)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchMetrics();
      }
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Skeleton loading
  if (isLoading || !metrics) {
    return (
      <section className="border-y border-red-900/30 bg-black/50 py-12">
        <div className="container mx-auto px-4">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-red-400">
            En Temps Réel
          </p>
          <div className="grid gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 animate-pulse rounded-full bg-red-900/30" />
                <div className="h-8 w-20 animate-pulse rounded bg-red-900/30" />
                <div className="h-4 w-32 animate-pulse rounded bg-red-900/30" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-red-900/30 bg-black/50 py-12">
      <div className="container mx-auto px-4">
        {/* Badge "Live" */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-red-400">
            Métriques en Direct
          </p>
        </div>

        {/* Grille de métriques */}
        <div className="grid gap-8 md:grid-cols-4">
          <MetricCard
            icon={Users}
            label="CV optimisés cette semaine"
            value={metrics.cvOptimizedThisWeek}
            subtitle={`${metrics.totalCVOptimized.toLocaleString()} au total`}
          />

          <MetricCard
            icon={Zap}
            label="Simulations d'entretien"
            value={metrics.interviewsThisWeek}
            subtitle={`${metrics.totalInterviewsSim.toLocaleString()} au total`}
          />

          <MetricCard
            icon={Star}
            label="Note moyenne utilisateurs"
            value={`${metrics.averageRating}/5`}
            trend={{
              value: 12,
              label: "vs mois dernier",
              positive: true,
            }}
          />

          <MetricCard
            icon={TrendingUp}
            label="De réponses positives"
            value={`+${metrics.successRateImprovement}%`}
            subtitle="En moyenne après optimisation"
          />
        </div>

        {/* Timestamp de dernière mise à jour */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Dernière mise à jour :{" "}
          {new Date(metrics.lastUpdated).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </section>
  );
}
