'use client';

import { useState, useEffect } from 'react';

export function InterviewSession({ sessionData, onComplete }: { sessionData: any; onComplete: (report: any) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [sessionData]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: sessionData.jobTitle,
          level: sessionData.level,
          interviewType: sessionData.interviewType,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswers([...answers, transcript]);
      setTranscript('');
    } else {
      setLoading(true);
      try {
        const response = await fetch('/api/interview/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionData,
            answers: [...answers, transcript],
          }),
        });
        if (response.ok) {
          const report = await response.json();
          onComplete(report);
        }
      } catch (error) {
        console.error('Failed to evaluate interview:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Erreur lors du chargement des questions</div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Question {currentQuestion + 1}/{questions.length}</span>
              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <div key={index} className={`w-3 h-3 rounded-full ${currentQuestion >= index ? 'bg-green-500' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{questions[currentQuestion]}</h3>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
              <p className="text-gray-700">{transcript || 'Votre réponse apparaîtra ici...'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleRecording}
              className={`flex-1 py-3 rounded-lg ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer l\'enregistrement'}
            </button>
            <button
              onClick={handleNext}
              disabled={!transcript}
              className="flex-1 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Terminer'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
