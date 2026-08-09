'use client';

import { useState } from 'react';

export function InterviewSetup({ onStart }: { onStart: (data: any) => void }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [level, setLevel] = useState('junior');
  const [interviewType, setInterviewType] = useState('technical');

  const handleStart = () => {
    onStart({
      jobTitle,
      jobDescription,
      level,
      interviewType,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Configuration de l'entretien</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre du poste
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="ex: Développeur Full Stack"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description du poste
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-lg"
            placeholder="Décrivez le poste et les compétences requises..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d'entretien
          </label>
          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="technical">Technique</option>
            <option value="behavioral">Comportemental</option>
            <option value="mixed">Mixte</option>
          </select>
        </div>

        <button
          onClick={handleStart}
          disabled={!jobTitle || !jobDescription}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Commencer l'entretien
        </button>
      </div>
    </div>
  );
}
