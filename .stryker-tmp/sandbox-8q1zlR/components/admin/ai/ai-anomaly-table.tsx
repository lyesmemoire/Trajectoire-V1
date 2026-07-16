// @ts-nocheck
"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface Anomaly {
  type: string;
  severity: string;
  message: string;
}

export function AIAnomalyTable({ anomalies }: { anomalies: Anomaly[] }) {
  if (anomalies.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-600">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-sm font-black uppercase tracking-widest">
            No Intelligence Anomalies Detected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" /> System Anomalies
      </h3>
      <div className="space-y-3">
        {anomalies.map((a, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border flex gap-4 items-center ${
              a.severity === "high"
                ? "bg-rose-50 border-rose-100 text-rose-700"
                : "bg-amber-50 border-amber-100 text-amber-700"
            }`}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
