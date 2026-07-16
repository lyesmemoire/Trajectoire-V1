// @ts-nocheck
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface Driver {
  driver: string;
  impact: number;
}

export function BehavioralDriversTable({ drivers }: { drivers: Driver[] }) {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
        Behavioral Drivers Analysis
      </h3>
      <div className="space-y-4">
        {drivers.map((d, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <span className="font-black text-slate-900">{d.driver}</span>
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-black ${d.impact > 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {d.impact > 0 ? `+${d.impact}%` : `${d.impact}%`}
              </span>
              {d.impact > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
