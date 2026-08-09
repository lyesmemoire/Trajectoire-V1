/**
 * Knowledge Graph RH Runtime v2
 * Main Knowledge Graph Service
 * Orchestrates graph building, querying, and management
 */

import { v4 as uuidv4 } from 'uuid';
import {
  Graph,
  Node,
  Edge,
  CandidateGraphInput,
  JobGraphInput,
} from './graph-types';
import { NodeBuilderService } from './node-builder.service';
import { EdgeBuilderService } from './edge-builder.service';
import { GraphValidatorService } from './graph-validator.service';
import { GraphSerializerService } from './graph-serializer.service';
import { GraphQueryService } from './graph-query.service';
import { GraphTraversalService } from './graph-traversal.service';
import { GraphStatisticsService } from './graph-statistics.service';
import { NodeType, EdgeType } from './graph-types';

export class KnowledgeGraphService {
  private graphs: Map<string, Graph> = new Map();

  constructor(
    private readonly nodeBuilder: NodeBuilderService,
    private readonly edgeBuilder: EdgeBuilderService,
    private readonly graphValidator: GraphValidatorService,
    private readonly graphSerializer: GraphSerializerService,
    private readonly graphQuery: GraphQueryService,
    private readonly graphTraversal: GraphTraversalService,
    private readonly graphStatistics: GraphStatisticsService,
  ) {}

