import { Result, ok } from "../../../../lib/core/result";
import { DashboardData } from "../../domain/entities/dashboard.entity";
import { GetDashboardDataQuery, GetDashboardDataQueryParams } from "../../application/queries/get-dashboard-data.query";

export class GetDashboardDataQueryImpl extends GetDashboardDataQuery {
  async execute(params: GetDashboardDataQueryParams): Promise<Result<DashboardData>> {
    // Mock implementation - will be replaced with real data sources
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const dashboardData: DashboardData = {
      userId: params.userId,
      userName: "Jean Dupont",
      userEmail: "jean.dupont@example.com",
      careerProgression: {
        globalScore: 72,
        progressionPercentage: 72,
        lastAnalysis: sevenDaysAgo,
        currentLevel: "Intermédiaire",
      },
      careerCopilot: {
        aiSummary: "Votre profil montre une forte progression en leadership technique. Concentrez-vous sur les certifications cloud pour atteindre le niveau Expert.",
        lastAnalysis: sevenDaysAgo,
        available: true,
      },
      objectives: [
        {
          id: "obj-1",
          title: "Obtenir certification AWS",
          description: "Préparer et passer l'examen AWS Solutions Architect",
          progress: 65,
          targetDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          status: "active",
        },
        {
          id: "obj-2",
          title: "Améliorer compétences en communication",
          description: "Suivre une formation en présentation et communication",
          progress: 40,
          targetDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          status: "active",
        },
        {
          id: "obj-3",
          title: "Mettre à jour CV",
          description: "Intégrer les nouvelles compétences et expériences",
          progress: 100,
          targetDate: oneDayAgo,
          status: "completed",
        },
      ],
      priorityActions: [
        {
          id: "act-1",
          title: "Compléter module Kubernetes",
          description: "Terminer le module avancé sur Kubernetes",
          priority: "high",
          dueDate: threeDaysAgo,
          category: "Formation",
        },
        {
          id: "act-2",
          title: "Préparer entretien technique",
          description: "Réviser les algorithmes et structures de données",
          priority: "high",
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          category: "Préparation",
        },
        {
          id: "act-3",
          title: "Mettre à jour portfolio",
          description: "Ajouter les projets récents",
          priority: "medium",
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          category: "Portfolio",
        },
      ],
      recentActivity: [
        {
          id: "evt-1",
          type: "analysis",
          title: "Analyse de carrière complétée",
          description: "Nouvelle analyse de votre progression disponible",
          timestamp: sevenDaysAgo,
        },
        {
          id: "evt-2",
          type: "objective_completed",
          title: "CV mis à jour",
          description: "Votre CV a été mis à jour avec succès",
          timestamp: oneDayAgo,
        },
        {
          id: "evt-3",
          type: "action_completed",
          title: "Module Docker complété",
          description: "Vous avez terminé le module Docker avec succès",
          timestamp: threeDaysAgo,
        },
        {
          id: "evt-4",
          type: "profile_updated",
          title: "Profil mis à jour",
          description: "Vos informations de profil ont été mises à jour",
          timestamp: thirtyDaysAgo,
        },
      ],
      intelligenceEngines: [
        {
          id: "engine-1",
          name: "Career Path Analyzer",
          status: "active",
          lastProcessed: sevenDaysAgo,
        },
        {
          id: "engine-2",
          name: "Skill Gap Detector",
          status: "active",
          lastProcessed: sevenDaysAgo,
        },
        {
          id: "engine-3",
          name: "Market Trend Analyzer",
          status: "inactive",
          lastProcessed: thirtyDaysAgo,
        },
        {
          id: "engine-4",
          name: "Interview Simulator",
          status: "active",
          lastProcessed: threeDaysAgo,
        },
      ],
      lastUpdated: now,
    };

    return ok(dashboardData);
  }
}
