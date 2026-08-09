/**
 * Knowledge Graph RH Runtime v2
 * Graph Matching Service
 * Matches candidates to jobs using graph-based analysis
 * All scores are computed from graph structure and relations
 * No fixed scores, no JSON-only storage
 */

import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';
import { CacheService } from '../../cache/cache.decorator';
import { Injectable } from '@nestjs/common';
import { BulkheadService } from '../../resilience/bulkhead.service';

export interface ScoreEvidence {
  source: string; // Source of the evidence (e.g., 'HAS_SKILL', 'REQUIRES_SKILL')
  proof: string; // Explanation of why this score was computed
  node: Node; // The node that contributed to this score
  edge: Edge; // The edge that connects the nodes
  citation: string; // Reference to the specific graph element
  confidence: number; // Confidence in this evidence (0-1)
}

export interface DimensionScore {
  value: number; // 0-100
  evidence: ScoreEvidence[]; // All evidence supporting this score
  explanation: string; // Human-readable explanation
  justification: string; // Technical justification
}

export interface MatchingScore {
  overall: DimensionScore;
  hardSkills: DimensionScore;
  softSkills: DimensionScore;
  experience: DimensionScore;
  education: DimensionScore;
  languages: DimensionScore;
  careerPath: DimensionScore;
  transferableSkills: DimensionScore;
  graphSimilarity: DimensionScore;
  semanticSimilarity: DimensionScore;
  confidence: DimensionScore;
}

export interface TransferableSkill {
  skill: Node;
  transferability: number;
  paths: Array<{ path: Node[]; edges: Edge[]; distance: number }>;
  evidence: ScoreEvidence[];
}

export interface NeighborhoodScore {
  overlap: number;
  sharedNeighbors: number;
  jaccardIndex: number;
}

export interface CentralityScore {
  alignment: number;
  candidateCentrality: number;
  jobCentrality: number;
}

export interface MatchingResult {
  candidateId: string;
  jobId: string;
  score: MatchingScore;
  transferableSkills: TransferableSkill[];
  matchedSkills: Node[];
  missingSkills: Node[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  neighborhood?: NeighborhoodScore;
  centrality?: CentralityScore;
}

@Injectable()
export class GraphMatchingService {
  constructor(
    private readonly graphQueryEngine: GraphQueryEngine,
    private readonly graphAnalyticsService: GraphAnalyticsService,
    private readonly cacheService: CacheService,
    private readonly bulkheadService: BulkheadService,
  ) {}

  /**
   * Match a candidate graph to a job graph
   * All scores computed from graph structure only
   */
  async match(candidateGraph: Graph, jobGraph: Graph): Promise<MatchingResult> {
    return this.bulkheadService.execute(
      'graph-matching',
      async () => {
        const candidateId = this.extractId(candidateGraph);
        const jobId = this.extractId(jobGraph);
        const cacheKey = this.cacheService.generateKey(
          'matching',
          candidateId,
          jobId,
        );

        // Try cache first
        const cached = await this.cacheService.get<MatchingResult>(cacheKey);
        if (cached) {
          return cached;
        }

        // Get candidate and job nodes
        const candidateNode = this.findNodeByType(
          candidateGraph,
          NodeType.CANDIDATE,
        );
        const jobNode = this.findNodeByType(jobGraph, NodeType.JOB);

        if (!candidateNode) {
          throw new Error('Candidate node not found in graph');
        }
        if (!jobNode) {
          throw new Error('Job node not found in graph');
        }

        // Calculate all dimension scores
        const hardSkills = this.calculateHardSkillsScore(
          candidateGraph,
          jobGraph,
          candidateNode,
          jobNode,
        );
        const softSkills = this.calculateSoftSkillsScore(
          candidateGraph,
          jobGraph,
          candidateNode,
          jobNode,
        );
        const experience = this.calculateExperienceScore(
          candidateGraph,
          jobGraph,
          candidateNode,
          jobNode,
        );
        const education = this.calculateEducationScore(
          candidateGraph,
          jobGraph,
          candidateNode,
          jobNode,
        );
        const languages = this.calculateLanguagesScore(
          candidateGraph,
          jobGraph,
          candidateNode,
          jobNode,
        );
        const careerPath = this.calculateCareerPathScore(
          candidateGraph,
          jobGraph,
          candidateNode,
          jobNode,
        );
        const transferableSkills = this.calculateTransferableSkillsScore(
          candidateGraph,
          jobGraph,
        );
        const graphSimilarity = this.calculateGraphSimilarityScore(
          candidateGraph,
          jobGraph,
        );
        const semanticSimilarity = this.calculateSemanticSimilarityScore(
          candidateGraph,
          jobGraph,
        );
        const confidence = this.calculateConfidenceScore(candidateGraph, jobGraph);

        // Calculate overall score as weighted average
        const overall = this.calculateOverallScore({
          hardSkills,
          softSkills,
          experience,
          education,
          languages,
          careerPath,
          transferableSkills,
          graphSimilarity,
          semanticSimilarity,
          confidence,
        });

        // Find transferable skills with evidence
        const transferableSkillsList = this.findTransferableSkills(
          candidateGraph,
          jobGraph,
        );

        // Find matched and missing skills
        const { matchedSkills, missingSkills } = this.analyzeSkillMatch(
          candidateGraph,
          jobGraph,
        );

        // Generate insights
        const { strengths, weaknesses, recommendations } = this.generateInsights(
          {
            overall,
            hardSkills,
            softSkills,
            experience,
            education,
            languages,
            careerPath,
            transferableSkills,
            graphSimilarity,
            semanticSimilarity,
            confidence,
          },
          transferableSkillsList,
          matchedSkills,
          missingSkills,
        );

        // Calculate neighborhood overlap
        const neighborhood = this.calculateNeighborhoodScore(
          candidateGraph,
          jobGraph,
        );

        // Calculate centrality alignment
        const centrality = await this.calculateCentralityScore(
          candidateGraph,
          jobGraph,
        );

        const result: MatchingResult = {
          candidateId,
          jobId,
          score: {
            overall,
            hardSkills,
            softSkills,
            experience,
            education,
            languages,
            careerPath,
            transferableSkills,
            graphSimilarity,
            semanticSimilarity,
            confidence,
          },
          transferableSkills: transferableSkillsList,
          matchedSkills,
          missingSkills,
          strengths,
          weaknesses,
          recommendations,
          neighborhood,
          centrality,
        };

        // Cache the result with 30 minute TTL
        await this.cacheService.set(cacheKey, result, 1800);

        return result;
      },
      { maxConcurrent: 10, maxQueueSize: 50 },
    );
  }