  /**
   * Build a candidate graph from CV data
   */
  buildCandidateGraph(input: CandidateGraphInput): Graph {
    const graphId = uuidv4();
    const nodes = new Map<string, Node>();
    const edges = new Map<string, Edge>();

    // Create Candidate node
    const candidateNode = this.nodeBuilder.createCandidate(
      input.candidateId,
      input.personalInfo.name,
      {
        confidence: 1.0,
        source: 'CV_PARSER',
        metadata: {
          email: input.personalInfo.email,
          phone: input.personalInfo.phone,
          location: input.personalInfo.location,
        },
      },
    );
    nodes.set(candidateNode.id, candidateNode);

    // Create and link Skills
    input.skills.technical.forEach((skillName) => {
      const skillNode = this.nodeBuilder.createSkill(skillName, {
        confidence: 0.9,
        source: 'CV_PARSER',
      });
      nodes.set(skillNode.id, skillNode);

      const edge = this.edgeBuilder.createHasSkill(
        candidateNode.id,
        skillNode.id,
        {
          confidence: 0.9,
        } as any,
      );
      edges.set(edge.id, edge);
    });

    // Create and link Soft Skills
    input.skills.soft.forEach((skillName) => {
      const softSkillNode = this.nodeBuilder.createSoftSkill(skillName, {
        confidence: 0.85,
        source: 'CV_PARSER',
      });
      nodes.set(softSkillNode.id, softSkillNode);

      const edge = this.edgeBuilder.createHasSoftSkill(
        candidateNode.id,
        softSkillNode.id,
        {
          confidence: 0.85,
        },
      );
      edges.set(edge.id, edge);
    });

    // Create and link Languages
    input.languages.forEach((lang) => {
      const languageNode = this.nodeBuilder.createLanguage(lang.name, {
        confidence: 0.95,
        source: 'CV_PARSER',
        metadata: { level: lang.level },
      });
      nodes.set(languageNode.id, languageNode);

      const edge = this.edgeBuilder.createHasLanguage(
        candidateNode.id,
        languageNode.id,
        {
          weight: 0.95,
          confidence: 0.95,
        },
      );
      edges.set(edge.id, edge);
    });

    // Create and link Certifications
    input.certifications.forEach((cert) => {
      const certNode = this.nodeBuilder.createCertification(cert.name, {
        confidence: 0.9,
        source: 'CV_PARSER',
        metadata: {
          issuer: cert.issuer,
          year: cert.year,
        },
      });
      nodes.set(certNode.id, certNode);

      const edge = this.edgeBuilder.createHasCertification(
        candidateNode.id,
        certNode.id,
        {
          weight: 0.9,
          confidence: 0.9,
        },
      );
      edges.set(edge.id, edge);
    });

    // Create and link Experience
    input.experience.forEach((exp) => {
      const experienceNode = this.nodeBuilder.createExperience(exp.title, {
        confidence: 0.95,
        source: 'CV_PARSER',
        metadata: {
          period: exp.period,
          location: exp.location,
        },
      });
      nodes.set(experienceNode.id, experienceNode);

      // Link to candidate
      const expEdge = this.edgeBuilder.createHasProject(
        candidateNode.id,
        experienceNode.id,
        {
          weight: 0.95,
          confidence: 0.95,
          reason: 'Candidate has this experience',
        },
      );
      edges.set(expEdge.id, expEdge);

      // Create Company node
      const companyNode = this.nodeBuilder.createCompany(exp.company, {
        confidence: 0.9,
        source: 'CV_PARSER',
      });
      nodes.set(companyNode.id, companyNode);

      // Link experience to company
      const edge = this.edgeBuilder.createWorkedAt(
        experienceNode.id,
        companyNode.id,
        {
          confidence: 0.95,
        } as any,
      );
      edges.set(edge.id, edge);

      // Create and link Technologies
      if (exp.technologies) {
        exp.technologies.forEach((techName) => {
          const techNode = this.nodeBuilder.createTechnology(techName, {
            confidence: 0.85,
            source: 'CV_PARSER',
          });
          nodes.set(techNode.id, techNode);

          const techEdge = this.edgeBuilder.createUsesTech(
            experienceNode.id,
            techNode.id,
            {
              confidence: 0.9,
            } as any,
          );
          edges.set(techEdge.id, techEdge);
        });
      }

      // Create and link Achievements
      if (exp.achievements) {
        exp.achievements.forEach((achievement) => {
          const achievementNode = this.nodeBuilder.createAchievement(
            achievement,
            {
              confidence: 0.8,
              source: 'CV_PARSER',
            },
          );
          nodes.set(achievementNode.id, achievementNode);

          const achievementEdge = this.edgeBuilder.createPartOf(
            achievementNode.id,
            experienceNode.id,
            {
              weight: 0.8,
              confidence: 0.8,
              reason: 'Achievement part of experience',
            },
          );
          edges.set(achievementEdge.id, achievementEdge);
        });
      }
    });

    // Create and link Education
    input.education.forEach((edu) => {
      const educationNode = this.nodeBuilder.createEducation(edu.degree, {
        confidence: 0.95,
        source: 'CV_PARSER',
        metadata: {
          year: edu.year,
          field: edu.field,
        },
      });
      nodes.set(educationNode.id, educationNode);

      // Link to candidate
      const eduEdge = this.edgeBuilder.createHasProject(
        candidateNode.id,
        educationNode.id,
        {
          weight: 0.95,
          confidence: 0.95,
          reason: 'Candidate has this education',
        },
      );
      edges.set(eduEdge.id, eduEdge);

      // Create School node
      const schoolNode = this.nodeBuilder.createSchool(edu.school, {
        confidence: 0.9,
        source: 'CV_PARSER',
      });
      nodes.set(schoolNode.id, schoolNode);

      // Link education to school
      const schoolEdge = this.edgeBuilder.createStudiedAt(
        educationNode.id,
        schoolNode.id,
        {
          weight: 0.9,
          confidence: 0.9,
        },
      );
      edges.set(schoolEdge.id, schoolEdge);
    });

    // Create and link Projects
    if (input.projects) {
      input.projects.forEach((project) => {
        const projectNode = this.nodeBuilder.createProject(project.name, {
          confidence: 0.9,
          source: 'CV_PARSER',
          metadata: {
            description: project.description,
          },
        });
        nodes.set(projectNode.id, projectNode);

        // Link to candidate
        const projectEdge = this.edgeBuilder.createHasProject(
          candidateNode.id,
          projectNode.id,
          {
            weight: 0.9,
            confidence: 0.9,
            reason: 'Candidate has this project',
          },
        );
        edges.set(projectEdge.id, projectEdge);

        // Create and link Technologies
        if (project.technologies) {
          project.technologies.forEach((techName) => {
            const techNode = this.nodeBuilder.createTechnology(techName, {
              confidence: 0.85,
              source: 'CV_PARSER',
            });
            nodes.set(techNode.id, techNode);

            const techEdge = this.edgeBuilder.createUsesTech(
              projectNode.id,
              techNode.id,
              {
                confidence: 0.9,
              } as any,
            );
            edges.set(techEdge.id, techEdge);
          });
        }

        // Create and link Achievements
        if (project.achievements) {
          project.achievements.forEach((achievement) => {
            const achievementNode = this.nodeBuilder.createAchievement(
              achievement,
              {
                confidence: 0.8,
                source: 'CV_PARSER',
              },
            );
            nodes.set(achievementNode.id, achievementNode);

            const achievementEdge = this.edgeBuilder.createPartOf(
              achievementNode.id,
              projectNode.id,
              {
                weight: 0.8,
                confidence: 0.8,
                reason: 'Achievement part of project',
              },
            );
            edges.set(achievementEdge.id, achievementEdge);
          });
        }
      });
    }

    const graph: Graph = {
      id: graphId,
      nodes,
      edges,
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'CANDIDATE_GRAPH',
        candidateId: input.candidateId,
      },
    };

