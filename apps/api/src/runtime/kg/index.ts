/**
 * Knowledge Graph RH Runtime v2
 * Main index file for Knowledge Graph services
 */

export { RuntimeGraphService } from './runtime-graph.service';
export type {
  RuntimeGraphOptions,
  PipelineResult,
} from './runtime-graph.service';
export { GraphRepository } from './graph-repository.service';
export { GraphQueryEngine } from './graph-query-engine.service';
export type {
  QueryOptions,
  PathResult,
  NeighborResult,
  ClusterResult,
  CommunityResult,
} from './graph-query-engine.service';
export { GraphAnalyticsService } from './graph-analytics.service';
export type {
  CoverageMetrics,
  DensityMetrics,
  DegreeMetrics,
  CentralityMetrics,
  ConnectedComponent,
  CommunityMetrics,
  DominantEntity,
  GraphStatistics,
} from './graph-analytics.service';
export { GraphMatchingService } from './graph-matching.service';
export type {
  MatchingScore,
  ScoreEvidence,
  DimensionScore,
  TransferableSkill,
  MatchingResult,
} from './graph-matching.service';
export { GraphSearchService } from './graph-search.service';
export type {
  SearchResult,
  NeighborhoodSearchResult,
  SimilaritySearchResult,
  CommunitySearchResult,
} from './graph-search.service';
export { GraphReasoningEngine } from './graph-reasoning-engine.service';
export type {
  ReasoningStep,
  ReasoningTrace,
  Explanation,
} from './graph-reasoning-engine.service';

// Re-export types
export type {
  Graph,
  Node,
  Edge,
  NodeType,
  EdgeType,
  NodeIndex,
  EdgeIndex,
  ValidationResult,
  CandidateGraphInput,
  JobGraphInput,
} from './graph-types';
