import { getAuthenticatedUser } from "@/lib/auth";
import {
  Cpu,
  Zap,
  CreditCard,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/design-system";

export default async function AdminAIPage() {
  const user = await getAuthenticatedUser();

  const models = [
    {
      name: "Mistral Small",
      usage: "82%",
      cost: "0.02€ / call",
      latency: "450ms",
      task: "Interruptions",
    },
    {
      name: "Mistral Large",
      usage: "18%",
      cost: "0.14€ / call",
      latency: "1.2s",
      task: "DNA & Replay",
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            AI <span className="text-blue-600">Observability</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Monitoring des coûts et performances LLM
          </p>
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl font-black">
          <CreditCard className="w-5 h-5 mr-2" /> Billing Mistral
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost & Token Monitor */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Zap className="w-48 h-48 text-amber-500" />
          </div>
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest relative z-10">
            Consommation & Coûts
          </h3>

          <div className="grid grid-cols-2 gap-10 relative z-10">
            <div className="space-y-2">
              <p className="text-4xl font-black">1.4M</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Tokens (24h)
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-black text-emerald-400">14.82€</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                Coût Estimé (24h)
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-400">
                Cache Hit Rate
              </span>
              <span className="text-sm font-black text-blue-400">42%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: "42%" }} />
            </div>
          </div>
        </div>

        {/* Model Tiering */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Répartition des Modèles
          </h3>
          <div className="space-y-6">
            {models.map((m) => (
              <div
                key={m.name}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{m.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {m.task}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">{m.latency}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {m.cost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Control */}
      <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" /> Contrôle Qualité
          (Human-in-the-loop)
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs font-black uppercase">
                Hallucinations Potentielles
              </span>
            </div>
            <p className="text-sm font-bold text-slate-700">
              3 réponses suspectes détectées par le filtre de cohérence.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 font-black p-0 h-auto"
            >
              Examiner les traces →
            </Button>
          </div>
          <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-black uppercase">
                Optimisation Prompt
              </span>
            </div>
            <p className="text-sm font-bold text-slate-700">
              Le prompt 'Victor V2.1' a réduit les répétitions de 15%.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 font-black p-0 h-auto"
            >
              Voir le rapport A/B →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
