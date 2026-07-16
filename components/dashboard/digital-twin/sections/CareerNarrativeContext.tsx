import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { User, TrendingUp, CheckCircle, Sparkles, Shield, Lightbulb, BookOpen, Fingerprint } from "lucide-react";
import { DigitalTwin } from "../types";

export interface CareerNarrativeContextProps {
  twin: DigitalTwin;
}

export function CareerNarrativeContext({ twin }: CareerNarrativeContextProps) {
  return (
    <>
      {twin.careerNarrativeContext && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm">
          <CardHeader className="border-b border-purple-200">
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Mon Histoire Professionnelle
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-purple-100 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Identité professionnelle
                </p>
                <p className="text-sm text-purple-800 mb-1">{twin.careerNarrativeContext.careerIdentity.dominantIdentity}</p>
                <p className="text-xs text-purple-600">{twin.careerNarrativeContext.careerIdentity.selfDefinition}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-purple-500">Confiance: {twin.careerNarrativeContext.careerIdentity.confidence}%</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Histoire de carrière
                </p>
                <p className="text-sm text-blue-800 mb-1">{twin.careerNarrativeContext.careerStory.summary}</p>
                <p className="text-xs text-blue-600">{twin.careerNarrativeContext.careerStory.thread}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-blue-500">Confiance: {twin.careerNarrativeContext.careerStory.confidence}%</span>
                </div>
              </div>

              {twin.careerNarrativeContext.professionalThemes.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Thèmes professionnels
                  </p>
                  <div className="space-y-2">
                    {twin.careerNarrativeContext.professionalThemes.map((theme, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-green-200">
                        <p className="text-xs text-green-800 mb-1">{theme.theme}</p>
                        <p className="text-xs text-green-600">{theme.description}</p>
                        <span className="text-xs text-green-500">Confiance: {theme.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.narrativeFingerprint && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" />
                    Empreinte narrative
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">Hash: {twin.careerNarrativeContext.narrativeFingerprint.hash}</p>
                    <p className="text-xs text-gray-600">Stabilité: {twin.careerNarrativeContext.narrativeFingerprint.stability}</p>
                    <p className="text-xs text-gray-500">Modifié: {new Date(twin.careerNarrativeContext.narrativeFingerprint.lastModified).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.consistencyScore && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Score de cohérence
                  </p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-800">{twin.careerNarrativeContext.consistencyScore.overall}/100</p>
                    <p className="text-xs text-blue-600">{twin.careerNarrativeContext.consistencyScore.explanation}</p>
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.narrativeEvolution && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Évolution narrative
                  </p>
                  <div className="space-y-2">
                    {twin.careerNarrativeContext.narrativeEvolution.identityEvolution && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-1">Identité</p>
                        <p className="text-xs text-amber-600">{twin.careerNarrativeContext.narrativeEvolution.identityEvolution.changeExplanation}</p>
                      </div>
                    )}
                    {twin.careerNarrativeContext.narrativeEvolution.strengthsEvolution && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-1">Forces</p>
                        <p className="text-xs text-amber-600">{twin.careerNarrativeContext.narrativeEvolution.strengthsEvolution.evolutionExplanation}</p>
                      </div>
                    )}
                    {twin.careerNarrativeContext.narrativeEvolution.motivationsEvolution && (
                      <div className="p-2 bg-white rounded border border-amber-200">
                        <p className="text-xs font-medium text-amber-800 mb-1">Motivations</p>
                        <p className="text-xs text-amber-600">{twin.careerNarrativeContext.narrativeEvolution.motivationsEvolution.evolutionExplanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {twin.careerNarrativeContext.narrativeEvidence && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Preuves narratives
                  </p>
                  <div className="space-y-2">
                    {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence && (
                      <div className="p-2 bg-white rounded border border-purple-200">
                        <p className="text-xs font-medium text-purple-800 mb-1">Identité</p>
                        <div className="space-y-1">
                          {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.experiences.length > 0 && (
                            <p className="text-xs text-purple-600">Expériences: {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.experiences.length}</p>
                          )}
                          {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.skills.length > 0 && (
                            <p className="text-xs text-purple-600">Compétences: {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.skills.length}</p>
                          )}
                          {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.achievements.length > 0 && (
                            <p className="text-xs text-purple-600">Réalisations: {twin.careerNarrativeContext.narrativeEvidence.careerIdentityEvidence.achievements.length}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence && (
                      <div className="p-2 bg-white rounded border border-purple-200">
                        <p className="text-xs font-medium text-purple-800 mb-1">Histoire</p>
                        <div className="space-y-1">
                          {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.experiences.length > 0 && (
                            <p className="text-xs text-purple-600">Expériences: {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.experiences.length}</p>
                          )}
                          {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.transitions.length > 0 && (
                            <p className="text-xs text-purple-600">Transitions: {twin.careerNarrativeContext.narrativeEvidence.careerStoryEvidence.transitions.length}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

    </>
  );
}
