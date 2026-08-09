/**
 * Knowledge Graph RH Runtime v2
 * Graph Validator Service
 * Validates graph integrity and consistency
 */

import {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
  ValidationResult,
  ValidationError,
} from './graph-types';

export class GraphValidatorService {
  // Forbidden edge type combinations
  private readonly forbiddenEdgeCombinations: Map<NodeType, Set<EdgeType>> =
    new Map();

  constructor() {
    // Initialize forbidden combinations
    this.forbiddenEdgeCombinations.set(
      NodeType.SKILL,
      new Set([EdgeType.WORKED_AT, EdgeType.STUDIED_AT]),
    );
    this.forbiddenEdgeCombinations.set(
      NodeType.SOFT_SKILL,
      new Set([EdgeType.WORKED_AT, EdgeType.STUDIED_AT]),
    );
    this.forbiddenEdgeCombinations.set(
      NodeType.LANGUAGE,
      new Set([EdgeType.WORKED_AT, EdgeType.STUDIED_AT]),
    );
    this.forbiddenEdgeCombinations.set(
      NodeType.CERTIFICATION,
      new Set([EdgeType.WORKED_AT, EdgeType.STUDIED_AT]),
    );
    this.forbiddenEdgeCombinations.set(
      NodeType.COMPANY,
      new Set([
        EdgeType.HAS_SKILL,
        EdgeType.HAS_SOFT_SKILL,
        EdgeType.HAS_LANGUAGE,
        EdgeType.HAS_CERTIFICATION,
      ]),
    );
    this.forbiddenEdgeCombinations.set(
      NodeType.SCHOOL,
      new Set([
        EdgeType.HAS_SKILL,
        EdgeType.HAS_SOFT_SKILL,
        EdgeType.HAS_LANGUAGE,
        EdgeType.HAS_CERTIFICATION,
      ]),
    );
  }

  /**
   * Validate entire graph
   */
  validate(graph: Graph): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check for duplicate nodes
    const duplicateNodes = this.checkDuplicateNodes(graph);
    errors.push(...duplicateNodes);

    // Check for duplicate edges
    const duplicateEdges = this.checkDuplicateEdges(graph);
    errors.push(...duplicateEdges);

    // Check for invalid cycles
    const invalidCycles = this.checkInvalidCycles(graph);
    errors.push(...invalidCycles);

    // Check for orphan nodes
    const orphanNodes = this.checkOrphanNodes(graph);
    warnings.push(...orphanNodes);

    // Check for forbidden relations
    const forbiddenRelations = this.checkForbiddenRelations(graph);
    errors.push(...forbiddenRelations);

    // Check for invalid weights
    const invalidWeights = this.checkInvalidWeights(graph);
    errors.push(...invalidWeights);

    // Check for invalid confidence
    const invalidConfidence = this.checkInvalidConfidence(graph);
    errors.push(...invalidConfidence);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check for duplicate nodes (same type and normalized label)
   */
  private checkDuplicateNodes(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];
    const seen = new Map<string, Set<string>>();

    graph.nodes.forEach((node, nodeId) => {
      const key = `${node.type}:${node.normalizedLabel}`;

      if (!seen.has(key)) {
        seen.set(key, new Set());
      }

      const existing = seen.get(key)!;
      if (existing.size > 0) {
        errors.push({
          type: 'DUPLICATE_NODE',
          message: `Duplicate node found: ${node.type} with normalized label "${node.normalizedLabel}"`,
          nodeId,
          severity: 'ERROR',
        });
      }

      existing.add(nodeId);
    });

