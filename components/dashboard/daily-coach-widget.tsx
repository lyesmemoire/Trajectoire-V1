"use client";

import * as React from "react";
import { m } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Sparkles, Target, Dumbbell, Briefcase, TrendingUp, Heart, Flag, Calendar } from "lucide-react";

interface DailyCoachWidgetProps {
  personalizedMessage: string;
  dailyObjective: string;
  dailyExercise: string;
  skillToWorkOn: string;
  recommendedInterview: string;
  progressSinceYesterday: string;
  personalizedEncouragement: string;
  goalReminder: string;
  weeklySummary: string;
}

export function DailyCoachWidget({
  personalizedMessage,
  dailyObjective,
  dailyExercise,
  skillToWorkOn,
  recommendedInterview,
  progressSinceYesterday,
  personalizedEncouragement,
  goalReminder,
  weeklySummary,
}: DailyCoachWidgetProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <CardTitle className="text-white">Coach IA Quotidien</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personalized Message */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
        >
          <p className="text-white text-sm leading-relaxed">{personalizedMessage}</p>
        </m.div>

        {/* Daily Objective */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Objectif du jour</p>
            <p className="text-white text-sm">{dailyObjective}</p>
          </div>
        </m.div>

        {/* Daily Exercise */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Exercice du jour</p>
            <p className="text-white text-sm">{dailyExercise}</p>
          </div>
        </m.div>

        {/* Skill to Work On */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Compétence à travailler</p>
            <p className="text-white text-sm">{skillToWorkOn}</p>
          </div>
        </m.div>

        {/* Recommended Interview */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Entretien conseillé</p>
            <p className="text-white text-sm">{recommendedInterview}</p>
          </div>
        </m.div>

        {/* Progress Since Yesterday */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Progression depuis hier</p>
            <p className="text-white text-sm">{progressSinceYesterday}</p>
          </div>
        </m.div>

        {/* Personalized Encouragement */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Encouragement</p>
            <p className="text-white text-sm">{personalizedEncouragement}</p>
          </div>
        </m.div>

        {/* Goal Reminder */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Flag className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Rappel des objectifs</p>
            <p className="text-white text-sm">{goalReminder}</p>
          </div>
        </m.div>

        {/* Weekly Summary */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Résumé de la semaine</p>
            <p className="text-white text-sm">{weeklySummary}</p>
          </div>
        </m.div>
      </CardContent>
    </Card>
  );
}
