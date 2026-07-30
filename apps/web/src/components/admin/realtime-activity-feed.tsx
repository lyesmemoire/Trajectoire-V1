"use client"

import { motion } from "framer-motion"
import { User, Mic2, FileText, CreditCard, Sparkles } from "lucide-react"

const EVENTS = [
  {
    id: "1",
    type: "signup",
    user: "omar.d@gmail.com",
    detail: "Nouveau compte",
    time: "À l'instant",
    icon: <User className="w-3 h-3" />,
    color: "blue",
  },
  {
    id: "2",
    type: "interview",
    user: "clémence.v",
    detail: "Entretien complété (Score 84)",
    time: "2m",
    icon: <Mic2 className="w-3 h-3" />,
    color: "purple",
  },
  {
    id: "3",
    type: "cv",
    user: "julien.r",
    detail: "Analyse ATS effectuée",
    time: "5m",
    icon: <FileText className="w-3 h-3" />,
    color: "emerald",
  },
  {
    id: "4",
    type: "payment",
    user: "marie.p",
    detail: "Passage au Plan Pro",
    time: "12m",
    icon: <CreditCard className="w-3 h-3" />,
    color: "terracotta",
  },
  {
    id: "5",
    type: "dna",
    user: "thomas.d",
    detail: "Career DNA Partagé",
    time: "15m",
    icon: <Sparkles className="w-3 h-3" />,
    color: "indigo",
  },
]

export function RealtimeActivityFeed() {
  return (
    <div className="space-y-4">
      {EVENTS.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between p-4 bg-ivoire-50 rounded-2xl border border-ivoire-100 hover:bg-white hover:shadow-premium transition-all group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl bg-${event.color}-50 text-${event.color}-600 flex items-center justify-center flex-shrink-0`}
            >
              {event.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-ink-900 truncate">
                {event.user}
              </p>
              <p className="text-xs text-ink-500 font-medium">
                {event.detail}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black text-ink-400 uppercase tracking-widest flex-shrink-0 ml-4">
            {event.time}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
