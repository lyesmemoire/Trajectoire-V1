// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Play, Pause, Square, RotateCcw, Clock, MessageSquare, CheckCircle, AlertCircle, Activity } from "lucide-react";

interface VoiceSessionData {
  sessionId: string;
  status: string;
  currentPhase: string;
  currentQuestion: {
    id: string;
    question: string;
    category: string;
  } | null;
  questionsAsked: number;
  remainingQuestions: number;
  elapsedTime: number;
  estimatedRemaining: number;
  conversationHistory: {
    events: Array<{
      event: string;
      timestamp: string;
      data: Record<string, unknown>;
    }>;
  };
  metadata: {
    createdAt: string;
    startedAt: string | null;
    finishedAt: string | null;
    totalDuration: number;
  };
}

interface VoiceSessionProps {
  sessionData: VoiceSessionData | null;
}

export function VoiceSession({ sessionData }: VoiceSessionProps) {
  if (!sessionData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Session Vocale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune session vocale active
          </div>
        </CardContent>
      </Card>
    );
  }

  const { sessionId, status, currentPhase, currentQuestion, questionsAsked, remainingQuestions, elapsedTime, estimatedRemaining, conversationHistory, metadata } = sessionData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-700 border-green-200";
      case "Paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Finished":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <Play className="w-4 h-4" />;
      case "Paused":
        return <Pause className="w-4 h-4" />;
      case "Finished":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <Square className="w-4 h-4" />;
      case "Error":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Session Vocale</CardTitle>
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
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Statut</span>
              </div>
              <div className={`flex items-center gap-2 text-sm font-bold px-2 py-1 rounded-full inline-block ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span>{status}</span>
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
              <div className="text-2xl font-bold text-blue-900">{elapsedTime} min</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Questions Posées</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{questionsAsked}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Restantes</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{remainingQuestions}</div>
            </motion.div>
          </div>

          {/* Current Phase */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Phase Actuelle</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-lg font-bold text-gray-900">{currentPhase}</div>
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
                <div className="text-sm font-medium text-blue-900 mb-1">{currentQuestion.category}</div>
                <p className="text-base font-medium text-gray-900">{currentQuestion.question}</p>
              </div>
            </div>
          )}

          {/* Timer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Timer</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Temps écoulé</span>
                <span className="font-medium text-gray-900">{elapsedTime} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Temps restant estimé</span>
                <span className="font-medium text-gray-900">{estimatedRemaining} min</span>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          {conversationHistory.events.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Événements Récents</span>
              </div>
              <div className="space-y-2">
                {conversationHistory.events.slice(-5).map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{event.event}</span>
                      <span className="text-xs text-gray-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2">
            {status === "Idle" || status === "Initializing" ? (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Play className="w-4 h-4" />
                <span>Démarrer</span>
              </button>
            ) : status === "Running" ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Square className="w-4 h-4" />
                  <span>Terminer</span>
                </button>
              </>
            ) : status === "Paused" ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Reprendre</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Square className="w-4 h-4" />
                  <span>Terminer</span>
                </button>
              </>
            ) : status === "Finished" || status === "Cancelled" || status === "Error" ? (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RotateCcw className="w-4 h-4" />
                <span>Nouvelle Session</span>
              </button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
