"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  Activity,
  Zap,
  Lock,
  EyeOff,
} from "lucide-react";

export function ThreatIntelligenceDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/threat-intel")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats)
    return <div className="animate-pulse h-64 bg-white/5 rounded-3xl" />;

  return (
    <div className="space-y-10 font-sans text-slate-900">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tight">
          Threat <span className="text-blue-600">Intelligence</span>
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <Shield className="w-3 h-3" /> Shield Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityKPICard
          title="Tentatives Scraper"
          value={stats.scrapingAttempts24h}
          icon={<EyeOff className="w-5 h-5" />}
          color="blue"
        />
        <SecurityKPICard
          title="Headless Bloqués"
          value={stats.headlessBlocked}
          icon={<Lock className="w-5 h-5" />}
          color="purple"
        />
        <SecurityKPICard
          title="IP Blacklistées"
          value={stats.ipsBlacklisted}
          icon={<ShieldAlert className="w-5 h-5" />}
          color="rose"
        />
        <SecurityKPICard
          title="Entropie Moyenne"
          value={`${stats.averageEntropyScore}%`}
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Analyse
            Comportementale des Requêtes
          </h3>

          <div className="space-y-6 font-mono text-xs">
            {[
              {
                ip: "192.168.1.45",
                action: "BLOCK",
                reason: "HEADLESS_CHROME_DETECTED",
                route: "/api/ats/analyze",
              },
              {
                ip: "45.12.89.21",
                action: "TARPIT",
                reason: "LOW_INTERACTION_ENTROPY",
                route: "/dashboard",
              },
              {
                ip: "102.34.11.9",
                action: "WHITELIST",
                reason: "HUMAN_SIGNATURE_CONFIRMED",
                route: "/interview",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="flex gap-6">
                  <span className="text-slate-400">{log.ip}</span>
                  <span
                    className={
                      log.action === "BLOCK"
                        ? "text-rose-500 font-bold"
                        : log.action === "WHITELIST"
                          ? "text-emerald-500"
                          : "text-amber-500"
                    }
                  >
                    [{log.action}]
                  </span>
                  <span className="text-slate-600 italic">{log.reason}</span>
                </div>
                <span className="text-slate-400 truncate max-w-[100px]">
                  {log.route}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32" />
            </div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Surface Défensive
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-bold text-slate-400 italic">
                  Route Virtualization
                </span>
                <span className="text-xs font-black text-emerald-400">ON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold text-slate-400 italic">
                  Prompt Fragmentation
                </span>
                <span className="text-xs font-black text-emerald-400">ON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-bold text-slate-400 italic">
                  Interaction Entropy
                </span>
                <span className="text-xs font-black text-emerald-400">ON</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityKPICard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
        {title}
      </p>
    </div>
  );
}
