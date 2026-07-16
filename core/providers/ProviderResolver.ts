/**
 * Provider Resolver
 *
 * Responsibilities:
 * - Resolve providers based on type and requirements
 * - NO business logic, NO reasoning, NO analysis
 * - ONLY provider resolution
 */

import {
  Provider,
  ProviderType,
  ProviderRequirements,
  ProviderResolver as IProviderResolver
} from "./ProviderAbstractionLayer";

// ============================================================================
// RESOLVER STATES
// ============================================================================

export type ResolverState =
  | "Idle"
  | "Resolving"
  | "Resolved"
  | "Error";

// ============================================================================
// RESOLVER EVENTS
// ============================================================================

export type ResolverEvent =
  | "ResolvingStarted"
  | "ResolvingCompleted"
  | "ProviderSelected"
  | "ResolutionFailed";

// ============================================================================
// PROVIDER RESOLVER IMPLEMENTATION
// ============================================================================

export class ProviderResolverImpl implements IProviderResolver {
  private state: ResolverState = "Idle";
  private providers: Map<string, Provider> = new Map();

  constructor(providers: Provider[] = []) {
    providers.forEach(p => this.providers.set(p.id, p));
  }

  resolve(type: ProviderType, _requirements: ProviderRequirements): Provider {
    this.state = "Resolving";
    
    const candidates = Array.from(this.providers.values());
    for (const provider of candidates) {
      if (provider.metadata.type === type && provider.metadata.enabled) {
        this.state = "Resolved";
        return provider;
      }
    }

    this.state = "Error";
    throw new Error(`No provider found for type: ${type}`);
  }

  resolveBest(type: ProviderType, _requirements: ProviderRequirements): Provider {
    this.state = "Resolving";
    
    const candidates = Array.from(this.providers.values())
      .filter(p => p.metadata.type === type && p.metadata.enabled)
      .sort((a, b) => b.metadata.priority - a.metadata.priority);

    if (candidates.length === 0) {
      this.state = "Error";
      throw new Error(`No provider found for type: ${type}`);
    }

    this.state = "Resolved";
    return candidates[0];
  }

  resolveAll(type: ProviderType, _requirements: ProviderRequirements): Provider[] {
    this.state = "Resolving";
    
    const candidates = Array.from(this.providers.values())
      .filter(p => p.metadata.type === type && p.metadata.enabled);

    this.state = "Resolved";
    return candidates;
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  getState(): ResolverState {
    return this.state;
  }

  addProvider(provider: Provider): void {
    this.providers.set(provider.id, provider);
  }

  removeProvider(providerId: string): void {
    this.providers.delete(providerId);
  }
}
