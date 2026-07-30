/**
 * Blueprint DSL CIR (Cognitive Intermediate Representation)
 * 
 * Main entry point for all CIR components.
 */

// Core IR types
export * from './ir-generator';

// SSA form
export * from './ssa-form';

// CFG builder
export * from './cfg-builder';

// Visitor pattern
export * from './ir-visitor';

// Serializer
export * from './ir-serializer';

// Pass manager
export * from './pass-manager';

// Graph builder
export * from './graph-builder';

// Optimizer
export {
  Optimizer,
  OptimizationLevel,
  OptimizationResult,
  OptimizationPipeline,
  OptimizationStage as OptimizerStage,
  PipelineResult as OptimizerPipelineResult,
} from './optimizer';

// Region
export * from './region';

// Pipeline
export {
  IRPipeline,
  PipelineStage,
  StageResult,
  PipelineResult,
  ValidationStage,
  SSAConversionStage,
  CFGConstructionStage,
  OptimizationStage as PipelineOptimizationStage,
  SerializationStage,
  PrintingStage,
  DefaultPipeline,
  FastPipeline,
  AggressivePipeline,
} from './pipeline';
