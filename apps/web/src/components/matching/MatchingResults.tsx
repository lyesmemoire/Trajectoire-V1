'use client';

export function MatchingResults({ results, onReset }: { results: any; onReset: () => void }) {
  return (
    <div className="bg-calm-surface p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Résultats du Matching</h2>
        <button
          onClick={onReset}
          className="text-calm-accent-deep hover:text-calm-accent-deep text-sm"
        >
          Nouveau matching
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-calm-accent-soft p-4 rounded-lg">
          <div className="text-3xl font-bold text-calm-accent-deep mb-2">
            {results?.score || 0}%
          </div>
          <div className="text-sm text-calm-tertiary">Score de compatibilité global</div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Compétences correspondantes</h3>
          <div className="flex flex-wrap gap-2">
            {results?.matchedSkills?.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-calm-accent-soft text-calm-accent-deep rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Compétences manquantes</h3>
          <div className="flex flex-wrap gap-2">
            {results?.missingSkills?.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-calm-warn-soft text-calm-warn rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Recommandations</h3>
          <ul className="space-y-2">
            {results?.recommendations?.map((rec: string, index: number) => (
              <li key={index} className="text-sm text-calm-ink flex items-start">
                <span className="text-calm-accent-deep mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
