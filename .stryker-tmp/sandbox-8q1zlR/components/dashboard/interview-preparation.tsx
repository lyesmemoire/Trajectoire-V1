// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { MessageSquare, Clock, Target, CheckCircle, AlertTriangle, TrendingUp, BookOpen } from "lucide-react";

interface InterviewQuestion {
  id: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  difficulty: "easy" | "medium" | "hard" | "expert";
  estimatedDuration: number;
  question: string;
  whyAsked: string;
  whatItMeasures: string;
}

interface InterviewPreparationData {
  interviewStrategy: {
    approach: string;
    openingStrategy: string;
    progressionStrategy: string;
    closingStrategy: string;
  };
  questionQueue: InterviewQuestion[];
  priorityQueue: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
  difficultyLevel: {
    overall: "easy" | "medium" | "hard" | "expert";
    rationale: string;
  };
  interviewDurationEstimate: {
    totalMinutes: number;
    breakdown: {
      warmup: number;
      validation: number;
      technical: number;
      behavioral: number;
      advanced: number;
      culture: number;
      critical: number;
      closing: number;
    };
  };
  expectedSkillsToDemonstrate: Array<{
    id: string;
    name: string;
    category: string;
    level: string;
    importance: "critical" | "high" | "medium" | "low";
  }>;
}

interface InterviewPreparationProps {
  interviewData: InterviewPreparationData | null;
}

export function InterviewPreparation({ interviewData }: InterviewPreparationProps) {
  if (!interviewData) {
    return (
      <Card className="bg-white border border-gray-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Préparation d'Entretien</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 text-sm py-8">
            Aucune donnée de préparation d'entretien disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  const { interviewStrategy, questionQueue, priorityQueue, difficultyLevel, interviewDurationEstimate, expectedSkillsToDemonstrate } = interviewData;

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
        <CardTitle className="text-gray-900">Préparation d'Entretien</CardTitle>
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
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Total Questions</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{questionQueue.length}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Durée Estimée</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{interviewDurationEstimate.totalMinutes} min</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">Difficulté</span>
              </div>
              <div className="text-sm font-bold text-purple-900 capitalize">{difficultyLevel.overall}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Critiques</span>
              </div>
              <div className="text-2xl font-bold text-red-900">{priorityQueue.critical.length}</div>
            </motion.div>
          </div>

          {/* Strategy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Stratégie d'Entretien</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Approche:</span>
                <span className="text-gray-600 ml-2">{interviewStrategy.approach}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Ouverture:</span>
                <span className="text-gray-600 ml-2">{interviewStrategy.openingStrategy}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Progression:</span>
                <span className="text-gray-600 ml-2">{interviewStrategy.progressionStrategy}</span>
              </div>
            </div>
          </div>

          {/* Expected Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Compétences Attendues</span>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{expectedSkillsToDemonstrate.length}</span>
            </div>
            <div className="space-y-2">
              {expectedSkillsToDemonstrate.slice(0, 5).map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(skill.importance)}`}>
                      {skill.importance}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Critical Questions */}
          {priorityQueue.critical.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">Questions Critiques</span>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{priorityQueue.critical.length}</span>
              </div>
              <div className="space-y-2">
                {questionQueue.filter(q => priorityQueue.critical.includes(q.id)).slice(0, 3).map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-red-900">{question.question}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{question.whatItMeasures}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Duration Breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Répartition de la Durée</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Warmup</span>
                <span className="font-medium text-gray-900">{interviewDurationEstimate.breakdown.warmup} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Validation</span>
                <span className="font-medium text-gray-900">{interviewDurationEstimate.breakdown.validation} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Technique</span>
                <span className="font-medium text-gray-900">{interviewDurationEstimate.breakdown.technical} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Comportemental</span>
                <span className="font-medium text-gray-900">{interviewDurationEstimate.breakdown.behavioral} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Culture</span>
                <span className="font-medium text-gray-900">{interviewDurationEstimate.breakdown.culture} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Closing</span>
                <span className="font-medium text-gray-900">{interviewDurationEstimate.breakdown.closing} min</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
