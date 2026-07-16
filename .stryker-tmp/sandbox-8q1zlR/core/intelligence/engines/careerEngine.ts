// @ts-nocheck
import { CandidateProfile, ProgressionRecord } from "../types";

/**
 * Career Engine
 * 
 * Responsibilities:
 * - Calculate career level based on experience and performance
 * - Determine career progression trajectory
 * - Identify career gaps and opportunities
 * - Calculate employability score
 * - Recommend career moves
 */

export class CareerEngine {
  /**
   * Calculate the appropriate career level based on years of experience and performance
   */
  static calculateCareerLevel(yearsOfExperience: number, performanceScore: number): "junior" | "intermediate" | "senior" | "expert" | "executive" {
    if (yearsOfExperience < 2) return "junior";
    if (yearsOfExperience < 5) {
      return performanceScore >= 70 ? "intermediate" : "junior";
    }
    if (yearsOfExperience < 10) {
      if (performanceScore >= 85) return "senior";
      if (performanceScore >= 70) return "intermediate";
      return "junior";
    }
    if (yearsOfExperience < 15) {
      if (performanceScore >= 90) return "expert";
      if (performanceScore >= 75) return "senior";
      if (performanceScore >= 60) return "intermediate";
      return "junior";
    }
    // 15+ years
    if (performanceScore >= 85) return "executive";
    if (performanceScore >= 70) return "expert";
    if (performanceScore >= 55) return "senior";
    return "intermediate";
  }

  /**
   * Calculate the gap between current level and target level
   */
  static calculateLevelGap(currentLevel: string, targetLevel: string): number {
    const levels = ["junior", "intermediate", "senior", "expert", "executive"];
    const currentIndex = levels.indexOf(currentLevel);
    const targetIndex = levels.indexOf(targetLevel);
    return targetIndex - currentIndex;
  }

  /**
   * Determine if candidate is ready for the next level
   */
  static isReadyForNextLevel(profile: CandidateProfile): boolean {
    const levelGap = this.calculateLevelGap(profile.career.currentLevel, profile.career.targetLevel);
    if (levelGap <= 0) return false; // Already at or above target
    
    const avgPerformance = profile.metrics.averageScore;
    const atsScore = profile.metrics.atsScore;
    const successRate = profile.metrics.successRate;
    
    // Minimum thresholds for level progression
    const thresholds = {
      junior_to_intermediate: { avg: 65, ats: 60, success: 70 },
      intermediate_to_senior: { avg: 75, ats: 70, success: 75 },
      senior_to_expert: { avg: 85, ats: 80, success: 80 },
      expert_to_executive: { avg: 90, ats: 85, success: 85 },
    };
    
    const currentLevel = profile.career.currentLevel;
    const nextLevel = this.getNextLevel(currentLevel);
    const thresholdKey = `${currentLevel}_to_${nextLevel}` as keyof typeof thresholds;
    const threshold = thresholds[thresholdKey];
    
    if (!threshold) return false;
    
    return avgPerformance >= threshold.avg && 
           atsScore >= threshold.ats && 
           successRate >= threshold.success;
  }

