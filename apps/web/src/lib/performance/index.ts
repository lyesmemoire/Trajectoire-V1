/**
 * Performance Optimization Layer - SPRINT-4.5
 * 
 * Export all performance monitoring and optimization modules
 */

export {
  PerformanceMonitor,
  performanceMonitor,
  measurePerformance,
  type PerformanceMetrics,
  type OperationMetrics,
} from './PerformanceMonitor';

export {
  OptimizedPrisma,
  optimizedPrisma,
} from './OptimizedPrisma';

export {
  OptimizedRedis,
  optimizedRedis as getOptimizedRedis,
} from './OptimizedRedis';

export {
  OptimizedOpenAI,
  optimizedOpenAI,
} from './OptimizedOpenAI';

export {
  OptimizedGraph,
  optimizedGraph,
  type GraphNode,
  type GraphEdge,
} from './OptimizedGraph';

export {
  OptimizedMatching,
  optimizedMatching,
  type MatchingInput,
  type MatchingResult,
} from './OptimizedMatching';

export {
  OptimizedSearch,
  optimizedSearch,
  type SearchQuery,
  type SearchResult,
} from './OptimizedSearch';

export {
  AutoOptimizer,
  autoOptimizer,
} from './AutoOptimizer';

export {
  withPerformanceTracking,
  measureMiddleware,
} from './PerformanceMiddleware';