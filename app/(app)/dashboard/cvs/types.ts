export type DashboardCv = {
  id: string;
  title: string;
  createdAt: string;
  score: number | null;
  previousScore: number | null;
  totalAnalyses: number;
  isLatest: boolean;
  isBest: boolean;
  sparklineData: { score: number }[];
};

export type DashboardCvsData = {
  cvs: DashboardCv[];
  kpis: {
    totalAnalyses: number;
    averageScore: number | null;
    lastAnalysisDate: string | null;
  };
  billing: {
    plan: string;
    hasUsedFreeTrial: boolean;
  };
};
