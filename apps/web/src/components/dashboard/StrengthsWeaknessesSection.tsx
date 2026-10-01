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
      <div className="bg-calm-surface p-6 rounded-xl border border-calm-line">
        <h3 className="text-lg font-sans font-semibold text-calm-ink mb-4">Analyse</h3>
        <p className="text-calm-secondary">Complétez des simulations pour voir votre analyse de forces et faiblesses.</p>
      </div>
    )
  }

  return (
    <div className="bg-calm-surface p-6 rounded-xl border border-calm-line">
      <h3 className="text-lg font-sans font-semibold text-calm-ink mb-4">Analyse</h3>

      {strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-calm-accent text-lg">✓</span>
            <p className="font-medium text-calm-ink">Points forts</p>
          </div>
          <div className="space-y-2">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2 bg-calm-accent-soft p-3 rounded-xl">
                <span className="text-calm-accent mt-0.5">•</span>
                <span className="text-sm text-calm-secondary">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showWeaknesses && weaknesses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-calm-warn text-lg">→</span>
            <p className="font-medium text-calm-ink">Points à améliorer</p>
          </div>
          <div className="space-y-2">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start gap-2 bg-calm-warn-soft p-3 rounded-xl">
                <span className="text-calm-warn mt-0.5">•</span>
                <span className="text-sm text-calm-secondary">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length === 0 && (
        <div className="text-center py-4 text-calm-secondary">
          <p className="text-sm">Aucun point fort identifié pour le moment</p>
        </div>
      )}

      {showWeaknesses && weaknesses.length === 0 && (
        <div className="text-center py-4 text-calm-secondary">
          <p className="text-sm">Aucun point à améliorer identifié pour le moment</p>
        </div>
      )}
    </div>
  )
}
