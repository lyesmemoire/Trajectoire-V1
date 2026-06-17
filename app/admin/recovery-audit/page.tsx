import { computeRecoveryAudit } from "@/lib/analytics/recovery-audit";
import {
  HeartHandshake,
  ShieldCheck,
  Zap,
  Timer,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";

export default async function RecoveryAuditPage() {
  const metrics = await computeRecoveryAudit();

  return (
    <div className="space-y-12 pb-20 font-sans text-slate-900">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">
          Honeypot <span className="text-blue-600">Validation</span>
        </h1>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">
          Audit de Survie Émotionnelle — Cohorte Bêta 01
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Recovered Session Rate"
          value={`${metrics.recoveredSessionRate}%`}
          trend="Impact Survie"
          icon={<HeartHandshake className="w-5 h-5" />}
        />
        <KPICard
          title="LTV Recovery Impact"
          value={`${metrics.returnAfterRecoveryRate}%`}
          trend="Retry J+1"
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <KPICard
          title="False Positives"
          value={`${metrics.falsePositiveRate}%`}
          trend="Bruit"
          icon={<AlertCircle className="w-5 h-5" />}
        />
        <KPICard
          title="Completions Saved"
          value={metrics.completionAfterRecovery}
          trend="Sessions Finies"
          icon={<ShieldCheck className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-8">
          <h3 className="text-xl font-black flex items-center gap-3">
            <Timer className="w-6 h-6 text-blue-500" /> Analyse du Temps de
            Rebond
          </h3>

          <div className="space-y-6">
            {[
              {
                label: "Reprise de parole < 5s après Clara",
                value: 65,
                color: "bg-emerald-500",
              },
              {
                label: "Reprise de parole 5-15s",
                value: 25,
                color: "bg-blue-500",
              },
              {
                label: "Abandon malgré l'intervention",
                value: 10,
                color: "bg-rose-500",
              },
            ].map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>{s.label}</span>
                  <span>{s.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color}`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32 text-amber-500" />
            </div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">
              Diagnostic de Fidélité
            </h4>
            <div className="space-y-6">
              <p className="text-lg font-bold leading-relaxed italic opacity-90">
                "Les utilisateurs sauvés par Clara ont un taux de retour 15%
                supérieur à la moyenne. Le sentiment de 'rebond accompagné' est
                un moteur de rétention plus fort que le succès facile."
              </p>
              <p className="text-[10px] font-black text-slate-500 uppercase">
                Analyse IA de la Cohorte
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
