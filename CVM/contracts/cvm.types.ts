/**
 * Cognitive Virtual Machine (CVM) TypeScript Type Definitions
 * 
 * This file contains comprehensive TypeScript type definitions for all CVM components.
 * Version: 1.0.0
 */

// ============================================================================
// CVM-000: Constitution Types
// ============================================================================

export interface CVMConstitution {
  version: string;
  principles: Principle[];
  architecturalInvariants: ArchitecturalInvariant[];
  executionModel: ExecutionModel;
  resourceBudgets: ResourceBudgets;
  errorHandling: ErrorHandlingModel;
  securityModel: SecurityModel;
  versioning: VersioningPolicy;
  compliance: ComplianceRequirements;
  metrics: MetricsPolicy;
  governance: GovernanceModel;
}

export interface Principle {
  id: string;
  name: string;
  description: string;
  priority: number;
}

export interface ArchitecturalInvariant {
  id: string;
  name: string;
  description: string;
  enforcement: EnforcementLevel;
}

export enum EnforcementLevel {
  STRICT = 'STRICT',
  MODERATE = 'MODERATE',
  ADVISORY = 'ADVISORY'
}

export interface ExecutionModel {
  determinism: DeterminismLevel;
  distribution: DistributionModel;
  traceability: TraceabilityLevel;
  optimizability: OptimizabilityLevel;
  industrializability: IndustrializabilityLevel;
}

export enum DeterminismLevel {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  NONE = 'NONE'
}

export enum DistributionModel {
  CENTRALIZED = 'CENTRALIZED',
  DISTRIBUTED = 'DISTRIBUTED',
  HYBRID = 'HYBRID'
}

export enum TraceabilityLevel {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  MINIMAL = 'MINIMAL'
}

export enum OptimizabilityLevel {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  NONE = 'NONE'
}

export enum IndustrializabilityLevel {
  PRODUCTION = 'PRODUCTION',
  DEVELOPMENT = 'DEVELOPMENT',
  EXPERIMENTAL = 'EXPERIMENTAL'
}

// ============================================================================
// CVM-001: Cognitive Virtual Machine Core Types
// ============================================================================

export interface CVMInstance {
  id: string;
  config: CVMConfig;
  state: CVMState;
  executionGraph: ExecutionGraph;
  resourceBudgets: ResourceBudgets;
  metrics: ExecutionMetrics;
}

export interface CVMConfig {
  version: string;
  mode: ExecutionMode;
  optimizationLevel: OptimizationLevel;
  traceLevel: TraceLevel;
  securityLevel: SecurityLevel;
  resourceLimits: ResourceLimits;
}

export enum ExecutionMode {
  NORMAL = 'NORMAL',
  DEBUG = 'DEBUG',
  PROFILE = 'PROFILE',
  SANDBOX = 'SANDBOX'
}

export enum OptimizationLevel {
  O0 = 'O0',
  O1 = 'O1',
  O2 = 'O2',
  O3 = 'O3'
}

export enum TraceLevel {
  NONE = 'NONE',
  BASIC = 'BASIC',
  DETAILED = 'DETAILED',
  FULL = 'FULL'
}

export enum SecurityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  STRICT = 'STRICT'
}

export interface CVMState {
  status: ExecutionStatus;
  programCounter: number;
  registerFile: RegisterFile;
  memory: MemoryState;
  stack: StackState;
  knowledgeGraph: KnowledgeGraph;
  checkpoints: Map<string, Checkpoint>;
}

export enum ExecutionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  ERROR = 'ERROR'
}

export interface RegisterFile {
  registers: Map<string, RegisterValue>;
}

export type RegisterValue = number | bigint | string | boolean | null;

export interface MemoryState {
  heap: Map<number, MemoryValue>;
  stack: Map<number, MemoryValue>;
  constants: Map<number, MemoryValue>;
}

export type MemoryValue = any;

export interface StackState {
  frames: StackFrame[];
  pointer: number;
}

export interface StackFrame {
  returnAddress: number;
  basePointer: number;
  locals: Map<string, unknown>;
}

export interface Checkpoint {
  id: string;
  timestamp: number;
  programCounter: number;
  state: CVMState;
  lastEvent: string;
}

export interface ExecutionGraph {
  nodes: ExecutionNode[];
  edges: ExecutionEdge[];
  entryPoint: string;
  exitPoints: string[];
}

export interface ExecutionNode {
  id: string;
  instruction: Instruction;
  dependencies: string[];
  resourceRequirements: ResourceRequirements;
  optimizationHints: OptimizationHints;
  metadata: NodeMetadata;
}

export interface Instruction {
  opcode: string;
  operands: unknown[];
  metadata?: InstructionMetadata;
}

export interface InstructionMetadata {
  traceId?: string;
  rollbackId?: string;
  replayId?: string;
  latencyBudget?: number;
  tokenBudget?: number;
  memoryBudget?: number;
  optimizationHints?: OptimizationHints;
}

export interface OptimizationHints {
  canParallelize?: boolean;
  canCache?: boolean;
  canFusion?: boolean;
  priority?: number;
}

export interface ExecutionEdge {
  id: string;
  from: string;
  to: string;
  condition?: string;
  type: EdgeType;
}

export enum EdgeType {
  SEQUENTIAL = 'SEQUENTIAL',
  CONDITIONAL = 'CONDITIONAL',
  DATA_DEPENDENCY = 'DATA_DEPENDENCY',
  CONTROL_DEPENDENCY = 'CONTROL_DEPENDENCY'
}

export interface ResourceRequirements {
  tokens: number;
  latency: number;
  memory: number;
  cpu: number;
  gpu?: number;
}

export interface NodeMetadata {
  index: number;
  sourceLocation: SourceLocation;
}

export interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

export interface ResourceBudgets {
  tokens: number;
  latency: number;
  memory: number;
  cpu: number;
  gpu?: number;
}

export interface ResourceLimits {
  maxMemory: number;
  maxCPU: number;
  maxGPU?: number;
  maxExecutionTime: number;
}

export interface ExecutionMetrics {
  executionTime: number;
  tokenUsage: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage?: number;
  instructionCount: number;
  cacheHits: number;
  cacheMisses: number;
}

// ============================================================================
// CVM-002: Cognitive Bytecode Specification Types
// ============================================================================

export interface BytecodeContainer {
  header: BytecodeHeader;
  constantPool: ConstantPool;
  instructionStream: InstructionStream;
  debugInfo: DebugInfo;
  signature: BytecodeSignature;
}

export interface BytecodeHeader {
  magic: number;
  version: number;
  constantPoolOffset: number;
  constantPoolSize: number;
  instructionStreamOffset: number;
  instructionStreamSize: number;
  debugInfoOffset: number;
  debugInfoSize: number;
  signatureOffset: number;
  signatureSize: number;
  checksum: number;
}

export interface ConstantPool {
  entries: ConstantPoolEntry[];
}

export interface ConstantPoolEntry {
  type: ConstantType;
  value: unknown;
  index: number;
}

export enum ConstantType {
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY'
}

export interface InstructionStream {
  instructions: EncodedInstruction[];
}

export interface EncodedInstruction {
  opcode: number;
  operands: number[];
  metadata: InstructionMetadata;
}

export interface DebugInfo {
  sourceMap: SourceMap;
  lineInfo: LineInfo[];
  symbolTable: SymbolTable;
}

export interface SourceMap {
  sources: string[];
  mappings: SourceMapping[];
}

export interface SourceMapping {
  generatedPosition: Position;
  originalPosition: Position;
  source: string;
  name?: string;
}

export interface Position {
  line: number;
  column: number;
}

export interface LineInfo {
  instructionIndex: number;
  sourceFile: string;
  lineNumber: number;
  columnNumber: number;
}

export interface SymbolTable {
  symbols: Symbol[];
}

