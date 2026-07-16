import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { DigitalTwin } from "../types";

export interface HabitsProps {
  twin: DigitalTwin;
}

export function Habits({ twin }: HabitsProps) {
  return (
    <>
      {/* Habits */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Habitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {twin.habits.positiveHabits.length > 0 && (
              <div>
                <p className="font-medium text-green-700 mb-2">Habitudes positives</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.habits.positiveHabits.map((habit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.habits.negativeHabits.length > 0 && (
              <div>
                <p className="font-medium text-red-700 mb-2">Habitudes négatives</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.habits.negativeHabits.map((habit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{habit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {twin.habits.recurringBehaviors.length > 0 && (
              <div>
                <p className="font-medium text-blue-700 mb-2">Comportements récurrents</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {twin.habits.recurringBehaviors.map((behavior, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </>
  );
}
