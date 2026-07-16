// @ts-nocheck
import { getAuthenticatedUser } from "@/lib/auth";
import { InterviewMonitor } from "@/components/admin/interview-monitor";
import { Activity, ShieldAlert, Users } from "lucide-react";

export default async function AdminInterviewsPage() {
  const user = await getAuthenticatedUser();

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Interview <span className="text-blue-600">Control Center</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Surveillance des simulations actives
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">14</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Sessions en cours
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">3</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Alerte Stress Élevé
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">81%</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Taux de Rétention (Live)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />{" "}
          Flux Vidéo/Vocal Simulé
        </h3>
        <InterviewMonitor />
      </div>
    </div>
  );
}
