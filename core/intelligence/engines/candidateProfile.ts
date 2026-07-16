import { CandidateProfile, CandidateIdentity, CandidateCareer, CandidateBehavior, Skill } from "../types";

/**
 * Candidate Profile Engine
 * 
 * Responsibilities:
 * - Build and maintain candidate profiles
 * - Calculate dynamic profile metrics
 * - Update profile based on new data
 * - Profile enrichment and validation
 */

export class CandidateProfileEngine {
  /**
   * Create a new candidate profile from basic information
   */
  static createProfile(identity: CandidateIdentity, career: CandidateCareer): CandidateProfile {
    return {
      identity,
      career,
      skills: {
        hardSkills: [],
        softSkills: [],
        strengths: [],
        weaknesses: [],
      },
      metrics: {
        atsScore: 0,
        atsTrend: "stable",
        totalSimulations: 0,
        totalTimeSpent: 0,
        successRate: 0,
        averageScore: 0,
        bestScore: 0,
        currentStreak: 0,
      },
      behavior: {
        communicationStyle: "analytical",
        personalityType: "unknown",
        confidenceLevel: 50,
        leadershipStyle: "collaborative",
        synthesisAbility: 50,
        businessImpact: 50,
        argumentationQuality: 50,
        starProficiency: 50,
        stressManagement: 50,
        persuasionAbility: 50,
      },
      history: {
        simulations: [],
        progressions: [],
        achievements: [],
        recurringErrors: [],
      },
    };
  }

  /**
   * Update profile with new simulation data
   */
  static updateWithSimulation(profile: CandidateProfile, simulationData: {
    score: number;
    duration: number;
    type: string;
    position: string;
    company: string;
    difficulty: string;
    insights: string[];
  }): CandidateProfile {
    const updatedProfile = { ...profile };
    
    // Update metrics
    updatedProfile.metrics.totalSimulations += 1;
    updatedProfile.metrics.totalTimeSpent += simulationData.duration;
    
    // Update average score
    const totalScore = updatedProfile.metrics.averageScore * (updatedProfile.metrics.totalSimulations - 1) + simulationData.score;
    updatedProfile.metrics.averageScore = Math.round(totalScore / updatedProfile.metrics.totalSimulations);
    
    // Update best score
    if (simulationData.score > updatedProfile.metrics.bestScore) {
      updatedProfile.metrics.bestScore = simulationData.score;
    }
    
    // Update success rate (score >= 70 considered success)
    const successes = updatedProfile.history.simulations.filter(s => s.score >= 70).length + (simulationData.score >= 70 ? 1 : 0);
    updatedProfile.metrics.successRate = Math.round((successes / updatedProfile.metrics.totalSimulations) * 100);
    
    // Update streak
    if (simulationData.score >= updatedProfile.metrics.averageScore) {
      updatedProfile.metrics.currentStreak += 1;
    } else {
      updatedProfile.metrics.currentStreak = 0;
    }
    
    // Add simulation to history
    updatedProfile.history.simulations.push({
      id: `sim-${Date.now()}`,
      date: new Date(),
      type: simulationData.type,
      position: simulationData.position,
      company: simulationData.company,
      difficulty: simulationData.difficulty,
      score: simulationData.score,
      duration: simulationData.duration,
      keyInsights: simulationData.insights,
    });
    
    return updatedProfile;
  }

  /**
   * Update profile with ATS score
   */
  static updateATSScore(profile: CandidateProfile, newScore: number, trend: "up" | "down" | "stable"): CandidateProfile {
    const updatedProfile = { ...profile };
    updatedProfile.metrics.atsScore = newScore;
    updatedProfile.metrics.atsTrend = trend;
    return updatedProfile;
  }

  /**
   * Update profile with skill assessment
   */
  static updateSkill(profile: CandidateProfile, skillName: string, level: number, isHardSkill: boolean, trend: "improving" | "stable" | "declining"): CandidateProfile {
    const updatedProfile = { ...profile };
    const skillArray = isHardSkill ? updatedProfile.skills.hardSkills : updatedProfile.skills.softSkills;
    
    const existingIndex = skillArray.findIndex(s => s.name === skillName);
    const skill: Skill = {
      name: skillName,
      level,
      lastAssessed: new Date(),
      trend,
    };
    
    if (existingIndex >= 0) {
      skillArray[existingIndex] = skill;
    } else {
      skillArray.push(skill);
    }
    
    return updatedProfile;
  }

