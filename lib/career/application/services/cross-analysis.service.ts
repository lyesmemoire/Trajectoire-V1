import { CareerMemoryEntity } from "../../domain/entities/career-memory.entity";

export interface CrossAnalysisResult {
  cvToJobOffer: {
    matchScore: number;
    missingKeywords: string[];
    alignment: string;
  };
  cvToAts: {
    scoreTrend: "improving" | "stable" | "declining";
    averageScore: number;
    latestScore: number;
  };
  atsToInterview: {
    correlation: number;
    atsPerformance: string;
    interviewPerformance: string;
  };
  interviewToVoice: {
    voiceQuality: number;
    confidenceLevel: number;
    articulationScore: number;
  };
  voiceToReport: {
    consistency: number;
    voiceImpact: number;
    overallAlignment: number;
  };
  reportToCareerProfile: {
    skillAlignment: number;
    strengthConsistency: number;
    weaknessConsistency: number;
  };
  careerProfileToHistory: {
    progressionRate: number;
    skillEvolution: string[];
    goalAchievement: number;
  };
  careerProfileToMarket: {
    marketFit: number;
    demandLevel: string;
    competitiveness: string;
  };
}

/**
 * Cross Analysis Service
 * 
 * Performs cross-domain analysis using existing engines and data.
 * Reuses existing data from CareerMemory without creating new engines.
 */
export class CrossAnalysisService {
  /**
   * Perform all cross analyses
   */
  async performCrossAnalysis(careerMemory: CareerMemoryEntity, jobOffer?: string): Promise<CrossAnalysisResult> {
    return {
      cvToJobOffer: this.analyzeCvToJobOffer(careerMemory, jobOffer),
      cvToAts: this.analyzeCvToAts(careerMemory),
      atsToInterview: this.analyzeAtsToInterview(careerMemory),
      interviewToVoice: this.analyzeInterviewToVoice(careerMemory),
      voiceToReport: this.analyzeVoiceToReport(careerMemory),
      reportToCareerProfile: this.analyzeReportToCareerProfile(careerMemory),
      careerProfileToHistory: this.analyzeCareerProfileToHistory(careerMemory),
      careerProfileToMarket: this.analyzeCareerProfileToMarket(careerMemory)
    };
  }

  /**
   * Analyze CV to Job Offer alignment
   */
  private analyzeCvToJobOffer(careerMemory: CareerMemoryEntity, jobOffer?: string): CrossAnalysisResult["cvToJobOffer"] {
    const latestCv = careerMemory.getLatestCv();
    const latestAts = careerMemory.getLatestAtsAnalysis();

    if (!latestCv || !latestAts) {
      return {
        matchScore: 0,
        missingKeywords: [],
        alignment: "no_data"
      };
    }

    return {
      matchScore: latestAts.score,
      missingKeywords: latestAts.missingKeywords,
      alignment: latestAts.score > 80 ? "high" : latestAts.score > 50 ? "medium" : "low"
    };
  }

  /**
   * Analyze CV to ATS trend
   */
  private analyzeCvToAts(careerMemory: CareerMemoryEntity): CrossAnalysisResult["cvToAts"] {
    const trend = careerMemory.getTrend();
    const averageScore = careerMemory.getAverageAtsScore();
    const latestAts = careerMemory.getLatestAtsAnalysis();

    return {
      scoreTrend: trend,
      averageScore,
      latestScore: latestAts?.score || 0
    };
  }

  /**
   * Analyze ATS to Interview correlation
   */
  private analyzeAtsToInterview(careerMemory: CareerMemoryEntity): CrossAnalysisResult["atsToInterview"] {
    const atsHistory = careerMemory.getAtsHistory();
    const interviewHistory = careerMemory.getInterviewHistory();

    if (atsHistory.length === 0 || interviewHistory.length === 0) {
      return {
        correlation: 0,
        atsPerformance: "no_data",
        interviewPerformance: "no_data"
      };
    }

    const avgAtsScore = careerMemory.getAverageAtsScore();
    const avgInterviewScore = careerMemory.getAverageInterviewScore();

    // Simple correlation: if both are high, correlation is high
    const correlation = (avgAtsScore + avgInterviewScore) / 200;

    return {
      correlation,
      atsPerformance: avgAtsScore > 70 ? "strong" : avgAtsScore > 50 ? "moderate" : "weak",
      interviewPerformance: avgInterviewScore > 70 ? "strong" : avgInterviewScore > 50 ? "moderate" : "weak"
    };
  }

