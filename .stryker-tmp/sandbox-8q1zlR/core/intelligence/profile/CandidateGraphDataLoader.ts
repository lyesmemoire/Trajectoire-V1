// @ts-nocheck
import { CandidateGraphInput } from "./CandidateGraphBuilder";
import { LiveScores } from "./CandidateIntelligenceGraph";
import { supabase } from "../../../lib/supabase/client";

/**
 * Candidate Graph Data Loader
 *
 * Responsibilities:
 * - Load real data from existing Supabase tables
 * - Map repository data to CandidateGraphInput format
 * - Provide fallback for missing data
 * 
 * IMPORTANT: This is a projection only. The source of truth remains:
 * - User table (identity)
 * - CareerProfile table (career data)
 * - CVAnalysis table (skills, education)
 * - InterviewSession table (interview history)
 */

export class CandidateGraphDataLoader {
  /**
   * Load candidate graph input from real data sources
   * Uses existing tables: User, CareerProfile, CVAnalysis, InterviewSession
   */
  static async loadFromRealData(userId: string): Promise<CandidateGraphInput | null> {
    try {
      // Load user data from User table
      const { data: user, error: userError } = await supabase
        .from("User")
        .select("id, email, name, image")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error loading user:", userError);
        return null;
      }

      // Load career profile from CareerProfile table
      const { data: careerProfile, error: careerError } = await supabase
        .from("CareerProfile")
        .select("*")
        .eq("userId", userId)
        .single();

      if (careerError && careerError.code !== 'PGRST116') {
        console.error("Error loading career profile:", careerError);
      }

      // Load CV data from CVAnalysis table
      const { data: cvAnalyses, error: cvError } = await supabase
        .from("CVAnalysis")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(1);

      if (cvError) {
        console.error("Error loading CV analysis:", cvError);
      }

      // Load interview history from InterviewSession table
      const { data: interviews, error: interviewError } = await supabase
        .from("InterviewSession")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false })
        .limit(10);

      if (interviewError) {
        console.error("Error loading interviews:", interviewError);
      }

      // Build CandidateGraphInput from real data (projection only)
      const input: CandidateGraphInput = {
        identity: {
          id: user.id,
          name: user.name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          phone: undefined, // Not in User table
          location: undefined, // Not in User table
          linkedIn: undefined, // Not in User table
          github: undefined, // Not in User table
        },
        career: {
          currentRole: undefined, // Not in CareerProfile
          yearsOfExperience: 0, // Not in CareerProfile
          targetRoles: [], // Not in CareerProfile
          targetIndustries: [], // Not in CareerProfile
          targetLocations: [], // Not in CareerProfile
          careerLevel: "mid", // Default, not in CareerProfile
        },
        skills: this.extractSkills(cvAnalyses),
        languages: [], // Not in CVAnalysis
        education: this.extractEducation(cvAnalyses),
        careerGoals: undefined, // Not in CareerProfile
        atsData: this.extractATSData(cvAnalyses),
        interviewHistory: this.extractInterviewHistory(interviews),
        previousScores: this.extractPreviousScores(interviews),
        liveScores: this.getDefaultLiveScores(),
        preferences: {
          targetSalary: undefined, // Not in CareerProfile
          targetLocations: [], // Not in CareerProfile
          remoteOnly: false, // Default
        },
      };

      return input;
    } catch (error) {
      console.error("Error loading candidate graph data:", error);
      return null;
    }
  }

  /**
   * Extract skills from CVAnalysis data
   */
  private static extractSkills(cvAnalyses: any[] | null): Array<{
    name: string;
    category: "hard" | "soft";
    level: number;
    confidence: number;
    lastAssessed: Date;
  }> {
    if (!cvAnalyses || cvAnalyses.length === 0) return [];

    const cv = cvAnalyses[0];
    const cvData = cv?.cvData || {};

    // Extract skills from cvData JSON structure
    const skills = cvData.skills || [];

    return skills.map((skill: any) => ({
      name: skill.name || "",
      category: skill.category || "hard",
      level: skill.level || 50,
      confidence: skill.confidence || 50,
      lastAssessed: new Date(skill.lastAssessed || Date.now()),
    }));
  }

  /**
   * Extract education from CVAnalysis data
   */
  private static extractEducation(cvAnalyses: any[] | null): Array<{
    degree: string;
    institution: string;
    year: number;
  }> {
    if (!cvAnalyses || cvAnalyses.length === 0) return [];

    const cv = cvAnalyses[0];
    const cvData = cv?.cvData || {};

    const education = cvData.education || [];

    return education.map((edu: any) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      year: edu.year || new Date().getFullYear(),
    }));
  }

  /**
   * Extract ATS data from CVAnalysis
   */
  private static extractATSData(cvAnalyses: any[] | null): {
    applications: number;
    interviews: number;
    offers: number;
    rejections: number;
  } {
    if (!cvAnalyses || cvAnalyses.length === 0) {
      return { applications: 0, interviews: 0, offers: 0, rejections: 0 };
    }

    // CVAnalysis has atsScoreBefore and atsScoreAfter, not application counts
    // This is a projection limitation - we can't get ATS application counts from CVAnalysis
    return {
      applications: cvAnalyses.length,
      interviews: 0, // Not available in CVAnalysis
      offers: 0, // Not available in CVAnalysis
      rejections: 0, // Not available in CVAnalysis
    };
  }

  /**
   * Extract interview history from InterviewSession
   */
  private static extractInterviewHistory(interviews: any[] | null): Array<{
    date: Date;
    type: string;
    score: number;
    feedback?: string;
  }> {
    if (!interviews) return [];

    return interviews.map((interview) => ({
      date: new Date(interview.createdAt),
      type: interview.persona || "simulation",
      score: interview.score || 0,
      feedback: undefined, // Not available in InterviewSession
    }));
  }

  /**
   * Extract previous scores from InterviewSession
   */
  private static extractPreviousScores(interviews: any[] | null): number[] {
    if (!interviews) return [];

    return interviews
      .filter((i) => i.score !== null && i.score !== undefined)
      .map((i) => i.score)
      .reverse();
  }

  /**
   * Get default live scores
   */
  private static getDefaultLiveScores(): LiveScores {
    return {
      communication: 50,
      leadership: 50,
      confidence: 50,
      structure: 50,
      impact: 50,
      stressManagement: 50,
      synthesis: 50,
    };
  }
}
