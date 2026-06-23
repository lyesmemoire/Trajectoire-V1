import {
  Clock,
  Zap,
  TrendingDown,
  BarChart3,
  Users,
  Trophy,
  Target,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";

export default async function TimeToWowPage() {
  // Fetch real data from our internal API (simplified for preview)
  const data = {
    medianTimeToWow: 84,
    dropOffRate: 22,
    returnRate: 38,
    bestTrigger: "Doubt Reveal",
  };

  return (
    <div className="space-y-12 pb-20 font-sans text-slate-900">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Time To <span className="text-blue-600">Wow</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Analyse de la vitesse de conversion émotionnelle
          </p>
        </div>
      </div>

      {/* 5 CARDS EXACTES DU CAHIER DES CHARGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Median Time To Wow"
          value={`${data.medianTimeToWow}s`}
          trend="Cible <90s"
          icon={<Clock className="w-5 h-5" />}
        />
        <KPICard
          title="First Drop-Off Point"
          value="Offer Paste"
          trend="Critique"
          icon={<TrendingDown className="w-5 h-5 text-rose-500" />}
        />
        <KPICard
          title="Top Wow Trigger"
          value={data.bestTrigger}
          trend="Impact 42%"
          icon={<Zap className="w-5 h-5 text-amber-500" />}
        />
        <KPICard
          title="Return Rate Post-Wow"
          value={`${data.returnRate}%`}
          trend="+5%"
          icon={<Users className="w-5 h-5" />}
        />
        <KPICard
          title="Best Segment"
          value="Junior"
          trend="62s"
          icon={<Trophy className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Funnel de Révélation */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" /> Funnel de Révélation
          </h3>

          <div className="space-y-6">
            {[
              { label: "Landing View", value: 100, color: "bg-blue-500" },
              { label: "CV Upload", value: 85, color: "bg-blue-400" },
              { label: "Offer Paste", value: 64, color: "bg-amber-400" },
              { label: "Doubt Reveal (Wow)", value: 52, color: "bg-[#7C3AED]" },
              { label: "Signup", value: 24, color: "bg-emerald-500" },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>{s.label}</span>
                  <span>{s.value}%</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color}`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wow Source Attribution */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-amber-500" />
            </div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">
              Wow Source Attribution
            </h4>
            <div className="space-y-4 relative z-10">
              {[
                { label: "Doubt Reveal", impact: 42 },
                { label: "Victor Tone", impact: 28 },
                { label: "Replay Story", impact: 15 },
                { label: "CV Correction", impact: 10 },
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5"
                >
                  <span className="text-sm font-bold text-slate-300">
                    {t.label}
                  </span>
                  <span className="text-lg font-black text-white">
                    {t.impact}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" /> Chute Critique
            </h4>
            <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
              "22% des utilisateurs abandonnent à l'étape 'Offer Paste'.
              L'effort mental de trouver/copier l'offre est le frein majeur
              avant le Wow."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