  /**
   * Analyze Interview to Voice quality
   */
  private analyzeInterviewToVoice(careerMemory: CareerMemoryEntity): CrossAnalysisResult["interviewToVoice"] {
    const interviewHistory = careerMemory.getInterviewHistory();

    if (interviewHistory.length === 0) {
      return {
        voiceQuality: 0,
        confidenceLevel: 0,
        articulationScore: 0
      };
    }

    // This would use voice metrics from VoiceInterviewOrchestrator
    // For now, use interview scores as proxy
    const avgInterviewScore = careerMemory.getAverageInterviewScore();

    return {
      voiceQuality: avgInterviewScore,
      confidenceLevel: avgInterviewScore * 0.9,
      articulationScore: avgInterviewScore * 0.85
    };
  }

  /**
   * Analyze Voice to Report consistency
   */
  private analyzeVoiceToReport(careerMemory: CareerMemoryEntity): CrossAnalysisResult["voiceToReport"] {
    const reportHistory = careerMemory.getReportHistory();
    const interviewHistory = careerMemory.getInterviewHistory();

    if (reportHistory.length === 0 || interviewHistory.length === 0) {
      return {
        consistency: 0,
        voiceImpact: 0,
        overallAlignment: 0
      };
    }

    const avgReportScore = reportHistory.reduce((acc: number, r: any) => acc + r.globalScore, 0) / reportHistory.length;
    const avgInterviewScore = careerMemory.getAverageInterviewScore();

    // Consistency: how close are interview and report scores
    const consistency = 1 - Math.abs(avgReportScore - avgInterviewScore) / 100;

    return {
      consistency,
      voiceImpact: avgInterviewScore,
      overallAlignment: (avgReportScore + avgInterviewScore) / 2
    };
  }

  /**
   * Analyze Report to Career Profile alignment
   */
  private analyzeReportToCareerProfile(careerMemory: CareerMemoryEntity): CrossAnalysisResult["reportToCareerProfile"] {
    const reportHistory = careerMemory.getReportHistory();

    if (reportHistory.length === 0) {
      return {
        skillAlignment: 0,
        strengthConsistency: 0,
        weaknessConsistency: 0
      };
    }

    const latestReport = reportHistory[reportHistory.length - 1];
    if (!latestReport) {
      return {
        skillAlignment: 0,
        strengthConsistency: 0,
        weaknessConsistency: 0
      };
    }

    // This would compare with career profile data
    // For now, use report data as proxy
    return {
      skillAlignment: latestReport.globalScore,
      strengthConsistency: latestReport.strengths.length > 0 ? 0.8 : 0,
      weaknessConsistency: latestReport.weaknesses.length > 0 ? 0.8 : 0
    };
  }

  /**
   * Analyze Career Profile to History progression
   */
  private analyzeCareerProfileToHistory(careerMemory: CareerMemoryEntity): CrossAnalysisResult["careerProfileToHistory"] {
    const atsHistory = careerMemory.getAtsHistory();
    const interviewHistory = careerMemory.getInterviewHistory();

    if (atsHistory.length < 2) {
      return {
        progressionRate: 0,
        skillEvolution: [],
        goalAchievement: 0
      };
    }

    // Calculate progression rate from ATS scores
    const firstScore = atsHistory[0]?.score || 0;
    const lastScore = atsHistory[atsHistory.length - 1]?.score || 0;
    const progressionRate = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

    // Extract skill evolution from ATS keywords
    const allKeywords = atsHistory.flatMap(a => a.matchedKeywords);
    const uniqueKeywords = [...new Set(allKeywords)];
    const skillEvolution = uniqueKeywords.slice(0, 5);

    // Goal achievement based on interview completion
    const completedInterviews = interviewHistory.filter(i => i.completedAt).length;
    const goalAchievement = interviewHistory.length > 0 ? (completedInterviews / interviewHistory.length) * 100 : 0;

    return {
      progressionRate,
      skillEvolution,
      goalAchievement
    };
  }

  /**
   * Analyze Career Profile to Market fit
   */
  private analyzeCareerProfileToMarket(careerMemory: CareerMemoryEntity): CrossAnalysisResult["careerProfileToMarket"] {
    const latestAts = careerMemory.getLatestAtsAnalysis();

    if (!latestAts) {
      return {
        marketFit: 0,
        demandLevel: "unknown",
        competitiveness: "unknown"
      };
    }

    // Market fit based on ATS score
    const marketFit = latestAts.score;

    // Demand level based on matched keywords count
    const demandLevel = latestAts.matchedKeywords.length > 10 ? "high" : latestAts.matchedKeywords.length > 5 ? "medium" : "low";

    // Competitiveness based on score
    const competitiveness = latestAts.score > 80 ? "high" : latestAts.score > 50 ? "medium" : "low";

    return {
      marketFit,
      demandLevel,
      competitiveness
    };
  }
}
