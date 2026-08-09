/**
 * Knowledge Graph RH Runtime v2
 * Graph Reasoning Engine
 * Provides reasoning capabilities with full citation of nodes and edges
 * All conclusions must be backed by graph evidence
 */

import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';
import { GraphQueryEngine } from './graph-query-engine.service';
import { GraphAnalyticsService } from './graph-analytics.service';

export interface ReasoningStep {
  stepNumber: number;
  type: 'query' | 'traversal' | 'inference' | 'conclusion';
  description: string;
  citedNodes: Node[];
  citedEdges: Edge[];
  confidence: number;
  reasoning: string;
}

export interface ReasoningTrace {
  query: string;
  steps: ReasoningStep[];
  finalConclusion: string;
  confidence: number;
  citedNodes: Node[];
  citedEdges: Edge[];
  timestamp: Date;
}

export interface Explanation {
  summary: string;
  detailedExplanation: string;
  evidence: Array<{
    claim: string;
    supportingNodes: Node[];
    supportingEdges: Edge[];
    confidence: number;
  }>;
  reasoningTrace: ReasoningTrace;
}

export class GraphReasoningEngine {
  constructor(
    private readonly graphQueryEngine: GraphQueryEngine,
    private readonly graphAnalyticsService: GraphAnalyticsService,
  ) {}

  /**
   * Answer a question about a candidate using graph reasoning
   */
  answerCandidateQuestion(graph: Graph, question: string): Explanation {
    const trace = this.traceReasoning(graph, question);
    const explanation = this.generateExplanation(trace);

    return explanation;
  }

  /**
   * Answer a question about a job using graph reasoning
   */
  answerJobQuestion(graph: Graph, question: string): Explanation {
    const trace = this.traceReasoning(graph, question);
    const explanation = this.generateExplanation(trace);

    return explanation;
  }

  /**
   * Compare candidate and job graphs with full reasoning
   */
  compareCandidateToJob(candidateGraph: Graph, jobGraph: Graph): Explanation {
    const combinedQuery = `Compare candidate ${candidateGraph.id} to job ${jobGraph.id}`;
    const trace = this.traceComparisonReasoning(
      candidateGraph,
      jobGraph,
      combinedQuery,
    );
    const explanation = this.generateExplanation(trace);

    return explanation;
  }

  /**
   * Trace reasoning through the graph
   */
  private traceReasoning(graph: Graph, question: string): ReasoningTrace {
    const steps: ReasoningStep[] = [];
    const citedNodes: Node[] = [];
    const citedEdges: Edge[] = [];

    // Step 1: Parse the question and identify relevant node types
    const queryStep = this.parseQuestion(graph, question);
    steps.push(queryStep);
    citedNodes.push(...queryStep.citedNodes);

    // Step 2: Query the graph for relevant nodes
    const queryNodesStep = this.queryNodes(graph, queryStep);
    steps.push(queryNodesStep);
    citedNodes.push(...queryNodesStep.citedNodes);

    // Step 3: Traverse edges to find relationships
    const traversalStep = this.traverseEdges(graph, queryNodesStep.citedNodes);
    steps.push(traversalStep);
    citedEdges.push(...traversalStep.citedEdges);
    citedNodes.push(...traversalStep.citedNodes);

    // Step 4: Make inferences based on the graph structure
    const inferenceStep = this.makeInferences(
      graph,
      queryNodesStep.citedNodes,
      traversalStep.citedEdges,
    );
    steps.push(inferenceStep);
    citedNodes.push(...inferenceStep.citedNodes);
    citedEdges.push(...inferenceStep.citedEdges);

    // Step 5: Generate final conclusion
    const conclusionStep = this.generateConclusion(graph, steps);
    steps.push(conclusionStep);

    const finalConclusion = conclusionStep.description;
    const confidence = this.calculateOverallConfidence(steps);

    return {
      query: question,
      steps,
      finalConclusion,
      confidence,
      citedNodes: [...new Set(citedNodes)],
      citedEdges: [...new Set(citedEdges)],
      timestamp: new Date(),
    };
  }

