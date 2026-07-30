/**
 * Cognitive Scheduler Type Definitions
 * Production-ready types for the cognitive task scheduling system
 */

export enum TaskPriority {
  CRITICAL = 0,
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
  BACKGROUND = 4
}

export enum TaskStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  TIMEOUT = 'TIMEOUT'
}

export enum WorkerStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
  PREEMPTING = 'PREEMPTING',
  SHUTTING_DOWN = 'SHUTTING_DOWN'
}

export enum SchedulingAlgorithm {
  CFS = 'CFS',
  PRIORITY = 'PRIORITY',
  DEADLINE = 'DEADLINE',
  FAIR_SHARE = 'FAIR_SHARE',
  REALTIME = 'REALTIME'
}

export enum BackoffStrategy {
  FIXED = 'FIXED',
  LINEAR = 'LINEAR',
  EXPONENTIAL = 'EXPONENTIAL',
  EXPONENTIAL_WITH_JITTER = 'EXPONENTIAL_WITH_JITTER'
}

export interface CognitiveTask {
  id: string;
  sessionId: string;
  instruction: unknown;
  priority: TaskPriority;
  deadline?: number;
  latencyBudget: number;
  tokenBudget: number;
  dependencies: string[];
  affinity?: EngineAffinity;
  retryPolicy: RetryPolicy;
  createdAt: number;
  scheduledAt?: number;
  startedAt?: number;
  completedAt?: number;
  status: TaskStatus;
  metrics: TaskMetrics;
}

export interface EngineAffinity {
  engineId?: string;
  cpuAffinity?: number[];
  gpuAffinity?: number[];
  providerAffinity?: string[];
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: BackoffStrategy;
  initialDelay: number;
  maxDelay: number;
}

export interface TaskMetrics {
  queueTime: number;
  executionTime: number;
  waitTime: number;
  cpuTime: number;
  memoryUsed: number;
  tokensUsed: number;
  retries: number;
  preemptions: number;
}

export interface SchedulerConfig {
  maxWorkers: number;
  maxQueueSize: number;
  schedulingAlgorithm: SchedulingAlgorithm;
  timeSlice: number;
  enablePreemption: boolean;
  enableWorkStealing: boolean;
  enableDeadlineScheduling: boolean;
  fairnessWeight: number;
  starvationThreshold: number;
  distributedMode: boolean;
  clusterSize?: number;
}

export interface ScheduleResult {
  taskId: string;
  scheduled: boolean;
  queuePosition?: number;
  estimatedStartTime?: number;
  error?: string;
}

export interface CancelResult {
  taskId: string;
  cancelled: boolean;
  reason?: string;
}

export interface QueueMetrics {
  pendingTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageQueueTime: number;
  averageExecutionTime: number;
  throughput: number;
}

export interface WorkerMetrics {
  activeWorkers: number;
  idleWorkers: number;
  averageUtilization: number;
  stolenTasks: number;
  preemptions: number;
}

export interface SchedulerMetrics {
  totalTasksScheduled: number;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  totalTasksCancelled: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  fairnessIndex: number;
  starvationCount: number;
}

export interface TaskQueue {
  id: string;
  priority: TaskPriority;
  tasks: CognitiveTask[];
  maxSize: number;
  createdAt: number;
}

export interface PriorityQueue {
  priority: TaskPriority;
  tasks: unknown; // BinaryHeap<CognitiveTask> - using any to avoid circular dependency
  maxSize: number;
}

export interface PriorityMetrics {
  queueSizes: Map<TaskPriority, number>;
  averageWaitTimes: Map<TaskPriority, number>;
}

export interface DeadlineTask {
  task: CognitiveTask;
  deadline: number;
  slack: number;
}

export interface DeadlineMetrics {
  missedDeadlines: number;
  nearMisses: number;
  averageSlack: number;
}

export interface DeadlineViolation {
  taskId: string;
  deadline: number;
  actualCompletion: number;
  violationDuration: number;
}

export interface PreemptionResult {
  preempted: boolean;
  reason?: string;
}

export interface DependencyResolution {
  ready: boolean;
  blockedBy: string[];
  estimatedReadyTime: number;
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
  edges: Map<string, DependencyEdge>;
}

export interface DependencyNode {
  taskId: string;
  status: TaskStatus;
  dependencies: string[];
  dependents: string[];
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export interface AffinityMetrics {
  affinityHits: number;
  affinityMisses: number;
  loadBalance: number;
}

export interface DispatchResult {
  dispatched: boolean;
  workerId?: number;
  error?: string;
}

export interface Worker {
  id: number;
  status: WorkerStatus;
  currentTask?: CognitiveTask;
  queue: CognitiveTask[];
  cpuAffinity: number[];
  gpuAffinity: number[];
  providerAffinity: string[];
  metrics: WorkerMetrics;
}

export interface DispatchMetrics {
  totalDispatches: number;
  successfulDispatches: number;
  failedDispatches: number;
  averageDispatchTime: number;
}

export interface BudgetCheckResult {
  withinBudget: boolean;
  exceededBudgets: string[];
  remainingBudgets: Map<string, number>;
}

export interface BudgetMetrics {
  totalLatencyConsumed: number;
  totalTokensConsumed: number;
  totalCPUConsumed: number;
  totalMemoryConsumed: number;
  budgetViolations: number;
}

export interface RetryMetrics {
  totalRetries: number;
  successfulRetries: number;
  failedRetries: number;
  averageRetriesPerTask: number;
}

export interface WorkStealingMetrics {
  stolenTasks: number;
  stealAttempts: number;
  balanceOperations: number;
}
