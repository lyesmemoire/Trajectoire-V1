"use client"

interface StrengthsWeaknessesSectionProps {
  strengths: string[]
  weaknesses: string[]
  showWeaknesses?: boolean
}

export function StrengthsWeaknessesSection({
  strengths, weaknesses, showWeaknesses = true
}: StrengthsWeaknessesSectionProps) {
  if (strengths.length === 0 && weaknesses.length === 0) {
    return (
      <div className="bg-zinc-900 p-6 rounded-xl border border-white/[0.08]">
        <h3 className="text-lg font-sans font-semibold text-white/80 mb-4">Analyse</h3>
        <p className="text-white/50">Complétez des simulations pour voir votre analyse de forces et faiblesses.</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-white/[0.08]">
      <h3 className="text-lg font-sans font-semibold text-white/80 mb-4">Analyse</h3>

      {strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400 text-lg">✓</span>
            <p className="font-medium text-white/80">Points forts</p>
          </div>
          <div className="space-y-2">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2 bg-emerald-500/[0.06] p-3 rounded-xl">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span className="text-sm text-white/70">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showWeaknesses && weaknesses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-lg">→</span>
            <p className="font-medium text-white/80">Points à améliorer</p>
          </div>
          <div className="space-y-2">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start gap-2 bg-amber-500/[0.06] p-3 rounded-xl">
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="text-sm text-white/70">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length === 0 && (
        <div className="text-center py-4 text-white/50">
          <p className="text-sm">Aucun point fort identifié pour le moment</p>
        </div>
      )}

      {showWeaknesses && weaknesses.length === 0 && (
        <div className="text-center py-4 text-white/50">
          <p className="text-sm">Aucun point à améliorer identifié pour le moment</p>
        </div>
      )}
    </div>
  )
}