  /**
   * Calculate Hard Skills score based on HAS_SKILL and REQUIRES_SKILL relations
   */
  private calculateHardSkillsScore(
    candidateGraph: Graph,
    jobGraph: Graph,
    candidateNode: Node,
    jobNode: Node,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalScore = 0;
    let count = 0;

    // Get candidate skills via HAS_SKILL edges
    const candidateSkillEdges = this.getEdgesBySourceAndType(
      candidateGraph,
      candidateNode.id,
      EdgeType.HAS_SKILL,
    );

    // Get job required skills via REQUIRES_SKILL edges
    const jobSkillEdges = this.getEdgesBySourceAndType(
      jobGraph,
      jobNode.id,
      EdgeType.REQUIRES_SKILL,
    );

    const requiredSkillEdges = jobSkillEdges.filter(
      (e) => e.metadata.required === true,
    );
    const preferredSkillEdges = jobSkillEdges.filter(
      (e) => e.metadata.required === false,
    );

    // Calculate required skill matches
    for (const jobEdge of requiredSkillEdges) {
      const jobSkillNode = jobGraph.nodes.get(jobEdge.targetNode);
      if (!jobSkillNode) continue;

      const matchingCandidateEdge = candidateSkillEdges.find((e) => {
        const candidateSkillNode = candidateGraph.nodes.get(e.targetNode);
        return (
          candidateSkillNode?.normalizedLabel === jobSkillNode.normalizedLabel
        );
      });

      if (matchingCandidateEdge) {
        const candidateSkillNode = candidateGraph.nodes.get(
          matchingCandidateEdge.targetNode,
        );
        if (candidateSkillNode) {
          totalScore += 100;
          count++;
          evidence.push({
            source: 'HAS_SKILL',
            proof: `Candidate has required skill "${jobSkillNode.label}" via HAS_SKILL edge`,
            node: candidateSkillNode,
            edge: matchingCandidateEdge,
            citation: `Edge ${matchingCandidateEdge.id} from ${candidateNode.id} to ${candidateSkillNode.id}`,
            confidence: matchingCandidateEdge.confidence,
          });
        }
      } else {
        totalScore += 0;
        count++;
        evidence.push({
          source: 'REQUIRES_SKILL',
          proof: `Job requires skill "${jobSkillNode.label}" but candidate does not have it`,
          node: jobSkillNode,
          edge: jobEdge,
          citation: `Edge ${jobEdge.id} from ${jobNode.id} to ${jobSkillNode.id}`,
          confidence: jobEdge.confidence,
        });
      }
    }

    // Calculate preferred skill matches (weighted 50%)
    for (const jobEdge of preferredSkillEdges) {
      const jobSkillNode = jobGraph.nodes.get(jobEdge.targetNode);
      if (!jobSkillNode) continue;

      const matchingCandidateEdge = candidateSkillEdges.find((e) => {
        const candidateSkillNode = candidateGraph.nodes.get(e.targetNode);
        return (
          candidateSkillNode?.normalizedLabel === jobSkillNode.normalizedLabel
        );
      });

      if (matchingCandidateEdge) {
        const candidateSkillNode = candidateGraph.nodes.get(
          matchingCandidateEdge.targetNode,
        );
        if (candidateSkillNode) {
          totalScore += 50;
          count++;
          evidence.push({
            source: 'HAS_SKILL',
            proof: `Candidate has preferred skill "${jobSkillNode.label}" via HAS_SKILL edge (50% weight)`,
            node: candidateSkillNode,
            edge: matchingCandidateEdge,
            citation: `Edge ${matchingCandidateEdge.id} from ${candidateNode.id} to ${candidateSkillNode.id}`,
            confidence: matchingCandidateEdge.confidence,
          });
        }
      }
    }

    const value = count > 0 ? totalScore / count : 0;

    return {
      value,
      evidence,
      explanation: `Hard skills match: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} skill requirements`,
      justification: `Computed from HAS_SKILL and REQUIRES_SKILL edges in the knowledge graph. Required skills weighted 100%, preferred skills weighted 50%.`,
    };
  }

