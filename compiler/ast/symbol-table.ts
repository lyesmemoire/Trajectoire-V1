/**
 * Blueprint DSL Symbol Table
 * 
 * Manages symbols (identifiers) and their scopes during compilation.
 */

import { TypeNode } from '../parser/parser';

export enum SymbolKind {
  VARIABLE = "VARIABLE",
  FUNCTION = "FUNCTION",
  PARAMETER = "PARAMETER",
  TYPE = "TYPE",
  MODULE = "MODULE",
  IMPORT = "IMPORT",
}

export interface Symbol {
  name: string;
  kind: SymbolKind;
  type?: TypeNode;
  value?: unknown;
  scope: string;
  line: number;
  column: number;
  isMutable: boolean;
  isExported: boolean;
}

export interface Scope {
  id: string;
  parentId?: string;
  symbols: Map<string, Symbol>;
  children: string[];
}

export class SymbolTable {
  private scopes: Map<string, Scope> = new Map();
  private currentScopeId: string = 'global';
  private scopeCounter: number = 0;

  constructor() {
    this.createScope('global');
  }

  /**
   * Create a new scope
   */
  public createScope(parentId?: string): string {
    const scopeId = `scope_${this.scopeCounter++}`;
    const scope: Scope = {
      id: scopeId,
      parentId,
      symbols: new Map(),
      children: [],
    };

    this.scopes.set(scopeId, scope);

    if (parentId) {
      const parentScope = this.scopes.get(parentId);
      if (parentScope) {
        parentScope.children.push(scopeId);
      }
    }

    return scopeId;
  }

  /**
   * Enter a scope
   */
  public enterScope(scopeId: string): void {
    this.currentScopeId = scopeId;
  }

  /**
   * Exit the current scope
   */
  public exitScope(): void {
    const currentScope = this.scopes.get(this.currentScopeId);
    if (currentScope && currentScope.parentId) {
      this.currentScopeId = currentScope.parentId;
    }
  }

  /**
   * Add a symbol to the current scope
   */
  public addSymbol(symbol: Symbol): void {
    const currentScope = this.scopes.get(this.currentScopeId);
    if (currentScope) {
      currentScope.symbols.set(symbol.name, symbol);
    }
  }

  /**
   * Get a symbol by name
   */
  public getSymbol(name: string): Symbol | null {
    let scopeId = this.currentScopeId;

    while (scopeId) {
      const scope = this.scopes.get(scopeId);
      if (scope && scope.symbols.has(name)) {
        return scope.symbols.get(name)!;
      }
      scopeId = scope?.parentId || '';
    }

    return null;
  }

  /**
   * Check if a symbol exists
   */
  public hasSymbol(name: string): boolean {
    return this.getSymbol(name) !== null;
  }

  /**
   * Get all symbols in the current scope
   */
  public getCurrentScopeSymbols(): Symbol[] {
    const currentScope = this.scopes.get(this.currentScopeId);
    if (currentScope) {
      return Array.from(currentScope.symbols.values());
    }
    return [];
  }

  /**
   * Get all symbols in all scopes
   */
  public getAllSymbols(): Symbol[] {
    const symbols: Symbol[] = [];

    for (const scope of this.scopes.values()) {
      symbols.push(...Array.from(scope.symbols.values()));
    }

    return symbols;
  }

  /**
   * Remove a symbol from the current scope
   */
  public removeSymbol(name: string): void {
    const currentScope = this.scopes.get(this.currentScopeId);
    if (currentScope) {
      currentScope.symbols.delete(name);
    }
  }

  /**
   * Clear all symbols in the current scope
   */
  public clearCurrentScope(): void {
    const currentScope = this.scopes.get(this.currentScopeId);
    if (currentScope) {
      currentScope.symbols.clear();
    }
  }

  /**
   * Get the current scope ID
   */
  public getCurrentScopeId(): string {
    return this.currentScopeId;
  }

  /**
   * Get a scope by ID
   */
  public getScope(scopeId: string): Scope | null {
    return this.scopes.get(scopeId) || null;
  }

  /**
   * Get all scopes
   */
  public getAllScopes(): Scope[] {
    return Array.from(this.scopes.values());
  }

  /**
   * Reset the symbol table
   */
  public reset(): void {
    this.scopes.clear();
    this.currentScopeId = 'global';
    this.scopeCounter = 0;
    this.createScope('global');
  }
}
