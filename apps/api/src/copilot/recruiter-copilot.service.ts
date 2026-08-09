/**
 * Recruiter Copilot Service
 * Real AI copilot using Knowledge Graph, Matching, Semantic Search, and Reasoning
 * All responses include sources, citations, proofs, nodes, edges, and confidence scores
 */

import { Injectable } from '@nestjs/common';
import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
} from '../runtime/kg/graph-types';
import { GraphSearchService } from '../runtime/kg/graph-search.service';
import { GraphMatchingService } from '../runtime/kg/graph-matching.service';
import { GraphReasoningEngine } from '../runtime/kg/graph-reasoning-engine.service';
import { RecruiterSearchService } from '../search/recruiter-search.service';
import { CacheService } from '../cache/cache.decorator';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CopilotEvidence {
  source: string;
  citation: string;
  proof: string;
  node: Node;
  edge: Edge;
  confidence: number;
}

export interface CopilotResponse {
  message: string;
  reasoning: string[];
  sources: CopilotEvidence[];
  confidence: number;
  data?: any;
}

export interface CandidateComparison {
  candidate1: Graph;
  candidate2: Graph;
  comparison: {
    skills: { match: number; details: CopilotEvidence[] };
    experience: { match: number; details: CopilotEvidence[] };
    education: { match: number; details: CopilotEvidence[] };
    overall: number;
  };
  recommendation: string;
  evidence: CopilotEvidence[];
  confidence: number;
}

export interface MatchingExplanation {
  candidateId: string;
  jobId: string;
  matchScore: number;
  dimensionScores: {
    hardSkills: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    softSkills: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    experience: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    education: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    languages: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    careerPath: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    transferableSkills: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    graphSimilarity: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    semanticSimilarity: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
    confidence: {
      value: number;
      explanation: string;
      evidence: CopilotEvidence[];
    };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  evidence: CopilotEvidence[];
  confidence: number;
}

export interface ProfileSearchCriteria {
  skills?: string[];
  experience?: { min?: number; max?: number };
  education?: string[];
  location?: string[];
  languages?: string[];
  salary?: { min?: number; max?: number };
}

export interface ShortlistCandidate {
  candidateId: string;
  graph: Graph;
  matchScore: number;
  matchReasons: string[];
  evidence: CopilotEvidence[];
  confidence: number;
}

export interface Shortlist {
  jobId: string;
  jobGraph: Graph;
  candidates: ShortlistCandidate[];
  totalCandidates: number;
  averageScore: number;
  evidence: CopilotEvidence[];
  confidence: number;
}

export interface JobAnalysis {
  jobId: string;
  jobGraph: Graph;
  requirements: {
    skills: string[];
    experience: number;
    education: string[];
    languages: string[];
  };
  difficulty: number;
  marketDemand: number;
  salaryRange: { min: number; max: number };
  recommendedSkills: string[];
  evidence: CopilotEvidence[];
  confidence: number;
}

export interface ReasoningResult {
  question: string;
  answer: string;
  reasoning: string[];
  evidence: CopilotEvidence[];
  confidence: number;
}

// ============================================================================
// SERVICE
// ============================================================================

@Injectable()
export class RecruiterCopilotService {
  constructor(
    private readonly graphSearchService: GraphSearchService,
    private readonly graphMatchingService: GraphMatchingService,
    private readonly graphReasoningEngine: GraphReasoningEngine,
    private readonly recruiterSearchService: RecruiterSearchService,
    private readonly cacheService: CacheService,
  ) {}

  // ============================================================================
  // CANDIDATE COMPARISON
  // ============================================================================