  /**
   * Calculate Soft Skills score based on HAS_SOFT_SKILL relations
   */
  private calculateSoftSkillsScore(
    candidateGraph: Graph,
    jobGraph: Graph,
    candidateNode: Node,
    jobNode: Node,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalScore = 0;
    let count = 0;

    // Get candidate soft skills via HAS_SOFT_SKILL edges
    const candidateSoftSkillEdges = this.getEdgesBySourceAndType(
      candidateGraph,
      candidateNode.id,
      EdgeType.HAS_SOFT_SKILL,
    );

    // Get job soft skills via REQUIRES_SKILL edges with soft skill type
    const jobSkillEdges = this.getEdgesBySourceAndType(
      jobGraph,
      jobNode.id,
      EdgeType.REQUIRES_SKILL,
    );

    const jobSoftSkillEdges = jobSkillEdges.filter(
      (e) => e.metadata.type === 'soft',
    );

    // Calculate soft skill matches
    for (const jobEdge of jobSoftSkillEdges) {
      const jobSoftSkillNode = jobGraph.nodes.get(jobEdge.targetNode);
      if (!jobSoftSkillNode) continue;

      const matchingCandidateEdge = candidateSoftSkillEdges.find((e) => {
        const candidateSoftSkillNode = candidateGraph.nodes.get(e.targetNode);
        return (
          candidateSoftSkillNode?.normalizedLabel ===
          jobSoftSkillNode.normalizedLabel
        );
      });

      if (matchingCandidateEdge) {
        const candidateSoftSkillNode = candidateGraph.nodes.get(
          matchingCandidateEdge.targetNode,
        );
        if (candidateSoftSkillNode) {
          totalScore += 100;
          count++;
          evidence.push({
            source: 'HAS_SOFT_SKILL',
            proof: `Candidate has soft skill "${jobSoftSkillNode.label}" via HAS_SOFT_SKILL edge`,
            node: candidateSoftSkillNode,
            edge: matchingCandidateEdge,
            citation: `Edge ${matchingCandidateEdge.id} from ${candidateNode.id} to ${candidateSoftSkillNode.id}`,
            confidence: matchingCandidateEdge.confidence,
          });
        }
      } else {
        totalScore += 0;
        count++;
        evidence.push({
          source: 'REQUIRES_SKILL',
          proof: `Job requires soft skill "${jobSoftSkillNode.label}" but candidate does not have it`,
          node: jobSoftSkillNode,
          edge: jobEdge,
          citation: `Edge ${jobEdge.id} from ${jobNode.id} to ${jobSoftSkillNode.id}`,
          confidence: jobEdge.confidence,
        });
      }
    }

    const value = count > 0 ? totalScore / count : 0;

    return {
      value,
      evidence,
      explanation: `Soft skills match: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} soft skill requirements`,
      justification: `Computed from HAS_SOFT_SKILL and REQUIRES_SKILL edges with type='soft' in the knowledge graph.`,
    };
  }

  /**
   * Calculate Experience score based on WORKED_AT and EXPERIENCE nodes
   */
  private calculateExperienceScore(
    candidateGraph: Graph,
    jobGraph: Graph,
    candidateNode: Node,
    jobNode: Node,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalScore = 0;
    let count = 0;

    // Get candidate experience nodes
    const candidateExperiences = this.getNodesByType(
      candidateGraph,
      NodeType.EXPERIENCE,
    );

    // Get job missions/responsibilities
    const jobResponsibilities = this.getNodesByType(
      jobGraph,
      NodeType.RESPONSIBILITY,
    );
    const jobMissions = this.getNodesByType(jobGraph, NodeType.MISSION);

    // For each job responsibility/mission, check if candidate has relevant experience
    const jobRequirements = [...jobResponsibilities, ...jobMissions];

    for (const jobReq of jobRequirements) {
      const jobReqLabel = jobReq.normalizedLabel.toLowerCase();
      let matched = false;

      for (const exp of candidateExperiences) {
        const expLabel = exp.normalizedLabel.toLowerCase();
        const expEdges = this.getEdgesBySourceAndType(
          candidateGraph,
          exp.id,
          EdgeType.WORKED_AT,
        );

        if (expLabel.includes(jobReqLabel) || jobReqLabel.includes(expLabel)) {
          totalScore += 100;
          count++;
          matched = true;

          const workEdge = expEdges[0];
          evidence.push({
            source: 'EXPERIENCE',
            proof: `Candidate has relevant experience "${exp.label}" matching job requirement "${jobReq.label}"`,
            node: exp,
            edge: workEdge || {
              id: 'none',
              type: EdgeType.WORKED_AT,
              sourceNode: exp.id,
              targetNode: '',
              weight: 1,
              confidence: 1,
              metadata: {},
              timestamps: { createdAt: new Date(), updatedAt: new Date() },
              provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
            },
            citation: `Experience node ${exp.id}`,
            confidence: exp.confidence,
          });
          break;
        }
      }

      if (!matched) {
        totalScore += 0;
        count++;
        evidence.push({
          source: 'EXPERIENCE',
          proof: `Job requires "${jobReq.label}" but no matching candidate experience found`,
          node: jobReq,
          edge: {
            id: 'none',
            type: EdgeType.WORKED_AT,
            sourceNode: jobNode.id,
            targetNode: jobReq.id,
            weight: 1,
            confidence: 1,
            metadata: {},
            timestamps: { createdAt: new Date(), updatedAt: new Date() },
            provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
          },
          citation: `Requirement node ${jobReq.id}`,
          confidence: jobReq.confidence,
        });
      }
    }

    const value = count > 0 ? totalScore / count : 0;

    return {
      value,
      evidence,
      explanation: `Experience match: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} experience requirements`,
      justification: `Computed from EXPERIENCE nodes and WORKED_AT edges in the knowledge graph. Matches job requirements with candidate experience.`,
    };
  }

