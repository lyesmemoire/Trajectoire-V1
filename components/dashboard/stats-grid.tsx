"use client";

import * as React from "react";
import { m } from "framer-motion";
import { StatCard } from "@/components/design-system";
import { TrendingUp, Users, Target, CreditCard } from "lucide-react";

interface StatsGridProps {
  stats: {
    interviewsCompleted: number;
    interviewsThisMonth: number;
    credits: number;
    careerScore: number | null;
    successRate: number | null;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      title: "Entretiens complétés",
      value: stats.interviewsCompleted.toString(),
      change: { value: stats.interviewsThisMonth, period: "Ce mois" },
      icon: Target,
      description: "Sessions terminées",
    },
    {
      title: "Crédits disponibles",
      value: stats.credits.toString(),
      change: { value: 0, period: "Solde actuel" },
      icon: CreditCard,
      description: "Crédits restants",
    },
    {
      title: "Score de carrière",
      value: stats.careerScore ? `${stats.careerScore}/100` : "N/A",
      change: { value: 0, period: "Évaluation" },
      icon: TrendingUp,
      description: "Préparation professionnelle",
    },
    {
      title: "Taux de réussite",
      value: stats.successRate ? `${stats.successRate}%` : "N/A",
      change: { value: 0, period: "Moyenne" },
      icon: Users,
      description: "Candidats ayant obtenu leur offre",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <m.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        </m.div>
      ))}
    </div>
  );
}
