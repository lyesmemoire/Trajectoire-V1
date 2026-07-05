"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { CheckCircle2, Circle, Calendar, Target, TrendingUp, Plus, ChevronRight } from "lucide-react";

export default function ProgressPlanPage() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const milestones = [
    {
      id: "1",
      title: "Semaine 1-2",
      description: "Fondations",
      tasks: [
        { id: "1-1", title: "Compléter le profil carrière", completed: false },
        { id: "1-2", title: "Uploader et analyser le CV", completed: false },
        { id: "1-3", title: "Réviser les questions courantes", completed: false },
      ],
    },
    {
      id: "2",
      title: "Semaine 3-4",
      description: "Préparation avancée",
      tasks: [
        { id: "2-1", title: "Pratiquer la méthode STAR", completed: false },
        { id: "2-2", title: "Faire 3 simulations vocales", completed: false },
        { id: "2-3", title: "Préparer des exemples concrets", completed: false },
      ],
    },
    {
      id: "3",
      title: "Semaine 5-6",
      description: "Perfectionnement",
      tasks: [
        { id: "3-1", title: "Simuler un entretien complet", completed: false },
        { id: "3-2", title: "Optimiser le CV selon feedback", completed: false },
        { id: "3-3", title: "Préparer questions à poser", completed: false },
      ],
    },
    {
      id: "4",
      title: "Semaine 7-8",
      description: "Finalisation",
      tasks: [
        { id: "4-1", title: "Réviser et ajuster", completed: false },
        { id: "4-2", title: "Simulation finale", completed: false },
        { id: "4-3", title: "Préparation mentale", completed: false },
      ],
    },
  ];

  const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedCount = completedTasks.size;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Plan de Progression
        </h1>
        <p className="text-gray-600">
          Suivez votre parcours personnalisé vers la réussite de vos entretiens.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Progression globale</h2>
              <div className="text-5xl font-bold">{Math.round(progress)}%</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">{completedCount}/{totalTasks}</div>
              <div className="text-blue-100">tâches complétées</div>
            </div>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div className="space-y-6">
        {milestones.map((milestone, index) => {
          const milestoneTasks = milestone.tasks;
          const milestoneCompleted = milestoneTasks.filter(t => completedTasks.has(t.id)).length;
          const milestoneProgress = (milestoneCompleted / milestoneTasks.length) * 100;

          return (
            <Card key={milestone.id} className={milestoneProgress === 100 ? "border-green-300" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          milestoneProgress === 100
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {milestoneProgress === 100 ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <div>{milestone.title}</div>
                        <div className="text-sm font-normal text-gray-500">{milestone.description}</div>
                      </div>
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {milestoneCompleted}/{milestoneTasks.length}
                    </div>
                    <div className="text-xs text-gray-500">tâches</div>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      milestoneProgress === 100 ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${milestoneProgress}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestoneTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="shrink-0">
                        {completedTasks.has(task.id) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <span
                        className={`flex-1 ${
                          completedTasks.has(task.id) ? "text-gray-400 line-through" : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      {completedTasks.has(task.id) && (
                        <span className="text-xs text-green-600 font-medium">Complété</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Custom Task */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une tâche personnalisée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Décrivez votre tâche..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" onClick={() => window.location.href = "/dashboard/interview-prep"}>
          <Target className="w-4 h-4 mr-2" />
          Préparation entretien
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard/interview-simulation"}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Simulation vocale
        </Button>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard/history"}>
          <Calendar className="w-4 h-4 mr-2" />
          Historique
        </Button>
      </div>
    </div>
  );
}
