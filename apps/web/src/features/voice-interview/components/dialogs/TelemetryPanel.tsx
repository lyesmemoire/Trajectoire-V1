import React, { memo, useState } from "react";
import { useTelemetry } from "../../hooks";
import { Activity } from "lucide-react";

export const TelemetryPanel = memo(function TelemetryPanel() {
  const telemetry = useTelemetry();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-surface border border-border-default rounded-full shadow-sm text-text-muted hover:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Afficher la télémétrie"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-surface border border-border-default shadow-floating rounded-2xl p-4 text-xs font-mono text-text-secondary z-50">
      <div className="flex justify-between items-center mb-4 border-b border-border-subtle pb-2">
        <span className="font-semibold text-text-primary">Télémétrie</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-text-muted hover:text-text-secondary"
          aria-label="Fermer la télémétrie"
        >
          Fermer
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Latence WS:</span>
          <span>{telemetry.wsLatencyMs ?? "-"} ms</span>
        </div>
        <div className="flex justify-between">
          <span>Latence STT:</span>
          <span>{telemetry.sttLatencyMs ?? "-"} ms</span>
        </div>
        <div className="flex justify-between">
          <span>Latence LLM:</span>
          <span>{telemetry.llmLatencyMs ?? "-"} ms</span>
        </div>
        <div className="flex justify-between">
          <span>Latence TTS:</span>
          <span>{telemetry.ttsLatencyMs ?? "-"} ms</span>
        </div>
        <div className="flex justify-between font-medium text-text-primary pt-2 border-t border-border-subtle">
          <span>Round-Trip Total:</span>
          <span>{telemetry.roundTripMs ?? "-"} ms</span>
        </div>
        <div className="mt-4 pt-2 border-t border-border-subtle text-[10px] text-text-muted truncate">
          Trace: {telemetry.traceId || "N/A"}
        </div>
      </div>
    </div>
  );
});
