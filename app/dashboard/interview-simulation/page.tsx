"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Mic, MicOff, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";

export default function InterviewSimulationPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);

  const questions = [
    "Présentez-vous en 2 minutes",
    "Quelles sont vos 3 principales forces ?",
    "Pourquoi voulez-vous travailler chez nous ?",
    "Décrivez un défi que vous avez surmonté",
    "Où vous voyez-vous dans 5 ans ?",
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPlaying(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setResponses([]);
    setIsRecording(false);
    setIsPlaying(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Simulation Vocale
        </h1>
        <p className="text-gray-600">
          Entraînez-vous avec notre IA pour préparer vos entretiens.
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-900">
              Question {currentQuestion + 1} sur {questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl">Question actuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-900 font-medium">{questions[currentQuestion]}</p>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-6">
            {/* Microphone Button */}
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isPlaying}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-blue-600 hover:bg-blue-700"
              } ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isRecording ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>

            {/* Status */}
            <div className="text-center">
              {isRecording && (
                <p className="text-red-600 font-medium animate-pulse">
                  Enregistrement en cours...
                </p>
              )}
              {isPlaying && (
                <p className="text-blue-600 font-medium">
                  Écoutez votre réponse
                </p>
              )}
              {!isRecording && !isPlaying && (
                <p className="text-gray-600">
                  Appuyez pour enregistrer votre réponse
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {isPlaying && (
                <>
                  <Button variant="outline" onClick={handleRestart}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recommencer
                  </Button>
                  <Button onClick={handleNextQuestion}>
                    Question suivante
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Parlez clairement et à un rythme modéré
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Structurez votre réponse (introduction, développement, conclusion)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Utilisez des exemples concrets
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              Soyez authentique et sincère
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer la simulation
        </Button>
        {currentQuestion === questions.length - 1 && isPlaying && (
          <Button onClick={() => window.location.href = "/dashboard/interview-result"}>
            Voir les résultats
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
