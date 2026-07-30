export interface DriftCluster {
  type: string;
  severity: number;
  ticks: number[];
  count: number;
}

export interface DistanceResult {
  distance: number;
  cluster: DriftCluster[];
  total: number;
  breakdown: Record<string, number>;
}

export function computeDistance(clusters: DriftCluster[]): DistanceResult {
  const breakdown: Record<string, number> = {};
  let total = 0;
  
  for (const cluster of clusters) {
    breakdown[cluster.type] = cluster.severity;
    total += cluster.severity;
  }
  
  return {
    distance: total,
    cluster: clusters,
    total,
    breakdown,
  };
}
