'use client';

import React, { useState } from 'react';
import { searchService } from '@/services/search.service';
import { CareerPath } from '@/types/search.types';
import { KnowledgeGraph } from '@/types/recruiter.types';
import { LoadingOverlay } from '../recruiter/LoadingOverlay';
import { ErrorBanner } from '../recruiter/ErrorBanner';
import { SkillBadge } from '../recruiter/SkillBadge';

interface CareerPathViewProps {
  candidateGraph?: KnowledgeGraph | null;
  jobGraphs?: KnowledgeGraph[] | null;
}

export function CareerPathView({ candidateGraph, jobGraphs = [] }: CareerPathViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);

  const handleBuildCareerPath = async () => {
    if (!candidateGraph || !jobGraphs || jobGraphs.length === 0) {
      setError('Veuillez charger un candidat et des postes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const path = await searchService.buildCareerPath(candidateGraph, jobGraphs);
      setCareerPath(path);
    } catch (err) {
      setError('Erreur lors de la construction du parcours de carrière');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Parcours de Carrière</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      {loading && <LoadingOverlay message="Construction du parcours en cours..." />}

      <div className="mb-4">
        <button
          onClick={handleBuildCareerPath}
          disabled={!candidateGraph || !jobGraphs || jobGraphs.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Analyser le Parcours
        </button>
      </div>

      {!candidateGraph || !jobGraphs || jobGraphs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Veuillez charger un candidat et des postes pour effectuer une recherche
        </p>
      ) : !careerPath ? (
        <p className="text-gray-500 text-center py-8">
          Cliquez sur Analyser pour lancer la recherche
        </p>
      ) : null}

      {careerPath && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Position Actuelle</h3>
            <p className="text-blue-700">{careerPath.currentPosition}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Compétences à Acquérir</h3>
            <div className="flex flex-wrap gap-2">
              {careerPath.missingSkills.slice(0, 10).map((skill, index) => (
                <SkillBadge key={index} skill={skill} type="required" />
              ))}
              {careerPath.missingSkills.length > 10 && (
                <span className="text-sm text-gray-500">+{careerPath.missingSkills.length - 10} autres</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Formations Recommandées</h3>
            <div className="space-y-2">
              {careerPath.recommendedTrainings.slice(0, 5).map((training, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                  {training}
                </div>
              ))}
              {careerPath.recommendedTrainings.length > 5 && (
                <span className="text-sm text-gray-500">+{careerPath.recommendedTrainings.length - 5} autres</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Compétences Futures</h3>
            <div className="flex flex-wrap gap-2">
              {careerPath.futureSkills.map((skill, index) => (
                <SkillBadge key={index} skill={skill} type="preferred" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Métiers Accessibles</h3>
            <div className="space-y-2">
              {careerPath.accessibleJobs.map((job, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
                  {job}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Estimation du Temps</h3>
            <p className="text-yellow-700">{careerPath.estimatedTime}</p>
          </div>
        </div>
      )}
    </div>
  );
}
