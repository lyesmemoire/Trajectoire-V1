'use client';

import React from 'react';
import { KnowledgeGraph } from '@/types/recruiter.types';

interface GraphViewerProps {
  candidateGraph: KnowledgeGraph | null;
  jobGraph: KnowledgeGraph | null;
}

export function GraphViewer({ candidateGraph, jobGraph }: GraphViewerProps) {
  if (!candidateGraph && !jobGraph) {
    return (
      <div className="bg-calm-surface rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Visualisation du Graphe</h2>
        <p className="text-calm-tertiary text-center py-8">
          Chargez un candidat et un poste pour voir les graphes
        </p>
      </div>
    );
  }

  return (
    <div className="bg-calm-surface rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Visualisation du Graphe</h2>
      
      <div className="space-y-6">
        {candidateGraph && (
          <div>
            <h3 className="font-semibold mb-3 text-calm-accent-deep">Graphe Candidat</h3>
            <div className="bg-calm-accent-wash rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-accent-deep">{candidateGraph.entities.length}</div>
                  <div className="text-sm text-calm-tertiary">Entités</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-accent-deep">{candidateGraph.relationships.length}</div>
                  <div className="text-sm text-calm-tertiary">Relations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-accent-deep">{candidateGraph.attributes.length}</div>
                  <div className="text-sm text-calm-tertiary">Attributs</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-calm-ink">Types d'entités:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(candidateGraph.entities.map(e => e.type))).map((type, index) => (
                    <span key={index} className="bg-calm-accent-soft text-calm-accent-deep px-2 py-1 rounded text-xs">
                      {type}: {candidateGraph.entities.filter(e => e.type === type).length}
                    </span>
                  ))}
                </div>
              </div>

              {candidateGraph.metadata && (
                <div className="mt-4 pt-4 border-t border-calm-line">
                  <div className="text-xs text-calm-tertiary">
                    <div>Extrait le: {new Date(candidateGraph.metadata.extractedAt).toLocaleString()}</div>
                    <div>Version: {candidateGraph.metadata.version}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {jobGraph && (
          <div>
            <h3 className="font-semibold mb-3 text-calm-accent-deep">Graphe Poste</h3>
            <div className="bg-calm-accent-wash rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-accent-deep">{jobGraph.entities.length}</div>
                  <div className="text-sm text-calm-tertiary">Entités</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-accent-deep">{jobGraph.relationships.length}</div>
                  <div className="text-sm text-calm-tertiary">Relations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-calm-accent-deep">{jobGraph.attributes.length}</div>
                  <div className="text-sm text-calm-tertiary">Attributs</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-calm-ink">Types d'entités:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(jobGraph.entities.map(e => e.type))).map((type, index) => (
                    <span key={index} className="bg-calm-accent-soft text-calm-accent-deep px-2 py-1 rounded text-xs">
                      {type}: {jobGraph.entities.filter(e => e.type === type).length}
                    </span>
                  ))}
                </div>
              </div>

              {jobGraph.metadata && (
                <div className="mt-4 pt-4 border-t border-calm-line">
                  <div className="text-xs text-calm-tertiary">
                    <div>Extrait le: {new Date(jobGraph.metadata.extractedAt).toLocaleString()}</div>
                    <div>Version: {jobGraph.metadata.version}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {candidateGraph && jobGraph && (
          <div>
            <h3 className="font-semibold mb-3 text-calm-accent-deep">Relations entre graphes</h3>
            <div className="bg-calm-accent-soft border border-calm-accent-line rounded-lg p-4">
              <div className="text-sm text-calm-ink">
                <p>Les deux graphes sont prêts pour le matching via le Matching Engine.</p>
                <p className="mt-2">Le Matching Engine comparera les entités, attributs et relations pour calculer le score de compatibilité.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