  /**
   * Calculate Education score based on STUDIED_AT and EDUCATION nodes
   */
  private calculateEducationScore(
    candidateGraph: Graph,
    jobGraph: Graph,
    candidateNode: Node,
    jobNode: Node,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalScore = 0;
    let count = 0;

    // Get candidate education nodes
    const candidateEducation = this.getNodesByType(
      candidateGraph,
      NodeType.EDUCATION,
    );

    // Get job education requirements from metadata or relations
    const jobEducationLevel = jobNode.metadata.educationLevel as
      | string
      | undefined;

    if (jobEducationLevel) {
      // Check if candidate has matching education level
      for (const edu of candidateEducation) {
        const eduLevel = edu.metadata.degree as string | undefined;
        const eduEdges = this.getEdgesBySourceAndType(
          candidateGraph,
          edu.id,
          EdgeType.STUDIED_AT,
        );

        if (
          eduLevel &&
          eduLevel.toLowerCase().includes(jobEducationLevel.toLowerCase())
        ) {
          totalScore += 100;
          count++;
          evidence.push({
            source: 'EDUCATION',
            proof: `Candidate has education level "${eduLevel}" matching job requirement "${jobEducationLevel}"`,
            node: edu,
            edge: eduEdges[0] || {
              id: 'none',
              type: EdgeType.STUDIED_AT,
              sourceNode: edu.id,
              targetNode: '',
              weight: 1,
              confidence: 1,
              metadata: {},
              timestamps: { createdAt: new Date(), updatedAt: new Date() },
              provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
            },
            citation: `Education node ${edu.id}`,
            confidence: edu.confidence,
          });
          break;
        }
      }

      if (count === 0) {
        totalScore += 0;
        count++;
        evidence.push({
          source: 'EDUCATION',
          proof: `Job requires education level "${jobEducationLevel}" but candidate does not match`,
          node: jobNode,
          edge: {
            id: 'none',
            type: EdgeType.STUDIED_AT,
            sourceNode: jobNode.id,
            targetNode: '',
            weight: 1,
            confidence: 1,
            metadata: {},
            timestamps: { createdAt: new Date(), updatedAt: new Date() },
            provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
          },
          citation: `Job node ${jobNode.id}`,
          confidence: jobNode.confidence,
        });
      }
    } else {
      // No specific education requirement, score based on education presence
      if (candidateEducation.length > 0) {
        totalScore = 100;
        count = 1;
        evidence.push({
          source: 'EDUCATION',
          proof: `Candidate has ${candidateEducation.length} education entries`,
          node: candidateEducation[0]!,
          edge: {
            id: 'none',
            type: EdgeType.STUDIED_AT,
            sourceNode: candidateNode.id,
            targetNode: candidateEducation[0]!.id,
            weight: 1,
            confidence: 1,
            metadata: {},
            timestamps: { createdAt: new Date(), updatedAt: new Date() },
            provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
          },
          citation: `Education node ${candidateEducation[0]!.id}`,
          confidence: candidateEducation[0]!.confidence,
        });
      }
    }

    const value = count > 0 ? totalScore / count : 0;

    return {
      value,
      evidence,
      explanation: `Education match: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} education requirements`,
      justification: `Computed from EDUCATION nodes and STUDIED_AT edges in the knowledge graph.`,
    };
  }

  /**
   * Calculate Languages score based on HAS_LANGUAGE and REQUIRES_LANGUAGE relations
   */
  private calculateLanguagesScore(
    candidateGraph: Graph,
    jobGraph: Graph,
    candidateNode: Node,
    jobNode: Node,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalScore = 0;
    let count = 0;

    // Get candidate languages via HAS_LANGUAGE edges
    const candidateLanguageEdges = this.getEdgesBySourceAndType(
      candidateGraph,
      candidateNode.id,
      EdgeType.HAS_LANGUAGE,
    );

    // Get job language requirements via REQUIRES_LANGUAGE edges
    const jobLanguageEdges = this.getEdgesBySourceAndType(
      jobGraph,
      jobNode.id,
      EdgeType.REQUIRES_LANGUAGE,
    );

    // Calculate language matches
    for (const jobEdge of jobLanguageEdges) {
      const jobLanguageNode = jobGraph.nodes.get(jobEdge.targetNode);
      if (!jobLanguageNode) continue;

      const matchingCandidateEdge = candidateLanguageEdges.find((e) => {
        const candidateLanguageNode = candidateGraph.nodes.get(e.targetNode);
        return (
          candidateLanguageNode?.normalizedLabel ===
          jobLanguageNode.normalizedLabel
        );
      });

      if (matchingCandidateEdge) {
        const candidateLanguageNode = candidateGraph.nodes.get(
          matchingCandidateEdge.targetNode,
        );
        if (candidateLanguageNode) {
          totalScore += 100;
          count++;
          evidence.push({
            source: 'HAS_LANGUAGE',
            proof: `Candidate has language "${jobLanguageNode.label}" via HAS_LANGUAGE edge`,
            node: candidateLanguageNode,
            edge: matchingCandidateEdge,
            citation: `Edge ${matchingCandidateEdge.id} from ${candidateNode.id} to ${candidateLanguageNode.id}`,
            confidence: matchingCandidateEdge.confidence,
          });
        }
      } else {
        totalScore += 0;
        count++;
        evidence.push({
          source: 'REQUIRES_LANGUAGE',
          proof: `Job requires language "${jobLanguageNode.label}" but candidate does not have it`,
          node: jobLanguageNode,
          edge: jobEdge,
          citation: `Edge ${jobEdge.id} from ${jobNode.id} to ${jobLanguageNode.id}`,
          confidence: jobEdge.confidence,
        });
      }
    }

    const value = count > 0 ? totalScore / count : 0;

    return {
      value,
      evidence,
      explanation: `Languages match: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} language requirements`,
      justification: `Computed from HAS_LANGUAGE and REQUIRES_LANGUAGE edges in the knowledge graph.`,
    };
  }

