import React, { memo } from "react";
import { useConnection } from "../../hooks";

export const LatencyIndicator = memo(function LatencyIndicator() {
  const { latencyMs, status } = useConnection();

  if (status !== "connected" || latencyMs === null) {
    return null;
  }

  // Visual dot for latency quality
  const isGood = latencyMs < 200;
  const isFair = latencyMs >= 200 && latencyMs < 500;
  
  const colorClass = isGood
    ? "bg-success"
    : isFair
    ? "bg-warning"
    : "bg-danger";

  return (
    <div 
      className="flex items-center gap-2 text-sm text-text-secondary bg-surface border border-border-default px-3 py-1 rounded-full shadow-sm"
      aria-label={`Latence de ${latencyMs} millisecondes`}
    >
      <div className={`w-2 h-2 rounded-full ${colorClass}`} aria-hidden="true" />
      <span>{latencyMs} ms</span>
    </div>
  );
});