export interface Symbol {
  name: string;
  type: SymbolType;
  scope: string;
  address: number;
}

export enum SymbolType {
  FUNCTION = 'FUNCTION',
  VARIABLE = 'VARIABLE',
  CONSTANT = 'CONSTANT',
  LABEL = 'LABEL'
}

export interface BytecodeSignature {
  algorithm: string;
  checksum: string;
  timestamp: number;
}

// ============================================================================
// CVM-003: Cognitive Instruction Set Types
// ============================================================================

export interface InstructionDefinition {
  opcode: string;
  code: number;
  family: InstructionFamily;
  syntax: string;
  semantics: string;
  bytecodeEncoding: BytecodeEncoding;
  cpuCost: number;
  memoryCost: number;
  gpuCost?: number;
  tokenCost: number;
  rollback: RollbackBehavior;
  replay: ReplayBehavior;
  events: EventType[];
  errors: ErrorType[];
  pseudocode: string;
}

export enum InstructionFamily {
  OBSERVATION = 'OBSERVATION',
  REASONING = 'REASONING',
  EVIDENCE = 'EVIDENCE',
  CONVERSATION = 'CONVERSATION',
  PLANNING = 'PLANNING',
  EXECUTION = 'EXECUTION',
  MEMORY = 'MEMORY',
  KNOWLEDGE = 'KNOWLEDGE',
  PREDICTION = 'PREDICTION',
  DECISION = 'DECISION',
  LEARNING = 'LEARNING',
  SAFETY = 'SAFETY'
}

export interface BytecodeEncoding {
  opcode: number;
  operandTypes: OperandType[];
}

export enum OperandType {
  REGISTER = 'REGISTER',
  IMMEDIATE = 'IMMEDIATE',
  ADDRESS = 'ADDRESS',
  LABEL = 'LABEL',
  CONSTANT = 'CONSTANT'
}

export enum RollbackBehavior {
  NONE = 'NONE',
  STATE = 'STATE',
  FULL = 'FULL'
}

export enum ReplayBehavior {
  DETERMINISTIC = 'DETERMINISTIC',
  NON_DETERMINISTIC = 'NON_DETERMINISTIC',
  SKIPPABLE = 'SKIPPABLE'
}

export enum EventType {
  INSTRUCTION_START = 'INSTRUCTION_START',
  INSTRUCTION_END = 'INSTRUCTION_END',
  OBSERVATION_MADE = 'OBSERVATION_MADE',
  INFERENCE_COMPLETED = 'INFERENCE_COMPLETED',
  VERIFICATION_COMPLETED = 'VERIFICATION_COMPLETED',
  DECISION_MADE = 'DECISION_MADE',
  LLM_CALL_STARTED = 'LLM_CALL_STARTED',
  LLM_CALL_COMPLETED = 'LLM_CALL_COMPLETED',
  GRAPH_QUERIED = 'GRAPH_QUERIED',
  GRAPH_TRAVERSED = 'GRAPH_TRAVERSED',
  MEMORY_ACCESSED = 'MEMORY_ACCESSED',
  MEMORY_MODIFIED = 'MEMORY_MODIFIED',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  CHECKPOINT_CREATED = 'CHECKPOINT_CREATED',
  CHECKPOINT_RESTORED = 'CHECKPOINT_RESTORED'
}

