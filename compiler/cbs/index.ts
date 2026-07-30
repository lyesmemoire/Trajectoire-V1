/**
 * Blueprint DSL CBS (Cognitive Bytecode System)
 * 
 * Main entry point for all CBS components.
 */

// Opcode table
export * from './opcode-table';

// Instruction table
export * from './instruction-table';

// Register table
export * from './register-table';

// Instruction encoder
export * from './instruction-encoder';

// Instruction decoder
export * from './instruction-decoder';

// Binary serializer
export * from './binary-serializer';

// Package loader
export * from './package-loader';

// Package linker
export {
  PackageLinker,
  LinkResult,
  LinkSymbol,
  SymbolType as LinkSymbolType,
} from './package-linker';

// Bytecode validator
export * from './bytecode-validator';

// Bytecode optimizer
export * from './bytecode-optimizer';

// Binary versioning
export * from './binary-versioning';

// Debug symbols
export {
  DebugSymbols,
  DebugSymbol,
  SourceLocation,
  DebugLineInfo,
  DebugFunctionInfo,
  SymbolType as DebugSymbolType,
} from './debug-symbols';

// Exception table
export * from './exception-table';

// Memory addressing
export * from './memory-addressing';

// Call frames
export * from './call-frames';

// Stack
export * from './stack';

// Heap
export * from './heap';
