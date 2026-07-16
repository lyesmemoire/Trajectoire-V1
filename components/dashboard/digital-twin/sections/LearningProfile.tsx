import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Lightbulb, Brain } from "lucide-react";
import { DigitalTwin } from "../types";

export interface LearningProfileProps {
  twin: DigitalTwin;
}

export function LearningProfile({ twin }: LearningProfileProps) {
  return (
    <>
      {/* Learning Profile */}
      {twin.learningProfile && (
        <Card className="bg-gradient-to-r from-cyan-50 to-sky-50 border-cyan-200 shadow-sm">
          <CardHeader className="border-b border-cyan-200">
            <CardTitle className="text-cyan-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Comment tu apprends le mieux
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Caractéristiques d'apprentissage</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Autonomie</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.autonomy.level}</p>
                    <p className="text-xs text-cyan-700">{twin.learningProfile.autonomy.confidence}% confiance</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Vitesse d'apprentissage</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.learningCharacteristics.learningSpeed.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Vitesse d'exécution</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.learningCharacteristics.executionSpeed.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Tolérance complexité</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.learningCharacteristics.complexityTolerance}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Préférences de guidage</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Longueur explication</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.guidancePreference.explanationLength}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Niveau détail</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.guidancePreference.detailLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Préférence exemples</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.guidancePreference.examplePreference}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Réactions</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Réaction aux échecs</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.reactionPatterns.failureReaction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Réaction aux succès</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.reactionPatterns.successReaction}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-3">Style de coaching optimal</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-cyan-600">Longueur réponse</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.responseLength}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Difficulté objectifs</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.goalDifficulty.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Niveau autonomie</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.autonomyLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-600">Vitesse progression</p>
                    <p className="text-sm font-medium text-cyan-900 capitalize">{twin.learningProfile.optimalCoachingStyle.progressionSpeed.replace("_", " ")}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-cyan-200">
                <p className="text-sm font-medium text-cyan-900 mb-2">Comment tu apprends le mieux</p>
                <div className="space-y-1">
                  {twin.learningProfile.howYouLearnBest.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-cyan-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}