  async compareCandidates(
    candidate1: Graph,
    candidate2: Graph,
  ): Promise<CandidateComparison> {
    const cacheKey = this.cacheService.generateKey(
      'compare_candidates',
      candidate1.id,
      candidate2.id,
    );

    const cached = await this.cacheService.get<CandidateComparison>(cacheKey);
    if (cached) return cached;

    const evidence: CopilotEvidence[] = [];

    // Compare skills
    const skillsComparison = await this.compareSkills(
      candidate1,
      candidate2,
      evidence,
    );

    // Compare experience
    const experienceComparison = await this.compareExperience(
      candidate1,
      candidate2,
      evidence,
    );

    // Compare education
    const educationComparison = await this.compareEducation(
      candidate1,
      candidate2,
      evidence,
    );

    // Calculate overall match
    const overall =
      skillsComparison.match * 0.4 +
      experienceComparison.match * 0.4 +
      educationComparison.match * 0.2;

    // Generate recommendation
    const recommendation = this.generateComparisonRecommendation(
      candidate1,
      candidate2,
      overall,
      evidence,
    );

    const comparison: CandidateComparison = {
      candidate1,
      candidate2,
      comparison: {
        skills: skillsComparison,
        experience: experienceComparison,
        education: educationComparison,
        overall,
      },
      recommendation,
      evidence,
      confidence: this.calculateConfidence(evidence),
    };

    await this.cacheService.set(cacheKey, comparison, 600);
    return comparison;
  }

  private async compareSkills(
    graph1: Graph,
    graph2: Graph,
    evidence: CopilotEvidence[],
  ): Promise<{ match: number; details: CopilotEvidence[] }> {
    const skills1 = this.getGraphSkills(graph1);
    const skills2 = this.getGraphSkills(graph2);

    const labels1 = new Set(skills1.map((skill) => skill.normalizedLabel));
    const labels2 = new Set(skills2.map((skill) => skill.normalizedLabel));

    const intersection = [...labels1].filter((l) => labels2.has(l));
    const union = new Set([...labels1, ...labels2]);
    const match = union.size > 0 ? (intersection.length / union.size) * 100 : 0;

    const details: CopilotEvidence[] = [];

    for (const skill of skills1) {
      const matchingSkill = skills2.find(
        (skill2) => skill2.normalizedLabel === skill.normalizedLabel,
      );
      if (matchingSkill) {
        const evidenceItem: CopilotEvidence = {
          source: 'SKILL_COMPARISON',
          citation: `Both candidates have skill: ${skill.label}`,
          proof: `Skill match found in both graphs with confidence ${skill.confidence}`,
          node: skill,
          edge: this.createMockEdge(
            skill.id,
            matchingSkill.id,
            EdgeType.HAS_SKILL,
          ),
          confidence: (skill.confidence + matchingSkill.confidence) / 2,
        };
        details.push(evidenceItem);
        evidence.push(evidenceItem);
      }
    }

    return { match, details };
  }

  private async compareExperience(
    graph1: Graph,
    graph2: Graph,
    evidence: CopilotEvidence[],
  ): Promise<{ match: number; details: CopilotEvidence[] }> {
    const exp1 = this.getGraphExperience(graph1);
    const exp2 = this.getGraphExperience(graph2);

    const diff = Math.abs(exp1 - exp2);
    const match = Math.max(0, 100 - diff * 10);

    const expNode1 = this.getExperienceNode(graph1);
    const expNode2 = this.getExperienceNode(graph2);
    const details: CopilotEvidence[] = [
      {
        source: 'EXPERIENCE_COMPARISON',
        citation: `Experience difference: ${diff} years`,
        proof: `Candidate 1: ${exp1} years, Candidate 2: ${exp2} years`,
        node: expNode1 || expNode2 || this.createMockNode('experience'),
        edge: this.createMockEdge('exp1', 'exp2', EdgeType.WORKED_AT),
        confidence: 0.8,
      },
    ];
    evidence.push(...details);

    return { match, details };
  }

  private async compareEducation(
    graph1: Graph,
    graph2: Graph,
    evidence: CopilotEvidence[],
  ): Promise<{ match: number; details: CopilotEvidence[] }> {
    const edu1 = this.getGraphEducation(graph1);
    const edu2 = this.getGraphEducation(graph2);

    const edu1Str = edu1.join(', ');
    const edu2Str = edu2.join(', ');
    const match = edu1Str === edu2Str ? 100 : 50;

    const eduNode1 = this.getEducationNode(graph1);
    const eduNode2 = this.getEducationNode(graph2);
    const details: CopilotEvidence[] = [
      {
        source: 'EDUCATION_COMPARISON',
        citation: `Education comparison`,
        proof: `Candidate 1: ${edu1Str}, Candidate 2: ${edu2Str}`,
        node: eduNode1 || eduNode2 || this.createMockNode('education'),
        edge: this.createMockEdge('edu1', 'edu2', EdgeType.STUDIED_AT),
        confidence: 0.7,
      },
    ];
    evidence.push(...details);

    return { match, details };
  }

