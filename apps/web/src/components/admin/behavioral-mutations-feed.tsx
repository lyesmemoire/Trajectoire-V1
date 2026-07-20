"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, History } from "lucide-react";
import { UserMutation } from "@/lib/analytics/mutations/mutation-engine";

export function BehavioralMutationsFeed({
  mutations,
}: {
  mutations: UserMutation[];
}) {
  return (
    <div className="space-y-6">
      {mutations.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
        >
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                {m.userRole[0]}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">
                  {m.userRole}
                </p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  Session {m.sessionNumber}
                </p>
              </div>
            </div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {new Date(m.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Mutation Observée
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {m.mutation}
              </p>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Zap className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  Turning Point Dominant
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 italic leading-relaxed">
                "{m.turningPoint}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {m.trend}
                </span>
              </div>
              <button className="text-[8px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                Ouvrir Replay →
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
