/**
 * AI Evaluation Engine
 * Evaluates AI recruiter quality based on multiple criteria
 */

import {
  ConversationEvaluation,
  CriteriaScores,
  QualityMetrics,
  ConversationTurn,
} from "./interfaces/IEvaluationPlatform";

export type { ConversationEvaluation };

// ============================================================================
// EVALUATION ENGINE CLASS
// ============================================================================

export class EvaluationEngine {
  private static instance: EvaluationEngine;

  private constructor() {}

  static getInstance(): EvaluationEngine {
    if (!EvaluationEngine.instance) {
      EvaluationEngine.instance = new EvaluationEngine();
    }
    return EvaluationEngine.instance;
  }

  /**
   * Evaluate a conversation
   */
  evaluateConversation(
    conversationId: string,
    scenarioId: string,
    turns: ConversationTurn[]
  ): ConversationEvaluation {
    const criteriaScores = this.calculateCriteriaScores(turns);
    const metrics = this.calculateQualityMetrics(turns);
    const overallScore = this.calculateOverallScore(criteriaScores, metrics);
    const feedback = this.generateFeedback(criteriaScores, metrics);
    const passed = overallScore >= 70; // Threshold for passing

    const evaluation: ConversationEvaluation = {
      id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      scenarioId,
      timestamp: new Date(),
      overallScore,
      criteriaScores,
      metrics,
      feedback,
      passed,
    };

    return evaluation;
  }

  /**
   * Calculate criteria scores
   */
  private calculateCriteriaScores(turns: ConversationTurn[]): CriteriaScores {
    const recruiterTurns = turns.filter(t => t.role === "recruiter");
    const candidateTurns = turns.filter(t => t.role === "candidate");

    return {
      coherence: this.calculateCoherence(recruiterTurns),
      relevance: this.calculateRelevance(recruiterTurns, candidateTurns),
      variety: this.calculateVariety(recruiterTurns),
      naturalness: this.calculateNaturalness(recruiterTurns),
      fluency: this.calculateFluency(recruiterTurns),
      personality: this.calculatePersonality(recruiterTurns),
      realism: this.calculateRealism(recruiterTurns, candidateTurns),
      listeningAbility: this.calculateListeningAbility(recruiterTurns, candidateTurns),
      followUpQuality: this.calculateFollowUpQuality(recruiterTurns, candidateTurns),
      silenceManagement: this.calculateSilenceManagement(recruiterTurns),
      stressManagement: this.calculateStressManagement(recruiterTurns, candidateTurns),
      adaptation: this.calculateAdaptation(recruiterTurns, candidateTurns),
      repetitionAvoidance: this.calculateRepetitionAvoidance(recruiterTurns),
      cvRespect: this.calculateCVRespect(recruiterTurns),
      contextRespect: this.calculateContextRespect(recruiterTurns),
      difficultyRespect: this.calculateDifficultyRespect(recruiterTurns),
    };
  }

