// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Mic, Clock, MessageSquare, CheckCircle, AlertTriangle, Play, Pause, SkipForward, VolumeX } from "lucide-react";

interface VoiceInterviewData {
  interviewSession: {
    id: string;
    currentState: string;
    startedAt: string;
  };
  currentPhase: {
    name: string;
    objective: string;
    expectedDuration: number;
  };
  currentQuestion: {
    id: string;
    question: string;
    category: string;
    priority: string;
    difficulty: string;
  } | null;
  interviewState: {
    totalQuestions: number;
    askedQuestionsCount: number;
    skippedQuestionsCount: number;
    overallProgress: number;
  };
  interviewTimer: {
    elapsedTime: number;
    remainingTime: number;
    maximumTime: number;
  };
  silenceCounter: {
    count: number;
    totalSilenceDuration: number;
  };
  candidateInterruptions: Array<{
    type: string;
    timestamp: string;
  }>;
}

interface VoiceInterviewProps {
  interviewData: VoiceInterviewData | null;
}

export function VoiceInterview({ interviewData }: VoiceInterviewProps) {
  if (!interviewData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Entretien Vocal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune donnée d'entretien vocal disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { interviewSession, currentPhase, currentQuestion, interviewState, interviewTimer, silenceCounter, candidateInterruptions } = interviewData;

  const getStateColor = (state: string) => {
    switch (state) {
      case "Finished":
        return "bg-green-100 text-green-700 border-green-200";
      case "Paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "expert":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Entretien Vocal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">État</span>
              </div>
              <div className={`text-sm font-bold px-2 py-1 rounded-full inline-block ${getStateColor(interviewSession.currentState)}`}>
                {interviewSession.currentState}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Durée Écoulée</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{interviewTimer.elapsedTime} min</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Progression</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{interviewState.overallProgress}%</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Questions Posées</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{interviewState.askedQuestionsCount}/{interviewState.totalQuestions}</div>
            </motion.div>
          </div>

          {/* Current Phase */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Phase Actuelle</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-gray-900">{currentPhase.name}</span>
                <span className="text-sm text-gray-600">{currentPhase.expectedDuration} min</span>
              </div>
              <p className="text-sm text-gray-600">{currentPhase.objective}</p>
            </div>
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Question Actuelle</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">{currentQuestion.category}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(currentQuestion.priority)}`}>
                      {currentQuestion.priority}
                    </span>
                  </div>
                </div>
                <p className="text-base font-medium text-gray-900">{currentQuestion.question}</p>
              </div>
            </div>
          )}

          {/* Timer Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Timer</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Temps écoulé</span>
                <span className="font-medium text-gray-900">{interviewTimer.elapsedTime} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Temps restant</span>
                <span className="font-medium text-gray-900">{interviewTimer.remainingTime} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Temps maximum</span>
                <span className="font-medium text-gray-900">{interviewTimer.maximumTime} min</span>
              </div>
            </div>
          </div>

          {/* Silence Counter */}
          {silenceCounter.count > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <VolumeX className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Silences</span>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{silenceCounter.count}</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Nombre de silences</span>
                  <span className="font-medium text-red-900">{silenceCounter.count}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-700">Durée totale</span>
                  <span className="font-medium text-red-900">{silenceCounter.totalSilenceDuration} sec</span>
                </div>
              </div>
            </div>
          )}

          {/* Interruptions */}
          {candidateInterruptions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">Interruptions</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{candidateInterruptions.length}</span>
              </div>
              <div className="space-y-2">
                {candidateInterruptions.slice(-3).map((interruption, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-900">{interruption.type}</span>
                      <span className="text-xs text-orange-700">{new Date(interruption.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Play className="w-4 h-4" />
              <span>Reprendre</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <SkipForward className="w-4 h-4" />
              <span>Sauter</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
