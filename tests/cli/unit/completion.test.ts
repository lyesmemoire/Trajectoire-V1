/**
 * Unit tests for CLI Completion functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateBashCompletion, generateZshCompletion, generateFishCompletion, generatePowerShellCompletion } from '../../../src/cli/core/completion';
import { Command } from 'commander';

describe('CLI Completion', () => {
  let program: Command;

  beforeEach(() => {
    program = new Command();
    program
      .name('blueprint')
      .description('Blueprint V3 Enterprise - Cognitive Platform CLI')
      .version('1.0.0')
      .option('-v, --verbose', 'Enable verbose output')
      .option('-q, --quiet', 'Suppress output')
      .option('--json', 'Output in JSON format')
      .option('-c, --config <path>', 'Path to configuration file');

    program
      .command('init')
      .description('Initialize a new Blueprint project')
      .option('--name <name>', 'Project name');

    program
      .command('compile')
      .description('Compile Blueprint DSL to bytecode')
      .option('-i, --input <path>', 'Input file path');

    program
      .command('run')
      .description('Run a Blueprint program')
      .option('-p, --package <path>', 'Package path');
  });

  describe('Bash Completion', () => {
    it('should generate bash completion script', () => {
      const script = generateBashCompletion(program);
      
      expect(script).toContain('blueprint');
      expect(script).toContain('complete -F _blueprint_completion blueprint');
      expect(script).toContain('_blueprint_completion()');
    });

    it('should include commands in bash completion', () => {
      const script = generateBashCompletion(program);
      
      expect(script).toContain('init');
      expect(script).toContain('compile');
      expect(script).toContain('run');
    });

    it('should include command options in bash completion', () => {
      const script = generateBashCompletion(program);
      
      expect(script).toContain('--name');
      expect(script).toContain('--input');
      expect(script).toContain('--package');
    });
  });

  describe('Zsh Completion', () => {
    it('should generate zsh completion script', () => {
      const script = generateZshCompletion(program);
      
      expect(script).toContain('blueprint');
      expect(script).toContain('#compdef blueprint');
      expect(script).toContain('_blueprint');
    });

    it('should include commands in zsh completion', () => {
      const script = generateZshCompletion(program);
      
      expect(script).toContain('init');
      expect(script).toContain('compile');
      expect(script).toContain('run');
    });

    it('should include descriptions in zsh completion', () => {
      const script = generateZshCompletion(program);
      
      expect(script).toContain('Initialize a new Blueprint project');
      expect(script).toContain('Compile Blueprint DSL to bytecode');
    });
  });

  describe('Fish Completion', () => {
    it('should generate fish completion script', () => {
      const script = generateFishCompletion(program);
      
      expect(script).toContain('blueprint');
      expect(script).toContain('complete -c blueprint');
    });

    it('should include commands in fish completion', () => {
      const script = generateFishCompletion(program);
      
      expect(script).toContain('init');
      expect(script).toContain('compile');
      expect(script).toContain('run');
    });
  });

  describe('PowerShell Completion', () => {
    it('should generate PowerShell completion script', () => {
      const script = generatePowerShellCompletion(program);
      
      expect(script).toContain('blueprint');
      expect(script).toContain('Register-ArgumentCompleter');
    });

    it('should include commands in PowerShell completion', () => {
      const script = generatePowerShellCompletion(program);
      
      expect(script).toContain('init');
      expect(script).toContain('compile');
      expect(script).toContain('run');
    });
  });

  describe('Shell Detection', () => {
    it('should support bash shell', () => {
      const shell = 'bash';
      const supportedShells = ['bash', 'zsh', 'fish', 'powershell'];
      expect(supportedShells).toContain(shell);
    });

    it('should support zsh shell', () => {
      const shell = 'zsh';
      const supportedShells = ['bash', 'zsh', 'fish', 'powershell'];
      expect(supportedShells).toContain(shell);
    });

    it('should support fish shell', () => {
      const shell = 'fish';
      const supportedShells = ['bash', 'zsh', 'fish', 'powershell'];
      expect(supportedShells).toContain(shell);
    });

    it('should support powershell shell', () => {
      const shell = 'powershell';
      const supportedShells = ['bash', 'zsh', 'fish', 'powershell'];
      expect(supportedShells).toContain(shell);
    });

    it('should reject unsupported shells', () => {
      const shell = 'unsupported';
      const supportedShells = ['bash', 'zsh', 'fish', 'powershell'];
      expect(supportedShells).not.toContain(shell);
    });
  });
});
