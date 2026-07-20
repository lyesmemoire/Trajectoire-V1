"use client";

import { AlertCircle, User } from "lucide-react";

interface Risk {
  userId: string;
  email: string;
  segment: string;
  driver: string;
}

export function ChurnRiskFeed({ risks }: { risks: Risk[] }) {
  const getRiskStyles = (segment: string) => {
    switch (segment) {
      case "LOW":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "MEDIUM":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className="bg-[#0B1023] rounded-[2.5rem] border border-white/[0.08] p-8 space-y-8 shadow-2xl">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-rose-500" /> Live Churn Risk Feed
      </h3>

      <div className="space-y-4">
        {risks.length > 0 ? (
          risks.map((risk) => (
            <div
              key={risk.userId}
              className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">
                    {risk.email}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {risk.driver}
                  </p>
                </div>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${getRiskStyles(risk.segment)}`}
              >
                {risk.segment}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500 text-xs py-10 font-bold italic">
            No active risks detected.
          </p>
        )}
      </div>
    </div>
  );
}
