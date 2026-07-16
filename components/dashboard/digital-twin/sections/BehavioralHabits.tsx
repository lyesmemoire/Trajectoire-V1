import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Sparkles } from "lucide-react";
import { DigitalTwin } from "../types";

export interface BehavioralHabitsProps {
  twin: DigitalTwin;
}

export function BehavioralHabits({ twin }: BehavioralHabitsProps) {
  return (
    <>
      {/* Behavioral Habits */}
      {twin.behavioralHabits && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Habitudes comportementales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.keepsCommitments ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Tient ses engagements</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.keepsCommitments ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.actsQuickly ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Agit rapidement</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.actsQuickly ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.procrastinates ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                <p className="text-xs font-medium mb-1">Procrastine</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.procrastinates ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.oftenAbandons ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
                <p className="text-xs font-medium mb-1">Abandonne souvent</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.oftenAbandons ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.persists ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Persévère</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.persists ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.progressesRegularly ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Progresse régulièrement</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.progressesRegularly ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.worksUnderPressure ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Travaille sous pression</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.worksUnderPressure ? "Oui" : "Non"}</p>
              </div>
              <div className={`p-3 rounded-lg border ${twin.behavioralHabits.learnsQuickly ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-xs font-medium mb-1">Apprend vite</p>
                <p className="text-sm font-bold">{twin.behavioralHabits.learnsQuickly ? "Oui" : "Non"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}