    return errors;
  }

  /**
   * Check for duplicate edges (same type, source, and target)
   */
  private checkDuplicateEdges(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];
    const seen = new Map<string, Set<string>>();

    graph.edges.forEach((edge, edgeId) => {
      const key = `${edge.type}:${edge.sourceNode}:${edge.targetNode}`;

      if (!seen.has(key)) {
        seen.set(key, new Set());
      }

      const existing = seen.get(key)!;
      if (existing.size > 0) {
        errors.push({
          type: 'DUPLICATE_EDGE',
          message: `Duplicate edge found: ${edge.type} from ${edge.sourceNode} to ${edge.targetNode}`,
          edgeId,
          severity: 'ERROR',
        });
      }

      existing.add(edgeId);
    });

    return errors;
  }

  /**
   * Check for invalid cycles (self-referencing nodes)
   */
  private checkInvalidCycles(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];

    graph.edges.forEach((edge, edgeId) => {
      if (edge.sourceNode === edge.targetNode) {
        errors.push({
          type: 'INVALID_CYCLE',
          message: `Self-referencing edge found: node ${edge.sourceNode} references itself`,
          edgeId,
          nodeId: edge.sourceNode,
          severity: 'ERROR',
        });
      }
    });

    return errors;
  }

  /**
   * Check for orphan nodes (nodes with no edges)
   */
  private checkOrphanNodes(graph: Graph): ValidationError[] {
    const warnings: ValidationError[] = [];
    const connectedNodeIds = new Set<string>();

    graph.edges.forEach((edge) => {
      connectedNodeIds.add(edge.sourceNode);
      connectedNodeIds.add(edge.targetNode);
    });

    graph.nodes.forEach((node, nodeId) => {
      if (!connectedNodeIds.has(nodeId)) {
        warnings.push({
          type: 'ORPHAN_NODE',
          message: `Orphan node found: ${node.type} "${node.label}" has no edges`,
          nodeId,
          severity: 'WARNING',
        });
      }
    });

    return warnings;
  }

  /**
   * Check for forbidden relations
   */
  private checkForbiddenRelations(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];

    graph.edges.forEach((edge, edgeId) => {
      const sourceNode = graph.nodes.get(edge.sourceNode);
      if (!sourceNode) return;

      const forbiddenTypes = this.forbiddenEdgeCombinations.get(
        sourceNode.type,
      );
      if (forbiddenTypes && forbiddenTypes.has(edge.type)) {
        errors.push({
          type: 'FORBIDDEN_RELATION',
          message: `Forbidden relation: ${sourceNode.type} cannot have ${edge.type} edge`,
          edgeId,
          nodeId: edge.sourceNode,
          severity: 'ERROR',
        });
      }
    });

    return errors;
  }

  /**
   * Check for invalid weights (must be between 0 and 1)
   */
  private checkInvalidWeights(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];

    graph.edges.forEach((edge, edgeId) => {
      if (edge.weight < 0 || edge.weight > 1) {
        errors.push({
          type: 'INVALID_WEIGHT',
          message: `Invalid weight: ${edge.weight} (must be between 0 and 1)`,
          edgeId,
          severity: 'ERROR',
        });
      }
    });

    return errors;
  }

  /**
   * Check for invalid confidence (must be between 0 and 1)
   */
  private checkInvalidConfidence(graph: Graph): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check node confidence
    graph.nodes.forEach((node, nodeId) => {
      if (node.confidence < 0 || node.confidence > 1) {
        errors.push({
          type: 'INVALID_CONFIDENCE',
          message: `Invalid node confidence: ${node.confidence} (must be between 0 and 1)`,
          nodeId,
          severity: 'ERROR',
        });
      }
    });

    // Check edge confidence
    graph.edges.forEach((edge, edgeId) => {
      if (edge.confidence < 0 || edge.confidence > 1) {
        errors.push({
          type: 'INVALID_CONFIDENCE',
          message: `Invalid edge confidence: ${edge.confidence} (must be between 0 and 1)`,
          edgeId,
          severity: 'ERROR',
        });
      }
    });

    return errors;
  }

  /**
   * Validate a single node
   */
  validateNode(node: Node): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check confidence
    if (node.confidence < 0 || node.confidence > 1) {
      errors.push({
        type: 'INVALID_CONFIDENCE',
        message: `Invalid confidence: ${node.confidence} (must be between 0 and 1)`,
        nodeId: node.id,
        severity: 'ERROR',
      });
    }

    // Check label
    if (!node.label || node.label.trim() === '') {
      errors.push({
        type: 'DUPLICATE_NODE',
        message: 'Node label is empty',
        nodeId: node.id,
        severity: 'ERROR',
      });
    }

    // Check normalized label
    if (!node.normalizedLabel || node.normalizedLabel.trim() === '') {
      errors.push({
        type: 'DUPLICATE_NODE',
        message: 'Node normalized label is empty',
        nodeId: node.id,
        severity: 'ERROR',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single edge
   */
  validateEdge(edge: Edge, graph: Graph): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check weight
    if (edge.weight < 0 || edge.weight > 1) {
      errors.push({
        type: 'INVALID_WEIGHT',
        message: `Invalid weight: ${edge.weight} (must be between 0 and 1)`,
        edgeId: edge.id,
        severity: 'ERROR',
      });
    }

    // Check confidence
    if (edge.confidence < 0 || edge.confidence > 1) {
      errors.push({
        type: 'INVALID_CONFIDENCE',
        message: `Invalid confidence: ${edge.confidence} (must be between 0 and 1)`,
        edgeId: edge.id,
        severity: 'ERROR',
      });
    }

    // Check self-reference
    if (edge.sourceNode === edge.targetNode) {
      errors.push({
        type: 'INVALID_CYCLE',
        message: 'Self-referencing edge',
        edgeId: edge.id,
        nodeId: edge.sourceNode,
        severity: 'ERROR',
      });
    }

    // Check if source node exists
    if (!graph.nodes.has(edge.sourceNode)) {
      errors.push({
        type: 'DUPLICATE_EDGE',
        message: `Source node ${edge.sourceNode} does not exist`,
        edgeId: edge.id,
        severity: 'ERROR',
      });
    }

    // Check if target node exists
    if (!graph.nodes.has(edge.targetNode)) {
      errors.push({
        type: 'DUPLICATE_EDGE',
        message: `Target node ${edge.targetNode} does not exist`,
        edgeId: edge.id,
        severity: 'ERROR',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Add a custom forbidden edge combination
   */
  addForbiddenCombination(nodeType: NodeType, edgeType: EdgeType): void {
    if (!this.forbiddenEdgeCombinations.has(nodeType)) {
      this.forbiddenEdgeCombinations.set(nodeType, new Set());
    }
    this.forbiddenEdgeCombinations.get(nodeType)!.add(edgeType);
  }

  /**
   * Remove a forbidden edge combination
   */
  removeForbiddenCombination(nodeType: NodeType, edgeType: EdgeType): void {
    const forbiddenTypes = this.forbiddenEdgeCombinations.get(nodeType);
    if (forbiddenTypes) {
      forbiddenTypes.delete(edgeType);
    }
  }
}