export enum ErrorType {
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_ERROR = 'RESOURCE_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

// ============================================================================
// CVM-004: Cognitive Optimizer Types
// ============================================================================

export interface CognitiveOptimizer {
  config: OptimizerConfig;
  passes: OptimizationPass[];
  analysisResults: Map<string, AnalysisResult>;
  optimize(graph: ExecutionGraph): Promise<OptimizationResult>;
  addPass(pass: OptimizationPass): void;
  removePass(passId: string): void;
  getPass(passId: string): OptimizationPass | undefined;
  setOptimizationLevel(level: OptimizationLevel): void;
  reset(): void;
}

export interface OptimizerConfig {
  level: OptimizationLevel;
  enableInlining: boolean;
  enableLoopUnrolling: boolean;
  enableDeadCodeElimination: boolean;
  enableConstantFolding: boolean;
  maxIterations: number;
}

export interface OptimizationPass {
  id: string;
  name: string;
  passType: OptimizationType;
  description: string;
  dependencies: string[];
  requiredAnalyses: string[];
  run(graph: ExecutionGraph, analysis: Map<string, AnalysisResult>): Promise<PassResult>;
}

export enum OptimizationType {
  DEAD_REASONING_ELIMINATION = 'DEAD_REASONING_ELIMINATION',
  GRAPH_FUSION = 'GRAPH_FUSION',
  PROMPT_FUSION = 'PROMPT_FUSION',
  MEMORY_FUSION = 'MEMORY_FUSION',
  EVIDENCE_COMPRESSION = 'EVIDENCE_COMPRESSION',
  GRAPH_SIMPLIFICATION = 'GRAPH_SIMPLIFICATION',
  TOKEN_OPTIMIZATION = 'TOKEN_OPTIMIZATION',
  LATENCY_OPTIMIZATION = 'LATENCY_OPTIMIZATION',
  INSTRUCTION_SCHEDULING = 'INSTRUCTION_SCHEDULING',
  SPECULATIVE_EXECUTION = 'SPECULATIVE_EXECUTION',
  CONSTANT_FOLDING = 'CONSTANT_FOLDING',
  LAZY_EVALUATION = 'LAZY_EVALUATION',
  CONTEXT_COMPRESSION = 'CONTEXT_COMPRESSION',
  PARALLEL_REASONING = 'PARALLEL_REASONING',
  EMBEDDING_REUSE = 'EMBEDDING_REUSE'
}

export interface AnalysisResult {
  passId: string;
  data: unknown;
  timestamp: number;
}

export interface PassResult {
  success: boolean;
  modifiedGraph: ExecutionGraph;
  metrics: PassMetrics;
}

export interface PassMetrics {
  nodesRemoved: number;
  nodesAdded: number;
  edgesRemoved: number;
  edgesAdded: number;
  executionTime: number;
}

export interface OptimizationResult {
  originalGraph: ExecutionGraph;
  optimizedGraph: ExecutionGraph;
  improvements: OptimizationImprovements;
  appliedPasses: string[];
  metrics: OptimizationMetrics;
}

export interface OptimizationImprovements {
  tokenReduction: number;
  latencyReduction: number;
  memoryReduction: number;
  instructionReduction: number;
}

export interface OptimizationMetrics {
  totalOptimizationTime: number;
  passResults: Map<string, PassResult>;
}

// ============================================================================
// CVM-005: Runtime Executor Types
// ============================================================================

export interface RuntimeExecutor {
  config: ExecutorConfig;
  state: ExecutorState;
  instructionHandlers: Map<string, InstructionHandler>;
  resourceManager: ResourceManager;
  errorManager: ErrorManager;
  initialize(graph: ExecutionGraph): Promise<void>;
  execute(input: ExecutionInput): Promise<ExecutionOutput>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  rollback(checkpointId: string): Promise<void>;
  snapshot(): Promise<Snapshot>;
  restore(snapshot: Snapshot): Promise<void>;
  getState(): ExecutorState;
  getMetrics(): ExecutionMetrics;
}

export interface ExecutorConfig {
  maxExecutionTime: number;
  enableProfiling: boolean;
  enableTracing: boolean;
  enableDebugging: boolean;
  checkpointInterval: number;
}

export interface ExecutorState {
  status: ExecutionStatus;
  currentTraceId: string;
  programCounter: number;
  executionGraph: ExecutionGraph;
  registerFile: RegisterFile;
  memory: MemoryState;
  stack: StackState;
  knowledgeGraph: KnowledgeGraph;
  checkpoints: Map<string, Checkpoint>;
  metrics: ExecutionMetrics;
}

export interface InstructionHandler {
  opcode: string;
  handle(instruction: Instruction, context: ExecutionContext): Promise<HandlerResult>;
}

export interface ExecutionContext {
  registerFile: RegisterFile;
  memory: MemoryState;
  stack: StackState;
  knowledgeGraph: KnowledgeGraph;
  resourceBudgets: ResourceBudgets;
  traceEngine: TraceEngine;
}

export interface HandlerResult {
  success: boolean;
  output: unknown;
  stateChanges: StateChange[];
  events: TraceEvent[];
}

export interface StateChange {
  type: StateChangeType;
  target: string;
  value: unknown;
}

export enum StateChangeType {
  REGISTER_WRITE = 'REGISTER_WRITE',
  MEMORY_WRITE = 'MEMORY_WRITE',
  STACK_PUSH = 'STACK_PUSH',
  STACK_POP = 'STACK_POP',
  GRAPH_UPDATE = 'GRAPH_UPDATE'
}

export interface ResourceManager {
  checkBudget(budget: ResourceBudgets): boolean;
  allocateResources(requirements: ResourceRequirements): boolean;
  releaseResources(resources: ResourceRequirements): void;
  getResourceUsage(): ResourceUsage;
}

export interface ResourceUsage {
  tokensUsed: number;
  latencyUsed: number;
  memoryUsed: number;
  cpuUsed: number;
  gpuUsed?: number;
}

export interface ErrorManager {
  handleError(error: CVMError): ErrorHandlingResult;
  createError(type: ErrorType, message: string, context: unknown): CVMError;
  getErrors(): CVMError[];
  clearErrors(): void;
}

export interface CVMError {
  id: string;
  type: ErrorType;
  message: string;
  context: unknown;
  timestamp: number;
  stackTrace?: string;
}

export interface ErrorHandlingResult {
  action: ErrorAction;
  recovery?: RecoveryAction;
}

export enum ErrorAction {
  CONTINUE = 'CONTINUE',
  RETRY = 'RETRY',
  ROLLBACK = 'ROLLBACK',
  ABORT = 'ABORT'
}

export interface RecoveryAction {
  type: RecoveryType;
  target: string;
  value: unknown;
}

export enum RecoveryType {
  RETRY = 'RETRY',
  SKIP = 'SKIP',
  SUBSTITUTE = 'SUBSTITUTE',
  DEFAULT = 'DEFAULT'
}

export interface ExecutionInput {
  data: unknown;
  context?: unknown;
  options?: ExecutionOptions;
}

export interface ExecutionOptions {
  timeout?: number;
  enableProfiling?: boolean;
  enableTracing?: boolean;
  checkpointInterval?: number;
}

export interface ExecutionOutput {
  success: boolean;
  result: unknown;
  metrics: ExecutionMetrics;
  traceId: string;
  errors: CVMError[];
}

export interface Snapshot {
  id: string;
  timestamp: number;
  state: ExecutorState;
}

// ============================================================================
// CVM-009: Trace Engine Types
// ============================================================================

export interface TraceEngine {
  config: TraceConfig;
  collector: TraceCollector;
  processor: TraceProcessor;
  storage: TraceStorage;
  queryEngine: TraceQueryEngine;
  analyzer: TraceAnalyzer;
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  emit(event: TraceEvent): Promise<void>;
  emitBatch(events: TraceEvent[]): Promise<void>;
  query(query: TraceQuery): Promise<TraceResult>;
  replay(traceId: string): Promise<ReplayResult>;
  analyze(traceId: string): Promise<AnalysisResult>;
  getMetrics(): TraceMetrics;
  flush(): Promise<void>;
}

export interface TraceConfig {
  enable: boolean;
  level: TraceLevel;
  bufferSize: number;
  flushInterval: number;
  storageBackend: StorageBackend;
}

export enum StorageBackend {
  MEMORY = 'MEMORY',
  DISK = 'DISK',
  REMOTE = 'REMOTE'
}

export interface TraceCollector {
  collect(event: TraceEvent): Promise<void>;
  collectBatch(events: TraceEvent[]): Promise<void>;
  flush(): Promise<void>;
}

export interface TraceEvent {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  eventType: EventType;
  timestamp: number;
  duration?: number;
  data: EventData;
  metadata: EventMetadata;
}

export interface EventData {
  instruction?: Instruction;
  result?: unknown;
  input?: unknown;
  context?: unknown;
  metrics?: EventMetrics;
}

export interface EventMetrics {
  tokensUsed?: number;
  latency?: number;
  memoryUsed?: number;
}

export interface EventMetadata {
  sourceLocation?: SourceLocation;
  threadId?: string;
  processId?: string;
}

export interface TraceProcessor {
  process(event: TraceEvent): Promise<TraceEvent>;
  filter(event: TraceEvent): boolean;
  transform(event: TraceEvent): TraceEvent;
  enrich(event: TraceEvent): TraceEvent;
}

export interface TraceStorage {
  store(event: TraceEvent): Promise<void>;
  storeBatch(events: TraceEvent[]): Promise<void>;
  retrieve(traceId: string): Promise<TraceEvent[]>;
  retrieveByTimeRange(start: number, end: number): Promise<TraceEvent[]>;
  delete(traceId: string): Promise<void>;
}

export interface TraceQueryEngine {
  query(query: TraceQuery): Promise<TraceResult>;
  aggregate(query: AggregationQuery): Promise<AggregationResult>;
}

export interface TraceQuery {
  traceId?: string;
  eventType?: EventType;
  timeRange?: TimeRange;
  filters?: QueryFilter[];
  limit?: number;
  offset?: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  CONTAINS = 'CONTAINS',
  REGEX = 'REGEX'
}

export interface TraceResult {
  events: TraceEvent[];
  totalCount: number;
  queryTime: number;
}

export interface AggregationQuery {
  groupBy: string[];
  aggregations: Aggregation[];
  filters?: QueryFilter[];
}

export interface Aggregation {
  field: string;
  operation: AggregationOperation;
  alias: string;
}

export enum AggregationOperation {
  COUNT = 'COUNT',
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX'
}

export interface AggregationResult {
  groups: AggregationGroup[];
  totalTime: number;
}

export interface AggregationGroup {
  key: unknown;
  values: Map<string, number>;
}

export interface TraceAnalyzer {
  analyze(traceId: string): Promise<AnalysisResult>;
  detectPatterns(traceId: string): Promise<PatternDetectionResult>;
  detectAnomalies(traceId: string): Promise<AnomalyDetectionResult>;
}

export interface AnalysisResult {
  traceId: string;
  summary: TraceSummary;
  patterns: Pattern[];
  anomalies: Anomaly[];
  recommendations: Recommendation[];
}

export interface TraceSummary {
  eventCount: number;
  duration: number;
  tokenUsage: number;
  memoryUsage: number;
  instructionCount: number;
}

export interface Pattern {
  id: string;
  type: PatternType;
  description: string;
  occurrences: PatternOccurrence[];
}

export enum PatternType {
  SEQUENCE = 'SEQUENCE',
  LOOP = 'LOOP',
  BRANCH = 'BRANCH',
  BOTTLENECK = 'BOTTLENECK'
}

export interface PatternOccurrence {
  startTime: number;
  endTime: number;
  events: string[];
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  description: string;
  severity: AnomalySeverity;
  timestamp: number;
}

export enum AnomalyType {
  LATENCY_SPIKE = 'LATENCY_SPIKE',
  MEMORY_LEAK = 'MEMORY_LEAK',
  ERROR_BURST = 'ERROR_BURST',
  UNEXPECTED_SEQUENCE = 'UNEXPECTED_SEQUENCE'
}

export enum AnomalySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  description: string;
  priority: RecommendationPriority;
}

