"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Star, Zap } from "lucide-react";

export default function SocialProof() {
  const [stats, setStats] = useState({
    cvOptimized: 2847,
    interviews: 1203,
    avgRating: 4.8,
    successRate: 127,
  });

  // Simulation d'incrémentation en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        cvOptimized: prev.cvOptimized + Math.floor(Math.random() * 3),
        interviews: prev.interviews + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-red-900/30 bg-black/50 py-12">
      <div className="container mx-auto px-4">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-red-400">
          En Temps Réel
        </p>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Stat 1 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-red-900/30 p-3 ring-1 ring-red-800/50">
              <Users className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.cvOptimized.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">CV optimisés cette semaine</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-red-900/30 p-3 ring-1 ring-red-800/50">
              <Zap className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.interviews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">
              Simulations d'entretien réalisées
            </p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-red-900/30 p-3 ring-1 ring-red-800/50">
              <Star className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.avgRating}/5</p>
            <p className="text-sm text-gray-400">Note moyenne utilisateurs</p>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-red-900/30 p-3 ring-1 ring-red-800/50">
              <TrendingUp className="h-6 w-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">
              +{stats.successRate}%
            </p>
            <p className="text-sm text-gray-400">
              De réponses positives en moyenne
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
