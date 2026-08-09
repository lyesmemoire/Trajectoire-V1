'use client';

import React, { useState } from 'react';
import { matchingService } from '@/services/matching.service';
import { MatchingReport, KnowledgeGraph } from '@/types/recruiter.types';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorBanner } from './ErrorBanner';
import { ScoreCard } from './ScoreCard';
import { SkillBadge } from './SkillBadge';

interface MatchingPanelProps {
  candidateGraph: KnowledgeGraph | null;
  jobGraph: KnowledgeGraph | null;
  onReportGenerated: (report: MatchingReport) => void;
}

export function MatchingPanel({ candidateGraph, jobGraph, onReportGenerated }: MatchingPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<MatchingReport | null>(null);

  const handleMatching = async () => {
    if (!candidateGraph || !jobGraph) {
      setError('Veuillez d\'abord charger un candidat et un poste');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reportData = await matchingService.getReport(candidateGraph, jobGraph);
      setReport(reportData);
      onReportGenerated(reportData);
    } catch (err) {
      setError('Erreur lors du matching');
    } finally {
      setLoading(false);
    }
  };

  if (!candidateGraph || !jobGraph) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Matching</h2>
        <p className="text-gray-500 text-center py-8">
          Veuillez d'abord charger un candidat et un poste
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Matching</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      
      {loading && <LoadingOverlay message="Calcul du matching en cours..." />}

      {!report ? (
        <div className="text-center py-8">
          <button
            onClick={handleMatching}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Lancer le Matching
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <ScoreCard score={report.scores.global} label="Score Global" color={report.scores.global >= 80 ? 'green' : report.scores.global >= 60 ? 'yellow' : 'red'} />

          <div>
            <h3 className="font-semibold mb-3">Détail des scores</h3>
            <div className="grid grid-cols-3 gap-3">
              {report.scores.dimensions.map((dim, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">{dim.name}</div>
                  <div className="text-xl font-bold">{dim.score}%</div>
                  <div className="text-xs text-gray-500">Poids: {Math.round(dim.weight * 100)}%</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Compétences communes</h3>
            <div className="flex flex-wrap gap-2">
              {report.strengths.slice(0, 8).map((strength, index) => (
                <SkillBadge key={index} skill={strength} type="preferred" />
              ))}
            </div>
          </div>

          {report.missingSkills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-red-600">Compétences manquantes</h3>
              <div className="flex flex-wrap gap-2">
                {report.missingSkills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill.name || skill} type="required" />
                ))}
              </div>
            </div>
          )}

          {report.transferableSkills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Compétences transférables</h3>
              <div className="space-y-2">
                {report.transferableSkills.map((transfer, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <span className="font-medium">{transfer.from}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{transfer.to}</span>
                    <span className="ml-2 text-gray-500">({Math.round(transfer.confidence * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Explication</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
              {report.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