  /**
   * Trace comparison reasoning between candidate and job
   */
  private traceComparisonReasoning(
    candidateGraph: Graph,
    jobGraph: Graph,
    question: string,
  ): ReasoningTrace {
    const steps: ReasoningStep[] = [];
    const citedNodes: Node[] = [];
    const citedEdges: Edge[] = [];

    // Step 1: Identify candidate and job nodes
    const candidateNode = this.findNodeByType(
      candidateGraph,
      NodeType.CANDIDATE,
    );
    const jobNode = this.findNodeByType(jobGraph, NodeType.JOB);

    if (!candidateNode || !jobNode) {
      return {
        query: question,
        steps: [],
        finalConclusion: 'Unable to compare: missing candidate or job node',
        confidence: 0,
        citedNodes: [],
        citedEdges: [],
        timestamp: new Date(),
      };
    }

    steps.push({
      stepNumber: 1,
      type: 'query',
      description: `Identified candidate node: ${candidateNode.label} and job node: ${jobNode.label}`,
      citedNodes: [candidateNode, jobNode],
      citedEdges: [],
      confidence: 1.0,
      reasoning: 'Direct node lookup by type',
    });
    citedNodes.push(candidateNode, jobNode);

    // Step 2: Query candidate skills
    const candidateQueryEngine = new GraphQueryEngine(candidateGraph);
    const candidateSkills = candidateQueryEngine.findNeighbors(
      candidateNode.id,
      { maxDepth: 1, limit: 50 },
    );
    const skillNodes = candidateSkills
      .filter((n) => n.node.type === NodeType.SKILL)
      .map((n) => n.node);
    const skillEdges = candidateSkills
      .filter((n) => n.node.type === NodeType.SKILL)
      .map((n) => n.edge);

    steps.push({
      stepNumber: 2,
      type: 'query',
      description: `Found ${skillNodes.length} skills for candidate via HAS_SKILL edges`,
      citedNodes: skillNodes,
      citedEdges: skillEdges,
      confidence: 0.95,
      reasoning: 'Direct neighbor query with edge type filter',
    });
    citedNodes.push(...skillNodes);
    citedEdges.push(...skillEdges);

    // Step 3: Query job requirements
    const jobQueryEngine = new GraphQueryEngine(jobGraph);
    const jobSkills = jobQueryEngine.findNeighbors(jobNode.id, {
      maxDepth: 1,
      limit: 50,
    });
    const requiredSkillNodes = jobSkills
      .filter((n) => n.node.type === NodeType.SKILL)
      .map((n) => n.node);
    const requiredSkillEdges = jobSkills
      .filter((n) => n.node.type === NodeType.SKILL)
      .map((n) => n.edge);

    steps.push({
      stepNumber: 3,
      type: 'query',
      description: `Found ${requiredSkillNodes.length} required skills for job via REQUIRES_SKILL edges`,
      citedNodes: requiredSkillNodes,
      citedEdges: requiredSkillEdges,
      confidence: 0.95,
      reasoning: 'Direct neighbor query with edge type filter',
    });
    citedNodes.push(...requiredSkillNodes);
    citedEdges.push(...requiredSkillEdges);

    // Step 4: Calculate skill overlap
    const candidateSkillLabels = new Set(
      skillNodes.map((s) => s.normalizedLabel),
    );
    const requiredSkillLabels = new Set(
      requiredSkillNodes.map((s) => s.normalizedLabel),
    );
    const matchedSkills = skillNodes.filter((s) =>
      requiredSkillLabels.has(s.normalizedLabel),
    );
    const missingSkills = requiredSkillNodes.filter(
      (s) => !candidateSkillLabels.has(s.normalizedLabel),
    );

    steps.push({
      stepNumber: 4,
      type: 'inference',
      description: `Calculated skill overlap: ${matchedSkills.length}/${requiredSkillNodes.length} skills matched`,
      citedNodes: [...matchedSkills, ...missingSkills],
      citedEdges: [],
      confidence: 0.9,
      reasoning: 'Set intersection of skill labels',
    });
    citedNodes.push(...matchedSkills, ...missingSkills);

    // Step 5: Check experience alignment
    const candidateExperiences = this.getNodesByType(
      candidateGraph,
      NodeType.EXPERIENCE,
    );
    const jobMissions = this.getNodesByType(jobGraph, NodeType.MISSION);

    steps.push({
      stepNumber: 5,
      type: 'query',
      description: `Found ${candidateExperiences.length} experiences and ${jobMissions.length} job missions`,
      citedNodes: [...candidateExperiences, ...jobMissions],
      citedEdges: [],
      confidence: 0.9,
      reasoning: 'Node type query',
    });
    citedNodes.push(...candidateExperiences, ...jobMissions);

    // Step 6: Generate final conclusion
    const matchPercentage =
      requiredSkillNodes.length > 0
        ? (matchedSkills.length / requiredSkillNodes.length) * 100
        : 0;
    const conclusion = `Candidate has ${matchPercentage.toFixed(0)}% skill match with job requirements. ${matchedSkills.length} skills matched, ${missingSkills.length} missing.`;

    steps.push({
      stepNumber: 6,
      type: 'conclusion',
      description: conclusion,
      citedNodes: [...matchedSkills, ...missingSkills],
      citedEdges: [...skillEdges, ...requiredSkillEdges],
      confidence: 0.85,
      reasoning: 'Final synthesis based on skill overlap calculation',
    });

    return {
      query: question,
      steps,
      finalConclusion: conclusion,
      confidence: matchPercentage / 100,
      citedNodes: [...new Set(citedNodes)],
      citedEdges: [...new Set(citedEdges)],
      timestamp: new Date(),
    };
  }

