/**
 * Knowledge Graph RH Runtime v2
 * Runtime Graph Service
 * Orchestrates the complete pipeline for importing CV and Job data into a Knowledge Graph
 */

import {
  Graph,
  Node,
  Edge,
  NodeIndex,
  EdgeIndex,
  ValidationResult,
  NodeType,
  EdgeType,
} from './graph-types';
import { EntityNormalizerService } from './entity-normalizer.service';
import { NodeFusionService } from './node-fusion.service';
import {
  EdgeBuilderService,
  RelationDeductionOptions,
} from './edge-builder.service';
import {
  SkillBuilder,
  ExperienceBuilder,
  EducationBuilder,
  CertificationBuilder,
  LanguageBuilder,
  ProjectBuilder,
  CompanyBuilder,
  LocationBuilder,
  MissionBuilder,
  ResponsibilityBuilder,
  TechnologyBuilder,
} from './builders';
import { GraphValidatorService } from './graph-validator.service';
import { GraphRepository } from './graph-repository.service';

export interface RuntimeGraphOptions {
  autoFuseNodes?: boolean;
  autoDeduceEdges?: boolean;
  confidenceThreshold?: number;
  weightThreshold?: number;
  validateGraph?: boolean;
}

export interface PipelineResult {
  graph: Graph;
  validation: ValidationResult;
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodesFused: number;
    edgesDeduced: number;
    processingTime: number;
  };
}

export interface CandidateGraphInput {
  candidateId: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  experiences: Array<{
    title: string;
    company?: string;
    duration?: string;
    description?: string;
    jobId?: string;
    confidence?: number;
  }>;
  education: Array<{
    degree: string;
    institution?: string;
    year?: string;
    field?: string;
  }>;
  skills: Array<{
    name: string;
    type?: string;
    level?: string;
    skillId?: string;
    confidence?: number;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
  languages: Array<{
    name: string;
    level?: string;
  }>;
}

export interface JobGraphInput {
  jobId: string;
  title: string;
  description?: string;
  requiredSkills: Array<{
    name: string;
    required?: boolean;
  }>;
  location?: string;
  company?: string;
  responsibilities?: string[];
  missions?: string[];
}

export class RuntimeGraphService {
  constructor(
    private readonly entityNormalizer: EntityNormalizerService,
    private readonly nodeFusionService: NodeFusionService,
    private readonly edgeBuilderService: EdgeBuilderService,
    private readonly graphValidatorService: GraphValidatorService,
    private readonly graphRepository: GraphRepository,
  ) {}

