// @ts-nocheck
"use client";

import { EyeOff } from "lucide-react";

interface Props {
  data: {
    avgReplayReadTime: number;
    abandonmentRate: number;
  };
}

export function ReplayFatiguePanel({ data }: Props) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 text-amber-500">
        <EyeOff className="w-5 h-5" />
        <h3 className="text-sm font-black uppercase tracking-widest">
          Replay Fatigue Monitor
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-2xl font-black text-slate-900">
            {data.avgReplayReadTime}s
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Avg Read Time
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-black text-rose-500">
            {data.abandonmentRate}%
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Abandonment Rate
          </p>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-50">
        <p className="text-[10px] font-medium text-slate-500 italic">
          High abandonment indicates cognitive overload. Recommendation: Shorten
          Replay content.
        </p>
      </div>
    </div>
  );
}