  /**
   * Parse the question and identify relevant node types
   */
  private parseQuestion(graph: Graph, question: string): ReasoningStep {
    const questionLower = question.toLowerCase();
    let nodeType: NodeType | null = null;
    let description = '';

    if (
      questionLower.includes('skill') ||
      questionLower.includes('compétence')
    ) {
      nodeType = NodeType.SKILL;
      description = 'Question is about skills - identifying SKILL nodes';
    } else if (
      questionLower.includes('experience') ||
      questionLower.includes('expérience')
    ) {
      nodeType = NodeType.EXPERIENCE;
      description =
        'Question is about experience - identifying EXPERIENCE nodes';
    } else if (
      questionLower.includes('education') ||
      questionLower.includes('formation')
    ) {
      nodeType = NodeType.EDUCATION;
      description = 'Question is about education - identifying EDUCATION nodes';
    } else if (
      questionLower.includes('company') ||
      questionLower.includes('entreprise')
    ) {
      nodeType = NodeType.COMPANY;
      description = 'Question is about companies - identifying COMPANY nodes';
    } else {
      description = 'Question type not specific - will search all node types';
    }

    const citedNodes = nodeType
      ? this.getNodesByType(graph, nodeType)
      : Array.from(graph.nodes.values());

    return {
      stepNumber: 1,
      type: 'query',
      description,
      citedNodes,
      citedEdges: [],
      confidence: 0.8,
      reasoning: 'Keyword-based node type identification',
    };
  }

  /**
   * Query nodes based on parsed question
   */
  private queryNodes(graph: Graph, parseStep: ReasoningStep): ReasoningStep {
    const nodes = parseStep.citedNodes;

    return {
      stepNumber: 2,
      type: 'query',
      description: `Retrieved ${nodes.length} nodes from graph`,
      citedNodes: nodes,
      citedEdges: [],
      confidence: 0.9,
      reasoning: 'Direct node retrieval from graph',
    };
  }

  /**
   * Traverse edges to find relationships
   */
  private traverseEdges(graph: Graph, nodes: Node[]): ReasoningStep {
    const citedEdges: Edge[] = [];
    const relatedNodes: Node[] = [];

    for (const node of nodes) {
      const outgoingEdges = Array.from(graph.edges.values()).filter(
        (e) => e.sourceNode === node.id,
      );
      const incomingEdges = Array.from(graph.edges.values()).filter(
        (e) => e.targetNode === node.id,
      );

      citedEdges.push(...outgoingEdges, ...incomingEdges);

      for (const edge of outgoingEdges) {
        const targetNode = graph.nodes.get(edge.targetNode);
        if (targetNode) relatedNodes.push(targetNode);
      }
      for (const edge of incomingEdges) {
        const sourceNode = graph.nodes.get(edge.sourceNode);
        if (sourceNode) relatedNodes.push(sourceNode);
      }
    }

    return {
      stepNumber: 3,
      type: 'traversal',
      description: `Traversed ${citedEdges.length} edges connecting to ${relatedNodes.length} related nodes`,
      citedNodes: relatedNodes,
      citedEdges,
      confidence: 0.85,
      reasoning: 'Edge traversal from query nodes',
    };
  }

