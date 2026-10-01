'use client';

import React from 'react';
import { CandidateSearch } from './CandidateSearch';
import { JobSearch } from './JobSearch';
import { SimilarityView } from './SimilarityView';
import { CareerPathView } from './CareerPathView';

export function SearchWorkspace() {
  return (
    <div className="min-h-screen bg-calm-line-soft">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-calm-ink">Recherche Sémantique de Talents</h1>
          <p className="text-calm-tertiary mt-2">Trouvez les meilleurs candidats et postes grâce à la compréhension métier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CandidateSearch />
          <JobSearch />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SimilarityView />
          <CareerPathView />
        </div>
      </div>
    </div>
  );
}
