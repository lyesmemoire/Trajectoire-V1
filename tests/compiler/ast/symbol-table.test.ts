import { describe, it, expect, beforeEach } from 'vitest';
import { SymbolTable } from '../../../compiler/ast/symbol-table';

describe('SymbolTable', () => {
  let symbolTable: SymbolTable;

  beforeEach(() => {
    symbolTable = new SymbolTable();
  });

  describe('Initialization', () => {
    it('should start in global scope', () => {
      expect(symbolTable.getCurrentScopeId()).toBeDefined();
    });
  });

  describe('Scope management', () => {
    it('should create a new scope', () => {
      const scopeId = symbolTable.createScope('global');
      expect(scopeId).toBe('scope_1');
      
      const scope = symbolTable.getScope(scopeId);
      expect(scope).toBeDefined();
      expect(scope?.parentId).toBe('global');
    });

    it('should create multiple scopes', () => {
      const scope1 = symbolTable.createScope('global');
      const scope2 = symbolTable.createScope('global');
      
      expect(scope1).toBe('scope_1');
      expect(scope2).toBe('scope_2');
      expect(scope1).not.toBe(scope2);
    });

    it('should create nested scopes', () => {
      const parentScope = symbolTable.createScope('global');
      const childScope = symbolTable.createScope(parentScope);
      
      const parent = symbolTable.getScope(parentScope);
      const child = symbolTable.getScope(childScope);
      
      expect(parent?.children).toContain(childScope);
      expect(child?.parentId).toBe(parentScope);
    });

    it('should enter a scope', () => {
      const scopeId = symbolTable.createScope('global');
      symbolTable.enterScope(scopeId);
      
      expect(symbolTable.getCurrentScopeId()).toBe(scopeId);
    });

    it('should exit to parent scope', () => {
      const parentScope = symbolTable.createScope('global');
      const childScope = symbolTable.createScope(parentScope);
      
      symbolTable.enterScope(childScope);
      symbolTable.exitScope();
      
      expect(symbolTable.getCurrentScopeId()).toBe(parentScope);
    });

    it('should stay in global scope when exiting from global', () => {
      symbolTable.exitScope();
      expect(symbolTable.getCurrentScopeId()).toBe('global');
    });

    it('should get all scopes', () => {
      symbolTable.createScope('global');
      symbolTable.createScope('global');
      
      const scopes = symbolTable.getAllScopes();
      expect(scopes).toHaveLength(3); // global + 2 new scopes
    });

    it('should get scope by ID', () => {
      const scopeId = symbolTable.createScope('global');
      const scope = symbolTable.getScope(scopeId);
      
      expect(scope).toBeDefined();
      expect(scope?.id).toBe(scopeId);
    });

    it('should return null for non-existent scope', () => {
      const scope = symbolTable.getScope('non_existent');
      expect(scope).toBeNull();
    });
  });

  describe('Reset', () => {
    it('should reset symbol table', () => {
      symbolTable.createScope('global');
      symbolTable.reset();
      
      expect(symbolTable.getCurrentScopeId()).toBeDefined();
      expect(symbolTable.getAllScopes()).toHaveLength(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle deeply nested scopes', () => {
      const scope1 = symbolTable.createScope('global');
      const scope2 = symbolTable.createScope(scope1);
      const scope3 = symbolTable.createScope(scope2);
      
      symbolTable.enterScope(scope3);
      expect(symbolTable.getCurrentScopeId()).toBe(scope3);
      
      symbolTable.exitScope();
      expect(symbolTable.getCurrentScopeId()).toBe(scope2);
      
      symbolTable.exitScope();
      expect(symbolTable.getCurrentScopeId()).toBe(scope1);
      
      symbolTable.exitScope();
      expect(symbolTable.getCurrentScopeId()).toBeDefined();
    });
  });
});