  /**
   * Make inferences based on graph structure
   */
  private makeInferences(
    graph: Graph,
    nodes: Node[],
    edges: Edge[],
  ): ReasoningStep {
    const inferences: string[] = [];
    const citedNodes: Node[] = [];
    const citedEdges: Edge[] = [];

    // Infer skill importance based on edge weights
    const skillEdges = edges.filter(
      (e) =>
        e.type === EdgeType.HAS_SKILL || e.type === EdgeType.REQUIRES_SKILL,
    );
    const highWeightSkills = skillEdges.filter((e) => e.weight > 0.7);

    if (highWeightSkills.length > 0) {
      inferences.push(
        `Identified ${highWeightSkills.length} high-weight skill relations`,
      );
      citedEdges.push(...highWeightSkills);
      highWeightSkills.forEach((e) => {
        const node = graph.nodes.get(e.targetNode);
        if (node) citedNodes.push(node);
      });
    }

    // Infer experience relevance based on ACHIEVED edges
    const achievementEdges = edges.filter((e) => e.type === EdgeType.ACHIEVED);
    if (achievementEdges.length > 0) {
      inferences.push(
        `Found ${achievementEdges.length} achievement relations indicating experience relevance`,
      );
      citedEdges.push(...achievementEdges);
    }

    const description =
      inferences.length > 0
        ? inferences.join('. ')
        : 'No significant inferences drawn from graph structure';

    return {
      stepNumber: 4,
      type: 'inference',
      description,
      citedNodes,
      citedEdges,
      confidence: 0.75,
      reasoning: 'Inference based on edge weights and types',
    };
  }

  /**
   * Generate final conclusion
   */
  private generateConclusion(
    graph: Graph,
    steps: ReasoningStep[],
  ): ReasoningStep {
    const allCitedNodes = steps.flatMap((s) => s.citedNodes);
    const allCitedEdges = steps.flatMap((s) => s.citedEdges);

    const nodeTypes = new Set(allCitedNodes.map((n) => n.type));
    const edgeTypes = new Set(allCitedEdges.map((e) => e.type));

    const description = `Analysis based on ${allCitedNodes.length} nodes (${[...nodeTypes].join(', ')}) and ${allCitedEdges.length} edges (${[...edgeTypes].join(', ')})`;

    return {
      stepNumber: steps.length + 1,
      type: 'conclusion',
      description,
      citedNodes: allCitedNodes,
      citedEdges: allCitedEdges,
      confidence: this.calculateOverallConfidence(steps),
      reasoning: 'Synthesis of all reasoning steps',
    };
  }

  /**
   * Calculate overall confidence from reasoning steps
   */
  private calculateOverallConfidence(steps: ReasoningStep[]): number {
    if (steps.length === 0) return 0;
    const avgConfidence =
      steps.reduce((sum, step) => sum + step.confidence, 0) / steps.length;
    return avgConfidence;
  }

  /**
   * Generate explanation from reasoning trace
   */
  private generateExplanation(trace: ReasoningTrace): Explanation {
    const summary = trace.finalConclusion;

    let detailedExplanation = `Reasoning trace for query: "${trace.query}"\n\n`;
    trace.steps.forEach((step) => {
      detailedExplanation += `Step ${step.stepNumber} [${step.type}]: ${step.description}\n`;
      detailedExplanation += `  Confidence: ${(step.confidence * 100).toFixed(0)}%\n`;
      detailedExplanation += `  Reasoning: ${step.reasoning}\n`;
      if (step.citedNodes.length > 0) {
        detailedExplanation += `  Cited nodes: ${step.citedNodes.map((n) => `${n.type}:${n.label}`).join(', ')}\n`;
      }
      if (step.citedEdges.length > 0) {
        detailedExplanation += `  Cited edges: ${step.citedEdges.map((e) => `${e.type}(${e.sourceNode}->${e.targetNode})`).join(', ')}\n`;
      }
      detailedExplanation += '\n';
    });

    // Generate evidence mapping
    const evidence: Array<{
      claim: string;
      supportingNodes: Node[];
      supportingEdges: Edge[];
      confidence: number;
    }> = [];

    for (const step of trace.steps) {
      if (step.type === 'inference' || step.type === 'conclusion') {
        evidence.push({
          claim: step.description,
          supportingNodes: step.citedNodes,
          supportingEdges: step.citedEdges,
          confidence: step.confidence,
        });
      }
    }

    return {
      summary,
      detailedExplanation,
      evidence,
      reasoningTrace: trace,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private findNodeByType(graph: Graph, type: NodeType): Node | undefined {
    return Array.from(graph.nodes.values()).find((n) => n.type === type);
  }

  private getNodesByType(graph: Graph, type: NodeType): Node[] {
    return Array.from(graph.nodes.values()).filter((n) => n.type === type);
  }
}
