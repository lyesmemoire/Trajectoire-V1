/**
 * Prometheus Metrics Service
 * Comprehensive metrics collection for latency, errors, CPU, RAM, Graph, Matching, Search, Copilot, Redis, Prisma
 */

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  register,
  Registry,
  Counter,
  Histogram,
  Gauge,
  Summary,
} from 'prom-client';

@Injectable()
export class PrometheusMetricsService implements OnModuleDestroy {
  private readonly registry: Registry;

  // Latency Metrics
  private httpLatency: Histogram<string>;
  private graphLatency: Histogram<string>;
  private matchingLatency: Histogram<string>;
  private searchLatency: Histogram<string>;
  private copilotLatency: Histogram<string>;
  private redisLatency: Histogram<string>;
  private prismaLatency: Histogram<string>;

  // Error Metrics
  private httpErrors: Counter<string>;
  private graphErrors: Counter<string>;
  private matchingErrors: Counter<string>;
  private searchErrors: Counter<string>;
  private copilotErrors: Counter<string>;
  private redisErrors: Counter<string>;
  private prismaErrors: Counter<string>;

  // CPU Metrics
  private cpuUsage: Gauge<string>;
  private cpuUsageUser: Gauge<string>;
  private cpuUsageSystem: Gauge<string>;

  // RAM Metrics
  private ramUsage: Gauge<string>;
  private ramUsageTotal: Gauge<string>;
  private ramUsageFree: Gauge<string>;
  private ramUsageCached: Gauge<string>;

  // Graph Metrics
  private graphOperationsTotal: Counter<string>;
  private graphOperationsActive: Gauge<string>;
  private graphNodesTotal: Gauge<string>;
  private graphEdgesTotal: Gauge<string>;
  private graphCacheHits: Counter<string>;
  private graphCacheMisses: Counter<string>;

  // Matching Metrics
  private matchingOperationsTotal: Counter<string>;
  private matchingOperationsActive: Gauge<string>;
  private matchingScore: Summary<string>;
  private matchingCandidatesProcessed: Counter<string>;
  private matchingJobsProcessed: Counter<string>;

  // Search Metrics
  private searchOperationsTotal: Counter<string>;
  private searchOperationsActive: Gauge<string>;
  private searchResultsCount: Summary<string>;
  private searchQueryComplexity: Histogram<string>;

  // Copilot Metrics
  private copilotOperationsTotal: Counter<string>;
  private copilotOperationsActive: Gauge<string>;
  private copilotTokensInput: Counter<string>;
  private copilotTokensOutput: Counter<string>;
  private copilotCost: Counter<string>;

  // Redis Metrics
  private redisConnections: Gauge<string>;
  private redisCommandsTotal: Counter<string>;
  private redisCacheHits: Counter<string>;
  private redisCacheMisses: Counter<string>;
  private redisMemoryUsed: Gauge<string>;
  private redisMemoryPeak: Gauge<string>;

  // Prisma Metrics
  private prismaQueriesTotal: Counter<string>;
  private prismaQueriesActive: Gauge<string>;
  private prismaConnections: Gauge<string>;
  private prismaTransactionsTotal: Counter<string>;
  private prismaTransactionsActive: Gauge<string>;

