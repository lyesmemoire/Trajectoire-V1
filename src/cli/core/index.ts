/**
 * Blueprint V3 Enterprise CLI
 * Main CLI entry point
 */

import { Command } from 'commander';
import { createLogger } from '../logging';
import { handleError } from '../errors';
import { configManager } from '../config';
import { generateBashCompletion, generateZshCompletion, generateFishCompletion, generatePowerShellCompletion } from './completion';

// Import commands
import { compileCommand } from '../compile';
import { buildCommand } from '../buildCmd';
import { runCommand } from '../runCmd';
import { initCommand } from '../initCmd';
import { graphCommand } from '../graphCmd';
import { traceCommand } from '../traceCmd';
import { debugCommand } from '../debugCmd';
import { benchmarkCommand } from '../benchmarkCmd';
import { doctorCommand } from '../doctorCmd';
import { sdkCommand } from '../sdkCmd';

const logger = createLogger();

export async function main(args: string[] = process.argv): Promise<void> {
  try {
    // Load configuration
    await configManager.load();

    // Setup CLI program
    const program = new Command();
    program
      .name('blueprint')
      .description('Blueprint V3 Enterprise - Cognitive Platform CLI')
      .version('1.0.0')
      .option('-v, --verbose', 'Enable verbose output')
      .option('-q, --quiet', 'Suppress output')
      .option('--json', 'Output in JSON format')
      .option('-c, --config <path>', 'Path to configuration file');

    // Register commands
    program
      .command('init')
      .description('Initialize a new Blueprint project')
      .option('--name <name>', 'Project name')
      .option('--template <template>', 'Template to use')
      .option('--directory <path>', 'Output directory')
      .option('--force', 'Force overwrite existing files')
      .action(async (options) => {
        try {
          await initCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('compile')
      .description('Compile Blueprint DSL to bytecode')
      .option('-i, --input <path>', 'Input file path')
      .option('-o, --output <path>', 'Output file path')
      .option('-O, --optimize', 'Enable optimizations')
      .option('--emit-ir', 'Emit IR')
      .option('--emit-bytecode', 'Emit bytecode')
      .option('--emit-package', 'Emit package')
      .option('--target <target>', 'Target platform')
      .action(async (options) => {
        try {
          await compileCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('build')
      .description('Build a Blueprint package')
      .option('-i, --input <path>', 'Input directory')
      .option('-o, --output <path>', 'Output directory')
      .option('-w, --watch', 'Watch for changes')
      .option('-O, --optimize', 'Enable optimizations')
      .action(async (options) => {
        try {
          await buildCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('run')
      .description('Run a Blueprint program')
      .option('-p, --package <path>', 'Package path')
      .option('-e, --entry <name>', 'Entry point name')
      .option('--debug', 'Enable debugging')
      .option('--args <args...>', 'Arguments to pass to program')
      .action(async (options) => {
        try {
          await runCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('graph')
      .description('Generate dependency/knowledge/runtime graphs')
      .option('--type <type>', 'Graph type (dependency, knowledge, runtime)')
      .option('--format <format>', 'Output format (json, dot, mermaid)')
      .option('--output <path>', 'Output file')
      .option('--filter <filter>', 'Filter nodes')
      .action(async (options) => {
        try {
          await graphCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('trace')
      .description('Enable runtime tracing')
      .option('--output <path>', 'Output file')
      .option('--format <format>', 'Output format (json, text)')
      .option('--filter <filter>', 'Event filter')
      .option('--duration <ms>', 'Trace duration in milliseconds')
      .action(async (options) => {
        try {
          await traceCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('debug')
      .description('Attach debugger to running program')
      .option('--port <port>', 'Debug port', '9229')
      .option('--host <host>', 'Debug host', 'localhost')
      .option('--breakpoints <file>', 'Breakpoints file')
      .option('--attach', 'Attach to existing process')
      .action(async (options) => {
        try {
          await debugCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('benchmark')
      .description('Run all benchmarks')
      .option('--output <path>', 'Output file')
      .option('--filter <filter>', 'Benchmark filter')
      .option('--iterations <n>', 'Number of iterations', '100')
      .option('--warmup <n>', 'Warmup iterations', '10')
      .action(async (options) => {
        try {
          await benchmarkCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    program
      .command('doctor')
      .description('Check system health and configuration')
      .option('--output <path>', 'Output file')
      .option('--fix', 'Auto-fix issues')
      .option('--check <items...>', 'Specific checks to run')
      .action(async (options) => {
        try {
          await doctorCommand(options);
        } catch (error) {
          handleError(error);
        }
      });

    // SDK command
    program.addCommand(sdkCommand);

    // Completion command
    program
      .command('completion [shell]')
      .description('Generate shell completion script')
      .action(async (shell) => {
        try {
          const shells = ['bash', 'zsh', 'fish', 'powershell'];
          
          if (!shell) {
            logger.info('Available shells: ' + shells.join(', '));
            logger.info('Usage: blueprint completion <shell>');
            logger.info('Example: blueprint completion bash > ~/.bashrc');
            return;
          }
          
          if (!shells.includes(shell)) {
            throw new Error(`Unsupported shell: ${shell}. Supported: ${shells.join(', ')}`);
          }
          
          let completionScript: string;
          switch (shell) {
            case 'bash':
              completionScript = generateBashCompletion(program);
              break;
            case 'zsh':
              completionScript = generateZshCompletion(program);
              break;
            case 'fish':
              completionScript = generateFishCompletion(program);
              break;
            case 'powershell':
              completionScript = generatePowerShellCompletion(program);
              break;
            default:
              throw new Error(`Unsupported shell: ${shell}`);
          }
          
          console.log(completionScript);
          logger.success(`Generated ${shell} completion script`);
        } catch (error) {
          handleError(error);
        }
      });

    // Parse arguments
    await program.parseAsync(args);

  } catch (error) {
    handleError(error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