  /**
   * Calculate quality metrics
   */
  private calculateQualityMetrics(turns: ConversationTurn[]): QualityMetrics {
    const recruiterTurns = turns.filter(t => t.role === "recruiter");
    const totalTokens = turns.reduce((sum, t) => sum + (t.tokens || 0), 0);

    return {
      questionRepetitionRate: this.calculateQuestionRepetitionRate(recruiterTurns),
      promptSize: this.calculatePromptSize(recruiterTurns),
      promptCost: this.calculatePromptCost(recruiterTurns),
      conversationLength: turns.length,
      averageTurns: this.calculateAverageTurns(turns),
      averageTokens: this.calculateAverageTokens(turns),
      openaiCost: this.calculateOpenAICost(turns),
      hallucinationRate: this.calculateHallucinationRate(recruiterTurns),
      relevanceScore: this.calculateRelevanceScore(recruiterTurns),
      conversationFlowScore: this.calculateConversationFlowScore(turns),
      humanLikeScore: this.calculateHumanLikeScore(recruiterTurns),
      recruiterConsistency: this.calculateRecruiterConsistency(recruiterTurns),
      emotionConsistency: this.calculateEmotionConsistency(recruiterTurns),
      followUpQuality: this.calculateFollowUpQualityMetric(recruiterTurns),
      interviewCoverage: this.calculateInterviewCoverage(recruiterTurns),
      evaluationAccuracy: this.calculateEvaluationAccuracy(recruiterTurns),
      reportAccuracy: this.calculateReportAccuracy(recruiterTurns),
      coachingAccuracy: this.calculateCoachingAccuracy(recruiterTurns),
      latency: this.calculateAverageLatency(turns),
      throughput: this.calculateThroughput(turns),
    };
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(criteriaScores: CriteriaScores, metrics: QualityMetrics): number {
    const criteriaWeight = 0.6;
    const metricsWeight = 0.4;

    const criteriaAverage = this.averageCriteriaScores(criteriaScores);
    const metricsAverage = this.averageQualityMetrics(metrics);

    return (criteriaAverage * criteriaWeight + metricsAverage * metricsWeight);
  }

  /**
   * Average criteria scores
   */
  private averageCriteriaScores(scores: CriteriaScores): number {
    const values = Object.values(scores);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Average quality metrics (normalized to 0-10)
   */
  private averageQualityMetrics(metrics: QualityMetrics): number {
    const values = Object.values(metrics);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  // ============================================================================
  // CRITERIA CALCULATIONS
  // ============================================================================

  private calculateCoherence(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze logical flow and consistency
    let coherenceScore = 0;
    let coherenceCount = 0;
    
    for (let i = 1; i < turns.length; i++) {
      const prevTurn = turns[i - 1];
      const currentTurn = turns[i];
      
      // Check if current turn references previous content
      const prevWords = new Set(prevTurn.content.toLowerCase().split(/\s+/));
      const currentWords = currentTurn.content.toLowerCase().split(/\s+/);
      
      // Calculate word overlap for coherence
      let overlap = 0;
      currentWords.forEach(word => {
        if (prevWords.has(word) && word.length > 3) {
          overlap++;
        }
      });
      
      const overlapRatio = currentWords.length > 0 ? overlap / currentWords.length : 0;
      coherenceScore += Math.min(1, overlapRatio * 2); // Amplify for visibility
      coherenceCount++;
    }
    
    return coherenceCount > 0 ? (coherenceScore / coherenceCount) * 10 : 5;
  }

  private calculateRelevance(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0) return 0;
    // Real implementation: analyze question-response relevance
    let relevanceScore = 0;
    let relevanceCount = 0;
    
    const minTurns = Math.min(recruiterTurns.length, candidateTurns.length);
    for (let i = 0; i < minTurns; i++) {
      const question = recruiterTurns[i].content.toLowerCase();
      const answer = candidateTurns[i].content.toLowerCase();
      
      // Extract key terms from question
      const questionKeywords = question.split(/\s+/).filter(w => w.length > 4);
      
      // Check if answer contains question keywords
      let keywordMatches = 0;
      questionKeywords.forEach(keyword => {
        if (answer.includes(keyword)) {
          keywordMatches++;
        }
      });
      
      const matchRatio = questionKeywords.length > 0 ? keywordMatches / questionKeywords.length : 0;
      relevanceScore += matchRatio;
      relevanceCount++;
    }
    
    return relevanceCount > 0 ? (relevanceScore / relevanceCount) * 10 : 5;
  }

  private calculateVariety(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const uniqueQuestions = new Set(turns.map(t => t.content));
    return Math.min(10, (uniqueQuestions.size / turns.length) * 10);
  }

  private calculateNaturalness(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze language patterns and conversational flow
    let naturalnessScore = 0;
    let naturalnessCount = 0;
    
    turns.forEach(turn => {
      const content = turn.content;
      
      // Check for natural language markers
      const hasFillers = /\b(um|uh|like|you know)\b/i.test(content);
      const hasContractions = /\b(can't|won't|don't|it's|that's)\b/i.test(content);
      const hasInformalLanguage = /\b(yeah|nope|sure|okay)\b/i.test(content);
      
      // Calculate naturalness based on conversational markers
      let score = 0.5; // Base score
      if (hasFillers) score += 0.2; // Some fillers are natural
      if (hasContractions) score += 0.2; // Contractions indicate natural speech
      if (hasInformalLanguage) score += 0.1; // Some informal language is natural
      
      naturalnessScore += Math.min(1, score);
      naturalnessCount++;
    });
    
    return naturalnessCount > 0 ? (naturalnessScore / naturalnessCount) * 10 : 5;
  }

  private calculateFluency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze sentence structure and flow
    let fluencyScore = 0;
    let fluencyCount = 0;
    
    turns.forEach(turn => {
      const sentences = turn.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      if (sentences.length === 0) {
        fluencyCount++;
        return;
      }
      
      // Calculate average sentence length
      const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
      
      // Ideal sentence length is 10-20 words for natural conversation
      const lengthScore = avgSentenceLength >= 8 && avgSentenceLength <= 25 ? 1 : Math.max(0, 1 - Math.abs(avgSentenceLength - 15) / 15);
      
      fluencyScore += lengthScore;
      fluencyCount++;
    });
    
    return fluencyCount > 0 ? (fluencyScore / fluencyCount) * 10 : 5;
  }

  private calculatePersonality(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze personality consistency through language patterns
    if (turns.length < 3) return 5; // Need sufficient data
    
    // Analyze consistency in communication style
    const firstHalf = turns.slice(0, Math.floor(turns.length / 2));
    const secondHalf = turns.slice(Math.floor(turns.length / 2));
    
    const firstHalfAvgLength = firstHalf.reduce((sum, t) => sum + t.content.length, 0) / firstHalf.length;
    const secondHalfAvgLength = secondHalf.reduce((sum, t) => sum + t.content.length, 0) / secondHalf.length;
    
    // Calculate consistency (lower difference = higher consistency)
    const lengthDiff = Math.abs(firstHalfAvgLength - secondHalfAvgLength);
    const consistencyScore = Math.max(0, 1 - lengthDiff / 100);
    
    return consistencyScore * 10;
  }

  private calculateRealism(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0) return 0;
    // Real implementation: compare to real interview patterns
    let realismScore = 0;
    let realismCount = 0;
    
    // Check for realistic interview patterns
    const typicalInterviewPatterns = [
      /\b(tell me about yourself|describe your experience|walk me through)\b/i,
      /\b(strengths|weaknesses|challenges)\b/i,
      /\b(why do you want|what interests you)\b/i,
      /\b(questions for me|do you have any questions)\b/i,
    ];
    
    recruiterTurns.forEach(turn => {
      let matchesPattern = false;
      typicalInterviewPatterns.forEach(pattern => {
        if (pattern.test(turn.content)) {
          matchesPattern = true;
        }
      });
      
      if (matchesPattern) {
        realismScore += 1;
      }
      realismCount++;
    });
    
    return realismCount > 0 ? (realismScore / realismCount) * 10 : 5;
  }

  private calculateListeningAbility(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Real implementation: analyze follow-up questions and references
    let listeningScore = 0;
    let listeningCount = 0;
    
    const minTurns = Math.min(recruiterTurns.length, candidateTurns.length);
    for (let i = 1; i < minTurns; i++) {
      const prevCandidateAnswer = candidateTurns[i - 1].content.toLowerCase();
      const currentRecruiterQuestion = recruiterTurns[i].content.toLowerCase();
      
      // Check if recruiter references candidate's previous answer
      const prevAnswerWords = new Set(prevCandidateAnswer.split(/\s+/).filter(w => w.length > 4));
      const currentQuestionWords = currentRecruiterQuestion.split(/\s+/);
      
      let references = 0;
      currentQuestionWords.forEach(word => {
        if (prevAnswerWords.has(word)) {
          references++;
        }
      });
      
      if (references > 0) {
        listeningScore += Math.min(1, references / 3); // Cap at reasonable references
      }
      listeningCount++;
    }
    
    return listeningCount > 0 ? (listeningScore / listeningCount) * 10 : 5;
  }

  private calculateFollowUpQuality(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Real implementation: analyze follow-up question relevance and depth
    let followUpScore = 0;
    let followUpCount = 0;
    
    const minTurns = Math.min(recruiterTurns.length, candidateTurns.length);
    for (let i = 1; i < minTurns; i++) {
      const prevCandidateAnswer = candidateTurns[i - 1].content;
      const currentRecruiterQuestion = recruiterTurns[i].content;
      
      // Check if follow-up question is specific and relevant
      const hasSpecificReference = /\b(you mentioned|you said|regarding|about)\b/i.test(currentRecruiterQuestion);
      const asksForDetail = /\b(can you|tell me more|elaborate|explain)\b/i.test(currentRecruiterQuestion);
      const reasonableLength = currentRecruiterQuestion.length > 20 && currentRecruiterQuestion.length < 200;
      
      let score = 0;
      if (hasSpecificReference) score += 0.4;
      if (asksForDetail) score += 0.3;
      if (reasonableLength) score += 0.3;
      
      followUpScore += score;
      followUpCount++;
    }
    
    return followUpCount > 0 ? (followUpScore / followUpCount) * 10 : 5;
  }

  private calculateSilenceManagement(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze timing and response patterns
    let silenceScore = 0;
    let silenceCount = 0;
    
    for (let i = 1; i < turns.length; i++) {
      const prevTurn = turns[i - 1];
      const currentTurn = turns[i];
      
      if (prevTurn.timestamp && currentTurn.timestamp) {
        const timeDiff = currentTurn.timestamp.getTime() - prevTurn.timestamp.getTime();
        
        // Ideal response time is 2-8 seconds for natural conversation
        if (timeDiff >= 2000 && timeDiff <= 8000) {
          silenceScore += 1;
        } else if (timeDiff > 0 && timeDiff < 15000) {
          silenceScore += 0.5; // Acceptable but not ideal
        }
        
        silenceCount++;
      }
    }
    
    return silenceCount > 0 ? (silenceScore / silenceCount) * 10 : 5;
  }

  private calculateStressManagement(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Real implementation: analyze stress handling through difficult questions
    let stressScore = 0;
    let stressCount = 0;
    
    // Identify potentially stressful questions
    const stressIndicators = [
      /\b(challenge|difficult|failure|mistake|weakness)\b/i,
      /\b(pressure|deadline|conflict|disagree)\b/i,
      /\b(why did you|what went wrong)\b/i,
    ];
    
    const minTurns = Math.min(recruiterTurns.length, candidateTurns.length);
    for (let i = 0; i < minTurns; i++) {
      const question = recruiterTurns[i].content;
      const answer = candidateTurns[i].content;
      
      const isStressful = stressIndicators.some(pattern => pattern.test(question));
      
      if (isStressful) {
        // Check if candidate handles it well (balanced response, not defensive)
        const answerLength = answer.length;
        const hasPositiveSpin = /\b(learned|improved|grew|developed|experience)\b/i.test(answer);
        const isDefensive = /\b(not my fault|they didn't|unfair)\b/i.test(answer);
        
        let score = 0.5; // Base score for responding
        if (answerLength > 100 && answerLength < 500) score += 0.2; // Reasonable length
        if (hasPositiveSpin) score += 0.2; // Positive framing
        if (!isDefensive) score += 0.1; // Not defensive
        
        stressScore += score;
        stressCount++;
      }
    }
    
    return stressCount > 0 ? (stressScore / stressCount) * 10 : 5;
  }

  private calculateAdaptation(recruiterTurns: ConversationTurn[], candidateTurns: ConversationTurn[]): number {
    if (recruiterTurns.length === 0 || candidateTurns.length === 0) return 0;
    // Real implementation: analyze adaptability to question types
    if (candidateTurns.length < 3) return 5;
    
    // Analyze how candidate adapts to different question types
    const firstThird = candidateTurns.slice(0, Math.floor(candidateTurns.length / 3));
    const lastThird = candidateTurns.slice(Math.floor(candidateTurns.length * 2 / 3));
    
    const firstAvgLength = firstThird.reduce((sum, t) => sum + t.content.length, 0) / firstThird.length;
    const lastAvgLength = lastThird.reduce((sum, t) => sum + t.content.length, 0) / lastThird.length;
    
    // Some adaptation is good (not identical responses)
    const adaptationDiff = Math.abs(firstAvgLength - lastAvgLength);
    const adaptationScore = Math.min(1, adaptationDiff / 50); // Normalize
    
    return adaptationScore * 10;
  }

  private calculateRepetitionAvoidance(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const repeatedPhrases = this.findRepeatedPhrases(turns);
    return Math.max(0, 10 - repeatedPhrases.length);
  }

  private calculateCVRespect(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze CV reference accuracy
    let cvScore = 0;
    let cvCount = 0;
    
    // Check for CV-related references
    const cvIndicators = [
      /\b(resume|cv|curriculum|experience|background)\b/i,
      /\b(mentioned|listed|stated|according to)\b/i,
    ];
    
    turns.forEach(turn => {
      const hasCVReference = cvIndicators.some(pattern => pattern.test(turn.content));
      if (hasCVReference) {
        cvScore += 1;
      }
      cvCount++;
    });
    
    return cvCount > 0 ? Math.min(10, (cvScore / cvCount) * 10 + 5) : 5;
  }

  private calculateContextRespect(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze context awareness
    let contextScore = 0;
    let contextCount = 0;
    
    for (let i = 1; i < turns.length; i++) {
      const prevTurn = turns[i - 1].content.toLowerCase();
      const currentTurn = turns[i].content.toLowerCase();
      
      // Check if current turn acknowledges previous context
      const contextMarkers = ["yes", "no", "right", "exactly", "correct", "understand", "agree"];
      const hasContextAck = contextMarkers.some(marker => currentTurn.includes(marker));
      
      if (hasContextAck) {
        contextScore += 1;
      }
      contextCount++;
    }
    
    return contextCount > 0 ? (contextScore / contextCount) * 10 : 5;
  }

  private calculateDifficultyRespect(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Real implementation: analyze question difficulty appropriateness
    let difficultyScore = 0;
    let difficultyCount = 0;
    
    turns.forEach(turn => {
      const content = turn.content;
      const length = content.length;
      
      // Assess difficulty based on complexity
      const hasComplexStructure = /[,.;]\s/.test(content);
      const hasTechnicalTerms = /\b(experience|skills|knowledge|expertise|technical)\b/i.test(content);
      const reasonableComplexity = length > 50 && length < 300;
      
      let score = 0.3; // Base score
      if (hasComplexStructure) score += 0.3;
      if (hasTechnicalTerms) score += 0.2;
      if (reasonableComplexity) score += 0.2;
      
      difficultyScore += score;
      difficultyCount++;
    });
    
    return difficultyCount > 0 ? (difficultyScore / difficultyCount) * 10 : 5;
  }

  // ============================================================================
  // METRICS CALCULATIONS
  // ============================================================================

  private calculateQuestionRepetitionRate(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const repeatedPhrases = this.findRepeatedPhrases(turns);
    return repeatedPhrases.length / turns.length;
  }

  private calculatePromptSize(turns: ConversationTurn[]): number {
    return turns.reduce((sum, t) => sum + (t.tokens || 0), 0);
  }

  private calculatePromptCost(turns: ConversationTurn[]): number {
    const tokens = this.calculatePromptSize(turns);
    // Mock cost calculation: $0.001 per 1000 tokens
    return (tokens / 1000) * 0.001;
  }

  private calculateAverageTurns(turns: ConversationTurn[]): number {
    return turns.length;
  }

  private calculateAverageTokens(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const totalTokens = turns.reduce((sum, t) => sum + (t.tokens || 0), 0);
    return totalTokens / turns.length;
  }

  private calculateOpenAICost(turns: ConversationTurn[]): number {
    return this.calculatePromptCost(turns);
  }

  private calculateHallucinationRate(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would detect hallucinations
    return 0.05;
  }

  private calculateRelevanceScore(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would calculate relevance
    return 0.85;
  }

  private calculateConversationFlowScore(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze flow
    return 0.80;
  }

  private calculateHumanLikeScore(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would compare to human conversations
    return 0.75;
  }

  private calculateRecruiterConsistency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze consistency
    return 0.85;
  }

  private calculateEmotionConsistency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze emotion consistency
    return 0.80;
  }

