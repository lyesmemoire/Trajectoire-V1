'use client';

import { useState } from 'react';
import { InterviewSetup } from './InterviewSetup';
import { InterviewSession } from './InterviewSession';
import { InterviewReport } from './InterviewReport';

export function InterviewWorkspace() {
  const [step, setStep] = useState<'setup' | 'session' | 'report'>('setup');
  const [sessionData, setSessionData] = useState<any>(null);

  const handleStartSession = (data: any) => {
    setSessionData(data);
    setStep('session');
  };

  const handleSessionComplete = (report: any) => {
    setSessionData({ ...sessionData, report });
    setStep('report');
  };

  const handleReset = () => {
    setSessionData(null);
    setStep('setup');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Entretien IA</h1>
          <p className="text-gray-600 mt-2">Entraînez-vous avec un recruteur intelligent</p>
        </div>

        {step === 'setup' && <InterviewSetup onStart={handleStartSession} />}
        {step === 'session' && <InterviewSession sessionData={sessionData} onComplete={handleSessionComplete} />}
        {step === 'report' && <InterviewReport sessionData={sessionData} onReset={handleReset} />}
      </div>
    </div>
  );
}
