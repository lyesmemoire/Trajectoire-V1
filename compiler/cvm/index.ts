/**
 * Blueprint DSL CVM (Cognitive Virtual Machine)
 * 
 * Main entry point for all CVM components.
 */

// Execution context
export * from './execution-context';

// Register file
export * from './register-file';

// Instruction fetch
export * from './instruction-fetch';

// Instruction decode
export * from './instruction-decode';

// Instruction execute
export * from './instruction-execute';

// Execution pipeline
export * from './execution-pipeline';

// Microcode engine
export * from './microcode-engine';

// Frame manager
export * from './frame-manager';

// Exception handler
export * from './exception-handler';

// Interrupt manager
export * from './interrupt-manager';

// Scheduler
export * from './scheduler';

// Branch predictor
export * from './branch-predictor';

// Instruction cache
export * from './instruction-cache';

// Rollback manager
export {
  RollbackManager,
  Snapshot as RollbackSnapshot,
  RollbackOptions,
} from './rollback-manager';

// Snapshot manager
export {
  SnapshotManager,
  Snapshot as ExecutionSnapshot,
  SnapshotOptions,
} from './snapshot-manager';

// Thread manager
export * from './thread-manager';

// Garbage collector
export * from './garbage-collector';

// Memory manager
export * from './memory-manager';

// Profiler hooks
export * from './profiler-hooks';

// Trace hooks
export * from './trace-hooks';

// Debugger hooks
export * from './debugger-hooks';
