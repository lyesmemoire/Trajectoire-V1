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
    <div className="bg-calm-surface rounded-lg shadow p-6">
      <h2 className="font-sans text-xl font-semibold mb-4 tracking-normal">Analyse de Similarité</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {loading && <LoadingOverlay message="Analyse en cours..." />}

      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTab('candidates')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === 'candidates'
                ? 'bg-calm-accent text-white'
                : 'bg-calm-line-soft text-calm-ink hover:bg-calm-line-soft'
            }`}
          >
            Candidats Similaires
          </button>
          <button
            onClick={() => setTab('jobs')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === 'jobs'
                ? 'bg-calm-accent text-white'
                : 'bg-calm-line-soft text-calm-ink hover:bg-calm-line-soft'
            }`}
          >
            Postes Similaires
          </button>
        </div>

        <button
          onClick={handleSearch}
          disabled={!targetGraph || (tab === 'candidates' && (!candidateGraphs || candidateGraphs.length === 0)) || (tab === 'jobs' && (!jobGraphs || jobGraphs.length === 0))}
          className="bg-calm-accent text-white px-6 py-2 rounded-lg hover:bg-calm-accent-deep transition-colors disabled:bg-calm-line-soft disabled:cursor-not-allowed"
        >
          Analyser
        </button>
      </div>

      {results && Array.isArray(results) && (
        <div className="space-y-4">
          <h3 className="font-medium text-calm-ink mb-3">
            {results.length} {tab === 'candidates' ? 'candidat(s)' : 'poste(s)'} similaire(s)
          </h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="bg-calm-accent-wash rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{result.candidateId || result.jobId}</div>
                  <div className="text-2xl font-bold text-calm-accent-deep">{result.score}%</div>
                </div>
                <div className="text-sm text-calm-tertiary">{result.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!targetGraph && (
        <p className="text-calm-tertiary text-center py-8">
          Veuillez charger un candidat ou un poste cible pour effectuer une analyse de similarité
        </p>
      )}
    </div>
  );
}