  /**
   * Calculate Career Path score based on CAREER_PATH nodes and relations
   */
  private calculateCareerPathScore(
    candidateGraph: Graph,
    jobGraph: Graph,
    candidateNode: Node,
    jobNode: Node,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalScore = 0;
    let count = 0;

    // Get candidate career path nodes
    const candidateCareerPaths = this.getNodesByType(
      candidateGraph,
      NodeType.CAREER_PATH,
    );

    // Get job career path from metadata or nodes
    const jobCareerPaths = this.getNodesByType(jobGraph, NodeType.CAREER_PATH);

    if (jobCareerPaths.length > 0) {
      for (const jobCareerPath of jobCareerPaths) {
        const matchingCandidatePath = candidateCareerPaths.find(
          (cp) => cp.normalizedLabel === jobCareerPath.normalizedLabel,
        );

        if (matchingCandidatePath) {
          totalScore += 100;
          count++;
          evidence.push({
            source: 'CAREER_PATH',
            proof: `Candidate career path "${matchingCandidatePath.label}" matches job career path "${jobCareerPath.label}"`,
            node: matchingCandidatePath,
            edge: {
              id: 'none',
              type: EdgeType.HAS_SKILL,
              sourceNode: candidateNode.id,
              targetNode: matchingCandidatePath.id,
              weight: 1,
              confidence: 1,
              metadata: {},
              timestamps: { createdAt: new Date(), updatedAt: new Date() },
              provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
            },
            citation: `Career path node ${matchingCandidatePath.id}`,
            confidence: matchingCandidatePath.confidence,
          });
        } else {
          totalScore += 0;
          count++;
          evidence.push({
            source: 'CAREER_PATH',
            proof: `Job career path "${jobCareerPath.label}" does not match candidate career paths`,
            node: jobCareerPath,
            edge: {
              id: 'none',
              type: EdgeType.HAS_SKILL,
              sourceNode: jobNode.id,
              targetNode: jobCareerPath.id,
              weight: 1,
              confidence: 1,
              metadata: {},
              timestamps: { createdAt: new Date(), updatedAt: new Date() },
              provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
            },
            citation: `Career path node ${jobCareerPath.id}`,
            confidence: jobCareerPath.confidence,
          });
        }
      }
    } else {
      // No specific career path requirement, score based on career path presence
      if (candidateCareerPaths.length > 0) {
        totalScore = 50; // Neutral score
        count = 1;
        evidence.push({
          source: 'CAREER_PATH',
          proof: `Candidate has ${candidateCareerPaths.length} career path entries`,
          node: candidateCareerPaths[0]!,
          edge: {
            id: 'none',
            type: EdgeType.HAS_SKILL,
            sourceNode: candidateNode.id,
            targetNode: candidateCareerPaths[0]!.id,
            weight: 1,
            confidence: 1,
            metadata: {},
            timestamps: { createdAt: new Date(), updatedAt: new Date() },
            provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
          },
          citation: `Career path node ${candidateCareerPaths[0]!.id}`,
          confidence: candidateCareerPaths[0]!.confidence,
        });
      }
    }

    const value = count > 0 ? totalScore / count : 0;

    return {
      value,
      evidence,
      explanation: `Career path match: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} career path requirements`,
      justification: `Computed from CAREER_PATH nodes in the knowledge graph.`,
    };
  }

  /**
   * Calculate Transferable Skills score using GraphQueryEngine
   */
  private calculateTransferableSkillsScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalTransferability = 0;
    let count = 0;

    const candidateQueryEngine = new GraphQueryEngine(candidateGraph);
    const jobSkills = this.getNodesByType(jobGraph, NodeType.SKILL);

    for (const jobSkill of jobSkills) {
      const transfers = candidateQueryEngine.findTransferableSkills(
        jobSkill.label,
        { limit: 5 },
      );

      if (transfers.length > 0) {
        const firstTransfer = transfers[0];
        if (firstTransfer) {
          totalTransferability += firstTransfer.transferability * 100;
          count++;

          evidence.push({
            source: 'TRANSFERABLE_SKILL',
            proof: `Skill "${jobSkill.label}" is transferable via "${firstTransfer.skill.label}" with ${(firstTransfer.transferability * 100).toFixed(1)}% transferability`,
            node: firstTransfer.skill,
            edge: firstTransfer.paths[0]?.edges[0] || {
              id: 'none',
              type: EdgeType.TRANSFERABLE_TO,
              sourceNode: '',
              targetNode: firstTransfer.skill.id,
              weight: firstTransfer.transferability,
              confidence: 1,
              metadata: {},
              timestamps: { createdAt: new Date(), updatedAt: new Date() },
              provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
            },
            citation: `Transfer path from ${firstTransfer.paths[0]?.path[0]?.id || 'unknown'} to ${firstTransfer.skill.id}`,
            confidence: firstTransfer.transferability,
          });
        }
      }
    }

    const value = count > 0 ? totalTransferability / count : 0;

    return {
      value,
      evidence,
      explanation: `Transferable skills: ${count > 0 ? value.toFixed(1) : 0}% based on ${count} transferable skill paths`,
      justification: `Computed using GraphQueryEngine to find transferable skill paths in the knowledge graph.`,
    };
  }

