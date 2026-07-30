/**
 * Blueprint DSL Incremental Compiler
 * 
 * Compiles only the parts of the code that have changed.
 */

import { ASTNode, ModuleNode } from '../parser/parser';
import { BytecodeModule } from '../bytecode/bytecode-generator';

export interface FileHash {
  file: string;
  hash: string;
  lastModified: number;
}

export interface CompilationUnit {
  file: string;
  ast: ASTNode;
  bytecode: BytecodeModule;
  dependencies: string[];
  dependents: string[];
}

export interface IncrementalCompilationResult {
  compiledFiles: string[];
  skippedFiles: string[];
  totalTimeMs: number;
  success: boolean;
}

export class IncrementalCompiler {
  private fileHashes: Map<string, FileHash> = new Map();
  private compilationUnits: Map<string, CompilationUnit> = new Map();
  private dependencyGraph: Map<string, Set<string>> = new Map();

  /**
   * Compile incrementally
   */
  public compileIncremental(
    files: string[],
    compileFunction: (file: string) => { ast: ASTNode; bytecode: BytecodeModule }
  ): IncrementalCompilationResult {
    const startTime = performance.now();
    const compiledFiles: string[] = [];
    const skippedFiles: string[] = [];

    for (const file of files) {
      if (this.needsCompilation(file)) {
        // Compile the file
        const result = compileFunction(file);
        
        // Update compilation unit
        this.compilationUnits.set(file, {
          file,
          ast: result.ast,
          bytecode: result.bytecode,
          dependencies: this.extractDependencies(result.ast),
          dependents: [],
        });

        // Update file hash
        this.updateFileHash(file);

        // Update dependency graph
        this.updateDependencyGraph(file, this.compilationUnits.get(file)!.dependencies);

        compiledFiles.push(file);
      } else {
        skippedFiles.push(file);
      }
    }

    const endTime = performance.now();

    return {
      compiledFiles,
      skippedFiles,
      totalTimeMs: endTime - startTime,
      success: true,
    };
  }

  /**
   * Check if a file needs compilation
   */
  private needsCompilation(file: string): boolean {
    const fileHash = this.fileHashes.get(file);
    
    // If file has never been compiled, it needs compilation
    if (!fileHash) {
      return true;
    }

    // Check if file has been modified
    const currentHash = this.computeFileHash(file);
    if (currentHash !== fileHash.hash) {
      return true;
    }

    // Check if dependencies have been modified
    const dependencies = this.dependencyGraph.get(file);
    if (dependencies) {
      for (const dep of dependencies) {
        if (this.needsCompilation(dep)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Update file hash
   */
  private updateFileHash(file: string): void {
    const hash = this.computeFileHash(file);
    const lastModified = Date.now();

    this.fileHashes.set(file, {
      file,
      hash,
      lastModified,
    });
  }

  /**
   * Compute file hash
   */
  private computeFileHash(file: string): string {
    // Simplified implementation
    // In a real implementation, this would compute a cryptographic hash of the file content
    return `hash_${file}_${Date.now()}`;
  }

  /**
   * Extract dependencies from AST
   */
  private extractDependencies(ast: ASTNode): string[] {
    const dependencies: string[] = [];

    if (ast.type === 'MODULE') {
      const module = ast as ModuleNode;
      for (const importNode of module.imports) {
        dependencies.push(importNode.module);
      }
    }

    return dependencies;
  }

  /**
   * Update dependency graph
   */
  private updateDependencyGraph(file: string, dependencies: string[]): void {
    // Set dependencies for this file
    this.dependencyGraph.set(file, new Set(dependencies));

    // Update dependents for dependencies
    for (const dep of dependencies) {
      if (!this.dependencyGraph.has(dep)) {
        this.dependencyGraph.set(dep, new Set());
      }
      this.dependencyGraph.get(dep)!.add(file);
    }
  }

  /**
   * Invalidate a file and all its dependents
   */
  public invalidate(file: string): void {
    // Remove file hash to force recompilation
    this.fileHashes.delete(file);

    // Invalidate all dependents
    const dependents = this.getDependents(file);
    for (const dependent of dependents) {
      this.invalidate(dependent);
    }
  }

  /**
   * Get all dependents of a file
   */
  private getDependents(file: string): Set<string> {
    const dependents = new Set<string>();

    for (const [key, deps] of this.dependencyGraph) {
      if (deps.has(file)) {
        dependents.add(key);
      }
    }

    return dependents;
  }

  /**
   * Clear all compilation state
   */
  public clear(): void {
    this.fileHashes.clear();
    this.compilationUnits.clear();
    this.dependencyGraph.clear();
  }

  /**
   * Get compilation statistics
   */
  public getStatistics(): {
    totalFiles: number;
    compiledFiles: number;
    skippedFiles: number;
    dependencyCount: number;
  } {
    let dependencyCount = 0;
    for (const deps of this.dependencyGraph.values()) {
      dependencyCount += deps.size;
    }

    return {
      totalFiles: this.compilationUnits.size,
      compiledFiles: this.fileHashes.size,
      skippedFiles: this.compilationUnits.size - this.fileHashes.size,
      dependencyCount,
    };
  }
}
