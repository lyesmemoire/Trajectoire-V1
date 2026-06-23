import { getAuthenticatedUser } from "@/lib/auth";
import { KPICard } from "@/components/admin/kpi-card";
import { BehavioralMutationsFeed } from "@/components/admin/behavioral-mutations-feed";
import {
  Zap,
  TrendingUp,
  RotateCcw,
  Brain,
  ShieldCheck,
  Lightbulb,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function BehaviorEvolutionPage() {
  const user = await getAuthenticatedUser();
  // Role check omitted for preview

  // Mocking narrative mutations for the feed
  const mutations = [
    {
      id: "1",
      userRole: "Senior Product Manager",
      sessionNumber: 5,
      mutation: "L'affirmation stratégique remplace la justification.",
      turningPoint:
        "A maintenu son calme et a recentré le débat sur le ROI après une interruption sèche de Victor.",
      trend: "Taux de 'Self-Correction' en hausse de 40%.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      userRole: "Lead Developer",
      sessionNumber: 3,
      mutation: "Capacité de synthèse chirurgicale détectée.",
      turningPoint:
        "Victor a validé la réponse technique dès la 1ère minute (Zéro doute émis).",
      trend: "Réduction du débit vocal (145 -> 125 WPM).",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      userRole: "Junior Marketing",
      sessionNumber: 2,
      mutation: "Passage du profil 'Anxieux' à 'Adaptable'.",
      turningPoint:
        "Clara n'a pas eu besoin d'intervenir sur les questions de mise en situation.",
      trend: "Score de confiance restauré (+22pts).",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 font-sans antialiased text-slate-900">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Behavior{" "}
            <span className="text-blue-600">Evolution Observatory</span>
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
            Surveillance des trajectoires de mutation humaine
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Brain className="w-3 h-3 text-blue-400" /> Mode Observateur Actif
          </div>
        </div>
      </div>

      {/* STRATEGIC KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Voluntary Retry Velocity"
          value="14m"
          trend="Idéal < 20m"
          icon={<Target className="w-5 h-5" />}
        />
        <KPICard
          title="Replay Revisit Rate"
          value="38%"
          trend="+12% vs S-1"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <KPICard
          title="Recovery Improvement"
          value="-4.2s"
          trend="Plus rapide"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: MUTATION FEED */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" /> Flux des Mutations
              Narratives
            </h3>
            <span className="text-[8px] font-bold text-slate-400">
              Dernière mise à jour : à l'instant
            </span>
          </div>
          <BehavioralMutationsFeed mutations={mutations as any} />
        </div>

        {/* RIGHT: FOUNDER INSIGHT PANEL */}
        <div className="lg:col-span-4 sticky top-24 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Lightbulb className="w-32 h-32 text-blue-400" />
            </div>

            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Founder Insight
            </h4>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <p className="text-sm font-black italic text-white leading-relaxed">
                  "Les utilisateurs Senior commencent à réduire leurs réponses
                  plus rapidement après une interruption de Victor."
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Tendance de la semaine
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <p className="text-sm font-black italic text-white leading-relaxed">
                  "Le nouveau Replay narratif a augmenté le Replay Revisit Rate
                  de 15% chez les profils Juniors."
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Impact Simplification
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-center text-blue-400 hover:text-white hover:bg-white/5 font-black p-0 h-auto"
            >
              Voir toutes les observations →
            </Button>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Contrôle Tactique
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-12 rounded-xl font-black text-xs"
              >
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />{" "}
                Calibrer Victor (Elite Mode)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-12 rounded-xl font-black text-xs"
              >
                <TrendingUp className="w-4 h-4 mr-2 text-blue-500" /> Ajuster
                Thresholds Recovery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