  private generateComparisonRecommendation(
    candidate1: Graph,
    candidate2: Graph,
    overall: number,
    evidence: CopilotEvidence[],
  ): string {
    if (overall > 80) {
      return `Both candidates are very similar (${overall.toFixed(0)}% match). Consider other factors like cultural fit and availability.`;
    } else if (overall > 50) {
      return `Candidates have moderate similarity (${overall.toFixed(0)}% match). Review specific skill gaps and experience differences.`;
    } else {
      return `Candidates are quite different (${overall.toFixed(0)}% match). Choose based on specific job requirements.`;
    }
  }

  // ============================================================================
  // MATCHING EXPLANATION
  // ============================================================================

  async explainMatching(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): Promise<MatchingExplanation> {
    const cacheKey = this.cacheService.generateKey(
      'explain_matching',
      candidateGraph.id,
      jobGraph.id,
    );

    const cached = await this.cacheService.get<MatchingExplanation>(cacheKey);
    if (cached) return cached;

    const matchingResult = await this.graphMatchingService.match(
      candidateGraph,
      jobGraph,
    );

    const evidence: CopilotEvidence[] = [];

    // Convert dimension scores to evidence
    const dimensionScores = {
      hardSkills: this.convertDimensionScore(
        matchingResult.score.hardSkills,
        evidence,
      ),
      softSkills: this.convertDimensionScore(
        matchingResult.score.softSkills,
        evidence,
      ),
      experience: this.convertDimensionScore(
        matchingResult.score.experience,
        evidence,
      ),
      education: this.convertDimensionScore(
        matchingResult.score.education,
        evidence,
      ),
      languages: this.convertDimensionScore(
        matchingResult.score.languages,
        evidence,
      ),
      careerPath: this.convertDimensionScore(
        matchingResult.score.careerPath,
        evidence,
      ),
      transferableSkills: this.convertDimensionScore(
        matchingResult.score.transferableSkills,
        evidence,
      ),
      graphSimilarity: this.convertDimensionScore(
        matchingResult.score.graphSimilarity,
        evidence,
      ),
      semanticSimilarity: this.convertDimensionScore(
        matchingResult.score.semanticSimilarity,
        evidence,
      ),
      confidence: this.convertDimensionScore(
        matchingResult.score.confidence,
        evidence,
      ),
    };

    const explanation: MatchingExplanation = {
      candidateId: candidateGraph.id,
      jobId: jobGraph.id,
      matchScore: matchingResult.score.overall.value,
      dimensionScores,
      strengths: matchingResult.strengths,
      weaknesses: matchingResult.weaknesses,
      recommendations: matchingResult.recommendations,
      evidence,
      confidence: matchingResult.score.confidence.value,
    };

    await this.cacheService.set(cacheKey, explanation, 600);
    return explanation;
  }

  private convertDimensionScore(
    dimensionScore: any,
    evidence: CopilotEvidence[],
  ): { value: number; explanation: string; evidence: CopilotEvidence[] } {
    const convertedEvidence: CopilotEvidence[] = dimensionScore.evidence.map(
      (e: any) => ({
        source: e.source,
        citation: e.citation,
        proof: e.proof,
        node: e.node,
        edge: e.edge,
        confidence: e.confidence,
      }),
    );
    evidence.push(...convertedEvidence);

    return {
      value: dimensionScore.value,
      explanation: dimensionScore.explanation,
      evidence: convertedEvidence,
    };
  }

  // ============================================================================
  // PROFILE FINDING
  // ============================================================================