  /**
   * Get the next career level
   */
  static getNextLevel(currentLevel: string): string {
    const levels = ["junior", "intermediate", "senior", "expert", "executive"];
    const currentIndex = levels.indexOf(currentLevel);
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1] ?? currentLevel;
    }
    return currentLevel;
  }

  /**
   * Calculate employability score based on multiple factors
   */
  static calculateEmployabilityScore(profile: CandidateProfile): number {
    const weights = {
      atsScore: 0.3,
      averageScore: 0.25,
      successRate: 0.2,
      experienceRelevance: 0.15,
      skillMatch: 0.1,
    };
    
    const experienceRelevance = this.calculateExperienceRelevance(profile);
    const skillMatch = this.calculateSkillMatch(profile);
    
    const score = 
      (profile.metrics.atsScore * weights.atsScore) +
      (profile.metrics.averageScore * weights.averageScore) +
      (profile.metrics.successRate * weights.successRate) +
      (experienceRelevance * weights.experienceRelevance) +
      (skillMatch * weights.skillMatch);
    
    return Math.round(score);
  }

  /**
   * Calculate how relevant the candidate's experience is for their target
   */
  private static calculateExperienceRelevance(profile: CandidateProfile): number {
    const years = profile.career.yearsOfExperience;
    const targetLevel = profile.career.targetLevel;
    
    const requiredYears = {
      junior: 0,
      intermediate: 3,
      senior: 7,
      expert: 12,
      executive: 15,
    };
    
    const required = requiredYears[targetLevel] || 5;
    const ratio = Math.min(1, years / required);
    
    return Math.round(ratio * 100);
  }

  /**
   * Calculate how well skills match the target position
   */
  private static calculateSkillMatch(profile: CandidateProfile): number {
    if (profile.skills.hardSkills.length === 0) return 50;
    
    const avgHardSkill = profile.skills.hardSkills.reduce((sum, skill) => sum + skill.level, 0) / profile.skills.hardSkills.length;
    const avgSoftSkill = profile.skills.softSkills.reduce((sum, skill) => sum + skill.level, 0) / profile.skills.softSkills.length;
    
    return Math.round((avgHardSkill * 0.6) + (avgSoftSkill * 0.4));
  }

  /**
   * Generate career progression insights
   */
  static generateProgressionInsights(profile: CandidateProfile): ProgressionRecord[] {
    const insights: ProgressionRecord[] = [];
    const now = new Date();
    
    // ATS progression
    if (profile.metrics.atsTrend === "up") {
      insights.push({
        date: now,
        metric: "ATS Score",
        previousValue: profile.metrics.atsScore - 5,
        newValue: profile.metrics.atsScore,
        change: 5,
        trend: "improvement",
      });
    }
    
    // Average score progression
    if (profile.metrics.currentStreak > 3) {
      insights.push({
        date: now,
        metric: "Performance Streak",
        previousValue: profile.metrics.currentStreak - 1,
        newValue: profile.metrics.currentStreak,
        change: 1,
        trend: "acceleration",
      });
    }
    
    // Skill improvements
    const improvingSkills = profile.skills.hardSkills.filter(s => s.trend === "improving");
    if (improvingSkills.length > 0) {
      insights.push({
        date: now,
        metric: "Improving Skills",
        previousValue: improvingSkills.length - 1,
        newValue: improvingSkills.length,
        change: 1,
        trend: "improvement",
      });
    }
    
    return insights;
  }

  /**
   * Identify career opportunities
   */
  static identifyCareerOpportunities(profile: CandidateProfile): string[] {
    const opportunities: string[] = [];
    const currentLevel = profile.career.currentLevel;
    const avgScore = profile.metrics.averageScore;
    
    if (this.isReadyForNextLevel(profile)) {
      opportunities.push(`Vous êtes prêt à postuler pour des postes de niveau ${this.getNextLevel(currentLevel)}`);
    }
    
    if (avgScore >= 80 && profile.behavior.leadershipStyle !== "authoritative") {
      opportunities.push("Vos scores de leadership suggèrent que vous pourriez viser des postes avec plus de responsabilités managériales");
    }
    
    if (profile.behavior.businessImpact >= 75 && profile.behavior.persuasionAbility >= 75) {
      opportunities.push("Votre capacité d'impact business et de persuasion vous ouvre des opportunités en ventes ou business development");
    }
    
    if (profile.metrics.successRate >= 85 && profile.metrics.totalSimulations >= 10) {
      opportunities.push("Votre taux de réussite élevé indique que vous êtes prêt pour des entretiens plus exigeants");
    }
    
    return opportunities;
  }

  /**
   * Identify career gaps
   */
  static identifyCareerGaps(profile: CandidateProfile): string[] {
    const gaps: string[] = [];
    
    if (profile.metrics.atsScore < 60) {
      gaps.push("Votre score ATS est en dessous du seuil recommandé pour votre niveau cible");
    }
    
    if (profile.behavior.starProficiency < 60) {
      gaps.push("Votre maîtrise de la méthode STAR nécessite un renforcement pour structurer vos réponses");
    }
    
    if (profile.behavior.businessImpact < 65) {
      gaps.push("Vous devez davantage quantifier l'impact business de vos actions");
    }
    
    if (profile.behavior.stressManagement < 60) {
      gaps.push("Votre gestion du stress en situation d'entretien pourrait être améliorée");
    }
    
    const decliningSkills = profile.skills.hardSkills.filter(s => s.trend === "declining");
    if (decliningSkills.length > 0) {
      gaps.push(`Certaines compétences sont en déclin : ${decliningSkills.map(s => s.name).join(", ")}`);
    }
    
    return gaps;
  }
}
