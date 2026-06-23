
import { computeFeatureValueScores } from "@/lib/analytics/product-truth";
import {
  RotateCcw,
  Heart,
  TrendingDown,
  ArrowUpRight,
  Search,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";

type FeatureScore = {
  feature: string;
  totalCost: number;
  usageCount: number;
  retentionImpact: number;
  valueScore: number;
};

export default async function ProductTruthPage() {
  let scores: FeatureScore[] = [];
  try {
    scores = await computeFeatureValueScores();
  } catch (e) {
    console.error("Failed to compute feature value scores", e);
    // fallback to empty scores
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Product <span className="text-blue-600">Truth</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Analyse de valeur, rétention et rentabilité réelle
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-2xl font-black">
            Exporter Cohortes
          </Button>
          <Button className="bg-blue-600 rounded-2xl font-black">
            Lancer Interview Utilisateur
          </Button>
        </div>
      </div>

      {/* High-Level Correlation Matrix */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-blue-600">
            <RotateCcw className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Global Retry Rate
            </span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900">38%</p>
            <p className="text-xs font-bold text-slate-400 mt-2">
              Candidats qui refont au moins une session
            </p>
          </div>
          <div className="pt-4 flex items-center gap-2 text-emerald-500 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" /> +12% vs semaine dernière
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-6">
          <div className="flex items-center gap-3 text-purple-400">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Wow Moment Hit Rate
            </span>
          </div>
          <div>
            <p className="text-5xl font-black">64%</p>
            <p className="text-xs font-bold text-slate-500 mt-2">
              Délivrance d'un insight "choc" par session
            </p>
          </div>
          <div className="pt-4 flex items-center gap-2 text-blue-400 font-bold text-sm">
            Focus : Replay Timeline v2
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-amber-500">
            <TrendingDown className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">
              Avg Churn Probability
            </span>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900">12%</p>
            <p className="text-xs font-bold text-slate-400 mt-2">
              Prédiction d'abandon après 1ère session
            </p>
          </div>
          <div className="pt-4 flex items-center gap-2 text-rose-500 font-bold text-sm">
            Alerte : Victor trop agressif ?
          </div>
        </div>
      </div>

      {/* Feature ROI Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">
            Feature ROI Matrix (Cost vs. Retention)
          </h3>
          <span className="text-[10px] font-bold text-slate-400">
            Trie par Value Score
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Feature
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Cost (Avg)
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Usage
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Retention Impact
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Value Score
                </th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scores.map((s) => (
                <tr
                  key={s.feature}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <span className="font-black text-slate-900 capitalize">
                      {s.feature}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-bold text-slate-600">
                      ${(s.totalCost / (s.usageCount || 1)).toFixed(3)}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-bold text-slate-600">
                      {s.usageCount}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">
                        {s.retentionImpact}%
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${s.retentionImpact}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span
                      className={`text-sm font-black ${s.valueScore > 1 ? "text-emerald-600" : "text-amber-600"}`}
                    >
                      {s.valueScore}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    {s.valueScore > 1.5 ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">
                        AMPLIFIER
                      </Badge>
                    ) : s.valueScore < 0.5 ? (
                      <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black">
                        OPTIMISER
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-50 text-slate-500 border-slate-200 font-black">
                        MAINTENIR
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Voice / Qualitative Feed */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-500" /> Qualitative
            Feedback
          </h3>
          <div className="space-y-6">
            {[
              {
                user: "Marie L.",
                text: "Victor m'a coupé alors que je parlais de mon stage, c'était frustrant mais nécessaire.",
                sentiment: "positive",
              },
              {
                user: "Thomas D.",
                text: "Je ne comprends pas bien l'archétype Strategic Leader, je pensais être technique.",
                sentiment: "neutral",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-100"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-black text-slate-900 text-sm">
                    {f.user}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[8px] font-black uppercase tracking-widest"
                  >
                    Feedback Post-Session
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                  "{f.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Search className="w-32 h-32" />
          </div>
          <h3 className="text-xl font-black">Hypothèse de la Semaine</h3>
          <p className="text-slate-400 font-medium leading-relaxed">
            "Réduire l'agressivité de Victor sur la première question augmente
            le taux de complétion de 15%."
          </p>
          <div className="pt-6 border-t border-white/5 space-y-4">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Test A/B en cours
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-300">
                Victor V2.1 (Soft)
              </span>
              <span className="text-sm font-black text-emerald-400">
                Winning +8%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