    // Validate graph
    const validation = this.graphValidator.validate(graph);
    if (!validation.isValid) {
      console.warn('Graph validation warnings:', validation.warnings);
    }

    // Store graph
    this.graphs.set(graphId, graph);

    return graph;
  }

  /**
   * Build a job graph from job data
   */
  buildJobGraph(input: JobGraphInput): Graph {
    const graphId = uuidv4();
    const nodes = new Map<string, Node>();
    const edges = new Map<string, Edge>();

    // Create Job node
    const jobNode = this.nodeBuilder.createJob(input.jobId, input.title, {
      confidence: 1.0,
      source: 'JOB_EXTRACTOR',
      metadata: {
        description: input.description,
        location: input.location,
      },
    });
    nodes.set(jobNode.id, jobNode);

    // Create and link Company if present
    if (input.company) {
      const companyNode = this.nodeBuilder.createCompany(input.company, {
        confidence: 0.9,
        source: 'JOB_EXTRACTOR',
      });
      nodes.set(companyNode.id, companyNode);

      const companyEdge = this.edgeBuilder.createPartOf(
        jobNode.id,
        companyNode.id,
        {
          weight: 0.9,
          confidence: 0.9,
          reason: 'Job belongs to company',
        },
      );
      edges.set(companyEdge.id, companyEdge);
    }

    // Create and link required Skills
    input.requiredSkills.forEach((skillName) => {
      const skillNode = this.nodeBuilder.createSkill(skillName, {
        confidence: 0.95,
        source: 'JOB_EXTRACTOR',
      });
      nodes.set(skillNode.id, skillNode);

      const edge = this.edgeBuilder.createRequiresSkill(
        jobNode.id,
        skillNode.id,
        {
          confidence: 0.95,
        } as any,
      );
      edges.set(edge.id, edge);
    });

    // Create and link preferred Skills
    if (input.preferredSkills) {
      input.preferredSkills.forEach((skillName) => {
        const skillNode = this.nodeBuilder.createSkill(skillName, {
          confidence: 0.8,
          source: 'JOB_EXTRACTOR',
        });
        nodes.set(skillNode.id, skillNode);

        const edge = this.edgeBuilder.createRequiresSkill(
          jobNode.id,
          skillNode.id,
          {
            confidence: 0.8,
          } as any,
        );
        edges.set(edge.id, edge);
      });
    }

    // Create and link required Languages
    if (input.requiredLanguages) {
      input.requiredLanguages.forEach((langName) => {
        const languageNode = this.nodeBuilder.createLanguage(langName, {
          confidence: 0.95,
          source: 'JOB_EXTRACTOR',
        });
        nodes.set(languageNode.id, languageNode);

        const edge = this.edgeBuilder.createRequiresLanguage(
          jobNode.id,
          languageNode.id,
          {
            weight: 1.0,
            confidence: 0.95,
          },
        );
        edges.set(edge.id, edge);
      });
    }

    // Create and link required Certifications
    if (input.requiredCertifications) {
      input.requiredCertifications.forEach((certName) => {
        const certNode = this.nodeBuilder.createCertification(certName, {
          confidence: 0.95,
          source: 'JOB_EXTRACTOR',
        });
        nodes.set(certNode.id, certNode);

        const edge = this.edgeBuilder.createRequiresCertification(
          jobNode.id,
          certNode.id,
          {
            weight: 1.0,
            confidence: 0.95,
          },
        );
        edges.set(edge.id, edge);
      });
    }

    // Create and link Responsibilities
    if (input.responsibilities) {
      input.responsibilities.forEach((resp) => {
        const respNode = this.nodeBuilder.createResponsibility(resp, {
          confidence: 0.9,
          source: 'JOB_EXTRACTOR',
        });
        nodes.set(respNode.id, respNode);

        const edge = this.edgeBuilder.createPartOf(respNode.id, jobNode.id, {
          weight: 0.9,
          confidence: 0.9,
          reason: 'Responsibility part of job',
        });
        edges.set(edge.id, edge);
      });
    }

    // Create and link Missions
    if (input.missions) {
      input.missions.forEach((mission) => {
        const missionNode = this.nodeBuilder.createMission(mission, {
          confidence: 0.9,
          source: 'JOB_EXTRACTOR',
        });
        nodes.set(missionNode.id, missionNode);

        const edge = this.edgeBuilder.createPartOf(missionNode.id, jobNode.id, {
          weight: 0.9,
          confidence: 0.9,
          reason: 'Mission part of job',
        });
        edges.set(edge.id, edge);
      });
    }

    // Create and link Salary Range
    if (input.salaryRange) {
      const salaryRange = `${input.salaryRange.min || 0} - ${input.salaryRange.max || 0} ${input.salaryRange.currency || 'EUR'}`;
      const salaryNode = this.nodeBuilder.createSalaryRange(salaryRange, {
        confidence: 0.95,
        source: 'JOB_EXTRACTOR',
        metadata: input.salaryRange,
      });
      nodes.set(salaryNode.id, salaryNode);

      const edge = this.edgeBuilder.createPartOf(salaryNode.id, jobNode.id, {
        weight: 0.95,
        confidence: 0.95,
        reason: 'Salary range for job',
      });
      edges.set(edge.id, edge);
    }

    // Create and link Contract Type
    if (input.contractType) {
      const contractNode = this.nodeBuilder.createContractType(
        input.contractType,
        {
          confidence: 0.95,
          source: 'JOB_EXTRACTOR',
        },
      );
      nodes.set(contractNode.id, contractNode);

      const edge = this.edgeBuilder.createPartOf(contractNode.id, jobNode.id, {
        weight: 0.95,
        confidence: 0.95,
        reason: 'Contract type for job',
      });
      edges.set(edge.id, edge);
    }

    // Create and link Remote Policy
    if (input.remotePolicy) {
      const remoteNode = this.nodeBuilder.createRemotePolicy(
        input.remotePolicy,
        {
          confidence: 0.95,
          source: 'JOB_EXTRACTOR',
        },
      );
      nodes.set(remoteNode.id, remoteNode);

      const edge = this.edgeBuilder.createPartOf(remoteNode.id, jobNode.id, {
        weight: 0.95,
        confidence: 0.95,
        reason: 'Remote policy for job',
      });
      edges.set(edge.id, edge);
    }

    // Create and link Industry
    if (input.industry) {
      const industryNode = this.nodeBuilder.createIndustry(input.industry, {
        confidence: 0.9,
        source: 'JOB_EXTRACTOR',
      });
      nodes.set(industryNode.id, industryNode);

      const edge = this.edgeBuilder.createPartOf(jobNode.id, industryNode.id, {
        weight: 0.9,
        confidence: 0.9,
        reason: 'Job in industry',
      });
      edges.set(edge.id, edge);
    }

    const graph: Graph = {
      id: graphId,
      nodes,
      edges,
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'JOB_GRAPH',
        jobId: input.jobId,
      },
    };

    // Validate graph
    const validation = this.graphValidator.validate(graph);
    if (!validation.isValid) {
      console.warn('Graph validation warnings:', validation.warnings);
    }

    // Store graph
    this.graphs.set(graphId, graph);

    return graph;
  }

  /**
   * Merge two graphs
   */
  mergeGraph(graph1: Graph, graph2: Graph): Graph {
    const mergedNodes = new Map<string, Node>(graph1.nodes);
    const mergedEdges = new Map<string, Edge>(graph1.edges);

    // Merge nodes (deduplicate by normalized label and type)
    graph2.nodes.forEach((node, id) => {
      const existingNode = Array.from(mergedNodes.values()).find(
        (n) =>
          n.type === node.type && n.normalizedLabel === node.normalizedLabel,
      );

      if (existingNode) {
        // Update existing node with higher confidence
        if (node.confidence > existingNode.confidence) {
          mergedNodes.set(existingNode.id, node);
        }
      } else {
        mergedNodes.set(id, node);
      }
    });

    // Merge edges
    graph2.edges.forEach((edge, id) => {
      const existingEdge = Array.from(mergedEdges.values()).find(
        (e) =>
          e.type === edge.type &&
          e.sourceNode === edge.sourceNode &&
          e.targetNode === edge.targetNode,
      );

      if (!existingEdge) {
        mergedEdges.set(id, edge);
      }
    });

    const mergedGraph: Graph = {
      id: uuidv4(),
      nodes: mergedNodes,
      edges: mergedEdges,
      metadata: {
        version: '2.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'MERGED_GRAPH',
        sourceGraphIds: [graph1.id, graph2.id],
      },
    };

    // Validate merged graph
    const validation = this.graphValidator.validate(mergedGraph);
    if (!validation.isValid) {
      console.warn('Merged graph validation warnings:', validation.warnings);
    }

    // Store merged graph
    this.graphs.set(mergedGraph.id, mergedGraph);

    return mergedGraph;
  }

  /**
   * Find a node in a graph
   */
  findNode(graphId: string, nodeId: string): Node | undefined {
    const graph = this.graphs.get(graphId);
    if (!graph) return undefined;
    return this.graphQuery.findNode(graph, nodeId);
  }

  /**
   * Find edges in a graph
   */
  findEdges(graphId: string, edgeId: string): Edge | undefined {
    const graph = this.graphs.get(graphId);
    if (!graph) return undefined;
    return this.graphQuery.findEdge(graph, edgeId);
  }

  /**
   * Find neighbors of a node
   */
  findNeighbors(graphId: string, nodeId: string, options?: any): Node[] {
    const graph = this.graphs.get(graphId);
    if (!graph) return [];
    return this.graphQuery.findNeighbors(graph, nodeId, options);
  }

  /**
   * Get a subgraph
   */
  getSubGraph(graphId: string, nodeId: string, maxDepth?: number): Graph {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }
    return this.graphQuery.getSubGraph(graph, nodeId, maxDepth);
  }

  /**
   * Serialize a graph
   */
  serialize(graphId: string, format?: 'JSON' | 'GRAPHML' | 'NEO4J'): any {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }
    return this.graphSerializer.serialize(graph, format);
  }

  /**
   * Deserialize a graph
   */
  deserialize(data: any, format?: 'JSON' | 'GRAPHML' | 'NEO4J'): Graph {
    const graph = this.graphSerializer.deserialize(data, format);
    this.graphs.set(graph.id, graph);
    return graph;
  }

  /**
   * Get graph by ID
   */
  getGraph(graphId: string): Graph | undefined {
    return this.graphs.get(graphId);
  }

  /**
   * Delete a graph
   */
  deleteGraph(graphId: string): boolean {
    return this.graphs.delete(graphId);
  }

  /**
   * Get all graph IDs
   */
  getAllGraphIds(): string[] {
    return Array.from(this.graphs.keys());
  }

  /**
   * Get graph statistics
   */
  getGraphStatistics(graphId: string) {
    const graph = this.graphs.get(graphId);
    if (!graph) {
      throw new Error(`Graph ${graphId} not found`);
    }
    return this.graphStatistics.computeStatistics(graph);
  }

  /**
   * Clear all graphs
   */
  clearAllGraphs(): void {
    this.graphs.clear();
  }
}