export enum RecommendationType {
  OPTIMIZATION = 'OPTIMIZATION',
  DEBUGGING = 'DEBUGGING',
  MONITORING = 'MONITORING'
}

export enum RecommendationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ReplayResult {
  success: boolean;
  replayedEvents: TraceEvent[];
  differences: ReplayDifference[];
  metrics: ReplayMetrics;
}

export interface ReplayDifference {
  eventId: string;
  field: string;
  originalValue: unknown;
  replayedValue: unknown;
}

export interface ReplayMetrics {
  replayTime: number;
  eventCount: number;
  differenceCount: number;
}

export interface TraceMetrics {
  eventsCollected: number;
  eventsProcessed: number;
  eventsStored: number;
  storageSize: number;
  queryCount: number;
  averageQueryTime: number;
}

// ============================================================================
// CVM-010: Debugger Types
// ============================================================================

export interface CognitiveDebugger {
  config: DebuggerConfig;
  traceEngine: TraceEngine;
  executionAnalyzer: ExecutionAnalyzer;
  decisionExplainer: DecisionExplainer;
  hypothesisAnalyzer: HypothesisAnalyzer;
  strategyAnalyzer: StrategyAnalyzer;
  proofVerifier: ProofVerifier;
  replayEngine: ReplayEngine;
  visualizationEngine: VisualizationEngine;
  attach(executor: RuntimeExecutor): Promise<void>;
  detach(): Promise<void>;
  explainDecision(decisionId: string): Promise<DecisionExplanation>;
  explainQuestion(questionId: string): Promise<QuestionExplanation>;
  explainFollowUp(followUpId: string): Promise<FollowUpExplanation>;
  explainConfidence(confidenceId: string): Promise<ConfidenceExplanation>;
  explainHypothesis(hypothesisId: string): Promise<HypothesisExplanation>;
  explainStrategy(strategyId: string): Promise<StrategyExplanation>;
  explainProof(proofId: string): Promise<ProofExplanation>;
  stepOver(): Promise<StepResult>;
  stepInto(): Promise<StepResult>;
  stepOut(): Promise<StepResult>;
  continue(): Promise<StepResult>;
  pause(): Promise<void>;
  setBreakpoint(location: BreakpointLocation): Promise<void>;
  clearBreakpoint(location: BreakpointLocation): Promise<void>;
  listBreakpoints(): Breakpoint[];
  watchExpression(expression: string): Promise<void>;
  unwatchExpression(expression: string): Promise<void>;
  evaluateExpression(expression: string): Promise<EvaluationResult>;
  whatIf(alternative: AlternativeExecution): Promise<WhatIfResult>;
  reverseDebug(timestamp: number): Promise<ReverseDebugResult>;
  getExecutionFlow(): Promise<ExecutionFlow>;
  getDecisionTree(): Promise<DecisionTree>;
  getEvidenceGraph(): Promise<EvidenceGraph>;
  getReasoningGraph(): Promise<ReasoningGraph>;
  getTimeline(): Promise<Timeline>;
  exportDebugSession(format: ExportFormat): Promise<ExportResult>;
  importDebugSession(data: unknown): Promise<void>;
}

export interface DebuggerConfig {
  autoAttach: boolean;
  breakOnError: boolean;
  breakOnDecision: boolean;
  breakOnLowConfidence: number;
  maxHistorySize: number;
  enableVisualization: boolean;
  enableReplay: boolean;
  enableWhatIf: boolean;
  enableReverseDebug: boolean;
}

export interface BreakpointLocation {
  instructionId?: string;
  lineNumber?: number;
  functionName?: string;
}

export interface Breakpoint {
  id: string;
  location: BreakpointLocation;
  enabled: boolean;
  hitCount: number;
  condition?: string;
}

export interface StepResult {
  completed: boolean;
  event: TraceEvent | null;
  breakpointHit?: boolean;
}

export interface EvaluationResult {
  expression: string;
  value: unknown;
  error: string | null;
}

export interface DecisionExplanation {
  decisionId: string;
  decision: Decision;
  context: DecisionContext;
  reasoning: ReasoningChain;
  alternatives: Alternative[];
  selectedAlternative: Alternative;
  confidence: ConfidenceBreakdown;
  impact: ImpactAnalysis;
  trace: DecisionTrace;
}

// Canonical Reference: BCM-OBJ-009 (blueprint.cognitive.decision)
// Owner: Chief Cognitive Architect
export interface Decision {
  id: string;
  description: string;
  timestamp: number;
}

export interface DecisionContext {
  timestamp: number;
  state: ExecutionState;
  inputs: unknown[];
  constraints: Constraint[];
  goals: Goal[];
  knowledgeGraphState: KnowledgeGraph;
}

export interface Constraint {
  key: string;
  value: unknown;
  operator: string;
}

export interface Goal {
  id: string;
  description: string;
  priority: number;
}

export interface ReasoningChain {
  steps: ReasoningStep[];
  evidence: Evidence[];
  assumptions: Assumption[];
  inferences: Inference[];
  conclusion: Conclusion;
}

export interface ReasoningStep {
  id: string;
  type: ReasoningStepType;
  description: string;
  input: unknown;
  output: unknown;
  timestamp: number;
  duration: number;
}

export enum ReasoningStepType {
  OBSERVATION = 'OBSERVATION',
  HYPOTHESIS = 'HYPOTHESIS',
  EVIDENCE_GATHERING = 'EVIDENCE_GATHERING',
  ANALYSIS = 'ANALYSIS',
  INFERENCE = 'INFERENCE',
  DECISION = 'DECISION'
}

// Canonical Reference: BCM-OBJ-003 (blueprint.cognitive.evidence)
// Owner: Chief Cognitive Architect
export interface Evidence {
  id: string;
  content: string;
  weight: number;
  timestamp: number;
  supports?: string[];
}

export interface Assumption {
  id: string;
  statement: string;
  confidence: number;
}

export interface Inference {
  id: string;
  statement: string;
  confidence: number;
  basis: string[];
}

export interface Conclusion {
  statement: string;
  confidence: number;
}

export interface Alternative {
  id: string;
  description: string;
  expectedOutcome: unknown;
  confidence: number;
  cost: Cost;
  risk: Risk;
  rejected: boolean;
  rejectionReason?: string;
}

export interface Cost {
  tokens: number;
  latency: number;
  memory: number;
}

