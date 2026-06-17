import { getAuthenticatedUser } from "@/lib/auth";
import {
  History,
  TrendingUp,
  Users,
  Play,
  RotateCcw,
  Zap,
  Heart,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";

export default async function ReplayInsightsPage() {
  const user = await getAuthenticatedUser();
  // Role check omitted for brevity

  // Mocked Metrics for Demo
  const metrics = {
    returnRate: 32, // %
    completionRate: 68, // %
    avgTimeSpent: "4m 12s",
    nextSessionConversion: 41, // %
    topRewatchedMoment: "Première Interruption (Victor)",
    emotionalAnchorRate: 74, // %
  };

  return (
    <div className="space-y-12 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Replay <span className="text-blue-600">Insights</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Analyse de l'engagement émotionnel post-session
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Replay Return Rate"
          value={`${metrics.returnRate}%`}
          trend="+5%"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <KPICard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          trend="+8%"
          icon={<Play className="w-5 h-5" />}
        />
        <KPICard
          title="Conv. Next Session"
          value={`${metrics.nextSessionConversion}%`}
          trend="+12%"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KPICard
          title="Emotional Anchor"
          value={`${metrics.emotionalAnchorRate}%`}
          trend="Stable"
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Behavioral Flow */}
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <History className="w-6 h-6 text-blue-500" /> Moments les plus
            revisités
          </h3>
          <div className="space-y-6">
            {[
              {
                label: "Première Interruption Tactique",
                count: 412,
                trend: "+14%",
              },
              {
                label: "Point de Bascule (Baisse de Clarté)",
                count: 284,
                trend: "+5%",
              },
              { label: "Moment de Recovery (Q4)", count: 192, trend: "+22%" },
            ].map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="space-y-1">
                  <p className="font-black text-slate-900 text-sm">{m.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {m.count} visionnages
                  </p>
                </div>
                <span className="text-xs font-black text-emerald-500">
                  {m.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Analysis */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Diagnostic Rétention
            </h4>
            <p className="text-lg font-bold leading-relaxed">
              "Le taux de retour de 32% indique que le nouveau format narratif
              (3 moments clés) a doublé l'intérêt par rapport au format
              analytique."
            </p>
            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                Prochaine Hypothèse
              </p>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-bold text-slate-300 italic">
                  "Ajouter un comparatif 'Aujourd'hui vs Moyenne' sur la 1ère
                  carte augmentera le partage social."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900">Conversion Bêta</h4>
            <p className="text-xs text-slate-500 font-medium">
              8 abonnés potentiels ont revisité leur replay plus de 3 fois en
              24h.
            </p>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
              Voir les profils
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
