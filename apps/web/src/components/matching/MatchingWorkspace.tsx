'use client';

import { useState } from 'react';
import { MatchingForm } from './MatchingForm';
import { MatchingResults } from './MatchingResults';
import { MatchingHistory } from './MatchingHistory';

export function MatchingWorkspace() {
  const [results, setResults] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleMatch = (matchResults: any) => {
    setResults(matchResults);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matching Candidat-Poste</h1>
          <p className="text-gray-600 mt-2">Trouvez les meilleures correspondances entre candidats et postes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!results ? (
              <MatchingForm onMatch={handleMatch} />
            ) : (
              <MatchingResults results={results} onReset={() => setResults(null)} />
            )}
          </div>

          <div>
            <MatchingHistory 
              onSelectMatch={setResults} 
              showHistory={showHistory}
              onToggleHistory={() => setShowHistory(!showHistory)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
