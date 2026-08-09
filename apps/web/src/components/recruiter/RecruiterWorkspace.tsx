'use client';

import React, { useState } from 'react';
import { CandidateUploader } from './CandidateUploader';
import { JobUploader } from './JobUploader';
import { MatchingPanel } from './MatchingPanel';
import { RecommendationPanel } from './RecommendationPanel';
import { GraphViewer } from './GraphViewer';
import { CandidateProfile, JobProfile, MatchingReport, KnowledgeGraph } from '@/types/recruiter.types';

export function RecruiterWorkspace() {
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [jobProfile, setJobProfile] = useState<JobProfile | null>(null);
  const [candidateGraph, setCandidateGraph] = useState<KnowledgeGraph | null>(null);
  const [jobGraph, setJobGraph] = useState<KnowledgeGraph | null>(null);
  const [matchingReport, setMatchingReport] = useState<MatchingReport | null>(null);

  const handleCandidateLoaded = (profile: CandidateProfile, graph: KnowledgeGraph) => {
    setCandidateProfile(profile);
    setCandidateGraph(graph);
  };

  const handleJobLoaded = (profile: JobProfile, graph: KnowledgeGraph) => {
    setJobProfile(profile);
    setJobGraph(graph);
  };

  const handleReportGenerated = (report: MatchingReport) => {
    setMatchingReport(report);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Espace Recruteur</h1>
          <p className="text-gray-600 mt-2">Analysez et comparez les candidats aux postes avec le moteur cognitif RH</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CandidateUploader onCandidateLoaded={handleCandidateLoaded} />
          <JobUploader onJobLoaded={handleJobLoaded} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MatchingPanel
            candidateGraph={candidateGraph}
            jobGraph={jobGraph}
            onReportGenerated={handleReportGenerated}
          />
          <RecommendationPanel report={matchingReport} />
        </div>

        <div className="mb-6">
          <GraphViewer candidateGraph={candidateGraph} jobGraph={jobGraph} />
        </div>
      </div>
    </div>
  );
}
