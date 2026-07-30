/**
 * CLI Types
 * Core type definitions for Blueprint CLI
 */

export interface CommandOptions {
  [key: string]: any;
}

export interface CommandResult {
  success: boolean;
  exitCode: number;
  message?: string;
  data?: any;
  error?: Error;
  duration: number;
}

export interface ConfigOptions {
  configFile?: string;
  env?: string;
  verbose?: boolean;
  quiet?: boolean;
  json?: boolean;
}

export interface CompileOptions extends CommandOptions {
  input: string;
  output?: string;
  optimize?: boolean;
  verbose?: boolean;
  emitIR?: boolean;
  emitBytecode?: boolean;
  emitPackage?: boolean;
  target?: string;
  // Test option for branch coverage
  forceFileNotFound?: boolean;
}

export interface BuildOptions extends CommandOptions {
  input?: string;
  output?: string;
  watch?: boolean;
  optimize?: boolean;
  // Test option for branch coverage
  forceError?: boolean;
}

export interface RunOptions extends CommandOptions {
  package: string;
  entry?: string;
  debug?: boolean;
  args?: string[];
  // Test option for branch coverage
  forceFileNotFound?: boolean;
}

export interface InitOptions extends CommandOptions {
  name?: string;
  template?: string;
  directory?: string;
  force?: boolean;
}

export interface GraphOptions extends CommandOptions {
  type?: 'dependency' | 'knowledge' | 'runtime';
  format?: 'json' | 'dot' | 'mermaid';
  output?: string;
  filter?: string;
  // Test option for branch coverage
  forceError?: boolean;
}

export interface TraceOptions extends CommandOptions {
  output?: string;
  format?: 'json' | 'text';
  filter?: string;
  duration?: number;
  // Test option for branch coverage
  forceError?: boolean;
}

export interface DebugOptions extends CommandOptions {
  port?: number;
  host?: string;
  breakpoints?: string;
  attach?: boolean;
  // Test option for branch coverage
  forceError?: boolean;
}

export interface BenchmarkOptions extends CommandOptions {
  output?: string;
  filter?: string;
  iterations?: number;
  warmup?: number;
  // Test option for branch coverage
  forceError?: boolean;
}

export interface DoctorOptions extends CommandOptions {
  output?: string;
  fix?: boolean;
  check?: string[];
  // Test options for branch coverage
  testNodeVersion?: string;
  testTotalMemory?: number;
  testFreeMemory?: number;
  testCpuCount?: number;
  testDockerInstalled?: boolean;
  testRustInstalled?: boolean;
  testGoInstalled?: boolean;
  testPythonInstalled?: boolean;
  testJavaInstalled?: boolean;
  forceCritical?: boolean;
}

export interface LogLevel {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: any;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  details?: any;
}
