import { CandidateGraphSnapshot } from "./CandidateGraphSnapshot";

/**
 * Candidate Graph Diff Result
 */
export interface CandidateGraphDiffResult {
  snapshotId: string;
  previousSnapshotId: string;
  timestamp: Date;
  previousTimestamp: Date;
  
  // Score changes
  overallScoreChange: number;
  confidenceChange: number;
  employabilityChange: number;
  
  // Profile changes
  newSkills: string[];
  lostSkills: string[];
  improvedSkills: Array<{ name: string; change: number }>;
  declinedSkills: Array<{ name: string; change: number }>;
  
  // Communication evolution
  communicationEvolution: {
    clarityChange: number;
    persuasionChange: number;
    listeningChange: number;
    structureChange: number;
  };
  
  // Leadership evolution
  leadershipEvolution: {
    visionChange: number;
    executionChange: number;
    teamBuildingChange: number;
    conflictResolutionChange: number;
    decisionMakingChange: number;
  };
  
  // Progression/Regression
  progression: boolean;
  regression: boolean;
  stable: boolean;
  
  // Career trajectory
  trajectoryChange: {
    levelChanged: boolean;
    previousLevel: string;
    newLevel: string;
  };
}

/**
 * Candidate Graph Diff
 *
 * Responsibilities:
 * - Compare two snapshots
 * - Detect progression
 * - Detect regression
 * - Identify new skills
 * - Identify lost skills
 * - Track confidence evolution
 * - Track employability evolution
 * - Track leadership evolution
 * - Track communication evolution
 */

export class CandidateGraphDiff {
  /**
   * Compare two snapshots and generate diff
   */
  static compare(current: CandidateGraphSnapshot, previous: CandidateGraphSnapshot): CandidateGraphDiffResult {
    const currentGraph = current.graph;
    const previousGraph = previous.graph;
    
    // Score changes
    const overallScoreChange = currentGraph.overallScore - previousGraph.overallScore;
    const confidenceChange = currentGraph.confidence - previousGraph.confidence;
    const employabilityChange = currentGraph.employability.overall - previousGraph.employability.overall;
    
    // Skill changes
    const newSkills = this.getNewSkills(currentGraph.skills, previousGraph.skills);
    const lostSkills = this.getLostSkills(currentGraph.skills, previousGraph.skills);
    const improvedSkills = this.getImprovedSkills(currentGraph.skills, previousGraph.skills);
    const declinedSkills = this.getDeclinedSkills(currentGraph.skills, previousGraph.skills);
    
    // Communication evolution
    const communicationEvolution = {
      clarityChange: currentGraph.communication.clarity - previousGraph.communication.clarity,
      persuasionChange: currentGraph.communication.persuasion - previousGraph.communication.persuasion,
      listeningChange: currentGraph.communication.listening - previousGraph.communication.listening,
      structureChange: currentGraph.communication.structure - previousGraph.communication.structure,
    };
    
    // Leadership evolution
    const leadershipEvolution = {
      visionChange: currentGraph.leadership.vision - previousGraph.leadership.vision,
      executionChange: currentGraph.leadership.execution - previousGraph.leadership.execution,
      teamBuildingChange: currentGraph.leadership.teamBuilding - previousGraph.leadership.teamBuilding,
      conflictResolutionChange: currentGraph.leadership.conflictResolution - previousGraph.leadership.conflictResolution,
      decisionMakingChange: currentGraph.leadership.decisionMaking - previousGraph.leadership.decisionMaking,
    };
    
    // Progression/Regression
    const progression = overallScoreChange > 5;
    const regression = overallScoreChange < -5;
    const stable = !progression && !regression;
    
    // Career trajectory
    const trajectoryChange = {
      levelChanged: currentGraph.trajectory.currentLevel !== previousGraph.trajectory.currentLevel,
      previousLevel: previousGraph.trajectory.currentLevel,
      newLevel: currentGraph.trajectory.currentLevel,
    };
    
    return {
      snapshotId: current.id,
      previousSnapshotId: previous.id,
      timestamp: current.timestamp,
      previousTimestamp: previous.timestamp,
      overallScoreChange,
      confidenceChange,
      employabilityChange,
      newSkills,
      lostSkills,
      improvedSkills,
      declinedSkills,
      communicationEvolution,
      leadershipEvolution,
      progression,
      regression,
      stable,
      trajectoryChange,
    };
  }
  
  /**
   * Get new skills (present in current, not in previous)
   */
  private static getNewSkills(currentSkills: CandidateGraphSnapshot["graph"]["skills"], previousSkills: CandidateGraphSnapshot["graph"]["skills"]): string[] {
    const previousSkillNames = new Set(previousSkills.map(s => s.name));
    return currentSkills
      .filter(s => !previousSkillNames.has(s.name))
      .map(s => s.name);
  }
  
  /**
   * Get lost skills (present in previous, not in current)
   */
  private static getLostSkills(currentSkills: CandidateGraphSnapshot["graph"]["skills"], previousSkills: CandidateGraphSnapshot["graph"]["skills"]): string[] {
    const currentSkillNames = new Set(currentSkills.map(s => s.name));
    return previousSkills
      .filter(s => !currentSkillNames.has(s.name))
      .map(s => s.name);
  }
  
  /**
   * Get improved skills (level increased)
   */
  private static getImprovedSkills(currentSkills: CandidateGraphSnapshot["graph"]["skills"], previousSkills: CandidateGraphSnapshot["graph"]["skills"]): Array<{ name: string; change: number }> {
    const previousSkillMap = new Map(previousSkills.map(s => [s.name, s.level]));
    
    return currentSkills
      .filter(s => {
        const previousLevel = previousSkillMap.get(s.name);
        return previousLevel !== undefined && s.level > previousLevel;
      })
      .map(s => ({
        name: s.name,
        change: s.level - (previousSkillMap.get(s.name) || 0),
      }));
  }
  
  /**
   * Get declined skills (level decreased)
   */
  private static getDeclinedSkills(currentSkills: CandidateGraphSnapshot["graph"]["skills"], previousSkills: CandidateGraphSnapshot["graph"]["skills"]): Array<{ name: string; change: number }> {
    const previousSkillMap = new Map(previousSkills.map(s => [s.name, s.level]));
    
    return currentSkills
      .filter(s => {
        const previousLevel = previousSkillMap.get(s.name);
        return previousLevel !== undefined && s.level < previousLevel;
      })
      .map(s => ({
        name: s.name,
        change: s.level - (previousSkillMap.get(s.name) || 0),
      }));
  }
  
  /**
   * Format diff as human-readable summary
   */
  static formatSummary(diff: CandidateGraphDiffResult): string {
    const parts: string[] = [];
    
    if (diff.progression) {
      parts.push(`Progression: +${diff.overallScoreChange} points`);
    } else if (diff.regression) {
      parts.push(`Regression: ${diff.overallScoreChange} points`);
    } else {
      parts.push("Stable");
    }
    
    if (diff.newSkills.length > 0) {
      parts.push(`${diff.newSkills.length} new skill(s)`);
    }
    
    if (diff.improvedSkills.length > 0) {
      parts.push(`${diff.improvedSkills.length} improved skill(s)`);
    }
    
    if (diff.trajectoryChange.levelChanged) {
      parts.push(`Career level: ${diff.trajectoryChange.previousLevel} → ${diff.trajectoryChange.newLevel}`);
    }
    
    return parts.join(", ");
  }
}
