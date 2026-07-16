export interface CareerMemory {
  userId: string;
  cvs: Array<{
    id: string;
    uploadedAt: Date;
    content: string;
    atsScore?: number;
  }>;
  atsAnalyses: Array<{
    id: string;
    cvId: string;
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    analyzedAt: Date;
  }>;
  interviews: Array<{
    sessionId: string;
    startedAt: Date;
    completedAt?: Date;
    score?: number;
  }>;
  reports: Array<{
    sessionId: string;
    generatedAt: Date;
    globalScore: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  recommendations: Array<{
    id: string;
    type: string;
    content: string;
    generatedAt: Date;
    followedUp?: boolean;
  }>;
}

export class CareerMemoryEntity {
  private memory: CareerMemory;

  constructor(userId: string) {
    this.memory = {
      userId,
      cvs: [],
      atsAnalyses: [],
      interviews: [],
      reports: [],
      recommendations: []
    };
  }

  addCv(id: string, content: string, atsScore?: number): void {
    this.memory.cvs.push({
      id,
      uploadedAt: new Date(),
      content,
      atsScore
    });
  }

  addAtsAnalysis(id: string, cvId: string, score: number, matchedKeywords: string[], missingKeywords: string[]): void {
    this.memory.atsAnalyses.push({
      id,
      cvId,
      score,
      matchedKeywords,
      missingKeywords,
      analyzedAt: new Date()
    });
  }

  addInterview(sessionId: string, score?: number): void {
    const existing = this.memory.interviews.find(i => i.sessionId === sessionId);
    if (existing) {
      existing.completedAt = new Date();
      existing.score = score;
    } else {
      this.memory.interviews.push({
        sessionId,
        startedAt: new Date(),
        score
      });
    }
  }

  addReport(sessionId: string, globalScore: number, strengths: string[], weaknesses: string[]): void {
    this.memory.reports.push({
      sessionId,
      generatedAt: new Date(),
      globalScore,
      strengths,
      weaknesses
    });
  }

  addRecommendation(id: string, type: string, content: string): void {
    this.memory.recommendations.push({
      id,
      type,
      content,
      generatedAt: new Date()
    });
  }

  markRecommendationFollowedUp(id: string): void {
    const rec = this.memory.recommendations.find(r => r.id === id);
    if (rec) {
      rec.followedUp = true;
    }
  }

  getMemory(): CareerMemory {
    return this.memory;
  }

  getCvHistory(): CareerMemory["cvs"] {
    return this.memory.cvs;
  }

  getAtsHistory(): CareerMemory["atsAnalyses"] {
    return this.memory.atsAnalyses;
  }

  getInterviewHistory(): CareerMemory["interviews"] {
    return this.memory.interviews;
  }

  getReportHistory(): CareerMemory["reports"] {
    return this.memory.reports;
  }

  getRecommendationHistory(): CareerMemory["recommendations"] {
    return this.memory.recommendations;
  }

  getLatestCv(): CareerMemory["cvs"][0] | undefined {
    return this.memory.cvs[this.memory.cvs.length - 1];
  }

  getLatestAtsAnalysis(): CareerMemory["atsAnalyses"][0] | undefined {
    return this.memory.atsAnalyses[this.memory.atsAnalyses.length - 1];
  }

  getAverageAtsScore(): number {
    if (this.memory.atsAnalyses.length === 0) return 0;
    const sum = this.memory.atsAnalyses.reduce((acc, a) => acc + a.score, 0);
    return sum / this.memory.atsAnalyses.length;
  }

  getAverageInterviewScore(): number {
    const completedInterviews = this.memory.interviews.filter(i => i.score !== undefined);
    if (completedInterviews.length === 0) return 0;
    const sum = completedInterviews.reduce((acc, i) => acc + (i.score || 0), 0);
    return sum / completedInterviews.length;
  }

  getTrend(): "improving" | "stable" | "declining" {
    if (this.memory.atsAnalyses.length < 2) return "stable";
    
    const recent = this.memory.atsAnalyses.slice(-5);
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
    const secondHalf = recent.slice(Math.floor(recent.length / 2));
    
    const firstAvg = firstHalf.reduce((acc, a) => acc + a.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, a) => acc + a.score, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 5) return "improving";
    if (secondAvg < firstAvg - 5) return "declining";
    return "stable";
  }
}
