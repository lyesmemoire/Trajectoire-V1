'use client';

import React, { useState } from 'react';
import { searchService } from '@/services/search.service';
import { RankedResult } from '@/types/search.types';
import { KnowledgeGraph } from '@/types/recruiter.types';
import { LoadingOverlay } from '../recruiter/LoadingOverlay';
import { ErrorBanner } from '../recruiter/ErrorBanner';
import { SearchResultCard } from './SearchResultCard';

interface CandidateSearchProps {
  jobGraph?: KnowledgeGraph | null;
  candidateGraphs?: KnowledgeGraph[] | null;
}

export function CandidateSearch({ jobGraph, candidateGraphs = [] }: CandidateSearchProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RankedResult[]>([]);

  const handleSearch = async () => {
    if (!jobGraph || !candidateGraphs || candidateGraphs.length === 0) {
      setError('Veuillez charger un poste et des candidats');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchService.searchCandidates(jobGraph, candidateGraphs);
      setResults(searchResults);
    } catch (err) {
      setError('Erreur lors de la recherche de candidats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-calm-surface rounded-lg shadow p-6">
      <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Recherche de Candidats</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {loading && <LoadingOverlay message="Recherche en cours..." />}

      <div className="mb-4">
        <button
          onClick={handleSearch}
          disabled={!jobGraph || !candidateGraphs || candidateGraphs.length === 0}
          className="bg-calm-accent text-white px-6 py-2 rounded-lg hover:bg-calm-accent-deep transition-colors disabled:bg-calm-line-soft disabled:cursor-not-allowed"
        >
          Rechercher des Candidats
        </button>
      </div>

      {results.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-medium text-calm-ink">
            {results.length} candidat(s) trouvé(s)
          </h3>
          {results.map((result, index) => (
            <SearchResultCard key={index} result={result} type="candidate" />
          ))}
        </div>
      ) : (
        <p className="text-calm-tertiary text-center py-8">
          {!jobGraph || !candidateGraphs || candidateGraphs.length === 0
            ? 'Veuillez charger un poste et des candidats pour effectuer une recherche'
            : 'Cliquez sur Rechercher pour lancer la recherche'}
        </p>
      )}
    </div>
  );
}