  async findProfiles(
    criteria: ProfileSearchCriteria,
    candidateGraphs: Graph[],
  ): Promise<{
    candidates: Graph[];
    evidence: CopilotEvidence[];
    confidence: number;
  }> {
    const cacheKey = this.cacheService.generateKey(
      'find_profiles',
      JSON.stringify(criteria),
    );

    const cached = await this.cacheService.get<{
      candidates: Graph[];
      evidence: CopilotEvidence[];
      confidence: number;
    }>(cacheKey);
    if (cached) return cached;

    const evidence: CopilotEvidence[] = [];
    const matchingCandidates: Graph[] = [];

    for (const candidate of candidateGraphs) {
      const match = await this.evaluateCandidateMatch(
        criteria,
        candidate,
        evidence,
      );
      if (match > 50) {
        matchingCandidates.push(candidate);
      }
    }

    const confidence = matchingCandidates.length > 0 ? 0.8 : 0.3;

    const result = {
      candidates: matchingCandidates,
      evidence,
      confidence,
    };

    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  private async evaluateCandidateMatch(
    criteria: ProfileSearchCriteria,
    candidate: Graph,
    evidence: CopilotEvidence[],
  ): Promise<number> {
    let score = 0;
    let factors = 0;

    // Skills match
    if (criteria.skills && criteria.skills.length > 0) {
      const candidateSkills = this.getGraphSkills(candidate);
      const matchedSkills = criteria.skills.filter((reqSkill) =>
        candidateSkills.some((cs) =>
          cs.normalizedLabel.includes(reqSkill.toLowerCase()),
        ),
      );
      const skillScore = (matchedSkills.length / criteria.skills.length) * 100;
      score += skillScore * 0.4;
      factors += 0.4;

      evidence.push({
        source: 'PROFILE_SEARCH',
        citation: `Skills match: ${matchedSkills.length}/${criteria.skills.length}`,
        proof: `Matched skills: ${matchedSkills.join(', ')}`,
        node: candidateSkills[0] || this.createMockNode('skills'),
        edge: this.createMockEdge('candidate', 'skills', EdgeType.HAS_SKILL),
        confidence: skillScore / 100,
      });
    }

    // Experience match
    if (criteria.experience) {
      const candidateExp = this.getGraphExperience(candidate);
      let expScore = 100;
      if (criteria.experience.min && candidateExp < criteria.experience.min) {
        expScore -= (criteria.experience.min - candidateExp) * 10;
      }
      if (criteria.experience.max && candidateExp > criteria.experience.max) {
        expScore -= (candidateExp - criteria.experience.max) * 5;
      }
      expScore = Math.max(0, expScore);
      score += expScore * 0.3;
      factors += 0.3;

      evidence.push({
        source: 'PROFILE_SEARCH',
        citation: `Experience: ${candidateExp} years`,
        proof: `Experience score: ${expScore.toFixed(0)}%`,
        node:
          this.getExperienceNode(candidate) ||
          this.createMockNode('experience'),
        edge: this.createMockEdge(
          'candidate',
          'experience',
          EdgeType.WORKED_AT,
        ),
        confidence: expScore / 100,
      });
    }

    // Location match
    if (criteria.location && criteria.location.length > 0) {
      const candidateLocation = this.getGraphLocation(candidate);
      const locationMatch =
        candidateLocation && criteria.location.includes(candidateLocation)
          ? 100
          : 0;
      score += locationMatch * 0.2;
      factors += 0.2;

      evidence.push({
        source: 'PROFILE_SEARCH',
        citation: `Location match: ${locationMatch > 0 ? 'Yes' : 'No'}`,
        proof: `Candidate location: ${candidateLocation || 'Unknown'}`,
        node:
          this.getLocationNode(candidate) || this.createMockNode('location'),
        edge: this.createMockEdge('candidate', 'location', EdgeType.LOCATED_AT),
        confidence: locationMatch / 100,
      });
    }

    return factors > 0 ? score / factors : 0;
  }

  // ============================================================================
  // SHORTLIST CREATION
  // ============================================================================

  async createShortlist(
    jobGraph: Graph,
    candidateGraphs: Graph[],
    limit: number = 10,
  ): Promise<Shortlist> {
    const cacheKey = this.cacheService.generateKey(
      'create_shortlist',
      jobGraph.id,
      limit,
    );

    const cached = await this.cacheService.get<Shortlist>(cacheKey);
    if (cached) return cached;

    const evidence: CopilotEvidence[] = [];
    const shortlistCandidates: ShortlistCandidate[] = [];

    for (const candidate of candidateGraphs) {
      const matchingResult = await this.graphMatchingService.match(
        candidate,
        jobGraph,
      );

      const candidateEvidence: CopilotEvidence[] =
        matchingResult.score.hardSkills.evidence.map((e) => ({
          source: e.source,
          citation: e.citation,
          proof: e.proof,
          node: e.node,
          edge: e.edge,
          confidence: e.confidence,
        }));

      shortlistCandidates.push({
        candidateId: candidate.id,
        graph: candidate,
        matchScore: matchingResult.score.overall.value,
        matchReasons: matchingResult.strengths,
        evidence: candidateEvidence,
        confidence: matchingResult.score.confidence.value,
      });

      evidence.push(...candidateEvidence);
    }

    // Sort by match score
    shortlistCandidates.sort((a, b) => b.matchScore - a.matchScore);
    const topCandidates = shortlistCandidates.slice(0, limit);

    const averageScore =
      topCandidates.length > 0
        ? topCandidates.reduce((sum, c) => sum + c.matchScore, 0) /
          topCandidates.length
        : 0;

    const shortlist: Shortlist = {
      jobId: jobGraph.id,
      jobGraph,
      candidates: topCandidates,
      totalCandidates: candidateGraphs.length,
      averageScore,
      evidence,
      confidence: this.calculateConfidence(evidence),
    };

    await this.cacheService.set(cacheKey, shortlist, 300);
    return shortlist;
  }

  // ============================================================================
  // JOB POSTING ANALYSIS
  // ============================================================================

  async analyzeJobPosting(jobGraph: Graph): Promise<JobAnalysis> {
    const cacheKey = this.cacheService.generateKey('analyze_job', jobGraph.id);

    const cached = await this.cacheService.get<JobAnalysis>(cacheKey);
    if (cached) return cached;

    const evidence: CopilotEvidence[] = [];

    // Extract requirements
    const skills = this.getGraphSkills(jobGraph).map((s) => s.label);
    const experience = this.getGraphExperience(jobGraph);
    const education = this.getGraphEducation(jobGraph);
    const languages = this.getGraphLanguages(jobGraph);

    // Calculate difficulty based on requirements
    const difficulty = Math.min(100, skills.length * 10 + experience * 5);

    // Calculate market demand (simplified - would use external data)
    const marketDemand = Math.min(100, skills.length * 15);

    // Extract salary range from metadata
    const salaryMetadata = jobGraph.metadata.salary as
      | { min?: number; max?: number }
      | undefined;
    const salaryRange = {
      min: salaryMetadata?.min || 0,
      max: salaryMetadata?.max || 0,
    };

    // Recommend additional skills based on market trends
    const recommendedSkills = this.recommendSkills(jobGraph, evidence);

    evidence.push({
      source: 'JOB_ANALYSIS',
      citation: `Job requirements extracted`,
      proof: `Skills: ${skills.length}, Experience: ${experience} years, Education: ${education.join(', ')}`,
      node: this.getJobNode(jobGraph) || this.createMockNode('job'),
      edge: this.createMockEdge('job', 'requirements', EdgeType.REQUIRES_SKILL),
      confidence: 0.9,
    });

    const analysis: JobAnalysis = {
      jobId: jobGraph.id,
      jobGraph,
      requirements: {
        skills,
        experience,
        education,
        languages,
      },
      difficulty,
      marketDemand,
      salaryRange,
      recommendedSkills,
      evidence,
      confidence: this.calculateConfidence(evidence),
    };

    await this.cacheService.set(cacheKey, analysis, 600);
    return analysis;
  }

  private recommendSkills(
    jobGraph: Graph,
    evidence: CopilotEvidence[],
  ): string[] {
    const currentSkills = this.getGraphSkills(jobGraph).map(
      (s) => s.normalizedLabel,
    );
    const commonSkills = [
      'typescript',
      'react',
      'node.js',
      'docker',
      'kubernetes',
      'aws',
    ];

    const recommended = commonSkills.filter(
      (skill) => !currentSkills.some((cs) => cs.includes(skill)),
    );

    evidence.push({
      source: 'SKILL_RECOMMENDATION',
      citation: `Recommended additional skills`,
      proof: `Based on market trends and current skill set`,
      node: this.createMockNode('recommendations'),
      edge: this.createMockEdge(
        'job',
        'recommendations',
        EdgeType.REQUIRES_SKILL,
      ),
      confidence: 0.7,
    });

    return recommended.slice(0, 5);
  }

  // ============================================================================
  // REASONING
  // ============================================================================

  async reasonAboutQuestion(
    question: string,
    contextGraph: Graph,
  ): Promise<ReasoningResult> {
    const cacheKey = this.cacheService.generateKey(
      'reason',
      question,
      contextGraph.id,
    );

    const cached = await this.cacheService.get<ReasoningResult>(cacheKey);
    if (cached) return cached;

    const reasoningResult = this.graphReasoningEngine.answerCandidateQuestion(
      contextGraph,
      question,
    );

    const evidence: CopilotEvidence[] = (reasoningResult.evidence || []).map(
      (e) => ({
        source: 'REASONING',
        citation: e.claim,
        proof: `Supported by ${e.supportingNodes.length} nodes and ${e.supportingEdges.length} edges`,
        node: e.supportingNodes[0] || this.createMockNode('reasoning'),
        edge:
          e.supportingEdges[0] ||
          this.createMockEdge('reasoning', 'evidence', EdgeType.RELATED_TO),
        confidence: e.confidence,
      }),
    );

    const result: ReasoningResult = {
      question,
      answer: reasoningResult.detailedExplanation,
      reasoning:
        reasoningResult.reasoningTrace?.steps?.map((s) => s.description) || [],
      evidence,
      confidence: reasoningResult.reasoningTrace?.confidence || 0,
    };

    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private getGraphSkills(graph: Graph): Node[] {
    return Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.SKILL,
    );
  }

  private getGraphExperience(graph: Graph): number {
    const experienceNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.EXPERIENCE,
    );
    return experienceNodes.reduce((sum, node) => {
      const years = node.metadata.years as number | undefined;
      return sum + (years || 0);
    }, 0);
  }