  /**
   * Update behavioral metrics
   */
  static updateBehavior(profile: CandidateProfile, behavior: Partial<CandidateBehavior>): CandidateProfile {
    return {
      ...profile,
      behavior: {
        ...profile.behavior,
        ...behavior,
      },
    };
  }

  /**
   * Add strength to profile
   */
  static addStrength(profile: CandidateProfile, strength: string): CandidateProfile {
    const updatedProfile = { ...profile };
    if (!updatedProfile.skills.strengths.includes(strength)) {
      updatedProfile.skills.strengths.push(strength);
    }
    return updatedProfile;
  }

  /**
   * Add weakness to profile
   */
  static addWeakness(profile: CandidateProfile, weakness: string): CandidateProfile {
    const updatedProfile = { ...profile };
    if (!updatedProfile.skills.weaknesses.includes(weakness)) {
      updatedProfile.skills.weaknesses.push(weakness);
    }
    return updatedProfile;
  }

  /**
   * Calculate overall profile completeness
   */
  static calculateProfileCompleteness(profile: CandidateProfile): number {
    let completeness = 0;
    let maxPoints = 0;
    
    // Identity (20 points)
    maxPoints += 20;
    if (profile.identity.firstName && profile.identity.lastName && profile.identity.email) {
      completeness += 20;
    }
    
    // Career (20 points)
    maxPoints += 20;
    if (profile.career.currentLevel && profile.career.sector && profile.career.yearsOfExperience > 0) {
      completeness += 20;
    }
    
    // Skills (30 points)
    maxPoints += 30;
    const skillPoints = Math.min(30, (profile.skills.hardSkills.length + profile.skills.softSkills.length) * 5);
    completeness += skillPoints;
    
    // Metrics (15 points)
    maxPoints += 15;
    if (profile.metrics.totalSimulations > 0) {
      completeness += 15;
    }
    
    // Behavior (15 points)
    maxPoints += 15;
    if (profile.behavior.communicationStyle !== "analytical" || profile.behavior.personalityType !== "unknown") {
      completeness += 15;
    }
    
    return Math.round((completeness / maxPoints) * 100);
  }

  /**
   * Validate profile data consistency
   */
  static validateProfile(profile: CandidateProfile): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate career level consistency
    if (profile.career.yearsOfExperience < 2 && profile.career.currentLevel !== "junior") {
      errors.push("Career level inconsistent with years of experience");
    }
    
    // Validate score ranges
    if (profile.metrics.atsScore < 0 || profile.metrics.atsScore > 100) {
      errors.push("ATS score must be between 0 and 100");
    }
    
    if (profile.metrics.averageScore < 0 || profile.metrics.averageScore > 100) {
      errors.push("Average score must be between 0 and 100");
    }
    
    // Validate skill levels
    [...profile.skills.hardSkills, ...profile.skills.softSkills].forEach(skill => {
      if (skill.level < 0 || skill.level > 100) {
        errors.push(`Skill level for ${skill.name} must be between 0 and 100`);
      }
    });
    
    // Validate behavior metrics
    const behaviorMetrics = [
      profile.behavior.confidenceLevel,
      profile.behavior.synthesisAbility,
      profile.behavior.businessImpact,
      profile.behavior.argumentationQuality,
      profile.behavior.starProficiency,
      profile.behavior.stressManagement,
      profile.behavior.persuasionAbility,
    ];
    
    behaviorMetrics.forEach(metric => {
      if (metric < 0 || metric > 100) {
        errors.push("Behavior metrics must be between 0 and 100");
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get profile summary for quick display
   */
  static getProfileSummary(profile: CandidateProfile): {
    name: string;
    level: string;
    atsScore: number;
    simulations: number;
    successRate: number;
    topStrengths: string[];
    topWeaknesses: string[];
  } {
    return {
      name: `${profile.identity.firstName} ${profile.identity.lastName}`,
      level: profile.career.currentLevel,
      atsScore: profile.metrics.atsScore,
      simulations: profile.metrics.totalSimulations,
      successRate: profile.metrics.successRate,
      topStrengths: profile.skills.strengths.slice(0, 3),
      topWeaknesses: profile.skills.weaknesses.slice(0, 3),
    };
  }
}
