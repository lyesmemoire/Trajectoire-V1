import { GraphValidatorService } from './graph-validator.service';
import { Graph, Node, Edge, NodeType, EdgeType } from './graph-types';

const createTestNode = (
  id: string,
  type: NodeType,
  label: string,
  normalizedLabel: string,
): Node => ({
  id,
  type,
  label,
  normalizedLabel,
  confidence: 1,
  source: 'TEST',
  metadata: {},
  timestamps: {
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  provenance: {
    createdBy: 'test',
    algorithmVersion: '1.0',
  },
});

const createTestEdge = (
  id: string,
  type: EdgeType,
  sourceNode: string,
  targetNode: string,
): Edge => ({
  id,
  type,
  sourceNode,
  targetNode,
  weight: 0.5,
  confidence: 1,
  metadata: {},
  timestamps: {
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  provenance: {
    createdBy: 'test',
    algorithmVersion: '1.0',
  },
});

const createTestGraph = (nodes: Node[], edges: Edge[]): Graph => ({
  id: 'g1',
  nodes: new Map(nodes.map((n) => [n.id, n])),
  edges: new Map(edges.map((e) => [e.id, e])),
  metadata: {
    version: '1.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'TEST',
  },
});

describe('GraphValidatorService', () => {
  let service: GraphValidatorService;

  beforeEach(() => {
    service = new GraphValidatorService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a valid graph', () => {
      const graph = createTestGraph(
        [createTestNode('n1', NodeType.CANDIDATE, 'John', 'john')],
        [createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2')],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect duplicate nodes', () => {
      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.CANDIDATE, 'John', 'john'),
        ],
        [],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('DUPLICATE_NODE');
    });

    it('should detect duplicate edges', () => {
      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
        ],
        [
          createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2'),
          createTestEdge('e2', EdgeType.HAS_SKILL, 'n1', 'n2'),
        ],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('DUPLICATE_EDGE');
    });

    it('should detect self-referencing edges', () => {
      const graph = createTestGraph(
        [createTestNode('n1', NodeType.CANDIDATE, 'John', 'john')],
        [createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n1')],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_CYCLE');
    });

    it('should detect orphan nodes as warnings', () => {
      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
          createTestNode('n3', NodeType.SKILL, 'Python', 'python'),
        ],
        [createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2')],
      );

      const result = service.validate(graph);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.type === 'ORPHAN_NODE')).toBe(true); // n3 is orphan
    });

    it('should detect forbidden relations', () => {
      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.SKILL, 'JavaScript', 'javascript'),
          createTestNode('n2', NodeType.COMPANY, 'Google', 'google'),
        ],
        [createTestEdge('e1', EdgeType.WORKED_AT, 'n1', 'n2')],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('FORBIDDEN_RELATION');
    });

    it('should detect invalid weights', () => {
      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');
      edge.weight = 1.5;

      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
        ],
        [edge],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_WEIGHT');
    });

    it('should detect negative weights', () => {
      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');
      edge.weight = -0.5;

      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
        ],
        [edge],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_WEIGHT');
    });

    it('should detect invalid node confidence', () => {
      const node = createTestNode('n1', NodeType.CANDIDATE, 'John', 'john');
      node.confidence = 1.5;

      const graph = createTestGraph([node], []);

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_CONFIDENCE');
    });

    it('should detect invalid edge confidence', () => {
      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');
      edge.confidence = 1.5;

      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
        ],
        [edge],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_CONFIDENCE');
    });
  });

  describe('validateNode', () => {
    it('should validate a valid node', () => {
      const node = createTestNode('n1', NodeType.CANDIDATE, 'John', 'john');

      const result = service.validateNode(node);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid confidence', () => {
      const node = createTestNode('n1', NodeType.CANDIDATE, 'John', 'john');
      node.confidence = 1.5;

      const result = service.validateNode(node);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_CONFIDENCE');
    });

    it('should detect empty label', () => {
      const node = createTestNode('n1', NodeType.CANDIDATE, '', 'john');

      const result = service.validateNode(node);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should detect empty normalized label', () => {
      const node = createTestNode('n1', NodeType.CANDIDATE, 'John', '');

      const result = service.validateNode(node);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('validateEdge', () => {
    it('should validate a valid edge', () => {
      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
        ],
        [],
      );

      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');

      const result = service.validateEdge(edge, graph);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid weight', () => {
      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript'),
        ],
        [],
      );

      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');
      edge.weight = 1.5;

      const result = service.validateEdge(edge, graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_WEIGHT');
    });

    it('should detect self-reference', () => {
      const graph = createTestGraph(
        [createTestNode('n1', NodeType.CANDIDATE, 'John', 'john')],
        [],
      );

      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n1');

      const result = service.validateEdge(edge, graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('INVALID_CYCLE');
    });

    it('should detect missing source node', () => {
      const graph = createTestGraph(
        [createTestNode('n2', NodeType.SKILL, 'JavaScript', 'javascript')],
        [],
      );

      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');

      const result = service.validateEdge(edge, graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should detect missing target node', () => {
      const graph = createTestGraph(
        [createTestNode('n1', NodeType.CANDIDATE, 'John', 'john')],
        [],
      );

      const edge = createTestEdge('e1', EdgeType.HAS_SKILL, 'n1', 'n2');

      const result = service.validateEdge(edge, graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('addForbiddenCombination', () => {
    it('should add a forbidden combination', () => {
      service.addForbiddenCombination(NodeType.CANDIDATE, EdgeType.WORKED_AT);

      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.CANDIDATE, 'John', 'john'),
          createTestNode('n2', NodeType.COMPANY, 'Google', 'google'),
        ],
        [createTestEdge('e1', EdgeType.WORKED_AT, 'n1', 'n2')],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.type).toBe('FORBIDDEN_RELATION');
    });
  });

  describe('removeForbiddenCombination', () => {
    it('should remove a forbidden combination', () => {
      service.removeForbiddenCombination(NodeType.SKILL, EdgeType.WORKED_AT);

      const graph = createTestGraph(
        [
          createTestNode('n1', NodeType.SKILL, 'JavaScript', 'javascript'),
          createTestNode('n2', NodeType.COMPANY, 'Google', 'google'),
        ],
        [createTestEdge('e1', EdgeType.WORKED_AT, 'n1', 'n2')],
      );

      const result = service.validate(graph);

      expect(result.isValid).toBe(true);
    });
  });
});
