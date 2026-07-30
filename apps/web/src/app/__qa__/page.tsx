import { notFound } from "next/navigation"

import { LiveLeaderboard } from "@/components/challenges/live-leaderboard"
import { ScoreRing } from "@/components/ui/score-ring"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default function QADesignPage() {
  // Sécurité : jamais accessible en prod
  if (process.env.NODE_ENV !== "development") notFound()

  const entries = [
    { 
      id: "u1", 
      bestScore: 1280, 
      maxPressure: 45, 
      interruptions: 2, 
      user: { name: "Camille", image: null } 
    },
    { 
      id: "u2", 
      bestScore: 1210, 
      maxPressure: 52, 
      interruptions: 3, 
      user: { name: "Mehdi", image: null } 
    },
    { 
      id: "u3", 
      bestScore: 1185, 
      maxPressure: 48, 
      interruptions: 1, 
      user: { name: "Sarah", image: null } 
    },
    { 
      id: "u4", 
      bestScore: 1100, 
      maxPressure: 65, 
      interruptions: 4, 
      user: { name: "Louis", image: null } 
    },
  ]

  return (
    <main className="min-h-screen bg-ivoire-50">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl text-ink-900">QA Visuelle — Design System</h1>
          <p className="text-sm text-ink-600">
            Page de test dev-only. À supprimer ou garder protégée par notFound() en prod.
          </p>
        </header>

        {/* 1) Badges (collision Bronze vs autres) */}
        <section className="bg-white border border-ivoire-200 rounded-2xl p-6 shadow-premium">
          <h2 className="font-serif text-xl text-ink-900 mb-4">Badges</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="free" />
            <Badge variant="pro" />
            <Badge variant="expert" />
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Vérifier : PRO (bronze) ne doit pas ressembler à un warning (terracotta) ni à un danger (brick).
          </p>
        </section>

        {/* 2) Scores (Forest / Terracotta / Brick) */}
        <section className="bg-white border border-ivoire-200 rounded-2xl p-6 shadow-premium">
          <h2 className="font-serif text-xl text-ink-900 mb-4">Scores</h2>
          <div className="flex flex-wrap gap-10 items-center">
            <div className="text-center space-y-2">
              <ScoreRing score={35} label="Score" />
              <div className="text-xs text-ink-500">Faible (Brick)</div>
            </div>
            <div className="text-center space-y-2">
              <ScoreRing score={65} label="Score" />
              <div className="text-xs text-ink-500">Moyen (Terracotta)</div>
            </div>
            <div className="text-center space-y-2">
              <ScoreRing score={85} label="Score" />
              <div className="text-xs text-ink-500">Élevé (Forest)</div>
            </div>
          </div>
        </section>

        {/* 3) Boutons (inclure danger) */}
        <section className="bg-white border border-ivoire-200 rounded-2xl p-6 shadow-premium">
          <h2 className="font-serif text-xl text-ink-900 mb-4">Boutons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary (Ink)</Button>
            <Button variant="premium">Premium (Bronze)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger (Brick)</Button>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Vérifier : danger = brick (irréversible). Jamais terracotta pour danger.
            Premium = bronze (rare, accent). Primary = ink (structurel).
          </p>
        </section>

        {/* 4) Leaderboard + Badge PRO (test collision) */}
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border border-ivoire-200 rounded-2xl p-6 shadow-premium">
            <h2 className="font-serif text-xl text-ink-900 mb-4">Leaderboard</h2>
            <LiveLeaderboard entries={entries} />
          </div>

          <div className="bg-white border border-ivoire-200 rounded-2xl p-6 shadow-premium space-y-4">
            <h2 className="font-serif text-xl text-ink-900">Collision test</h2>
            <p className="text-sm text-ink-600">
              Mets le badge PRO à côté du podium : ils ne doivent pas partager la même "signature" couleur.
              Le podium utilise des hex isolés (#B8860B, #8A8A8A, #CD7F32), le badge PRO utilise bronze-* tokens.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-700">Plan :</span>
              <Badge variant="pro" />
            </div>
            <div className="mt-4 p-4 bg-ivoire-50 rounded-lg border border-ivoire-200">
              <p className="text-xs text-ink-600 font-medium mb-2">Palette Podium (hex isolés) :</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 rounded text-white" style={{backgroundColor: "#B8860B"}}>Gold #B8860B</span>
                <span className="px-2 py-1 rounded text-white" style={{backgroundColor: "#8A8A8A"}}>Silver #8A8A8A</span>
                <span className="px-2 py-1 rounded text-white" style={{backgroundColor: "#CD7F32"}}>Bronze #CD7F32</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5) État système (success/neutral/danger) */}
        <section className="bg-white border border-ivoire-200 rounded-2xl p-6 shadow-premium">
          <h2 className="font-serif text-xl text-ink-900 mb-4">États système</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-forest-50 border border-forest-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-forest-500"></div>
              <span className="text-sm text-forest-800">Success / Safe (Forest)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-terracotta-50 border border-terracotta-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-terracotta-500"></div>
              <span className="text-sm text-terracotta-800">Warning / Pending (Terracotta)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-brick-50 border border-brick-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-brick-500"></div>
              <span className="text-sm text-brick-800">Danger / Critical (Brick)</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-ivoire-50 border border-ivoire-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-ink-400"></div>
              <span className="text-sm text-ink-700">Neutral (Ink/Ivoire)</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