  private calculateFollowUpQualityMetric(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze follow-up quality
    return 0.75;
  }

  private calculateInterviewCoverage(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze topic coverage
    return 0.80;
  }

  private calculateEvaluationAccuracy(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would compare to ground truth
    return 0.85;
  }

  private calculateReportAccuracy(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze report quality
    return 0.80;
  }

  private calculateCoachingAccuracy(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would analyze coaching quality
    return 0.75;
  }

  private calculateAverageLatency(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    const latencies = turns.map(t => t.latency || 0);
    return latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
  }

  private calculateThroughput(turns: ConversationTurn[]): number {
    if (turns.length === 0) return 0;
    // Mock implementation - would calculate conversations per minute
    return 1.0;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private findRepeatedPhrases(turns: ConversationTurn[]): string[] {
    const phrases: string[] = [];
    const contentMap: Map<string, number> = new Map();

    turns.forEach(turn => {
      const words = turn.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) {
          contentMap.set(word, (contentMap.get(word) || 0) + 1);
        }
      });
    });

    contentMap.forEach((count, phrase) => {
      if (count > 2) {
        phrases.push(phrase);
      }
    });

    return phrases;
  }

  /**
   * Generate feedback
   */
  private generateFeedback(criteriaScores: CriteriaScores, metrics: QualityMetrics): string {
    const overall = this.averageCriteriaScores(criteriaScores);
    
    let feedback = `Overall score: ${overall.toFixed(1)}/10. `;
    
    if (overall >= 8) {
      feedback += "Excellent performance across most criteria.";
    } else if (overall >= 6) {
      feedback += "Good performance with room for improvement.";
    } else if (overall >= 4) {
      feedback += "Average performance requiring significant improvement.";
    } else {
      feedback += "Poor performance requiring major improvements.";
    }

    // Add specific feedback based on low scores
    if (criteriaScores.repetitionAvoidance < 5) {
      feedback += " Reduce question repetition.";
    }
    if (criteriaScores.naturalness < 5) {
      feedback += " Improve conversation naturalness.";
    }
    if (metrics.hallucinationRate > 0.1) {
      feedback += " Address hallucination issues.";
    }

    return feedback;
  }

  /**
   * Validate evaluation
   */
  validateEvaluation(evaluation: ConversationEvaluation): boolean {
    // Basic validation
    return (
      evaluation.id !== undefined &&
      evaluation.conversationId !== undefined &&
      evaluation.scenarioId !== undefined &&
      evaluation.overallScore >= 0 &&
      evaluation.overallScore <= 100
    );
  }

  /**
   * Compare two evaluations
   */
  compareEvaluations(
    evaluationA: ConversationEvaluation,
    evaluationB: ConversationEvaluation
  ): {
    scoreDelta: number;
    improved: boolean;
    criteriaDeltas: Partial<Record<keyof CriteriaScores, number>>;
    metricsDeltas: Partial<Record<keyof QualityMetrics, number>>;
  } {
    const scoreDelta = evaluationB.overallScore - evaluationA.overallScore;
    
    const criteriaDeltas: Partial<Record<keyof CriteriaScores, number>> = {};
    Object.keys(evaluationA.criteriaScores).forEach(key => {
      const k = key as keyof CriteriaScores;
      criteriaDeltas[k] = evaluationB.criteriaScores[k] - evaluationA.criteriaScores[k];
    });

    const metricsDeltas: Partial<Record<keyof QualityMetrics, number>> = {};
    Object.keys(evaluationA.metrics).forEach(key => {
      const k = key as keyof QualityMetrics;
      metricsDeltas[k] = evaluationB.metrics[k] - evaluationA.metrics[k];
    });

    return {
      scoreDelta,
      improved: scoreDelta > 0,
      criteriaDeltas,
      metricsDeltas,
    };
  }
}

export const evaluationEngine = EvaluationEngine.getInstance();
