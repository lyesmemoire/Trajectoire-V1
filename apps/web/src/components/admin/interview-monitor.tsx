"use client"

import {
  Mic2,
  AlertCircle,
} from "lucide-react"

const LIVE_SESSIONS = [
  {
    id: "1",
    user: "omar.d",
    persona: "Victor (Stress)",
    pressure: 84,
    progress: 4,
    total: 7,
    status: "interruption_triggered",
  },
  {
    id: "2",
    user: "marie.p",
    persona: "Clara (Supportive)",
    pressure: 22,
    progress: 2,
    total: 7,
    status: "stable",
  },
]

export function InterviewMonitor() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {LIVE_SESSIONS.map((session) => (
        <div
          key={session.id}
          className="bg-[#050816] rounded-[2.5rem] p-8 border border-white/5 space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-brick-500/10 border border-brick-500/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-brick-500 animate-ping" />
              <span className="text-[8px] font-black text-brick-500 uppercase tracking-widest">
                Live Monitoring
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ink-800 flex items-center justify-center text-white font-black text-xs">
              {session.user?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-black text-white">{session.user}</p>
              <p className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">
                {session.persona}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-ink-400">
                <span>Pression</span>
                <span
                  className={
                    session.pressure > 70 ? "text-brick-500" : "text-forest-400"
                  }
                >
                  {session.pressure}%
                </span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={
                    session.pressure > 70
                      ? "h-full bg-brick-500"
                      : "h-full bg-forest-400"
                  }
                  style={{ width: `${session.pressure}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Mic2 className="w-4 h-4 text-ink-600" />
                <span className="text-xs font-bold text-ink-300">
                  Question {session.progress}/{session.total}
                </span>
              </div>
              {session.status === "interruption_triggered" && (
                <div className="flex items-center gap-2 text-terracotta-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">
                    Interruption
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-ink-400 uppercase tracking-widest transition-all">
              Ouvrir l'inspecteur comportemental
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
