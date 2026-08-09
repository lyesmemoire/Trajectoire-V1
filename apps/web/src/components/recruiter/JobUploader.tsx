'use client';

import React, { useState } from 'react';
import { jobService } from '@/services/job.service';
import { JobProfile } from '@/types/recruiter.types';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorBanner } from './ErrorBanner';
import { SkillBadge } from './SkillBadge';

interface JobUploaderProps {
  onJobLoaded: (profile: JobProfile, graph: any) => void;
}

export function JobUploader({ onJobLoaded }: JobUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<JobProfile | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const uploadResult = await jobService.uploadJob(file);
      const profile = (uploadResult.data as { profile: JobProfile; graph: any }).profile;
      const graph = (uploadResult.data as { profile: JobProfile; graph: any }).graph;
      
      setProfile(profile);
      onJobLoaded(profile, graph);
    } catch (err) {
      setError('Erreur lors du chargement de la fiche de poste');
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Import Poste</h2>
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      
      {loading && <LoadingOverlay message="Traitement de la fiche de poste en cours..." />}

      {!profile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
            id="job-upload"
          />
          <label
            htmlFor="job-upload"
            className="cursor-pointer"
          >
            <div className="text-gray-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium">Glissez-déposez une fiche de poste ici</p>
              <p className="text-sm">ou cliquez pour sélectionner</p>
              <p className="text-xs text-gray-500 mt-2">PDF ou DOCX (max 10MB)</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{profile.job.title}</h3>
            <button
              onClick={() => setProfile(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Changer
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Famille:</span>
              <span className="ml-2 font-medium">{profile.job.family || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Séniorité:</span>
              <span className="ml-2 font-medium">{profile.job.seniority || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Localisation:</span>
              <span className="ml-2 font-medium">{profile.job.location || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Contrat:</span>
              <span className="ml-2 font-medium">{profile.job.contractType || 'N/A'}</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Compétences requises ({profile.requiredSkills.length})</h4>
            <div className="flex flex-wrap gap-2">
              {profile.requiredSkills.slice(0, 8).map((skill, index) => (
                <SkillBadge key={index} skill={skill.name} type="required" confidence={skill.confidence} />
              ))}
              {profile.requiredSkills.length > 8 && (
                <span className="text-sm text-gray-500">+{profile.requiredSkills.length - 8} autres</span>
              )}
            </div>
          </div>

          {profile.preferredSkills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Compétences souhaitées ({profile.preferredSkills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {profile.preferredSkills.slice(0, 5).map((skill, index) => (
                  <SkillBadge key={index} skill={skill.name} type="preferred" confidence={skill.confidence} />
                ))}
                {profile.preferredSkills.length > 5 && (
                  <span className="text-sm text-gray-500">+{profile.preferredSkills.length - 5} autres</span>
                )}
              </div>
            </div>
          )}

          {profile.softSkills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Soft Skills ({profile.softSkills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {profile.softSkills.slice(0, 5).map((skill, index) => (
                  <SkillBadge key={index} skill={skill.name} type="soft" confidence={skill.confidence} />
                ))}
                {profile.softSkills.length > 5 && (
                  <span className="text-sm text-gray-500">+{profile.softSkills.length - 5} autres</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
