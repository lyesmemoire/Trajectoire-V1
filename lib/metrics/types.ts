export interface Metrics {
  // Métriques d'usage
  totalCVOptimized: number;
  totalInterviewsSim: number;
  cvOptimizedThisWeek: number;
  interviewsThisWeek: number;

  // Métriques de qualité
  averageRating: number;
  averageATSScore: number;

  // Métriques de succès
  successRateImprovement: number; // En pourcentage
  averageResponseRate: number;

  // Meta
  lastUpdated: string; // ISO timestamp
}

export interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
}
