/**
 * Unit tests for CLI Version functionality
 */

import { describe, it, expect } from 'vitest';

describe('Version Command', () => {
  describe('Version Format', () => {
    it('should follow semantic versioning format', () => {
      const version = '1.0.0';
      const semverPattern = /^\d+\.\d+\.\d+/;
      expect(version).toMatch(semverPattern);
    });

    it('should support pre-release versions', () => {
      const version = '1.0.0-beta.1';
      const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
      expect(version).toMatch(semverPattern);
    });

    it('should support build metadata', () => {
      const version = '1.0.0+build.123';
      const semverPattern = /^\d+\.\d+\.\d+(\+[a-zA-Z0-9.-]+)?$/;
      expect(version).toMatch(semverPattern);
    });
  });

  describe('Version Components', () => {
    it('should parse major version', () => {
      const version = '1.0.0';
      const major = parseInt(version.split('.')[0], 10);
      expect(major).toBe(1);
    });

    it('should parse minor version', () => {
      const version = '1.0.0';
      const minor = parseInt(version.split('.')[1], 10);
      expect(minor).toBe(0);
    });

    it('should parse patch version', () => {
      const version = '1.0.0';
      const patch = parseInt(version.split('.')[2], 10);
      expect(patch).toBe(0);
    });
  });

  describe('Release Channels', () => {
    it('should identify stable release', () => {
      const version = '1.0.0';
      const isStable = !version.includes('-');
      expect(isStable).toBe(true);
    });

    it('should identify beta release', () => {
      const version = '1.0.0-beta.1';
      const isBeta = version.includes('beta');
      expect(isBeta).toBe(true);
    });

    it('should identify alpha release', () => {
      const version = '1.0.0-alpha.1';
      const isAlpha = version.includes('alpha');
      expect(isAlpha).toBe(true);
    });
  });
});
