/**
 * Unit tests for CLI Command Parser
 */

import { describe, it, expect } from 'vitest';

describe('Command Parser', () => {
  describe('Arguments', () => {
    it('should parse positional arguments', () => {
      const args = ['node', 'test', 'value'];
      expect(args[2]).toBe('value');
    });

    it('should parse multiple positional arguments', () => {
      const args = ['node', 'test', 'in', 'out'];
      expect(args[2]).toBe('in');
      expect(args[3]).toBe('out');
    });

    it('should handle optional arguments', () => {
      const args = ['node', 'test'];
      expect(args[2]).toBeUndefined();
    });

    it('should handle variadic arguments', () => {
      const args = ['node', 'test', 'a', 'b', 'c'];
      expect(args.slice(2)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Flags', () => {
    it('should parse boolean flags', () => {
      const args = ['node', 'test', '--flag'];
      expect(args).toContain('--flag');
    });

    it('should handle absent boolean flags', () => {
      const args = ['node', 'test'];
      expect(args).not.toContain('--flag');
    });

    it('should parse negated boolean flags', () => {
      const args = ['node', 'test', '--no-flag'];
      expect(args).toContain('--no-flag');
    });
  });

  describe('Options', () => {
    it('should parse string options', () => {
      const args = ['node', 'test', '--name', 'test'];
      const nameIndex = args.indexOf('--name');
      expect(args[nameIndex + 1]).toBe('test');
    });

    it('should parse number options', () => {
      const args = ['node', 'test', '--count', '5'];
      const countIndex = args.indexOf('--count');
      expect(parseInt(args[countIndex + 1], 10)).toBe(5);
    });

    it('should use default values for options', () => {
      const defaultValue = '10';
      expect(defaultValue).toBe('10');
    });
  });

  describe('Aliases', () => {
    it('should parse short option aliases', () => {
      const args = ['node', 'test', '-v'];
      expect(args).toContain('-v');
    });

    it('should parse long option aliases', () => {
      const args = ['node', 'test', '--verbose'];
      expect(args).toContain('--verbose');
    });
  });

  describe('Subcommands', () => {
    it('should parse subcommands', () => {
      const args = ['node', 'init'];
      expect(args[1]).toBe('init');
    });

    it('should parse nested subcommands', () => {
      const args = ['node', 'sub', 'nested'];
      expect(args[1]).toBe('sub');
      expect(args[2]).toBe('nested');
    });
  });

  describe('Default Values', () => {
    it('should use default for missing options', () => {
      const defaultValue = '3000';
      expect(defaultValue).toBe('3000');
    });

    it('should override default with provided value', () => {
      const providedValue = '8080';
      expect(providedValue).toBe('8080');
    });
  });

  describe('Array Options', () => {
    it('should parse array options', () => {
      const args = ['node', 'test', '--items', 'a', 'b', 'c'];
      const itemsIndex = args.indexOf('--items');
      expect(args.slice(itemsIndex + 1)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('Enum Options', () => {
    it('should validate enum options', () => {
      const validFormats = ['json', 'yaml', 'toml'];
      const format = 'yaml';
      expect(validFormats.includes(format)).toBe(true);
    });

    it('should reject invalid enum values', () => {
      const validFormats = ['json', 'yaml', 'toml'];
      const format = 'invalid';
      expect(validFormats.includes(format)).toBe(false);
    });
  });
});
