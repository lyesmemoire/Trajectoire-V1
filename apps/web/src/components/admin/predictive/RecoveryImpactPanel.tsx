"use client";

import { Heart, CheckCircle2 } from "lucide-react";

interface Props {
  data: {
    recoveredUsers: number;
    returnedAfterRecovery: number;
    recoveryReturnRate: number;
  };
}

export function RecoveryImpactPanel({ data }: Props) {
  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm space-y-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">
            Moteur de Récupération (Clara)
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Impact sur la Rétention
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Users Saved
          </p>
          <p className="text-4xl font-black text-slate-900">
            {data.recoveredUsers}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Returned voluntarily
          </p>
          <p className="text-4xl font-black text-slate-900">
            {data.returnedAfterRecovery}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Success Rate
          </p>
          <p className="text-4xl font-black text-blue-600">
            {data.recoveryReturnRate}%
          </p>
        </div>
      </div>

      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest">
            Diagnostic ROI
          </span>
        </div>
        <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
          "Les utilisateurs ayant vécu une boucle de récupération réussie
          affichent un taux de retour supérieur de 32% à la moyenne."
        </p>
      </div>
    </div>
  );
}