export interface Risk {
  level: RiskLevel;
  factors: string[];
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ConfidenceBreakdown {
  overall: number;
  components: ConfidenceComponent[];
  uncertainty: UncertaintyAnalysis;
  sensitivity: SensitivityAnalysis;
}

export interface ConfidenceComponent {
  factor: string;
  weight: number;
  value: number;
  contribution: number;
}

export interface UncertaintyAnalysis {
  sources: UncertaintySource[];
  total: number;
  mitigation: MitigationStrategy[];
}

export interface UncertaintySource {
  factor: string;
  contribution: number;
}

export interface MitigationStrategy {
  description: string;
  effectiveness: number;
}

export interface SensitivityAnalysis {
  factors: SensitivityFactor[];
  criticalFactors: string[];
}

export interface SensitivityFactor {
  factor: string;
  sensitivity: number;
}

export interface ImpactAnalysis {
  throughput: number;
  latency: number;
  resourceUtilization: number;
}

export interface DecisionTrace {
  traceId: string;
  events: TraceEvent[];
  timeline: Timeline;
  causality: CausalityGraph;
}

export interface Timeline {
  events: TimelineEvent[];
  startTime: number;
  endTime: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  description: string;
  duration?: number;
}

export interface CausalityGraph {
  nodes: CausalityNode[];
  edges: CausalityEdge[];
}

export interface CausalityNode {
  id: string;
  type: string;
  timestamp: number;
}

export interface CausalityEdge {
  from: string;
  to: string;
  strength: number;
}

// ============================================================================
// CVM-011: Profiler Types
// ============================================================================

export interface CognitiveProfiler {
  config: ProfilerConfig;
  metricCollector: MetricCollector;
  cognitiveAnalyzer: CognitiveMetricAnalyzer;
  resourceAnalyzer: ResourceAnalyzer;
  performanceModeler: PerformanceModeler;
  optimizationRecommender: OptimizationRecommender;
  visualizationEngine: VisualizationEngine;
  startProfiling(sessionId: string): Promise<void>;
  stopProfiling(sessionId: string): Promise<void>;
  pauseProfiling(sessionId: string): Promise<void>;
  resumeProfiling(sessionId: string): Promise<void>;
  collectMetrics(event: TraceEvent): Promise<void>;
  getMetrics(sessionId: string): Promise<ProfileMetrics>;
  getRealTimeMetrics(sessionId: string): Promise<RealTimeMetrics>;
  analyzePerformance(sessionId: string): Promise<PerformanceAnalysis>;
  analyzeBottlenecks(sessionId: string): Promise<BottleneckAnalysis>;
  analyzeHotspots(sessionId: string): Promise<HotspotAnalysis>;
  analyzeCriticalPath(sessionId: string): Promise<CriticalPathAnalysis>;
  analyzeScaling(sessionId: string): Promise<ScalingAnalysis>;
  analyzeCost(sessionId: string): Promise<CostAnalysis>;
  generateReport(sessionId: string, format: ReportFormat): Promise<ProfileReport>;
  exportData(sessionId: string, format: ExportFormat): Promise<ExportResult>;
  compareSessions(sessionIds: string[]): Promise<ComparisonResult>;
  trendAnalysis(sessionIds: string[]): Promise<TrendAnalysis>;
}

export interface ProfilerConfig {
  samplingRate: number;
  bufferSize: number;
  enableRealTime: boolean;
  enableGPUProfiling: boolean;
  enableNetworkProfiling: boolean;
  enableMemoryProfiling: boolean;
  metrics: MetricConfig[];
}

export interface MetricConfig {
  name: string;
  enabled: boolean;
  samplingInterval: number;
  aggregation: AggregationMethod;
}

export enum AggregationMethod {
  AVERAGE = 'AVERAGE',
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  PERCENTILE = 'PERCENTILE'
}

export interface MetricCollector {
  collect(event: TraceEvent): Promise<MetricSample>;
  collectBatch(events: TraceEvent[]): Promise<MetricSample[]>;
  getMetrics(sessionId: string): Promise<CollectedMetrics>;
  reset(sessionId: string): Promise<void>;
}

export interface MetricSample {
  sessionId: string;
  timestamp: number;
  instructionId: string;
  latency: LatencyMetrics;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  tokens: TokenMetrics;
  network: NetworkMetrics;
}

export interface LatencyMetrics {
  total: number;
  reasoning: number;
  evidence: number;
  decision: number;
  conversation: number;
  knowledge: number;
  planning: number;
  memory: number;
  llm: number;
  scheduler: number;
  compiler: number;
}

export interface CPUMetrics {
  total: number;
  user: number;
  system: number;
  iowait: number;
}

export interface MemoryMetrics {
  total: number;
  heap: number;
  stack: number;
  cache: number;
  knowledgeGraph: number;
}

export interface TokenMetrics {
  input: number;
  output: number;
  total: number;
  cached: number;
  byModel: Map<string, number>;
}

export interface NetworkMetrics {
  requests: number;
  bytes: number;
  latency: number;
  errors: number;
}

export interface CollectedMetrics {
  sessionId: string;
  samples: MetricSample[];
  aggregated: AggregatedMetrics;
}

export interface AggregatedMetrics {
  latency: LatencyMetrics;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  tokens: TokenMetrics;
  network: NetworkMetrics;
}

export interface ProfileMetrics {
  sessionId: string;
  latency: LatencyMetrics;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  tokens: TokenMetrics;
  network: NetworkMetrics;
}

export interface RealTimeMetrics {
  sessionId: string;
  metrics: ProfileMetrics;
  timestamp: number;
}

export interface PerformanceAnalysis {
  sessionId: string;
  overall: OverallPerformance;
  bottlenecks: BottleneckAnalysis;
  hotspots: HotspotAnalysis;
  criticalPath: CriticalPathAnalysis;
  scaling: ScalingAnalysis;
  cost: CostAnalysis;
}

export interface OverallPerformance {
  executionTime: number;
  throughput: number;
  efficiency: number;
}

export interface BottleneckAnalysis {
  bottlenecks: Bottleneck[];
  primaryBottleneck: Bottleneck;
  impact: BottleneckImpact;
  recommendations: BottleneckRecommendation[];
}

export interface Bottleneck {
  id: string;
  type: BottleneckType;
  location: string;
  severity: BottleneckSeverity;
  impact: number;
  description: string;
}

export enum BottleneckType {
  CPU = 'CPU',
  MEMORY = 'MEMORY',
  IO = 'IO',
  NETWORK = 'NETWORK',
  LLM = 'LLM',
  SYNCHRONIZATION = 'SYNCHRONIZATION',
  ALGORITHM = 'ALGORITHM'
}

export enum BottleneckSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface BottleneckImpact {
  throughput: number;
  latency: number;
  resourceUtilization: number;
}

export interface BottleneckRecommendation {
  type: string;
  description: string;
  priority: RecommendationPriority;
  estimatedImpact: number;
}

export interface HotspotAnalysis {
  hotspots: Hotspot[];
  primaryHotspot: Hotspot;
  heatMap: HeatMap;
}

export interface Hotspot {
  id: string;
  location: string;
  type: HotspotType;
  frequency: number;
  duration: number;
  intensity: number;
}

export enum HotspotType {
  CPU = 'CPU',
  MEMORY = 'MEMORY',
  LLM = 'LLM',
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH'
}

export interface HeatMap {
  data: HeatMapData[];
  min: number;
  max: number;
  buckets: number;
}

export interface HeatMapData {
  x: string;
  y: string;
  value: number;
}

export interface CriticalPathAnalysis {
  path: CriticalPathNode[];
  totalDuration: number;
  bottlenecks: Bottleneck[];
  parallelism: ParallelismAnalysis;
}

export interface CriticalPathNode {
  id: string;
  instruction: string;
  duration: number;
  slack: number;
  parallelizable: boolean;
}

export interface ParallelismAnalysis {
  theoreticalMax: number;
  actual: number;
  efficiency: number;
  opportunities: ParallelismOpportunity[];
}

export interface ParallelismOpportunity {
  nodes: string[];
  potentialSpeedup: number;
  implementation: ImplementationComplexity;
}

export enum ImplementationComplexity {
  TRIVIAL = 'TRIVIAL',
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  DIFFICULT = 'DIFFICULT',
  VERY_DIFFICULT = 'VERY_DIFFICULT'
}

export interface ScalingAnalysis {
  scalability: Scalability;
  limits: ScalingLimit[];
  recommendations: ScalingRecommendation[];
}

export interface Scalability {
  type: ScalabilityType;
  efficiency: ScalingEfficiency;
  bottlenecks: ScalingBottleneck[];
}

export enum ScalabilityType {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
  HYBRID = 'HYBRID'
}

export interface ScalingEfficiency {
  linear: number;
  actual: number;
  efficiency: number;
}

export interface ScalingBottleneck {
  resource: string;
  impact: number;
}

export interface ScalingLimit {
  resource: string;
  current: number;
  limit: number;
  headroom: number;
}

export interface ScalingRecommendation {
  type: string;
  description: string;
  priority: RecommendationPriority;
}

export interface CostAnalysis {
  totalCost: number;
  breakdown: CostBreakdown;
  byInstruction: Map<string, Cost>;
  optimization: CostOptimization;
}

export interface CostBreakdown {
  compute: number;
  llm: number;
  storage: number;
  network: number;
  memory: number;
}

export interface Cost {
  direct: number;
  indirect: number;
  total: number;
}

export interface CostOptimization {
  opportunities: CostOptimizationOpportunity[];
  potentialSavings: number;
  priority: OptimizationPriority[];
}

export interface CostOptimizationOpportunity {
  id: string;
  description: string;
  potentialSavings: number;
}

export interface OptimizationPriority {
  type: string;
  priority: RecommendationPriority;
}

export enum ReportFormat {
  HTML = 'HTML',
  PDF = 'PDF',
  JSON = 'JSON',
  CSV = 'CSV'
}

export enum ExportFormat {
  JSON = 'JSON',
  CSV = 'CSV',
  PARQUET = 'PARQUET'
}

export interface ProfileReport {
  sessionId: string;
  format: ReportFormat;
  data: unknown;
  generatedAt: number;
}

export interface ExportResult {
  format: ExportFormat;
  data: Buffer;
  size: number;
}

export interface ComparisonResult {
  sessions: SessionComparison[];
  differences: ComparisonDifference[];
  summary: ComparisonSummary;
}

export interface SessionComparison {
  sessionId: string;
  metrics: ProfileMetrics;
}

export interface ComparisonDifference {
  metric: string;
  baseline: number;
  comparison: number;
  difference: number;
  percentage: number;
}

export interface ComparisonSummary {
  totalSessions: number;
  significantDifferences: number;
  trends: string[];
}

export interface TrendAnalysis {
  metric: string;
  trend: TrendDirection;
  rate: number;
  confidence: number;
  predictions: TrendPrediction[];
}

export interface TrendPrediction {
  timestamp: number;
  predictedValue: number;
  confidence: number;
}

// ============================================================================
// CVM-012: Package Format Types
// ============================================================================

export interface CognitivePackage {
  header: PackageHeader;
  manifest: PackageManifest;
  bytecode: BytecodeContainer;
  signature?: PackageSignature;
  resources: Resource[];
  metadata?: PackageMetadata;
  security: SecurityInfo;
  data: Buffer;
}

export interface PackageHeader {
  magic: number;
  version: number;
  headerSize: number;
  manifestOffset: number;
  manifestSize: number;
  bytecodeOffset: number;
  bytecodeSize: number;
  metadataOffset: number;
  metadataSize: number;
  resourcesOffset: number;
  resourcesSize: number;
  signatureOffset: number;
  signatureSize: number;
  checksum: number;
  flags: number;
  reserved: number[];
}

export interface PackageManifest {
  package: PackageInfo;
  version: VersionInfo;
  dependencies: Dependency[];
  capabilities: Capability[];
  requirements: Requirement[];
  security: SecurityInfo;
  metadata: PackageMetadata;
}

export interface PackageInfo {
  id: string;
  name: string;
  description: string;
  author: string;
  license: string;
  homepage: string;
  repository: string;
}

export interface VersionInfo {
  version: string;
  build: string;
  compatibility: string;
  bytecodeVersion: string;
}

export interface Dependency {
  id: string;
  version: string;
  type: DependencyType;
  required: boolean;
  checksum: string;
}

export enum DependencyType {
  RUNTIME = 'RUNTIME',
  DEVELOPMENT = 'DEVELOPMENT',
// Canonical Reference: COS-OBJ-006 (blueprint.runtime.capability)
// Owner: COS Team
  TEST = 'TEST',
  OPTIONAL = 'OPTIONAL'
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  version: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
  constraints: Constraint[];
}

export interface Requirement {
  type: RequirementType;
  value: string;
  minimum?: string;
  maximum?: string;
}

export enum RequirementType {
  CVM_VERSION = 'CVM_VERSION',
  MEMORY = 'MEMORY',
  CPU = 'CPU',
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  GPU = 'GPU'
}

export interface SecurityInfo {
  signature?: SignatureInfo;
  encryption?: EncryptionInfo;
  integrity?: IntegrityInfo;
  accessControl?: AccessControlInfo;
}

export interface SignatureInfo {
  algorithm: string;
  publicKey: string;
  signature: string;
  timestamp: number;
}

export interface EncryptionInfo {
  algorithm: string;
  keyId: string;
  iv: string;
}

export interface IntegrityInfo {
  algorithm: string;
  checksum: string;
  salt: string;
}

export interface AccessControlInfo {
  acl: ACL[];
  owner: string;
  group: string;
}

export interface ACL {
  principal: string;
  permissions: string[];
}

export interface PackageMetadata {
  created: number;
  modified: number;
  size: number;
  tags: string[];
  categories: string[];
}

export interface PackageSignature {
  algorithm: SignatureAlgorithm;
  publicKey: string;
  signature: string;
  timestamp: number;
  certificate?: string;
  chain?: string[];
}

export enum SignatureAlgorithm {
  RSA_SHA256 = 'RSA_SHA256',
  RSA_SHA512 = 'RSA_SHA512',
  ECDSA_SHA256 = 'ECDSA_SHA256',
  ECDSA_SHA512 = 'ECDSA_SHA512',
  ED25519 = 'ED25519'
}

export interface Resource {
  id: string;
  type: ResourceType;
  path: string;
  size: number;
  checksum: string;
  compression: string;
  metadata: ResourceMetadata;
}

export enum ResourceType {
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH',
  MODEL = 'MODEL',
  PROMPT = 'PROMPT',
  CONFIG = 'CONFIG',
  ASSET = 'ASSET',
  DATA = 'DATA'
}

export interface ResourceMetadata {
  mimeType: string;
  encoding: string;
  language?: string;
  version?: string;
  tags: string[];
}

export interface ResourceBundle {
  resources: Resource[];
  index: ResourceIndex;
  compression: CompressionInfo;
}

export interface ResourceIndex {
  entries: ResourceIndexEntry[];
}

export interface ResourceIndexEntry {
  resourceId: string;
  offset: number;
  size: number;
  compressed: boolean;
}

export interface CompressionInfo {
  algorithm: string;
  level: number;
}

export interface EncryptedPackage {
  encrypted: Buffer;
  algorithm: EncryptionAlgorithm;
  keyId: string;
  iv: string;
}

export enum EncryptionAlgorithm {
  AES_256_GCM = 'AES_256_GCM',
  AES_256_CBC = 'AES_256_CBC',
  CHACHA20_POLY1305 = 'CHACHA20_POLY1305'
}

export enum HashAlgorithm {
  SHA256 = 'SHA256',
  SHA384 = 'SHA384',
  SHA512 = 'SHA512',
  SHA3_256 = 'SHA3_256',
  SHA3_512 = 'SHA3_512'
}

// ============================================================================
// CVM-013: Loader Types
// ============================================================================

export interface PackageLoader {
  config: LoaderConfig;
  parser: PackageParser;
  dependencyResolver: DependencyResolver;
  resourceLoader: ResourceLoader;
  initializationEngine: InitializationEngine;
  securityManager: SecurityManager;
  loadPackage(source: PackageSource): Promise<LoadResult>;
  loadPackageFromFile(filePath: string): Promise<LoadResult>;
  loadPackageFromBuffer(buffer: Buffer): Promise<LoadResult>;
  loadPackageFromURL(url: string): Promise<LoadResult>;
  unloadPackage(packageId: string): Promise<void>;
  reloadPackage(packageId: string): Promise<LoadResult>;
  getLoadedPackages(): LoadedPackage[];
  getPackage(packageId: string): LoadedPackage | undefined;
  resolveDependencies(packageId: string): Promise<DependencyResolutionResult>;
  loadResources(packageId: string): Promise<ResourceLoadResult>;
  initializePackage(packageId: string): Promise<InitializationResult>;
}

export interface LoaderConfig {
  cacheEnabled: boolean;
  cachePath: string;
  verifySignature: boolean;
  verifyChecksum: boolean;
  resolveDependencies: boolean;
  autoInitialize: boolean;
  sandboxEnabled: boolean;
  maxPackageSize: number;
  timeout: number;
}

export interface PackageSource {
  type: SourceType;
  path?: string;
  buffer?: Buffer;
  url?: string;
}

export enum SourceType {
  FILE = 'FILE',
  BUFFER = 'BUFFER',
  URL = 'URL'
}

export interface LoadResult {
  success: boolean;
  packageId: string;
  package: CognitivePackage;
  errors: LoadError[];
  warnings: LoadWarning[];
  metrics: LoadMetrics;
}

export interface LoadError {
  type: LoadErrorType;
  message: string;
  error?: Error;
  details?: unknown;
}

export enum LoadErrorType {
  PARSE_FAILED = 'PARSE_FAILED',
  SIGNATURE_VERIFICATION_FAILED = 'SIGNATURE_VERIFICATION_FAILED',
  CHECKSUM_VERIFICATION_FAILED = 'CHECKSUM_VERIFICATION_FAILED',
  DEPENDENCY_RESOLUTION_FAILED = 'DEPENDENCY_RESOLUTION_FAILED',
  RESOURCE_LOAD_FAILED = 'RESOURCE_LOAD_FAILED',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  SANDBOX_SETUP_FAILED = 'SANDBOX_SETUP_FAILED'
}

export interface LoadWarning {
  type: LoadWarningType;
  message: string;
}

export enum LoadWarningType {
  DEPENDENCY_WARNING = 'DEPENDENCY_WARNING',
  VERSION_WARNING = 'VERSION_WARNING',
  COMPATIBILITY_WARNING = 'COMPATIBILITY_WARNING'
}

export interface LoadMetrics {
  loadTime: number;
  parseTime: number;
  dependencyResolutionTime: number;
  resourceLoadTime: number;
  initializationTime: number;
  totalTime: number;
  memoryUsed: number;
}

export interface LoadedPackage {
  packageId: string;
  package: CognitivePackage;
  state: PackageState;
  dependencies: LoadedPackage[];
  resources: Map<string, unknown>;
  executionGraph: ExecutionGraph;
  loadedAt: number;
}

export enum PackageState {
  LOADED = 'LOADED',
  DEPENDENCIES_RESOLVED = 'DEPENDENCIES_RESOLVED',
  RESOURCES_LOADED = 'RESOURCES_LOADED',
  INITIALIZED = 'INITIALIZED',
  ERROR = 'ERROR'
}

export interface PackageParser {
  parseHeader(buffer: Buffer): PackageHeader;
  parseManifest(buffer: Buffer): PackageManifest;
  parseBytecode(buffer: Buffer): BytecodeContainer;
  parseResources(buffer: Buffer): ResourceBundle;
  parseSignature(buffer: Buffer): PackageSignature;
  parsePackage(buffer: Buffer): CognitivePackage;
  validateHeader(header: PackageHeader): ValidationResult;
  validateManifest(manifest: PackageManifest): ValidationResult;
  validateBytecode(bytecode: BytecodeContainer): ValidationResult;
}

export interface DependencyResolver {
  config: DependencyResolverConfig;
  cache: DependencyCache;
  registry: PackageRegistry;
  resolve(package: CognitivePackage): Promise<DependencyResolutionResult>;
  resolveVersion(dependency: Dependency): Promise<ResolvedDependency>;
  checkConflicts(dependencies: Dependency[]): ConflictDetectionResult;
  detectCircularDependencies(package: CognitivePackage): CircularDependencyResult;
  resolveTransitiveDependencies(package: CognitivePackage): Promise<TransitiveResolutionResult>;
}

export interface DependencyResolverConfig {
  registryURL: string;
  cacheEnabled: boolean;
  cachePath: string;
  timeout: number;
  maxRetries: number;
}

export interface DependencyResolutionResult {
  resolved: Map<string, ResolvedDependency>;
  conflicts: DependencyConflict[];
  circularDependencies: CircularDependency[];
  transitiveDependencies: Map<string, ResolvedDependency[]>;
  errors: DependencyError[];
}

export interface ResolvedDependency {
  dependency: Dependency;
  package: CognitivePackage;
  version: string;
  location: string;
}

export interface DependencyConflict {
  dependency: string;
  versions: string[];
  resolution: ConflictResolution;
}

export interface ConflictResolution {
  strategy: ConflictResolutionStrategy;
  selectedVersion: string;
  reason: string;
}

export enum ConflictResolutionStrategy {
  HIGHEST_VERSION = 'HIGHEST_VERSION',
  LOWEST_VERSION = 'LOWEST_VERSION',
  FIRST_DECLARED = 'FIRST_DECLARED',
  MANUAL = 'MANUAL'
}

export interface CircularDependency {
  cycle: string[];
  severity: CircularDependencySeverity;
}

export enum CircularDependencySeverity {
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

export interface DependencyError {
  type: DependencyErrorType;
  message: string;
  dependency?: string;
  error?: Error;
  details?: unknown;
}

export enum DependencyErrorType {
  RESOLUTION_FAILED = 'RESOLUTION_FAILED',
  CIRCULAR_DEPENDENCY = 'CIRCULAR_DEPENDENCY',
  VERSION_CONFLICT = 'VERSION_CONFLICT'
}

export interface DependencyCache {
  get(dependencyId: string, version: string): Promise<ResolvedDependency | null>;
  set(dependencyId: string, version: string, dependency: ResolvedDependency): Promise<void>;
  clear(): Promise<void>;
}

export interface PackageRegistry {
  findPackage(id: string, version: string): Promise<PackageInfo>;
  downloadPackage(location: string): Promise<Buffer>;
}

export interface ResourceLoader {
  loadResources(package: CognitivePackage): Promise<ResourceLoadResult>;
  loadResource(resource: Resource): Promise<LoadedResource>;
  loadKnowledgeGraph(resource: Resource): Promise<KnowledgeGraph>;
  loadModel(resource: Resource): Promise<Model>;
  loadPrompt(resource: Resource): Promise<Prompt>;
  loadConfig(resource: Resource): Promise<Config>;
  loadAsset(resource: Resource): Promise<Asset>;
}

export interface ResourceLoadResult {
  loaded: Map<string, LoadedResource>;
  failed: Map<string, ResourceLoadError>;
  metrics: ResourceLoadMetrics;
}

export interface LoadedResource {
  resource: Resource;
  data: unknown;
  loadedAt: number;
}

export interface ResourceLoadError {
  resourceId: string;
  error: Error;
  timestamp: number;
}

export interface ResourceLoadMetrics {
  loadTime: number;
  resourceCount: number;
  totalSize: number;
  memoryUsed: number;
}

export interface InitializationEngine {
  initialize(package: CognitivePackage, resources: Map<string, LoadedResource>): Promise<InitializationResult>;
  initializeMemory(package: CognitivePackage): Promise<MemoryState>;
  initializeRegisters(package: CognitivePackage): Promise<RegisterFile>;
  initializeStack(package: CognitivePackage): Promise<StackState>;
  buildExecutionGraph(package: CognitivePackage): Promise<ExecutionGraph>;
  initializeKnowledgeGraph(resources: Map<string, LoadedResource>): Promise<KnowledgeGraph>;
  initializeLLMClient(package: CognitivePackage): Promise<LLMClient>;
}

export interface InitializationResult {
  success: boolean;
  memoryState: MemoryState;
  registerFile: RegisterFile;
  stackState: StackState;
  executionGraph: ExecutionGraph;
  knowledgeGraph: KnowledgeGraph;
  llmClient: LLMClient;
  errors: InitializationError[];
  metrics: InitializationMetrics;
}

export interface InitializationError {
  type: InitializationErrorType;
  message: string;
  component: string;
}

export enum InitializationErrorType {
  MEMORY_INIT_FAILED = 'MEMORY_INIT_FAILED',
  REGISTER_INIT_FAILED = 'REGISTER_INIT_FAILED',
  STACK_INIT_FAILED = 'STACK_INIT_FAILED',
  GRAPH_BUILD_FAILED = 'GRAPH_BUILD_FAILED',
  KG_INIT_FAILED = 'KG_INIT_FAILED',
  LLM_INIT_FAILED = 'LLM_INIT_FAILED'
}

export interface InitializationMetrics {
  memoryInitTime: number;
  registerInitTime: number;
  stackInitTime: number;
  graphBuildTime: number;
  kgInitTime: number;
  llmInitTime: number;
  totalTime: number;
}

export interface LLMClient {
  config: LLMConfig;
  call(prompt: string, options?: LLMMOptions): Promise<LLMResponse>;
  stream(prompt: string, options?: LLMMOptions): AsyncGenerator<LLMChunk>;
}

export interface LLMConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface LLMMOptions {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
}

export interface LLMResponse {
  text: string;
  tokens: number;
  model: string;
  finishReason: string;
}

export interface LLMChunk {
  text: string;
  done: boolean;
}

// ============================================================================
// CVM-014: Validator Types
// ============================================================================

export interface CognitiveValidator {
  config: ValidatorConfig;
  structuralValidator: StructuralValidator;
  semanticValidator: SemanticValidator;
  securityValidator: SecurityValidator;
  runtimeValidator: RuntimeValidator;
  compatibilityValidator: CompatibilityValidator;
  validatePackage(package: CognitivePackage): Promise<ValidationResult>;
  validateBytecode(bytecode: BytecodeContainer): Promise<ValidationResult>;
  validateExecutionGraph(graph: ExecutionGraph): Promise<ValidationResult>;
  validateInstruction(instruction: Instruction): Promise<ValidationResult>;
  validateManifest(manifest: PackageManifest): Promise<ValidationResult>;
  validateResources(resources: Resource[]): Promise<ValidationResult>;
  setValidationLevel(level: ValidationLevel): void;
  addCustomRule(rule: ValidationRule): void;
  removeCustomRule(ruleId: string): void;
  getValidationReport(): ValidationReport;
}

export interface ValidatorConfig {
  level: ValidationLevel;
  strictMode: boolean;
  enableSignatureVerification: boolean;
  enableIntegrityCheck: boolean;
  enableAccessControlCheck: boolean;
  enableRuntimeValidation: boolean;
  timeout: number;
  maxErrors: number;
}

export enum ValidationLevel {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  STRICT = 'STRICT',
  PARANOID = 'PARANOID'
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  info: ValidationInfo[];
  metrics: ValidationMetrics;
}

export interface ValidationError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  message: string;
  location: ValidationLocation;
  suggestion?: string;
}

export interface ValidationWarning {
  id: string;
  type: WarningType;
  message: string;
  location: ValidationLocation;
}

export interface ValidationInfo {
  id: string;
  type: InfoType;
  message: string;
  location: ValidationLocation;
}

export interface ValidationLocation {
  file?: string;
  line?: number;
  column?: number;
  instruction?: string;
  component?: string;
}

export enum WarningType {
  DEPRECATED = 'DEPRECATED',
  PERFORMANCE = 'PERFORMANCE',
  SECURITY = 'SECURITY',
  BEST_PRACTICE = 'BEST_PRACTICE'
}

export enum InfoType {
  METADATA = 'METADATA',
  STATISTICS = 'STATISTICS',
  RECOMMENDATION = 'RECOMMENDATION'
}

export interface ValidationMetrics {
  validationTime: number;
  checksPerformed: number;
  checksPassed: number;
  checksFailed: number;
  checksSkipped: number;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: ErrorSeverity;
  enabled: boolean;
  validate: (target: unknown) => Promise<ValidationResult>;
}

export interface ValidationReport {
  timestamp: number;
  results: PackageValidationResult[];
  summary: ValidationSummary;
}

export interface PackageValidationResult {
  packageId: string;
  timestamp: number;
  valid: boolean;
  errors: number;
  warnings: number;
  info: number;
}

export interface ValidationSummary {
  totalValidations: number;
  passed: number;
  failed: number;
  warnings: number;
// Canonical Reference: BCM-GRAPH-005 (blueprint.graph.knowledge)
// Owner: Chief Cognitive Architect
}

// ============================================================================
// Knowledge Graph Types
// ============================================================================

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export interface GraphNode {
  id: string;
  type: NodeType;
  properties: Map<string, unknown>;
  embeddings?: number[];
}

export enum NodeType {
  ENTITY = 'ENTITY',
  CONCEPT = 'CONCEPT',
  RELATION = 'RELATION',
  ATTRIBUTE = 'ATTRIBUTE',
  EVENT = 'EVENT'
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  properties: Map<string, unknown>;
  weight?: number;
}

export interface GraphMetadata {
  version: string;
  createdAt: number;
  updatedAt: number;
  nodeCount: number;
  edgeCount: number;
}

// ============================================================================
// Common Utility Types
// ============================================================================

export type UUID = string;

export function generateUUID(): UUID {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface ExecutionState {
  status: ExecutionStatus;
  timestamp: number;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  parameters: ModelParameters;
}

export enum ModelType {
  LANGUAGE = 'LANGUAGE',
  EMBEDDING = 'EMBEDDING',
  VISION = 'VISION',
  RAG = 'RAG'
}

export interface ModelParameters {
  parameterCount: number;
  architecture: string;
  framework: string;
}

export interface Prompt {
  id: string;
  template: string;
  variables: PromptVariable[];
  metadata: PromptMetadata;
}

export interface PromptVariable {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
}

export interface PromptMetadata {
  version: string;
  description: string;
  tags: string[];
}

export interface Config {
  id: string;
  type: ConfigType;
  data: unknown;
  schema?: unknown;
}

export enum ConfigType {
  JSON = 'JSON',
  YAML = 'YAML',
  TOML = 'TOML',
  XML = 'XML'
}

export interface Asset {
  id: string;
  type: AssetType;
  data: Buffer;
  metadata: AssetMetadata;
}

export enum AssetType {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  BINARY = 'BINARY'
}

export interface AssetMetadata {
  mimeType: string;
  size: number;
  hash: string;
}

// ============================================================================
// Export all types
// ============================================================================

export default {
  // Core types
  CVMInstance,
  CVMConfig,
  CVMState,
  ExecutionGraph,
  ResourceBudgets,
  ExecutionMetrics,
  
  // Bytecode types
  BytecodeContainer,
  BytecodeHeader,
  ConstantPool,
  InstructionStream,
  DebugInfo,
  
  // Instruction types
  Instruction,
  InstructionDefinition,
  InstructionFamily,
  
  // Optimizer types
  CognitiveOptimizer,
  OptimizationPass,
  OptimizationResult,
  
  // Executor types
  RuntimeExecutor,
  InstructionHandler,
  ResourceManager,
  ErrorManager,
  
  // Trace types
  TraceEngine,
  TraceEvent,
  TraceQuery,
  TraceResult,
  
  // Debugger types
  CognitiveDebugger,
  DecisionExplanation,
  ReasoningChain,
  
  // Profiler types
  CognitiveProfiler,
  MetricSample,
  ProfileMetrics,
  PerformanceAnalysis,
  
  // Package types
  CognitivePackage,
  PackageHeader,
  PackageManifest,
  Resource,
  
  // Loader types
  PackageLoader,
  LoadResult,
  LoadedPackage,
  
  // Validator types
  CognitiveValidator,
  ValidationResult,
  ValidationRule,
  
  // Utility types
  generateUUID,
};