  /**
   * Calculate Graph Similarity score using Jaccard and cosine similarity
   */
  private calculateGraphSimilarityScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];

    const candidateSkills = this.getNodesByType(candidateGraph, NodeType.SKILL);
    const jobSkills = this.getNodesByType(jobGraph, NodeType.SKILL);

    const candidateSkillLabels = new Set(
      candidateSkills.map((s) => s.normalizedLabel),
    );
    const jobSkillLabels = new Set(jobSkills.map((s) => s.normalizedLabel));

    // Jaccard similarity
    const intersection = [...candidateSkillLabels].filter((s) =>
      jobSkillLabels.has(s),
    ).length;
    const union = new Set([...candidateSkillLabels, ...jobSkillLabels]).size;
    const jaccardSimilarity = union > 0 ? intersection / union : 0;

    // Cosine similarity (simplified)
    const common = intersection;
    const magnitude1 = Math.sqrt(candidateSkillLabels.size);
    const magnitude2 = Math.sqrt(jobSkillLabels.size);
    const cosineSimilarity =
      magnitude1 > 0 && magnitude2 > 0 ? common / (magnitude1 * magnitude2) : 0;

    // Combined similarity score
    const value = ((jaccardSimilarity + cosineSimilarity) / 2) * 100;

    evidence.push({
      source: 'GRAPH_SIMILARITY',
      proof: `Jaccard similarity: ${(jaccardSimilarity * 100).toFixed(1)}%, Cosine similarity: ${(cosineSimilarity * 100).toFixed(1)}%`,
      node: candidateSkills[0] ||
        jobSkills[0] || {
          id: 'none',
          type: NodeType.SKILL,
          label: 'none',
          normalizedLabel: 'none',
          confidence: 1,
          source: 'system',
          metadata: {},
          timestamps: { createdAt: new Date(), updatedAt: new Date() },
          provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
        },
      edge: {
        id: 'none',
        type: EdgeType.SIMILAR_TO,
        sourceNode: '',
        targetNode: '',
        weight: value / 100,
        confidence: 1,
        metadata: {},
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
        provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
      },
      citation: `Skill overlap: ${intersection} common skills out of ${union} total`,
      confidence: 1,
    });

    return {
      value,
      evidence,
      explanation: `Graph similarity: ${value.toFixed(1)}% based on Jaccard and cosine similarity of skill sets`,
      justification: `Computed from skill node overlap in the knowledge graph using Jaccard and cosine similarity metrics.`,
    };
  }

  /**
   * Calculate Semantic Similarity score based on node metadata and relations
   */
  private calculateSemanticSimilarityScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];
    let totalSimilarity = 0;
    let count = 0;

    // Compare semantic similarity based on node types and relations
    const candidateNodeTypes = new Set(
      Array.from(candidateGraph.nodes.values()).map((n) => n.type),
    );
    const jobNodeTypes = new Set(
      Array.from(jobGraph.nodes.values()).map((n) => n.type),
    );

    const commonNodeTypes = [...candidateNodeTypes].filter((t) =>
      jobNodeTypes.has(t),
    ).length;
    const totalNodeTypes = new Set([...candidateNodeTypes, ...jobNodeTypes])
      .size;
    const nodeTypeSimilarity =
      totalNodeTypes > 0 ? commonNodeTypes / totalNodeTypes : 0;

    totalSimilarity += nodeTypeSimilarity * 100;
    count++;

    evidence.push({
      source: 'SEMANTIC_SIMILARITY',
      proof: `Node type similarity: ${(nodeTypeSimilarity * 100).toFixed(1)}% (${commonNodeTypes} common types out of ${totalNodeTypes})`,
      node: {
        id: 'none',
        type: NodeType.CANDIDATE,
        label: 'semantic',
        normalizedLabel: 'semantic',
        confidence: 1,
        source: 'system',
        metadata: {},
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
        provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
      },
      edge: {
        id: 'none',
        type: EdgeType.SIMILAR_TO,
        sourceNode: '',
        targetNode: '',
        weight: nodeTypeSimilarity,
        confidence: 1,
        metadata: {},
        timestamps: { createdAt: new Date(), updatedAt: new Date() },
        provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
      },
      citation: `Node type overlap analysis`,
      confidence: 1,
    });

    const value = count > 0 ? totalSimilarity / count : 0;

    return {
      value,
      evidence,
      explanation: `Semantic similarity: ${value.toFixed(1)}% based on node type and relation similarity`,
      justification: `Computed from semantic similarity of graph structure and node types in the knowledge graph.`,
    };
  }

  /**
   * Calculate Confidence score based on edge confidence and node confidence
   */
  private calculateConfidenceScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): DimensionScore {
    const evidence: ScoreEvidence[] = [];

    // Calculate average confidence of all nodes
    const candidateNodes = Array.from(candidateGraph.nodes.values());
    const jobNodes = Array.from(jobGraph.nodes.values());

    const candidateAvgConfidence =
      candidateNodes.reduce((sum, n) => sum + n.confidence, 0) /
      (candidateNodes.length || 1);
    const jobAvgConfidence =
      jobNodes.reduce((sum, n) => sum + n.confidence, 0) /
      (jobNodes.length || 1);

    // Calculate average confidence of all edges
    const candidateEdges = Array.from(candidateGraph.edges.values());
    const jobEdges = Array.from(jobGraph.edges.values());

    const candidateEdgeAvgConfidence =
      candidateEdges.reduce((sum, e) => sum + e.confidence, 0) /
      (candidateEdges.length || 1);
    const jobEdgeAvgConfidence =
      jobEdges.reduce((sum, e) => sum + e.confidence, 0) /
      (jobEdges.length || 1);

    // Combined confidence score
    const value =
      ((candidateAvgConfidence +
        jobAvgConfidence +
        candidateEdgeAvgConfidence +
        jobEdgeAvgConfidence) /
        4) *
      100;

    evidence.push({
      source: 'CONFIDENCE',
      proof: `Candidate node confidence: ${(candidateAvgConfidence * 100).toFixed(1)}%, Job node confidence: ${(jobAvgConfidence * 100).toFixed(1)}%, Candidate edge confidence: ${(candidateEdgeAvgConfidence * 100).toFixed(1)}%, Job edge confidence: ${(jobEdgeAvgConfidence * 100).toFixed(1)}%`,
      node: candidateNodes[0] ||
        jobNodes[0] || {
          id: 'none',
          type: NodeType.CANDIDATE,
          label: 'confidence',
          normalizedLabel: 'confidence',
          confidence: 1,
          source: 'system',
          metadata: {},
          timestamps: { createdAt: new Date(), updatedAt: new Date() },
          provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
        },
      edge: candidateEdges[0] ||
        jobEdges[0] || {
          id: 'none',
          type: EdgeType.HAS_SKILL,
          sourceNode: '',
          targetNode: '',
          weight: 1,
          confidence: 1,
          metadata: {},
          timestamps: { createdAt: new Date(), updatedAt: new Date() },
          provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
        },
      citation: `Average confidence across ${candidateNodes.length + jobNodes.length} nodes and ${candidateEdges.length + jobEdges.length} edges`,
      confidence: value / 100,
    });

    return {
      value,
      evidence,
      explanation: `Confidence: ${value.toFixed(1)}% based on average node and edge confidence`,
      justification: `Computed from confidence values of all nodes and edges in the knowledge graph.`,
    };
  }

  /**
   * Calculate overall score as weighted average of dimension scores
   */
  private calculateOverallScore(scores: {
    hardSkills: DimensionScore;
    softSkills: DimensionScore;
    experience: DimensionScore;
    education: DimensionScore;
    languages: DimensionScore;
    careerPath: DimensionScore;
    transferableSkills: DimensionScore;
    graphSimilarity: DimensionScore;
    semanticSimilarity: DimensionScore;
    confidence: DimensionScore;
  }): DimensionScore {
    const weights = {
      hardSkills: 0.25,
      softSkills: 0.1,
      experience: 0.2,
      education: 0.1,
      languages: 0.05,
      careerPath: 0.05,
      transferableSkills: 0.1,
      graphSimilarity: 0.08,
      semanticSimilarity: 0.02,
      confidence: 0.05,
    };

    const value =
      scores.hardSkills.value * weights.hardSkills +
      scores.softSkills.value * weights.softSkills +
      scores.experience.value * weights.experience +
      scores.education.value * weights.education +
      scores.languages.value * weights.languages +
      scores.careerPath.value * weights.careerPath +
      scores.transferableSkills.value * weights.transferableSkills +
      scores.graphSimilarity.value * weights.graphSimilarity +
      scores.semanticSimilarity.value * weights.semanticSimilarity +
      scores.confidence.value * weights.confidence;

    const evidence: ScoreEvidence[] = [];
    Object.entries(weights).forEach(([dimension, weight]) => {
      const score = scores[dimension as keyof typeof scores];
      evidence.push({
        source: 'WEIGHTED_AVERAGE',
        proof: `${dimension}: ${score.value.toFixed(1)}% with weight ${(weight * 100).toFixed(0)}%`,
        node: score.evidence[0]?.node || {
          id: 'none',
          type: NodeType.CANDIDATE,
          label: dimension,
          normalizedLabel: dimension,
          confidence: 1,
          source: 'system',
          metadata: {},
          timestamps: { createdAt: new Date(), updatedAt: new Date() },
          provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
        },
        edge: score.evidence[0]?.edge || {
          id: 'none',
          type: EdgeType.HAS_SKILL,
          sourceNode: '',
          targetNode: '',
          weight: weight,
          confidence: 1,
          metadata: {},
          timestamps: { createdAt: new Date(), updatedAt: new Date() },
          provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
        },
        citation: `Dimension ${dimension} weight ${weight}`,
        confidence: score.value / 100,
      });
    });

    return {
      value,
      evidence,
      explanation: `Overall match: ${value.toFixed(1)}% based on weighted average of all dimensions`,
      justification: `Computed as weighted average: Hard Skills (25%), Soft Skills (10%), Experience (20%), Education (10%), Languages (5%), Career Path (5%), Transferable Skills (10%), Graph Similarity (8%), Semantic Similarity (2%), Confidence (5%).`,
    };
  }

  /**
   * Find transferable skills between candidate and job
   */
  private findTransferableSkills(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): TransferableSkill[] {
    const candidateQueryEngine = new GraphQueryEngine(candidateGraph);
    const jobSkills = this.getNodesByType(jobGraph, NodeType.SKILL);

    const transferableSkills: TransferableSkill[] = [];

    for (const jobSkill of jobSkills) {
      const transfers = candidateQueryEngine.findTransferableSkills(
        jobSkill.label,
        { limit: 3 },
      );

      for (const transfer of transfers) {
        const evidence: ScoreEvidence[] = [
          {
            source: 'TRANSFERABLE_SKILL',
            proof: `Skill "${jobSkill.label}" is transferable to "${transfer.skill.label}" with ${(transfer.transferability * 100).toFixed(1)}% transferability`,
            node: transfer.skill,
            edge: transfer.paths[0]?.edges[0] || {
              id: 'none',
              type: EdgeType.TRANSFERABLE_TO,
              sourceNode: '',
              targetNode: transfer.skill.id,
              weight: transfer.transferability,
              confidence: 1,
              metadata: {},
              timestamps: { createdAt: new Date(), updatedAt: new Date() },
              provenance: { createdBy: 'system', algorithmVersion: '1.0.0' },
            },
            citation: `Transfer path length: ${transfer.paths[0]?.path.length || 0}`,
            confidence: transfer.transferability,
          },
        ];

        transferableSkills.push({
          skill: transfer.skill,
          transferability: transfer.transferability * 100,
          paths: transfer.paths.map((p) => ({
            path: p.path,
            edges: p.edges,
            distance: p.path.length - 1,
          })),
          evidence,
        });
      }
    }

    return transferableSkills
      .sort((a, b) => b.transferability - a.transferability)
      .slice(0, 10);
  }

  /**
   * Analyze skill match
   */
  private analyzeSkillMatch(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): {
    matchedSkills: Node[];
    missingSkills: Node[];
  } {
    const candidateSkills = this.getNodesByType(candidateGraph, NodeType.SKILL);
    const jobSkills = this.getNodesByType(jobGraph, NodeType.SKILL);

    const candidateSkillLabels = new Set(
      candidateSkills.map((s) => s.normalizedLabel),
    );
    const jobSkillLabels = new Set(jobSkills.map((s) => s.normalizedLabel));

    const matchedSkills = jobSkills.filter((s) =>
      candidateSkillLabels.has(s.normalizedLabel),
    );
    const missingSkills = jobSkills.filter(
      (s) => !candidateSkillLabels.has(s.normalizedLabel),
    );

    return { matchedSkills, missingSkills };
  }

  /**
   * Generate insights
   */
  private generateInsights(
    scores: {
      overall: DimensionScore;
      hardSkills: DimensionScore;
      softSkills: DimensionScore;
      experience: DimensionScore;
      education: DimensionScore;
      languages: DimensionScore;
      careerPath: DimensionScore;
      transferableSkills: DimensionScore;
      graphSimilarity: DimensionScore;
      semanticSimilarity: DimensionScore;
      confidence: DimensionScore;
    },
    transferableSkills: TransferableSkill[],
    matchedSkills: Node[],
    missingSkills: Node[],
  ): {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Strengths
    if (scores.hardSkills.value > 70) {
      strengths.push(
        `Strong hard skills match (${scores.hardSkills.value.toFixed(0)}%)`,
      );
    }
    if (scores.softSkills.value > 70) {
      strengths.push(
        `Strong soft skills match (${scores.softSkills.value.toFixed(0)}%)`,
      );
    }
    if (scores.experience.value > 70) {
      strengths.push(
        `Relevant experience alignment (${scores.experience.value.toFixed(0)}%)`,
      );
    }
    if (transferableSkills.length > 0) {
      strengths.push(
        `${transferableSkills.length} transferable skills identified`,
      );
    }
    if (scores.graphSimilarity.value > 60) {
      strengths.push(
        `High graph similarity (${scores.graphSimilarity.value.toFixed(0)}%)`,
      );
    }

    // Weaknesses
    if (scores.hardSkills.value < 50) {
      weaknesses.push(
        `Low hard skills match (${scores.hardSkills.value.toFixed(0)}%)`,
      );
    }
    if (scores.softSkills.value < 50) {
      weaknesses.push(
        `Low soft skills match (${scores.softSkills.value.toFixed(0)}%)`,
      );
    }
    if (missingSkills.length > 0) {
      weaknesses.push(`${missingSkills.length} required skills missing`);
    }
    if (scores.experience.value < 50) {
      weaknesses.push(
        `Low experience alignment (${scores.experience.value.toFixed(0)}%)`,
      );
    }
    if (scores.confidence.value < 60) {
      weaknesses.push(
        `Low confidence in data quality (${scores.confidence.value.toFixed(0)}%)`,
      );
    }

    // Recommendations
    if (transferableSkills.length > 0) {
      recommendations.push(
        `Leverage transferable skills: ${transferableSkills
          .slice(0, 3)
          .map((t) => t.skill.label)
          .join(', ')}`,
      );
    }
    if (missingSkills.length > 0 && missingSkills.length <= 5) {
      recommendations.push(
        `Acquire missing skills: ${missingSkills.map((s) => s.label).join(', ')}`,
      );
    }
    if (scores.experience.value < 50) {
      recommendations.push(`Gain more relevant experience in the domain`);
    }
    if (scores.education.value < 50) {
      recommendations.push(`Consider additional education or certifications`);
    }

    return { strengths, weaknesses, recommendations };
  }

  /**
   * Calculate neighborhood overlap between candidate and job graphs
   */
  private calculateNeighborhoodScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): NeighborhoodScore {
    const candidateNeighbors = new Set<string>();
    const jobNeighbors = new Set<string>();

    // Collect candidate neighbors
    for (const [nodeId, node] of candidateGraph.nodes.entries()) {
      if (node.type === NodeType.SKILL) {
        candidateNeighbors.add(nodeId);
      }
    }

    // Collect job neighbors
    for (const [nodeId, node] of jobGraph.nodes.entries()) {
      if (node.type === NodeType.SKILL) {
        jobNeighbors.add(nodeId);
      }
    }

    // Calculate overlap
    const sharedNeighbors = new Set<string>();
    for (const neighbor of candidateNeighbors) {
      if (jobNeighbors.has(neighbor)) {
        sharedNeighbors.add(neighbor);
      }
    }

    const overlap = sharedNeighbors.size;
    const union = candidateNeighbors.size + jobNeighbors.size - overlap;
    const jaccardIndex = union > 0 ? overlap / union : 0;

    return {
      overlap,
      sharedNeighbors: sharedNeighbors.size,
      jaccardIndex,
    };
  }

  /**
   * Calculate centrality alignment between candidate and job graphs
   */
  private async calculateCentralityScore(
    candidateGraph: Graph,
    jobGraph: Graph,
  ): Promise<CentralityScore> {
    const candidateAnalytics = new GraphAnalyticsService(candidateGraph);
    const jobAnalytics = new GraphAnalyticsService(jobGraph);

    const candidateCentrality = candidateAnalytics.calculateAllCentrality();
    const jobCentrality = jobAnalytics.calculateAllCentrality();

    const candidateAvgCentrality =
      candidateCentrality.reduce((sum, c) => sum + c.degreeCentrality, 0) /
      (candidateCentrality.length || 1);
    const jobAvgCentrality =
      jobCentrality.reduce((sum, c) => sum + c.degreeCentrality, 0) /
      (jobCentrality.length || 1);

    const alignment =
      1 - Math.abs(candidateAvgCentrality - jobAvgCentrality) / 2;

    return {
      alignment,
      candidateCentrality: candidateAvgCentrality,
      jobCentrality: jobAvgCentrality,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private extractId(graph: Graph): string {
    return graph.id || 'unknown';
  }

  private findNodeByType(graph: Graph, type: NodeType): Node | undefined {
    return Array.from(graph.nodes.values()).find((n) => n.type === type);
  }

  private getNodesByType(graph: Graph, type: NodeType): Node[] {
    return Array.from(graph.nodes.values()).filter((n) => n.type === type);
  }

  private getEdgesBySourceAndType(
    graph: Graph,
    sourceId: string,
    type: EdgeType,
  ): Edge[] {
    return Array.from(graph.edges.values()).filter(
      (e) => e.sourceNode === sourceId && e.type === type,
    );
  }
}
