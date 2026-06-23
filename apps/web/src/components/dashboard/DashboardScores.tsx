"use client";

import { FileText, Target, Mic } from "lucide-react";
import { ScoreCard } from "./ScoreCard";

interface DashboardScoresProps {
  scoreCV:    number | null;
  scoreATS:   number | null;
  scoreVocal: number | null;
}

export function DashboardScores({
  scoreCV,
  scoreATS,
  scoreVocal,
}: DashboardScoresProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <ScoreCard
        label="CV"
        score={scoreCV}
        icon={FileText}
        color="bg-indigo-500"
        href="/dashboard/cv"
        ctaLabel={scoreCV ? "Réanalyser" : "Lancer l'audit"}
        delay={0.1}
      />
      <ScoreCard
        label="ATS"
        score={scoreATS}
        icon={Target}
        color="bg-violet-500"
        href="/dashboard/ats"
        ctaLabel={scoreATS ? "Voir le scan" : "Scanner une offre"}
        delay={0.2}
      />
      <ScoreCard
        label="Vocal"
        score={scoreVocal}
        icon={Mic}
        color="bg-emerald-500"
        href="/dashboard/interview/session"
        ctaLabel={scoreVocal ? "Reprendre" : "Démarrer"}
        delay={0.3}
      />
    </div>
  );
}