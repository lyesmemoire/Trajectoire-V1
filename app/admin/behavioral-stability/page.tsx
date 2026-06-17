import { getAuthenticatedUser } from "@/lib/auth";
import { computeBehavioralStability } from "@/lib/analytics/behavioral-stability";
import {
  Brain,
  ZapOff,
  Activity,
  Clock,
  ShieldAlert,
  TrendingUp,
  Play,
  Users,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";

export default async function BehavioralStabilityPage() {
  const user = await getAuthenticatedUser();
  // Role check omitted for dev preview

  const stability = await computeBehavioralStability();

  return (
    <div className="space-y-12 pb-20 font-sans">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Behavioral <span className="text-blue-600">Stability</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Dashboard de Santé Psychologique du Produit
          </p>
        </div>
      </div>

      {/* Primary Stability Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Second Session Rate"
          value={`${Math.round(stability.secondSessionRate)}%`}
          trend="Cible 30%"
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          title="Rage Quit Rate"
          value={`${Math.round(stability.rageQuitRate)}%`}
          trend="Cible <15%"
          icon={<ZapOff className="w-5 h-5" />}
        />
        <KPICard
          title="Freeze Rate"
          value={`${Math.round(stability.freezeEventRate)}%`}
          trend="Cible <20%"
          icon={<Clock className="w-5 h-5" />}
        />
        <KPICard
          title="Replay Completion"
          value={`${stability.replayCompletionRate}%`}
          trend="Cible >60%"
          icon={<Play className="w-5 h-5" />}
        />
        <KPICard
          title="Voice → Text"
          value={`${stability.voiceToTextFallbackRate}%`}
          trend="Cible <25%"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Drill Detection & Analysis */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-500" /> Analyse des
              Dérives Comportementales (Drifts)
            </h3>

            <div className="space-y-6">
              {[
                {
                  name: "Victor Sadique Drift",
                  status: "STABLE",
                  kpi: "Silence > 8s + Quit < 2m",
                  value: "4%",
                  color: "text-emerald-500",
                },
                {
                  name: "Therapy Drift",
                  status: "ALERTE",
                  kpi: "Baisse crédibilité rapportée",
                  value: "18%",
                  color: "text-amber-500",
                },
                {
                  name: "Replay Fatigue Drift",
                  status: "DANGER",
                  kpi: "Scroll < 35%",
                  value: "42%",
                  color: "text-rose-500",
                },
                {
                  name: "Cognitive Overload",
                  status: "STABLE",
                  kpi: "Freeze onboarding",
                  value: "12%",
                  color: "text-emerald-500",
                },
              ].map((drift, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all"
                >
                  <div className="space-y-1">
                    <p className="font-black text-slate-900">{drift.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {drift.kpi}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${drift.color}`}>
                      {drift.status}
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {drift.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Silence Breakdown */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Brain className="w-32 h-32" />
            </div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Répartition des Silences
            </h4>

            <div className="space-y-6 relative z-10">
              {[
                {
                  label: "1-3s (Réflexion)",
                  value: 45,
                  color: "bg-emerald-500",
                },
                { label: "4-7s (Tension)", value: 30, color: "bg-blue-500" },
                {
                  label: "8-15s (Surcharge)",
                  value: 15,
                  color: "bg-amber-500",
                },
                { label: ">15s (Rupture)", value: 10, color: "bg-rose-500" },
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{s.label}</span>
                    <span>{s.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color}`}
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post-10 Sessions Verdict */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Bilan Cohorte 01 (n=10)
            </h3>
            <p className="text-sm text-slate-400 font-medium italic">
              Analyse des patterns récurrents après 10 sessions réelles.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Top Frictions Validées (3+ users)
            </h4>
            <ul className="space-y-2">
              <li className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold border border-rose-100 flex gap-3">
                <ZapOff className="w-4 h-4 flex-shrink-0" /> Replay trop long :
                Abandon à la 2ème carte.
              </li>
              <li className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold border border-rose-100 flex gap-3">
                <ZapOff className="w-4 h-4 flex-shrink-0" /> Hésitation Micro :
                Peur du direct au démarrage.
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Décisions Produit Immédiates
            </h4>
            <ul className="space-y-2">
              <li className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 flex gap-3">
                <Activity className="w-4 h-4 flex-shrink-0" /> Réduire le replay
                à 2 cartes max.
              </li>
              <li className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 flex gap-3">
                <Activity className="w-4 h-4 flex-shrink-0" /> Ajouter un test
                micro "silencieux" avant Victor.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
