/**
 * ContextBuilder
 *
 * Builds RuntimeContext from multiple sources.
 * Aggregates technical dependencies without business logic knowledge.
 */

import { RuntimeContext, RuntimeContextOptions } from "../domain/context/RuntimeContext";

export interface ContextSource {
  key: string;
  value: unknown;
}

export interface ContextBuilderOptions extends RuntimeContextOptions {
  sources?: ContextSource[];
}

export class ContextBuilder {
  private options: ContextBuilderOptions;

  constructor(options?: ContextBuilderOptions) {
    this.options = options ?? {};
  }

  /**
   * Build RuntimeContext from sources
   * @param sources - Context sources
   * @returns Built RuntimeContext
   */
  build(sources?: ContextSource[]): RuntimeContext {
    const context = new RuntimeContext(this.options);
    const allSources = [...(this.options.sources ?? []), ...(sources ?? [])];
    
    for (const source of allSources) {
      context.set(source.key, source.value);
    }

    return context;
  }

  /**
   * Build child context from parent
   * @param parent - Parent context
   * @param sources - Additional sources
   * @returns Child context
   */
  buildChild(parent: RuntimeContext, sources?: ContextSource[]): RuntimeContext {
    const child = parent.child();
    
    for (const source of sources ?? []) {
      child.set(source.key, source.value);
    }

    return child;
  }

  /**
   * Add default sources to builder
   * @param sources - Default sources
   * @returns Updated builder
   */
  withDefaults(sources: ContextSource[]): ContextBuilder {
    this.options.sources = [...(this.options.sources ?? []), ...sources];
    return this;
  }

  /**
   * Set immutable option
   * @param immutable - Immutable flag
   * @returns Updated builder
   */
  withImmutable(immutable: boolean): ContextBuilder {
    this.options.immutable = immutable;
    return this;
  }

  /**
   * Set parent context
   * @param parent - Parent context
   * @returns Updated builder
   */
  withParent(parent: RuntimeContext): ContextBuilder {
    this.options.parent = parent;
    return this;
  }
}
