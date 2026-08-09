'use client';

export function MatchingResults({ results, onReset }: { results: any; onReset: () => void }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Résultats du Matching</h2>
        <button
          onClick={onReset}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Nouveau matching
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {results?.score || 0}%
          </div>
          <div className="text-sm text-gray-600">Score de compatibilité global</div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Compétences correspondantes</h3>
          <div className="flex flex-wrap gap-2">
            {results?.matchedSkills?.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
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
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
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
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