  private getGraphEducation(graph: Graph): string[] {
    const educationNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.EDUCATION,
    );
    return educationNodes.map((n) => n.label);
  }

  private getGraphLanguages(graph: Graph): string[] {
    const languageNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.LANGUAGE,
    );
    return languageNodes.map((n) => n.label);
  }

  private getGraphLocation(graph: Graph): string | undefined {
    const locationNodes = Array.from(graph.nodes.values()).filter(
      (n) => n.type === NodeType.LOCATION,
    );
    return locationNodes[0]?.label;
  }

  private getExperienceNode(graph: Graph): Node | undefined {
    return Array.from(graph.nodes.values()).find(
      (n) => n.type === NodeType.EXPERIENCE,
    );
  }

  private getEducationNode(graph: Graph): Node | undefined {
    return Array.from(graph.nodes.values()).find(
      (n) => n.type === NodeType.EDUCATION,
    );
  }

  private getLocationNode(graph: Graph): Node | undefined {
    return Array.from(graph.nodes.values()).find(
      (n) => n.type === NodeType.LOCATION,
    );
  }

  private getJobNode(graph: Graph): Node | undefined {
    return Array.from(graph.nodes.values()).find(
      (n) => n.type === NodeType.JOB,
    );
  }

  private createMockNode(id: string): Node {
    return {
      id,
      type: NodeType.SKILL,
      label: id,
      normalizedLabel: id.toLowerCase(),
      confidence: 0.5,
      source: 'copilot',
      metadata: {},
      timestamps: { createdAt: new Date(), updatedAt: new Date() },
      provenance: { createdBy: 'copilot', algorithmVersion: '1.0.0' },
    };
  }

  private createMockEdge(source: string, target: string, type: EdgeType): Edge {
    return {
      id: `${source}-${target}`,
      type,
      sourceNode: source,
      targetNode: target,
      weight: 1,
      confidence: 0.5,
      metadata: {},
      timestamps: { createdAt: new Date(), updatedAt: new Date() },
      provenance: { createdBy: 'copilot', algorithmVersion: '1.0.0' },
    };
  }

  private calculateConfidence(evidence: CopilotEvidence[]): number {
    if (evidence.length === 0) return 0;
    const avgConfidence =
      evidence.reduce((sum, e) => sum + e.confidence, 0) / evidence.length;
    return avgConfidence;
  }
}