  constructor() {
    this.registry = new Registry();

    // Initialize Latency Metrics
    this.httpLatency = new Histogram({
      name: 'http_latency_seconds',
      help: 'HTTP request latency in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.graphLatency = new Histogram({
      name: 'graph_latency_seconds',
      help: 'Graph operation latency in seconds',
      labelNames: ['operation', 'graph_id'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.matchingLatency = new Histogram({
      name: 'matching_latency_seconds',
      help: 'Matching operation latency in seconds',
      labelNames: ['operation', 'candidate_id', 'job_id'],
      buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.searchLatency = new Histogram({
      name: 'search_latency_seconds',
      help: 'Search operation latency in seconds',
      labelNames: ['operation', 'query_type'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [this.registry],
    });

    this.copilotLatency = new Histogram({
      name: 'copilot_latency_seconds',
      help: 'Copilot operation latency in seconds',
      labelNames: ['operation', 'session_id'],
      buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10, 20],
      registers: [this.registry],
    });

    this.redisLatency = new Histogram({
      name: 'redis_latency_seconds',
      help: 'Redis operation latency in seconds',
      labelNames: ['operation', 'key'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25],
      registers: [this.registry],
    });

    this.prismaLatency = new Histogram({
      name: 'prisma_latency_seconds',
      help: 'Prisma query latency in seconds',
      labelNames: ['operation', 'model'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5],
      registers: [this.registry],
    });

    // Initialize Error Metrics
    this.httpErrors = new Counter({
      name: 'http_errors_total',
      help: 'Total HTTP errors',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry],
    });

    this.graphErrors = new Counter({
      name: 'graph_errors_total',
      help: 'Total graph operation errors',
      labelNames: ['operation', 'error_type'],
      registers: [this.registry],
    });

    this.matchingErrors = new Counter({
      name: 'matching_errors_total',
      help: 'Total matching operation errors',
      labelNames: ['operation', 'error_type'],
      registers: [this.registry],
    });

    this.searchErrors = new Counter({
      name: 'search_errors_total',
      help: 'Total search operation errors',
      labelNames: ['operation', 'error_type'],
      registers: [this.registry],
    });

    this.copilotErrors = new Counter({
      name: 'copilot_errors_total',
      help: 'Total copilot operation errors',
      labelNames: ['operation', 'error_type'],
      registers: [this.registry],
    });

    this.redisErrors = new Counter({
      name: 'redis_errors_total',
      help: 'Total Redis operation errors',
      labelNames: ['operation', 'error_type'],
      registers: [this.registry],
    });

    this.prismaErrors = new Counter({
      name: 'prisma_errors_total',
      help: 'Total Prisma query errors',
      labelNames: ['operation', 'model', 'error_type'],
      registers: [this.registry],
    });

    // Initialize CPU Metrics
    this.cpuUsage = new Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage',
      labelNames: ['core'],
      registers: [this.registry],
    });

    this.cpuUsageUser = new Gauge({
      name: 'cpu_usage_user_percent',
      help: 'CPU user mode usage percentage',
      labelNames: ['core'],
      registers: [this.registry],
    });

    this.cpuUsageSystem = new Gauge({
      name: 'cpu_usage_system_percent',
      help: 'CPU system mode usage percentage',
      labelNames: ['core'],
      registers: [this.registry],
    });

    // Initialize RAM Metrics
    this.ramUsage = new Gauge({
      name: 'ram_usage_bytes',
      help: 'RAM usage in bytes',
      registers: [this.registry],
    });

    this.ramUsageTotal = new Gauge({
      name: 'ram_usage_total_bytes',
      help: 'Total RAM in bytes',
      registers: [this.registry],
    });

    this.ramUsageFree = new Gauge({
      name: 'ram_usage_free_bytes',
      help: 'Free RAM in bytes',
      registers: [this.registry],
    });

    this.ramUsageCached = new Gauge({
      name: 'ram_usage_cached_bytes',
      help: 'Cached RAM in bytes',
      registers: [this.registry],
    });

    // Initialize Graph Metrics
    this.graphOperationsTotal = new Counter({
      name: 'graph_operations_total',
      help: 'Total graph operations',
      labelNames: ['operation'],
      registers: [this.registry],
    });

    this.graphOperationsActive = new Gauge({
      name: 'graph_operations_active',
      help: 'Active graph operations',
      registers: [this.registry],
    });

    this.graphNodesTotal = new Gauge({
      name: 'graph_nodes_total',
      help: 'Total graph nodes',
      labelNames: ['graph_id'],
      registers: [this.registry],
    });

    this.graphEdgesTotal = new Gauge({
      name: 'graph_edges_total',
      help: 'Total graph edges',
      labelNames: ['graph_id'],
      registers: [this.registry],
    });

    this.graphCacheHits = new Counter({
      name: 'graph_cache_hits_total',
      help: 'Total graph cache hits',
      labelNames: ['cache_type'],
      registers: [this.registry],
    });

    this.graphCacheMisses = new Counter({
      name: 'graph_cache_misses_total',
      help: 'Total graph cache misses',
      labelNames: ['cache_type'],
      registers: [this.registry],
    });

    // Initialize Matching Metrics
    this.matchingOperationsTotal = new Counter({
      name: 'matching_operations_total',
      help: 'Total matching operations',
      labelNames: ['operation'],
      registers: [this.registry],
    });

    this.matchingOperationsActive = new Gauge({
      name: 'matching_operations_active',
      help: 'Active matching operations',
      registers: [this.registry],
    });

    this.matchingScore = new Summary({
      name: 'matching_score',
      help: 'Matching score distribution',
      labelNames: ['candidate_id', 'job_id'],
      percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
      registers: [this.registry],
    });

    this.matchingCandidatesProcessed = new Counter({
      name: 'matching_candidates_processed_total',
      help: 'Total candidates processed',
      registers: [this.registry],
    });

    this.matchingJobsProcessed = new Counter({
      name: 'matching_jobs_processed_total',
      help: 'Total jobs processed',
      registers: [this.registry],
    });

    // Initialize Search Metrics
    this.searchOperationsTotal = new Counter({
      name: 'search_operations_total',
      help: 'Total search operations',
      labelNames: ['operation'],
      registers: [this.registry],
    });

    this.searchOperationsActive = new Gauge({
      name: 'search_operations_active',
      help: 'Active search operations',
      registers: [this.registry],
    });

    this.searchResultsCount = new Summary({
      name: 'search_results_count',
      help: 'Search results count distribution',
      labelNames: ['query_type'],
      percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
      registers: [this.registry],
    });

    this.searchQueryComplexity = new Histogram({
      name: 'search_query_complexity',
      help: 'Search query complexity',
      labelNames: ['query_type'],
      buckets: [1, 2, 3, 4, 5, 10, 20, 50],
      registers: [this.registry],
    });

    // Initialize Copilot Metrics
    this.copilotOperationsTotal = new Counter({
      name: 'copilot_operations_total',
      help: 'Total copilot operations',
      labelNames: ['operation'],
      registers: [this.registry],
    });

    this.copilotOperationsActive = new Gauge({
      name: 'copilot_operations_active',
      help: 'Active copilot operations',
      registers: [this.registry],
    });

    this.copilotTokensInput = new Counter({
      name: 'copilot_tokens_input_total',
      help: 'Total input tokens',
      labelNames: ['model', 'operation'],
      registers: [this.registry],
    });

    this.copilotTokensOutput = new Counter({
      name: 'copilot_tokens_output_total',
      help: 'Total output tokens',
      labelNames: ['model', 'operation'],
      registers: [this.registry],
    });

    this.copilotCost = new Counter({
      name: 'copilot_cost_total',
      help: 'Total copilot cost in USD',
      labelNames: ['model', 'operation'],
      registers: [this.registry],
    });

    // Initialize Redis Metrics
    this.redisConnections = new Gauge({
      name: 'redis_connections',
      help: 'Number of Redis connections',
      registers: [this.registry],
    });

    this.redisCommandsTotal = new Counter({
      name: 'redis_commands_total',
      help: 'Total Redis commands',
      labelNames: ['command'],
      registers: [this.registry],
    });

    this.redisCacheHits = new Counter({
      name: 'redis_cache_hits_total',
      help: 'Total Redis cache hits',
      labelNames: ['cache_type'],
      registers: [this.registry],
    });

    this.redisCacheMisses = new Counter({
      name: 'redis_cache_misses_total',
      help: 'Total Redis cache misses',
      labelNames: ['cache_type'],
      registers: [this.registry],
    });

    this.redisMemoryUsed = new Gauge({
      name: 'redis_memory_used_bytes',
      help: 'Redis memory used in bytes',
      registers: [this.registry],
    });

    this.redisMemoryPeak = new Gauge({
      name: 'redis_memory_peak_bytes',
      help: 'Redis memory peak in bytes',
      registers: [this.registry],
    });

    // Initialize Prisma Metrics
    this.prismaQueriesTotal = new Counter({
      name: 'prisma_queries_total',
      help: 'Total Prisma queries',
      labelNames: ['operation', 'model'],
      registers: [this.registry],
    });

    this.prismaQueriesActive = new Gauge({
      name: 'prisma_queries_active',
      help: 'Active Prisma queries',
      registers: [this.registry],
    });

    this.prismaConnections = new Gauge({
      name: 'prisma_connections',
      help: 'Number of Prisma connections',
      labelNames: ['state'],
      registers: [this.registry],
    });

    this.prismaTransactionsTotal = new Counter({
      name: 'prisma_transactions_total',
      help: 'Total Prisma transactions',
      labelNames: ['status'],
      registers: [this.registry],
    });

    this.prismaTransactionsActive = new Gauge({
      name: 'prisma_transactions_active',
      help: 'Active Prisma transactions',
      registers: [this.registry],
    });

    // Start system metrics collection
    this.startSystemMetricsCollection();
  }

  // ============================================================================
  // LATENCY METRICS
  // ============================================================================

  recordHttpLatency(
    method: string,
    path: string,
    status: string,
    latency: number,
  ): void {
    this.httpLatency.observe({ method, path, status }, latency);
  }

  recordGraphLatency(
    operation: string,
    graphId: string,
    latency: number,
  ): void {
    this.graphLatency.observe({ operation, graph_id: graphId }, latency);
  }

  recordMatchingLatency(
    operation: string,
    candidateId: string,
    jobId: string,
    latency: number,
  ): void {
    this.matchingLatency.observe(
      { operation, candidate_id: candidateId, job_id: jobId },
      latency,
    );
  }

  recordSearchLatency(
    operation: string,
    queryType: string,
    latency: number,
  ): void {
    this.searchLatency.observe({ operation, query_type: queryType }, latency);
  }

  recordCopilotLatency(
    operation: string,
    sessionId: string,
    latency: number,
  ): void {
    this.copilotLatency.observe({ operation, session_id: sessionId }, latency);
  }

  recordRedisLatency(operation: string, key: string, latency: number): void {
    this.redisLatency.observe({ operation, key }, latency);
  }

  recordPrismaLatency(operation: string, model: string, latency: number): void {
    this.prismaLatency.observe({ operation, model }, latency);
  }

  // ============================================================================
  // ERROR METRICS
  // ============================================================================

  incrementHttpErrors(method: string, path: string, status: string): void {
    this.httpErrors.inc({ method, path, status });
  }

  incrementGraphErrors(operation: string, errorType: string): void {
    this.graphErrors.inc({ operation, error_type: errorType });
  }

  incrementMatchingErrors(operation: string, errorType: string): void {
    this.matchingErrors.inc({ operation, error_type: errorType });
  }

  incrementSearchErrors(operation: string, errorType: string): void {
    this.searchErrors.inc({ operation, error_type: errorType });
  }

  incrementCopilotErrors(operation: string, errorType: string): void {
    this.copilotErrors.inc({ operation, error_type: errorType });
  }

  incrementRedisErrors(operation: string, errorType: string): void {
    this.redisErrors.inc({ operation, error_type: errorType });
  }

  incrementPrismaErrors(
    operation: string,
    model: string,
    errorType: string,
  ): void {
    this.prismaErrors.inc({ operation, model, error_type: errorType });
  }

  // ============================================================================
  // CPU METRICS
  // ============================================================================

  setCpuUsage(core: string, usage: number): void {
    this.cpuUsage.set({ core }, usage);
  }

  setCpuUsageUser(core: string, usage: number): void {
    this.cpuUsageUser.set({ core }, usage);
  }

  setCpuUsageSystem(core: string, usage: number): void {
    this.cpuUsageSystem.set({ core }, usage);
  }

  // ============================================================================
  // RAM METRICS
  // ============================================================================

  setRamUsage(usage: number): void {
    this.ramUsage.set(usage);
  }

  setRamUsageTotal(total: number): void {
    this.ramUsageTotal.set(total);
  }

  setRamUsageFree(free: number): void {
    this.ramUsageFree.set(free);
  }

  setRamUsageCached(cached: number): void {
    this.ramUsageCached.set(cached);
  }

  // ============================================================================
  // GRAPH METRICS
  // ============================================================================

  incrementGraphOperations(operation: string): void {
    this.graphOperationsTotal.inc({ operation });
  }

  setGraphOperationsActive(count: number): void {
    this.graphOperationsActive.set(count);
  }

  setGraphNodesTotal(graphId: string, count: number): void {
    this.graphNodesTotal.set({ graph_id: graphId }, count);
  }

  setGraphEdgesTotal(graphId: string, count: number): void {
    this.graphEdgesTotal.set({ graph_id: graphId }, count);
  }

  incrementGraphCacheHits(cacheType: string): void {
    this.graphCacheHits.inc({ cache_type: cacheType });
  }

  incrementGraphCacheMisses(cacheType: string): void {
    this.graphCacheMisses.inc({ cache_type: cacheType });
  }

  // ============================================================================
  // MATCHING METRICS
  // ============================================================================

  incrementMatchingOperations(operation: string): void {
    this.matchingOperationsTotal.inc({ operation });
  }

  setMatchingOperationsActive(count: number): void {
    this.matchingOperationsActive.set(count);
  }

  observeMatchingScore(
    candidateId: string,
    jobId: string,
    score: number,
  ): void {
    this.matchingScore.observe(
      { candidate_id: candidateId, job_id: jobId },
      score,
    );
  }

  incrementMatchingCandidatesProcessed(): void {
    this.matchingCandidatesProcessed.inc();
  }

  incrementMatchingJobsProcessed(): void {
    this.matchingJobsProcessed.inc();
  }

  // ============================================================================
  // SEARCH METRICS
  // ============================================================================

  incrementSearchOperations(operation: string): void {
    this.searchOperationsTotal.inc({ operation });
  }

  setSearchOperationsActive(count: number): void {
    this.searchOperationsActive.set(count);
  }

  observeSearchResultsCount(queryType: string, count: number): void {
    this.searchResultsCount.observe({ query_type: queryType }, count);
  }

  observeSearchQueryComplexity(queryType: string, complexity: number): void {
    this.searchQueryComplexity.observe({ query_type: queryType }, complexity);
  }

  // ============================================================================
  // COPILOT METRICS
  // ============================================================================

  incrementCopilotOperations(operation: string): void {
    this.copilotOperationsTotal.inc({ operation });
  }

  setCopilotOperationsActive(count: number): void {
    this.copilotOperationsActive.set(count);
  }

  incrementCopilotTokensInput(
    model: string,
    operation: string,
    tokens: number,
  ): void {
    this.copilotTokensInput.inc({ model, operation }, tokens);
  }

  incrementCopilotTokensOutput(
    model: string,
    operation: string,
    tokens: number,
  ): void {
    this.copilotTokensOutput.inc({ model, operation }, tokens);
  }

  incrementCopilotCost(model: string, operation: string, cost: number): void {
    this.copilotCost.inc({ model, operation }, cost);
  }

  // ============================================================================
  // REDIS METRICS
  // ============================================================================

  setRedisConnections(count: number): void {
    this.redisConnections.set(count);
  }

  incrementRedisCommands(command: string): void {
    this.redisCommandsTotal.inc({ command });
  }

  incrementRedisCacheHits(cacheType: string): void {
    this.redisCacheHits.inc({ cache_type: cacheType });
  }

  incrementRedisCacheMisses(cacheType: string): void {
    this.redisCacheMisses.inc({ cache_type: cacheType });
  }

  setRedisMemoryUsed(bytes: number): void {
    this.redisMemoryUsed.set(bytes);
  }

  setRedisMemoryPeak(bytes: number): void {
    this.redisMemoryPeak.set(bytes);
  }

  // ============================================================================
  // PRISMA METRICS
  // ============================================================================

  incrementPrismaQueries(operation: string, model: string): void {
    this.prismaQueriesTotal.inc({ operation, model });
  }

  setPrismaQueriesActive(count: number): void {
    this.prismaQueriesActive.set(count);
  }

  setPrismaConnections(state: string, count: number): void {
    this.prismaConnections.set({ state }, count);
  }

  incrementPrismaTransactions(status: string): void {
    this.prismaTransactionsTotal.inc({ status });
  }

  setPrismaTransactionsActive(count: number): void {
    this.prismaTransactionsActive.set(count);
  }

  // ============================================================================
  // PROMETHEUS EXPORT
  // ============================================================================

  async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  // ============================================================================
  // SYSTEM METRICS COLLECTION
  // ============================================================================

  private startSystemMetricsCollection(): void {
    // Collect CPU and RAM metrics every 5 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 5000);
  }

  private collectSystemMetrics(): void {
    const os = require('os');
    const cpus = os.cpus();

    // CPU Metrics
    let totalUser = 0;
    let totalSystem = 0;
    let totalIdle = 0;

    cpus.forEach((cpu: any, index: number) => {
      totalUser += cpu.times.user;
      totalSystem += cpu.times.system;
      totalIdle += cpu.times.idle;

      const total = totalUser + totalSystem + totalIdle;
      const userPercent = (cpu.times.user / total) * 100;
      const systemPercent = (cpu.times.system / total) * 100;
      const totalPercent = ((cpu.times.user + cpu.times.system) / total) * 100;

      this.setCpuUsage(index.toString(), totalPercent);
      this.setCpuUsageUser(index.toString(), userPercent);
      this.setCpuUsageSystem(index.toString(), systemPercent);
    });

    // RAM Metrics
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    this.setRamUsageTotal(totalMem);
    this.setRamUsageFree(freeMem);
    this.setRamUsage(usedMem);
    this.setRamUsageCached(0); // Not available in Node.js directly
  }

  onModuleDestroy(): void {
    // Cleanup if needed
  }
}
