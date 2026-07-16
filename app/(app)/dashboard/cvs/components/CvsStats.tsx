"use client";

import { DashboardCard, StaggerChildren } from "@/components/design-system";
import type { DashboardCvsData } from "../types";

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return <DashboardCard title={label} value={value} />;
}

export function CvsStats({ kpis }: { kpis: DashboardCvsData["kpis"] }) {
  return (
    <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard
        label="Analyses ATS"
        value={kpis.totalAnalyses}
      />
      <KpiCard
        label="Score moyen"
        value={kpis.averageScore ? `${kpis.averageScore}%` : "—"}
      />
      <KpiCard
        label="Dernière analyse"
        value={kpis.lastAnalysisDate ?? "—"}
      />
    </StaggerChildren>
  );
}
