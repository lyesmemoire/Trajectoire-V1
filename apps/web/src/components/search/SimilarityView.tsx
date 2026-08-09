'use client';

import React, { useState } from 'react';
import { searchService } from '@/services/search.service';
import { SimilarityResult } from '@/types/search.types';
import { KnowledgeGraph } from '@/types/recruiter.types';
import { LoadingOverlay } from '../recruiter/LoadingOverlay';
import { ErrorBanner } from '../recruiter/ErrorBanner';

interface SimilarityViewProps {
  targetGraph?: KnowledgeGraph | null;
  candidateGraphs?: KnowledgeGraph[] | null;
  jobGraphs?: KnowledgeGraph[] | null;
}

export function SimilarityView({ targetGraph, candidateGraphs = [], jobGraphs = [] }: SimilarityViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'candidates' | 'jobs'>('candidates');
  const [results, setResults] = useState<SimilarityResult[] | null>(null);

  const handleCandidateSimilarity = async () => {
    if (!targetGraph || !candidateGraphs || candidateGraphs.length === 0) {
      setError('Veuillez charger un candidat cible et des candidats à comparer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const similarCandidates = await searchService.findSimilarCandidates(targetGraph, candidateGraphs);
      setResults(similarCandidates);
    } catch (err) {
      setError('Erreur lors de la recherche de candidats similaires');
    } finally {
      setLoading(false);
    }
  };

  const handleJobSimilarity = async () => {
    if (!targetGraph || !jobGraphs || jobGraphs.length === 0) {
      setError('Veuillez charger un poste cible et des postes à comparer');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const similarJobs = await searchService.findSimilarJobs(targetGraph, jobGraphs);
      setResults(similarJobs);
    } catch (err) {
      setError('Erreur lors de la recherche de postes similaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    switch (tab) {
      case 'candidates':
        handleCandidateSimilarity();
        break;
      case 'jobs':
        handleJobSimilarity();
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Analyse de Similarité</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {loading && <LoadingOverlay message="Analyse en cours..." />}

      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTab('candidates')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === 'candidates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Candidats Similaires
          </button>
          <button
            onClick={() => setTab('jobs')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === 'jobs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Postes Similaires
          </button>
        </div>

        <button
          onClick={handleSearch}
          disabled={!targetGraph || (tab === 'candidates' && (!candidateGraphs || candidateGraphs.length === 0)) || (tab === 'jobs' && (!jobGraphs || jobGraphs.length === 0))}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Analyser
        </button>
      </div>

      {results && Array.isArray(results) && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700 mb-3">
            {results.length} {tab === 'candidates' ? 'candidat(s)' : 'poste(s)'} similaire(s)
          </h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{result.candidateId || result.jobId}</div>
                  <div className="text-2xl font-bold text-blue-600">{result.score}%</div>
                </div>
                <div className="text-sm text-gray-600">{result.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!targetGraph && (
        <p className="text-gray-500 text-center py-8">
          Veuillez charger un candidat ou un poste cible pour effectuer une analyse de similarité
        </p>
      )}
    </div>
  );
}
