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
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-xl border border-ivoire-200 shadow-premium">
        <h3 className="text-lg font-serif font-semibold text-ink-900 mb-4">Analyse</h3>
        <p className="text-ink-600">Complétez des simulations pour voir votre analyse de forces et faiblesses.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-xl border border-ivoire-200 shadow-premium">
      <h3 className="text-lg font-serif font-semibold text-ink-900 mb-4">Analyse</h3>

      {strengths.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-forest-600 text-lg">✓</span>
            <p className="font-medium text-ink-900">Points forts</p>
          </div>
          <div className="space-y-2">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2 bg-forest-50 p-3 rounded-xl">
                <span className="text-forest-600 mt-0.5">•</span>
                <span className="text-sm text-ink-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showWeaknesses && weaknesses.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-terracotta-600 text-lg">→</span>
            <p className="font-medium text-ink-900">Points à améliorer</p>
          </div>
          <div className="space-y-2">
            {weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start gap-2 bg-terracotta-50 p-3 rounded-xl">
                <span className="text-terracotta-600 mt-0.5">•</span>
                <span className="text-sm text-ink-700">{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {strengths.length === 0 && (
        <div className="text-center py-4 text-ink-500">
          <p className="text-sm">Aucun point fort identifié pour le moment</p>
        </div>
      )}

      {showWeaknesses && weaknesses.length === 0 && (
        <div className="text-center py-4 text-ink-500">
          <p className="text-sm">Aucun point à améliorer identifié pour le moment</p>
        </div>
      )}
    </div>
  )
}