  /**
   * Import a CV and build a complete Knowledge Graph
   */
  async importCV(
    cvData: CandidateGraphInput,
    options: RuntimeGraphOptions = {},
    userId?: string,
  ): Promise<PipelineResult> {
    const startTime = Date.now();

    // Step 1: Build Nodes from CV data
    const nodes = await this.buildNodesFromCV(cvData, options);

    // Step 2: Build Edges from nodes
    const edges = await this.buildEdgesFromCV(cvData, nodes, options);

    // Step 3: Fuse duplicate nodes if enabled
    const fusedNodes = options.autoFuseNodes
      ? this.nodeFusionService.fuseNodes(nodes).nodes
      : nodes;

    // Step 4: Create Graph with indexes
    const graph = this.createGraph(
      fusedNodes,
      edges,
      cvData.candidateId,
      'CV_IMPORT',
    );

    // Step 5: Validate graph if enabled
    const validation = options.validateGraph
      ? this.graphValidatorService.validate(graph)
      : { isValid: true, errors: [], warnings: [] };

    // Step 6: Persist graph to database
    let persistedGraph: Graph | null = null;
    if (validation.isValid) {
      try {
        // Create or update graph in database
        const existingGraph = await this.graphRepository.getGraphById(
          cvData.candidateId,
          {},
          userId || 'system',
        );

        if (existingGraph) {
          // Update existing graph
          persistedGraph = await this.graphRepository.updateGraph(
            cvData.candidateId,
            {
              name: `Candidate Graph - ${cvData.candidateId}`,
              description: 'Candidate knowledge graph',
              metadata: graph.metadata,
            },
            userId || 'system',
          );

          // Delete old nodes and edges
          await this.graphRepository.deleteNodesByGraphId(cvData.candidateId, userId || 'system');
          await this.graphRepository.deleteEdgesByGraphId(cvData.candidateId, userId || 'system');

          // Create new nodes and edges
          await this.graphRepository.createNodes(
            cvData.candidateId,
            Array.from(graph.nodes.values()),
            userId || 'system',
          );
          await this.graphRepository.createEdges(
            cvData.candidateId,
            Array.from(graph.edges.values()),
            userId || 'system',
          );

          // Create version
          await this.graphRepository.createVersion(cvData.candidateId, {
            description: 'CV import update',
            changeLog: {
              nodeCount: graph.nodes.size,
              edgeCount: graph.edges.size,
            },
            createdBy: 'CV_IMPORT',
          }, userId || 'system');
        } else {
          // Create new graph
          persistedGraph = await this.graphRepository.createGraph(
            {
              name: `Candidate Graph - ${cvData.candidateId}`,
              description: 'Candidate knowledge graph',
              source: 'CV_IMPORT',
              metadata: graph.metadata,
            },
            userId || 'system',
          );

          // Create nodes and edges
          await this.graphRepository.createNodes(
            persistedGraph.id,
            Array.from(graph.nodes.values()),
            userId || 'system',
          );
          await this.graphRepository.createEdges(
            persistedGraph.id,
            Array.from(graph.edges.values()),
            userId || 'system',
          );

          // Create version
          await this.graphRepository.createVersion(persistedGraph.id, {
            description: 'Initial CV import',
            changeLog: {
              nodeCount: graph.nodes.size,
              edgeCount: graph.edges.size,
            },
            createdBy: 'CV_IMPORT',
          }, userId || 'system');
        }
      } catch (error) {
        console.error('Failed to persist graph:', error);
        // Continue with in-memory graph if persistence fails
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      graph: persistedGraph || graph,
      validation,
      stats: {
        totalNodes: fusedNodes.length,
        totalEdges: edges.length,
        nodesFused: nodes.length - fusedNodes.length,
        edgesDeduced: edges.length,
        processingTime,
      },
    };
  }

  /**
   * Import a Job and build a complete Knowledge Graph
   */
  async importJob(
    jobData: JobGraphInput,
    options: RuntimeGraphOptions = {},
    userId?: string,
  ): Promise<PipelineResult> {
    const startTime = Date.now();

    // Step 1: Build Nodes from Job data
    const nodes = await this.buildNodesFromJob(jobData, options);

    // Step 2: Build Edges from nodes
    const edges = await this.buildEdgesFromJob(jobData, nodes, options);

    // Step 3: Fuse duplicate nodes if enabled
    const fusedNodes = options.autoFuseNodes
      ? this.nodeFusionService.fuseNodes(nodes).nodes
      : nodes;

    // Step 4: Create Graph with indexes
    const graph = this.createGraph(
      fusedNodes,
      edges,
      jobData.jobId,
      'JOB_IMPORT',
    );

    // Step 5: Validate graph if enabled
    const validation = options.validateGraph
      ? this.graphValidatorService.validate(graph)
      : { isValid: true, errors: [], warnings: [] };

    // Step 6: Persist graph to database
    let persistedGraph: Graph | null = null;
    if (validation.isValid) {
      try {
        // Create or update graph in database
        const existingGraph = await this.graphRepository.getGraphById(
          jobData.jobId,
          {},
          userId || 'system',
        );

        if (existingGraph) {
          // Update existing graph
          persistedGraph = await this.graphRepository.updateGraph(
            jobData.jobId,
            {
              name: `Job Graph - ${jobData.jobId}`,
              description: 'Job knowledge graph',
              metadata: graph.metadata,
            },
            userId || 'system',
          );

          // Delete old nodes and edges
          await this.graphRepository.deleteNodesByGraphId(jobData.jobId, userId || 'system');
          await this.graphRepository.deleteEdgesByGraphId(jobData.jobId, userId || 'system');

          // Create new nodes and edges
          await this.graphRepository.createNodes(
            jobData.jobId,
            Array.from(graph.nodes.values()),
            userId || 'system',
          );
          await this.graphRepository.createEdges(
            jobData.jobId,
            Array.from(graph.edges.values()),
            userId || 'system',
          );

          // Create version
          await this.graphRepository.createVersion(jobData.jobId, {
            description: 'Job import update',
            changeLog: {
              nodeCount: graph.nodes.size,
              edgeCount: graph.edges.size,
            },
            createdBy: 'JOB_IMPORT',
          }, userId || 'system');
        } else {
          // Create new graph
          persistedGraph = await this.graphRepository.createGraph(
            {
              name: `Job Graph - ${jobData.jobId}`,
              description: 'Job knowledge graph',
              source: 'JOB_IMPORT',
              metadata: graph.metadata,
            },
            userId || 'system',
          );

          // Create nodes and edges
          await this.graphRepository.createNodes(
            persistedGraph.id,
            Array.from(graph.nodes.values()),
            userId || 'system',
          );
          await this.graphRepository.createEdges(
            persistedGraph.id,
            Array.from(graph.edges.values()),
            userId || 'system',
          );

          // Create version
          await this.graphRepository.createVersion(persistedGraph.id, {
            description: 'Initial job import',
            changeLog: {
              nodeCount: graph.nodes.size,
              edgeCount: graph.edges.size,
            },
            createdBy: 'JOB_IMPORT',
          }, userId || 'system');
        }
      } catch (error) {
        console.error('Failed to persist graph:', error);
        // Continue with in-memory graph if persistence fails
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      graph: persistedGraph || graph,
      validation,
      stats: {
        totalNodes: fusedNodes.length,
        totalEdges: edges.length,
        nodesFused: nodes.length - fusedNodes.length,
        edgesDeduced: edges.length,
        processingTime,
      },
    };
  }

  /**
   * Build nodes from CV data
   */
  private async buildNodesFromCV(
    cvData: CandidateGraphInput,
    options: RuntimeGraphOptions,
  ): Promise<Node[]> {
    const nodes: Node[] = [];
    const source = 'CV_PARSER';

    // Initialize builders
    const skillBuilder = new SkillBuilder(this.entityNormalizer);
    const experienceBuilder = new ExperienceBuilder(this.entityNormalizer);
    const educationBuilder = new EducationBuilder(this.entityNormalizer);
    const certificationBuilder = new CertificationBuilder(
      this.entityNormalizer,
    );
    const languageBuilder = new LanguageBuilder(this.entityNormalizer);
    const projectBuilder = new ProjectBuilder(this.entityNormalizer);
    const companyBuilder = new CompanyBuilder(this.entityNormalizer);
    const locationBuilder = new LocationBuilder(this.entityNormalizer);
    const missionBuilder = new MissionBuilder(this.entityNormalizer);
    const responsibilityBuilder = new ResponsibilityBuilder(
      this.entityNormalizer,
    );
    const technologyBuilder = new TechnologyBuilder(this.entityNormalizer);

    // Build Candidate node
    const candidateNode = this.createCandidateNode(cvData, source);
    if (!candidateNode) return { nodes: [], edges: [] } as any;
    nodes.push(candidateNode);

    // Build Skill nodes
    const skills = (cvData.skills as any).technical || cvData.skills || [];
    const skillNodes = skillBuilder.buildBatch(skills, { source });
    nodes.push(...skillNodes);

    // Build Experience nodes
    const experienceNodes = experienceBuilder.buildBatch(cvData.experiences, {
      source,
    });
    nodes.push(...experienceNodes);

    // Build Company nodes from experience
    const companies = [
      ...new Set(cvData.experiences.map((e: any) => e.company)),
    ];
    const companyNodes = companyBuilder.buildBatch(companies, { source });
    nodes.push(...companyNodes);

    // Build Education nodes
    const educationNodes = educationBuilder.buildBatch(cvData.education, {
      source,
    });
    nodes.push(...educationNodes);

    // Build Certification nodes
    const certificationNodes = certificationBuilder.buildBatch(
      cvData.certifications,
      { source },
    );
    nodes.push(...certificationNodes);

    // Build Language nodes
    const languageNodes = languageBuilder.buildBatch(cvData.languages, {
      source,
    });
    nodes.push(...languageNodes);

    // Build Project nodes
    const projects = (cvData as any).projects || [];
    if (projects.length > 0) {
      const projectNodes = projectBuilder.buildBatch(projects, { source });
      nodes.push(...projectNodes);

      const technologies = projects.flatMap((p: any) => p.technologies || []);
      const uniqueTechnologies = [...new Set(technologies)];
      const technologyNodes = technologyBuilder.buildBatch(uniqueTechnologies, {
        source,
      });
      nodes.push(...technologyNodes);
    }

    // Build Location nodes
    const locations: string[] = [];
    const personalLocation =
      (cvData.personalInfo as any).location || cvData.personalInfo.address;
    if (personalLocation) {
      locations.push(personalLocation);
    }
    cvData.experiences.forEach((e: any) => {
      if (e.location) locations.push(e.location);
    });
    const uniqueLocations = [...new Set(locations)];
    const locationNodes = locationBuilder.buildBatch(uniqueLocations, {
      source,
    });
    nodes.push(...locationNodes);

    // Build Mission nodes from experience achievements
    const missions = cvData.experiences.flatMap(
      (e: any) => e.achievements || [],
    );
    const missionNodes = missionBuilder.buildBatch(missions, { source });
    nodes.push(...missionNodes);

    // Build Responsibility nodes from experience
    const responsibilities = cvData.experiences.flatMap((e: any) => {
      if (e.achievements && e.achievements.length > 0) {
        return e.achievements;
      }
      return [e.title];
    });
    const uniqueResponsibilities = [...new Set(responsibilities)];
    const responsibilityNodes = responsibilityBuilder.buildBatch(
      uniqueResponsibilities,
      { source },
    );
    nodes.push(...responsibilityNodes);

    return nodes;
  }

  /**
   * Build edges from CV nodes
   */
  private async buildEdgesFromCV(
    cvData: CandidateGraphInput,
    nodes: Node[],
    options: RuntimeGraphOptions,
  ): Promise<Edge[]> {
    const edges: Edge[] = [];
    const source = 'CV_PARSER';
    const now = new Date();

    // Find nodes by type
    const candidateNode = nodes.find((n) => n.type === NodeType.CANDIDATE);
    if (!candidateNode) return edges;

    const skillNodes = nodes.filter((n) => n.type === NodeType.SKILL);
    const experienceNodes = nodes.filter((n) => n.type === NodeType.EXPERIENCE);
    const companyNodes = nodes.filter((n) => n.type === NodeType.COMPANY);
    const educationNodes = nodes.filter((n) => n.type === NodeType.EDUCATION);
    const certificationNodes = nodes.filter(
      (n) => n.type === NodeType.CERTIFICATION,
    );
    const languageNodes = nodes.filter((n) => n.type === NodeType.LANGUAGE);
    const projectNodes = nodes.filter((n) => n.type === NodeType.PROJECT);
    const technologyNodes = nodes.filter((n) => n.type === NodeType.TECHNOLOGY);
    const locationNodes = nodes.filter((n) => n.type === NodeType.LOCATION);
    const missionNodes = nodes.filter((n) => n.type === NodeType.MISSION);
    const responsibilityNodes = nodes.filter(
      (n) => n.type === NodeType.RESPONSIBILITY,
    );

    // Create Candidate -> Skill edges (HAS_SKILL)
    const skills = (cvData.skills as any).technical || cvData.skills || [];
    for (const skill of skills) {
      const skillName = skill.name || skill;
      const skillNode = skillNodes.find(
        (s) =>
          s.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(skillName, NodeType.SKILL),
      );
      if (skillNode) {
        edges.push({
          id: `edge-${candidateNode.id}-${skillNode.id}-HAS_SKILL`,
          type: EdgeType.HAS_SKILL,
          sourceNode: candidateNode.id,
          targetNode: skillNode.id,
          weight: 0.8,
          confidence: 0.9,
          reason: `Candidate possesses skill: ${skillName}`,
          metadata: {},
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Candidate -> Language edges (HAS_LANGUAGE)
    for (const lang of cvData.languages) {
      const langNode = languageNodes.find(
        (l) =>
          l.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(lang.name, NodeType.LANGUAGE),
      );
      if (langNode) {
        edges.push({
          id: `edge-${candidateNode.id}-${langNode.id}-HAS_LANGUAGE`,
          type: EdgeType.HAS_LANGUAGE,
          sourceNode: candidateNode.id,
          targetNode: langNode.id,
          weight: 0.7,
          confidence: 0.85,
          reason: `Candidate speaks language: ${lang.name}`,
          metadata: { level: lang.level },
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Candidate -> Certification edges (HAS_CERTIFICATION)
    for (const cert of cvData.certifications) {
      const certNode = certificationNodes.find(
        (c) =>
          c.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(
            cert.name,
            NodeType.CERTIFICATION,
          ),
      );
      if (certNode) {
        edges.push({
          id: `edge-${candidateNode.id}-${certNode.id}-HAS_CERTIFICATION`,
          type: EdgeType.HAS_CERTIFICATION,
          sourceNode: candidateNode.id,
          targetNode: certNode.id,
          weight: 0.75,
          confidence: 0.9,
          reason: `Candidate holds certification: ${cert.name}`,
          metadata: { issuer: cert.issuer, year: (cert as any).year },
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Experience -> Company edges (WORKED_AT)
    for (let i = 0; i < cvData.experiences.length; i++) {
      const exp = cvData.experiences[i];
      const expNode = experienceNodes[i];
      if (!expNode || !exp) continue;

      const companyName = (exp as any).company || 'Unknown';
      const companyNode = companyNodes.find(
        (c) =>
          c.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(companyName, NodeType.COMPANY),
      );
      if (companyNode) {
        edges.push({
          id: `edge-${expNode.id}-${companyNode.id}-WORKED_AT`,
          type: EdgeType.WORKED_AT,
          sourceNode: expNode.id,
          targetNode: companyNode.id,
          weight: 0.9,
          confidence: 0.95,
          reason: `Worked at ${exp.company} as ${exp.title}`,
          metadata: {
            position: exp.title,
            period: (exp as any).period || exp.duration,
          },
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }

      // Create Experience -> Location edges (LOCATED_AT)
      const expLocation = (exp as any).location;
      if (expLocation !== undefined) {
        const locationNode = locationNodes.find(
          (l) =>
            l.normalizedLabel ===
            this.entityNormalizer.normalizeLabel(
              expLocation,
              NodeType.LOCATION,
            ),
        );
        if (locationNode) {
          edges.push({
            id: `edge-${expNode.id}-${locationNode.id}-LOCATED_AT`,
            type: EdgeType.LOCATED_AT,
            sourceNode: expNode.id,
            targetNode: locationNode.id,
            weight: 0.6,
            confidence: 0.8,
            reason: `Experience located at: ${expLocation}`,
            metadata: {},
            timestamps: { createdAt: now, updatedAt: now },
            provenance: {
              createdBy: 'RuntimeGraphService',
              algorithmVersion: '1.0.0',
            },
          });
        }
      }

      // Create Experience -> Mission edges (ACHIEVED)
      const achievements = (exp as any).achievements;
      if (achievements) {
        for (const achievement of achievements) {
          const missionNode = missionNodes.find(
            (m) =>
              m.normalizedLabel ===
              this.entityNormalizer.normalizeLabel(
                achievement,
                NodeType.MISSION,
              ),
          );
          if (missionNode) {
            edges.push({
              id: `edge-${expNode.id}-${missionNode.id}-ACHIEVED`,
              type: EdgeType.ACHIEVED,
              sourceNode: expNode.id,
              targetNode: missionNode.id,
              weight: 0.7,
              confidence: 0.85,
              reason: `Achieved: ${achievement}`,
              metadata: {},
              timestamps: { createdAt: now, updatedAt: now },
              provenance: {
                createdBy: 'RuntimeGraphService',
                algorithmVersion: '1.0.0',
              },
            });
          }
        }
      }

      // Create Experience -> Responsibility edges (HAS_RESPONSIBILITY)
      const responsibilityNode = responsibilityNodes.find(
        (r) =>
          r.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(
            exp.title,
            NodeType.RESPONSIBILITY,
          ),
      );
      if (responsibilityNode) {
        edges.push({
          id: `edge-${expNode.id}-${responsibilityNode.id}-HAS_RESPONSIBILITY`,
          type: EdgeType.HAS_RESPONSIBILITY,
          sourceNode: expNode.id,
          targetNode: responsibilityNode.id,
          weight: 0.8,
          confidence: 0.9,
          reason: `Responsibility: ${exp.title}`,
          metadata: {},
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Education -> School edges (STUDIED_AT)
    for (let i = 0; i < cvData.education.length; i++) {
      const edu = cvData.education[i];
      const eduNode = educationNodes[i];
      if (!eduNode || !edu) continue;

      // Create school node if not exists
      const schoolName = (edu as any).school || edu.institution;
      const schoolNode = nodes.find(
        (n) =>
          n.type === NodeType.SCHOOL &&
          n.normalizedLabel ===
            this.entityNormalizer.normalizeLabel(schoolName, NodeType.SCHOOL),
      );
      if (schoolNode) {
        edges.push({
          id: `edge-${eduNode.id}-${schoolNode.id}-STUDIED_AT`,
          type: EdgeType.STUDIED_AT,
          sourceNode: eduNode.id,
          targetNode: schoolNode.id,
          weight: 0.9,
          confidence: 0.95,
          reason: `Studied at ${schoolName}`,
          metadata: { degree: edu.degree, year: edu.year },
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Project -> Technology edges (USES_TECH)
    const projects = (cvData as any).projects || [];
    if (projects.length > 0) {
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectNode = projectNodes[i];
        if (!projectNode || !project || !project.technologies) continue;

        for (const tech of project.technologies) {
          const techNode = technologyNodes.find(
            (t) =>
              t.normalizedLabel ===
              this.entityNormalizer.normalizeLabel(tech, NodeType.TECHNOLOGY),
          );
          if (techNode) {
            edges.push({
              id: `edge-${projectNode.id}-${techNode.id}-USES_TECH`,
              type: EdgeType.USES_TECH,
              sourceNode: projectNode.id,
              targetNode: techNode.id,
              weight: 0.8,
              confidence: 0.9,
              reason: `Project uses technology: ${tech}`,
              metadata: {},
              timestamps: { createdAt: now, updatedAt: now },
              provenance: {
                createdBy: 'RuntimeGraphService',
                algorithmVersion: '1.0.0',
              },
            });
          }
        }
      }
    }

    return edges;
  }

  /**
   * Build nodes from Job data
   */
  private async buildNodesFromJob(
    jobData: JobGraphInput,
    options: RuntimeGraphOptions,
  ): Promise<Node[]> {
    const nodes: Node[] = [];
    const source = 'JOB_EXTRACTOR';

    // Initialize builders
    const skillBuilder = new SkillBuilder(this.entityNormalizer);
    const companyBuilder = new CompanyBuilder(this.entityNormalizer);
    const locationBuilder = new LocationBuilder(this.entityNormalizer);
    const missionBuilder = new MissionBuilder(this.entityNormalizer);
    const responsibilityBuilder = new ResponsibilityBuilder(
      this.entityNormalizer,
    );

    // Build Job node
    const jobNode = this.createJobNode(jobData, source);
    nodes.push(jobNode);

    // Build Skill nodes
    const skillNodes = skillBuilder.buildBatch(jobData.requiredSkills, {
      source,
    });
    nodes.push(...skillNodes);

    const preferredSkills = (jobData as any).preferredSkills || [];
    if (preferredSkills.length > 0) {
      const preferredSkillNodes = skillBuilder.buildBatch(preferredSkills, {
        source,
      });
      // Add preferred skills to the job node metadata
      jobNode.metadata.preferredSkills = preferredSkills;
      nodes.push(...preferredSkillNodes);
    }

    // Build Company node if specified
    if (jobData.company) {
      const companyNode = companyBuilder.build(jobData.company, { source });
      nodes.push(companyNode);
    }

    // Build Location node if specified
    if (jobData.location) {
      const locationNode = locationBuilder.build(jobData.location, { source });
      nodes.push(locationNode);
    }

    // Build Mission nodes
    if (jobData.missions) {
      const missionNodes = missionBuilder.buildBatch(jobData.missions, {
        source,
      });
      nodes.push(...missionNodes);
    }

    // Build Responsibility nodes
    if (jobData.responsibilities) {
      const responsibilityNodes = responsibilityBuilder.buildBatch(
        jobData.responsibilities,
        { source },
      );
      nodes.push(...responsibilityNodes);
    }

    return nodes;
  }

  /**
   * Build edges from Job nodes
   */
  private async buildEdgesFromJob(
    jobData: JobGraphInput,
    nodes: Node[],
    options: RuntimeGraphOptions,
  ): Promise<Edge[]> {
    const edges: Edge[] = [];
    const now = new Date();

    // Find nodes by type
    const jobNode = nodes.find((n) => n.type === NodeType.JOB);
    if (!jobNode) return edges;

    const skillNodes = nodes.filter((n) => n.type === NodeType.SKILL);
    const companyNodes = nodes.filter((n) => n.type === NodeType.COMPANY);
    const locationNodes = nodes.filter((n) => n.type === NodeType.LOCATION);
    const missionNodes = nodes.filter((n) => n.type === NodeType.MISSION);
    const responsibilityNodes = nodes.filter(
      (n) => n.type === NodeType.RESPONSIBILITY,
    );

    // Create Job -> Skill edges (REQUIRES_SKILL) for required skills
    for (const skill of jobData.requiredSkills) {
      const skillName = (skill as any).name || skill;
      const skillNode = skillNodes.find(
        (s) =>
          s.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(skillName, NodeType.SKILL),
      );
      if (skillNode) {
        edges.push({
          id: `edge-${jobNode.id}-${skillNode.id}-REQUIRES_SKILL`,
          type: EdgeType.REQUIRES_SKILL,
          sourceNode: jobNode.id,
          targetNode: skillNode.id,
          weight: 0.9,
          confidence: 0.95,
          reason: `Job requires skill: ${skill}`,
          metadata: { required: true },
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Job -> Skill edges for preferred skills
    const preferredSkills = (jobData as any).preferredSkills || [];
    if (preferredSkills.length > 0) {
      for (const skill of preferredSkills) {
        const skillNode = skillNodes.find(
          (s) =>
            s.normalizedLabel ===
            this.entityNormalizer.normalizeLabel(skill, NodeType.SKILL),
        );
        if (skillNode) {
          edges.push({
            id: `edge-${jobNode.id}-${skillNode.id}-REQUIRES_SKILL`,
            type: EdgeType.REQUIRES_SKILL,
            sourceNode: jobNode.id,
            targetNode: skillNode.id,
            weight: 0.6,
            confidence: 0.8,
            reason: `Job prefers skill: ${skill}`,
            metadata: { required: false },
            timestamps: { createdAt: now, updatedAt: now },
            provenance: {
              createdBy: 'RuntimeGraphService',
              algorithmVersion: '1.0.0',
            },
          });
        }
      }
    }

    // Create Job -> Company edge if specified
    if (jobData.company !== undefined) {
      const companyNode = companyNodes.find(
        (c) =>
          c.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(
            jobData.company!,
            NodeType.COMPANY,
          ),
      );
      if (companyNode) {
        edges.push({
          id: `edge-${jobNode.id}-${companyNode.id}-RELATED_TO`,
          type: EdgeType.RELATED_TO,
          sourceNode: jobNode.id,
          targetNode: companyNode.id,
          weight: 0.7,
          confidence: 0.85,
          reason: `Job at company: ${jobData.company}`,
          metadata: {},
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Job -> Location edge if specified
    if (jobData.location !== undefined) {
      const locationNode = locationNodes.find(
        (l) =>
          l.normalizedLabel ===
          this.entityNormalizer.normalizeLabel(
            jobData.location!,
            NodeType.LOCATION,
          ),
      );
      if (locationNode) {
        edges.push({
          id: `edge-${jobNode.id}-${locationNode.id}-LOCATED_AT`,
          type: EdgeType.LOCATED_AT,
          sourceNode: jobNode.id,
          targetNode: locationNode.id,
          weight: 0.6,
          confidence: 0.8,
          reason: `Job located at: ${jobData.location}`,
          metadata: {},
          timestamps: { createdAt: now, updatedAt: now },
          provenance: {
            createdBy: 'RuntimeGraphService',
            algorithmVersion: '1.0.0',
          },
        });
      }
    }

    // Create Job -> Mission edges
    if (jobData.missions) {
      for (const mission of jobData.missions) {
        const missionNode = missionNodes.find(
          (m) =>
            m.normalizedLabel ===
            this.entityNormalizer.normalizeLabel(mission, NodeType.MISSION),
        );
        if (missionNode) {
          edges.push({
            id: `edge-${jobNode.id}-${missionNode.id}-ACHIEVED`,
            type: EdgeType.ACHIEVED,
            sourceNode: jobNode.id,
            targetNode: missionNode.id,
            weight: 0.7,
            confidence: 0.85,
            reason: `Job mission: ${mission}`,
            metadata: {},
            timestamps: { createdAt: now, updatedAt: now },
            provenance: {
              createdBy: 'RuntimeGraphService',
              algorithmVersion: '1.0.0',
            },
          });
        }
      }
    }

    // Create Job -> Responsibility edges
    if (jobData.responsibilities) {
      for (const responsibility of jobData.responsibilities) {
        const responsibilityNode = responsibilityNodes.find(
          (r) =>
            r.normalizedLabel ===
            this.entityNormalizer.normalizeLabel(
              responsibility,
              NodeType.RESPONSIBILITY,
            ),
        );
        if (responsibilityNode) {
          edges.push({
            id: `edge-${jobNode.id}-${responsibilityNode.id}-HAS_RESPONSIBILITY`,
            type: EdgeType.HAS_RESPONSIBILITY,
            sourceNode: jobNode.id,
            targetNode: responsibilityNode.id,
            weight: 0.8,
            confidence: 0.9,
            reason: `Job responsibility: ${responsibility}`,
            metadata: {},
            timestamps: { createdAt: now, updatedAt: now },
            provenance: {
              createdBy: 'RuntimeGraphService',
              algorithmVersion: '1.0.0',
            },
          });
        }
      }
    }

    return edges;
  }

  /**
   * Create a Candidate node
   */
  private createCandidateNode(
    cvData: CandidateGraphInput,
    source: string,
  ): Node | null {
    const now = new Date();
    const name = cvData.personalInfo.name || 'Unknown';
    const normalizedLabel = this.entityNormalizer.normalizeLabel(
      name,
      NodeType.CANDIDATE,
    );

    if (!normalizedLabel) return null;

    return {
      id: `${NodeType.CANDIDATE}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      type: NodeType.CANDIDATE,
      label: name,
      normalizedLabel,
      confidence: 1.0,
      source,
      metadata: {
        candidateId: cvData.candidateId,
      },
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: 'RuntimeGraphService',
        algorithmVersion: '1.0.0',
      },
    };
  }

  /**
   * Create a Job node
   */
  private createJobNode(jobData: JobGraphInput, source: string): Node {
    const now = new Date();
    const normalizedLabel = this.entityNormalizer.normalizeLabel(
      jobData.title,
      NodeType.JOB,
    );

    return {
      id: `job-${jobData.jobId}`,
      type: NodeType.JOB,
      label: jobData.title,
      normalizedLabel,
      confidence: 1.0,
      source,
      metadata: {
        jobId: jobData.jobId,
      },
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      provenance: {
        createdBy: 'RuntimeGraphService',
        algorithmVersion: '1.0.0',
      },
    };
  }

  /**
   * Create a Graph with indexes
   */
  private createGraph(
    nodes: Node[],
    edges: Edge[],
    id: string,
    source: string,
  ): Graph {
    const nodeIndex = new NodeIndex();
    const edgeIndex = new EdgeIndex();

    nodes.forEach((node) => nodeIndex.add(node));
    edges.forEach((edge) => edgeIndex.add(edge));

    const now = new Date();

    return {
      id,
      nodes: new Map(nodes.map((n) => [n.id, n])),
      edges: new Map(edges.map((e) => [e.id, e])),
      metadata: {
        version: '2.0.0',
        createdAt: now,
        updatedAt: now,
        source,
      },
    };
  }
}
