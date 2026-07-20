/**
 * Funnel Analytics
 * Analytics for conversion funnels
 * Tracks: signup -> dashboard -> simulation -> report
 */

import { z } from "zod";

// Funnel Step
export interface FunnelStep {
  name: string;
  description: string;
  users: number;
  percentage: number; // relative to previous step
  dropoff: number; // percentage of users who dropped off
  averageTimeInStep: number; // seconds
}

// Funnel Data
export interface FunnelData {
  funnelName: string;
  steps: FunnelStep[];
  totalUsers: number;
  conversionRate: number; // 0-1
  averageTimeToComplete: number; // seconds
}

// Funnel Metrics
export interface FunnelMetrics {
  signupFunnel: FunnelData;
  simulationFunnel: FunnelData;
  reportFunnel: FunnelData;
  overallConversionRate: number;
  biggestDropoffStep: string;
  averageFunnelCompletionTime: number;
}

export class FunnelAnalytics {
  private static instance: FunnelAnalytics;
  private funnelData: Map<string, FunnelData> = new Map();

  private constructor() {
    // Initialize default funnels
    this.initializeDefaultFunnels();
  }

  static getInstance(): FunnelAnalytics {
    if (!FunnelAnalytics.instance) {
      FunnelAnalytics.instance = new FunnelAnalytics();
    }
    return FunnelAnalytics.instance;
  }

  /**
   * Initialize default funnels
   */
  private initializeDefaultFunnel(name: string, steps: string[]): void {
    const funnelSteps: FunnelStep[] = steps.map(step => ({
      name: step,
      description: this.getStepDescription(step),
      users: 0,
      percentage: 0,
      dropoff: 0,
      averageTimeInStep: 0,
    }));

    this.funnelData.set(name, {
      funnelName: name,
      steps: funnelSteps,
      totalUsers: 0,
      conversionRate: 0,
      averageTimeToComplete: 0,
    });
  }

  private initializeDefaultFunnels(): void {
    // Signup Funnel: Landing -> Signup -> Email Verification -> Dashboard
    this.initializeDefaultFunnel("signup", [
      "landing_page",
      "signup_form",
      "email_verification",
      "dashboard",
    ]);

    // Simulation Funnel: Dashboard -> Simulation Config -> Simulation Start -> Simulation Complete
    this.initializeDefaultFunnel("simulation", [
      "dashboard",
      "simulation_config",
      "simulation_start",
      "simulation_complete",
    ]);

    // Report Funnel: Simulation Complete -> Report Generate -> Report View
    this.initializeDefaultFunnel("report", [
      "simulation_complete",
      "report_generate",
      "report_view",
    ]);
  }

  /**
   * Get step description
   */
  private getStepDescription(step: string): string {
    const descriptions: Record<string, string> = {
      landing_page: "Page d'accueil",
      signup_form: "Formulaire d'inscription",
      email_verification: "Vérification email",
      dashboard: "Tableau de bord",
      simulation_config: "Configuration simulation",
      simulation_start: "Démarrage simulation",
      simulation_complete: "Simulation terminée",
      report_generate: "Génération rapport",
      report_view: "Vue rapport",
    };
    return descriptions[step] || step;
  }

  /**
   * Track funnel step entry
   */
  trackStepEntry(
    funnelName: string,
    stepName: string,
    userId: string,
    timeInStep?: number
  ): void {
    const funnel = this.funnelData.get(funnelName);
    if (!funnel) return;

    const step = funnel.steps.find(s => s.name === stepName);
    if (!step) return;

    step.users++;

    if (timeInStep !== undefined) {
      step.averageTimeInStep = (step.averageTimeInStep * (step.users - 1) + timeInStep) / step.users;
    }

    this.recalculateFunnelMetrics(funnelName);
  }

