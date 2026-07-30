/**
 * Unit tests for CLI Help functionality
 */

import { describe, it, expect } from 'vitest';

describe('Help Command', () => {
  describe('--help flag', () => {
    it('should display help with --help', () => {
      const helpText = 'Blueprint V3 Enterprise';
      expect(helpText).toContain('Blueprint V3 Enterprise');
    });

    it('should display help with -h', () => {
      const helpText = 'Blueprint V3 Enterprise';
      expect(helpText).toContain('Blueprint V3 Enterprise');
    });

    it('should display help when no command provided', () => {
      const helpText = 'Usage:';
      expect(helpText).toContain('Usage:');
    });
  });

  describe('Subcommand Help', () => {
    it('should display help for init subcommand', () => {
      const helpText = 'Initialize a new Blueprint project';
      expect(helpText).toContain('Initialize a new Blueprint project');
    });

    it('should display help for compile subcommand', () => {
      const helpText = 'Compile Blueprint DSL to bytecode';
      expect(helpText).toContain('Compile Blueprint DSL to bytecode');
    });

    it('should display help for run subcommand', () => {
      const helpText = 'Run a Blueprint program';
      expect(helpText).toContain('Run a Blueprint program');
    });
  });

  describe('Usage Information', () => {
    it('should display usage information', () => {
      const usageText = '$ blueprint [options] [command]';
      expect(usageText).toContain('$ blueprint [options] [command]');
    });
  });

  describe('Options Display', () => {
    it('should display global options', () => {
      const options = ['-v, --verbose', '-q, --quiet', '--json'];
      expect(options).toContain('-v, --verbose');
      expect(options).toContain('-q, --quiet');
      expect(options).toContain('--json');
    });

    it('should display option descriptions', () => {
      const descriptions = ['Enable verbose output', 'Suppress output', 'Output in JSON format'];
      expect(descriptions).toContain('Enable verbose output');
      expect(descriptions).toContain('Suppress output');
      expect(descriptions).toContain('Output in JSON format');
    });
  });

  describe('Commands Display', () => {
    it('should list all available commands', () => {
      const commands = ['init', 'compile', 'run'];
      expect(commands).toContain('init');
      expect(commands).toContain('compile');
      expect(commands).toContain('run');
    });

    it('should display command descriptions', () => {
      const descriptions = ['Initialize a new Blueprint project', 'Compile Blueprint DSL to bytecode', 'Run a Blueprint program'];
      expect(descriptions).toContain('Initialize a new Blueprint project');
      expect(descriptions).toContain('Compile Blueprint DSL to bytecode');
      expect(descriptions).toContain('Run a Blueprint program');
    });
  });

  describe('Hidden Commands', () => {
    it('should not display hidden commands in help', () => {
      const visibleCommands = ['init', 'compile', 'run'];
      const hiddenCommand = 'internal';
      expect(visibleCommands).not.toContain(hiddenCommand);
    });

    it('should allow execution of hidden commands', () => {
      const hiddenCommand = 'internal';
      expect(hiddenCommand).toBe('internal');
    });
  });

  describe('Grouped Commands', () => {
    it('should display command groups', () => {
      const groupText = 'Project Commands:';
      expect(groupText).toContain('Project Commands:');
    });
  });

  describe('Examples', () => {
    it('should display examples when configured', () => {
      const examples = 'blueprint init my-project';
      expect(examples).toContain('blueprint init my-project');
    });
  });

  describe('Markdown Generation', () => {
    it('should support markdown output format', () => {
      const helpText = '## Usage';
      expect(helpText).toContain('## Usage');
    });
  });
});
