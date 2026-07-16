// @ts-nocheck
import { computeSentinelMetrics } from "@/lib/analytics/beta-sentinel";
import {
  Clock,
  Zap,
  RotateCcw,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";

export default async function BetaSentinelPage() {
  const metrics = await computeSentinelMetrics();

  return (
    <div className="space-y-12 pb-20 font-sans text-slate-900">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Beta <span className="text-blue-600">Sentinel</span>
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
            Observation Comportementale Contrôlée (n=10)
          </p>
        </div>
        <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 animate-pulse">
          Live Observation
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Median Recovery Time"
          value={metrics.medianRecoveryTime}
          trend="Temps Digestion"
          icon={<Clock className="w-5 h-5" />}
        />
        <KPICard
          title="Voluntary Retry"
          value={metrics.retryVelocity}
          trend="Cycle Habitude"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <KPICard
          title="Organic Revisit"
          value={`${metrics.organicRevisitRate}%`}
          trend="Replay Value"
          icon={<Zap className="w-5 h-5 text-amber-500" />}
        />
        <KPICard
          title="Doubt Recall Rate"
          value={`${metrics.victorDoubtRecall}%`}
          trend="Impact Victor"
          icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-500" /> Flux de Densité
            Comportementale
          </h3>

          <div className="space-y-6">
            {[
              {
                profile: "Senior Dev",
                behavior: "A relu son point faible 4 fois.",
                signal: "WOW_IMPACT",
                color: "text-blue-600",
              },
              {
                profile: "Product Manager",
                behavior: "A quitté après 2 interruptions.",
                signal: "FATIGUE_TOXIQUE",
                color: "text-rose-500",
              },
              {
                profile: "Consultant",
                behavior: "Relance session 2 immédiatement.",
                signal: "HABIT_LOOP",
                color: "text-emerald-500",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="space-y-1">
                  <p className="font-black text-slate-900 text-sm">
                    {s.profile}
                  </p>
                  <p className="text-xs text-slate-500 font-medium italic">
                    "{s.behavior}"
                  </p>
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${s.color}`}
                >
                  [{s.signal}]
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6">
          <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
            Alerte Bêta
          </h4>
          <p className="text-lg font-bold leading-relaxed italic opacity-90">
            "Le segment 'Senior Dev' montre la plus haute Voluntary Retry
            Velocity. Ils utilisent Victor comme un sparing-partner."
          </p>
          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] font-black text-slate-500 uppercase">
              Prochaine Décision
            </p>
            <p className="text-sm font-bold text-white mt-2">
              Désactiver le Replay détaillé pour les sessions de moins de 5 min
              ?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
