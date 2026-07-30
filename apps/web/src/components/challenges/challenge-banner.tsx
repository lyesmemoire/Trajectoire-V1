"use client"

import { Timer, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  challenge: {
    id: string
    name: string
    description: string
    endDate: string
    _count: { entries: number }
  }
}

export function ChallengeBanner({ challenge }: Props) {
  const timeLeft = new Date(challenge.endDate).getTime() - new Date().getTime()
  const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24))

  return (
    <div className="bg-ink-900 rounded-[3rem] p-8 md:p-12 text-ivoire-50 relative overflow-hidden shadow-premium-lg">
      <div className="absolute top-0 right-0 w-96 h-96 bg-bronze-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="space-y-6 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-bronze-500/20 border border-bronze-500/30 rounded-full text-bronze-400 text-xs font-black uppercase tracking-widest">
            🔥 Événement Limité
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.9]">
            {challenge.name}
          </h2>

          <p className="text-lg text-ink-400 font-medium max-w-xl">
            {challenge.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-bronze-500" />
              <span className="text-sm font-black text-ink-300 uppercase tracking-widest">
                {daysLeft} jours restants
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-bronze-500" />
              <span className="text-sm font-black text-ink-300 uppercase tracking-widest">
                {challenge._count.entries} participants
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <Link href={`/dashboard/interview/challenges/${challenge.id}`}>
            <Button
              size="lg"
              className="h-16 px-10 rounded-2xl bg-ivoire-50 text-bronze-600 hover:bg-ivoire-100 font-black text-lg shadow-premium w-full"
            >
              Rejoindre le Défi <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-center text-[10px] font-black text-ink-500 uppercase tracking-widest">
            Récompense : Elite Badge + 10 crédits
          </p>
        </div>
      </div>
    </div>
  )
}