  /**
   * Recalculate funnel metrics
   */
  private recalculateFunnelMetrics(funnelName: string): void {
    const funnel = this.funnelData.get(funnelName);
    if (!funnel) return;

    const totalUsers = funnel.steps[0].users;
    funnel.totalUsers = totalUsers;

    if (totalUsers === 0) return;

    let previousUsers = totalUsers;
    let totalDropoff = 0;

    funnel.steps.forEach((step, index) => {
      if (index === 0) {
        step.percentage = 100;
      } else {
        step.percentage = previousUsers > 0 ? (step.users / previousUsers) * 100 : 0;
        step.dropoff = previousUsers > 0 ? ((previousUsers - step.users) / previousUsers) * 100 : 0;
        totalDropoff += step.dropoff;
      }
      previousUsers = step.users;
    });

    const finalStepUsers = funnel.steps[funnel.steps.length - 1].users;
    funnel.conversionRate = totalUsers > 0 ? finalStepUsers / totalUsers : 0;

    // Calculate average time to complete
    const totalTime = funnel.steps.reduce((sum, step) => sum + step.averageTimeInStep, 0);
    funnel.averageTimeToComplete = totalTime;
  }

  /**
   * Get funnel data
   */
  getFunnel(funnelName: string): FunnelData | null {
    return this.funnelData.get(funnelName) || null;
  }

  /**
   * Get all funnels
   */
  getAllFunnels(): FunnelData[] {
    return Array.from(this.funnelData.values());
  }

  /**
   * Calculate funnel metrics
   */
  calculateMetrics(): FunnelMetrics {
    const signupFunnel = this.funnelData.get("signup");
    const simulationFunnel = this.funnelData.get("simulation");
    const reportFunnel = this.funnelData.get("report");

    const overallConversionRate = signupFunnel?.conversionRate || 0;

    // Find biggest dropoff step
    let biggestDropoffStep = "";
    let maxDropoff = 0;

    this.funnelData.forEach(funnel => {
      funnel.steps.forEach(step => {
        if (step.dropoff > maxDropoff) {
          maxDropoff = step.dropoff;
          biggestDropoffStep = `${funnel.funnelName}:${step.name}`;
        }
      });
    });

    // Calculate average funnel completion time
    const totalTime = Array.from(this.funnelData.values())
      .reduce((sum, funnel) => sum + funnel.averageTimeToComplete, 0);
    const averageFunnelCompletionTime = this.funnelData.size > 0 ? totalTime / this.funnelData.size : 0;

    return {
      signupFunnel: signupFunnel || this.createEmptyFunnel("signup"),
      simulationFunnel: simulationFunnel || this.createEmptyFunnel("simulation"),
      reportFunnel: reportFunnel || this.createEmptyFunnel("report"),
      overallConversionRate,
      biggestDropoffStep,
      averageFunnelCompletionTime,
    };
  }

  /**
   * Create empty funnel
   */
  private createEmptyFunnel(name: string): FunnelData {
    return {
      funnelName: name,
      steps: [],
      totalUsers: 0,
      conversionRate: 0,
      averageTimeToComplete: 0,
    };
  }

  /**
   * Get funnel visualization data
   */
  getFunnelVisualization(funnelName: string): Array<{
    step: string;
    users: number;
    percentage: number;
    dropoff: number;
  }> {
    const funnel = this.funnelData.get(funnelName);
    if (!funnel) return [];

    return funnel.steps.map(step => ({
      step: step.name,
      users: step.users,
      percentage: step.percentage,
      dropoff: step.dropoff,
    }));
  }

  /**
   * Compare funnels over time
   */
  compareFunnels(funnelName: string, period1: Date, period2: Date): {
    period1: FunnelData;
    period2: FunnelData;
    change: {
      conversionRateChange: number;
      stepChanges: Array<{ step: string; userChange: number; percentageChange: number }>;
    };
  } | null {
    // This would require historical data storage
    // For now, return null as placeholder
    return null;
  }

  /**
   * Clear funnel data
   */
  clearFunnel(funnelName: string): void {
    this.initializeDefaultFunnel(funnelName, []);
  }

  /**
   * Clear all funnels
   */
  clearAllFunnels(): void {
    this.funnelData.clear();
    this.initializeDefaultFunnels();
  }
}

export const funnelAnalytics = FunnelAnalytics.getInstance();
