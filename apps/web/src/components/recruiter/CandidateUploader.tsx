'use client';

import React, { useState } from 'react';
import { cvService } from '@/services/cv.service';
import { CandidateProfile } from '@/types/recruiter.types';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorBanner } from './ErrorBanner';
import { SkillBadge } from './SkillBadge';

interface CandidateUploaderProps {
  onCandidateLoaded: (profile: CandidateProfile, graph: any) => void;
}

export function CandidateUploader({ onCandidateLoaded }: CandidateUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const uploadResult = await cvService.uploadCv(file);
      const profile = (uploadResult.data as { profile: CandidateProfile; graph: any }).profile;
      const graph = (uploadResult.data as { profile: CandidateProfile; graph: any }).graph;
      
      setProfile(profile);
      onCandidateLoaded(profile, graph);
    } catch (err) {
      setError('Erreur lors du chargement du CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-calm-surface rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Import Candidat</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      
      {loading && <LoadingOverlay message="Traitement du CV en cours..." />}

      {!profile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-calm-accent bg-calm-accent-soft' : 'border-calm-line hover:border-calm-line'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInput}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="cursor-pointer"
          >
            <div className="text-calm-tertiary mb-4">
              <svg className="w-12 h-12 mx-auto mb-4 text-calm-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium">Glissez-déposez un CV ici</p>
              <p className="text-sm">ou cliquez pour sélectionner</p>
              <p className="text-xs text-calm-tertiary mt-2">PDF ou DOCX (max 10MB)</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{profile.personalInfo.name || 'Candidat'}</h3>
            <button
              onClick={() => setProfile(null)}
              className="text-sm text-calm-tertiary hover:text-calm-ink"
            >
              Changer
            </button>
          </div>
          
          <div>
            <p className="text-sm text-calm-tertiary">{profile.personalInfo.email}</p>
            <p className="text-sm text-calm-tertiary">{profile.personalInfo.phone}</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Compétences ({profile.skills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.slice(0, 10).map((skill, index) => (
                <SkillBadge key={index} skill={skill.name} type="preferred" confidence={skill.confidence} />
              ))}
              {profile.skills.length > 10 && (
                <span className="text-sm text-calm-tertiary">+{profile.skills.length - 10} autres</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-calm-tertiary">Expériences:</span>
              <span className="ml-2 font-medium">{profile.profileScores.experienceCount}</span>
            </div>
            <div>
              <span className="text-calm-tertiary">Formation:</span>
              <span className="ml-2 font-medium">{profile.profileScores.educationCount}</span>
            </div>
            <div>
              <span className="text-calm-tertiary">Certifications:</span>
              <span className="ml-2 font-medium">{profile.profileScores.certificationCount}</span>
            </div>
            <div>
              <span className="text-calm-tertiary">Langues:</span>
              <span className="ml-2 font-medium">{profile.profileScores.languageCount}</span>
            </div>
          </div>

          <div className="bg-calm-accent-soft border border-calm-accent-line rounded-lg p-3">
            <p className="text-sm text-calm-accent-deep">
              Score de confiance: <span className="font-bold">{profile.profileScores.overallScore}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
