'use client';

import React from 'react';
import { MatchingReport } from '@/types/recruiter.types';

interface RecommendationPanelProps {
  report: MatchingReport | null;
}

export function RecommendationPanel({ report }: RecommendationPanelProps) {
  if (!report) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
        <p className="text-gray-500 text-center py-8">
          Lancez le matching pour voir les recommandations
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Recommandations</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-green-600">Points forts</h3>
          <ul className="space-y-2">
            {report.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-red-600">Points faibles</h3>
          <ul className="space-y-2">
            {report.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

        {report.missingSkills.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-blue-600">Compétences à acquérir</h3>
            <div className="space-y-2">
              {report.missingSkills.map((skill, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <span className="font-medium">{skill.name || skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-3 text-purple-600">Actions recommandées</h3>
          <ul className="space-y-2">
            {report.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
