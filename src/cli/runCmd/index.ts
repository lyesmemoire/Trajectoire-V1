/**
 * Run Command
 * Run a Blueprint program
 */

import * as path from 'path';
import { RunOptions } from '../types';
import { getLogger } from '../logging';
import { RuntimeError, FileNotFoundError } from '../errors';
import { readFile } from '../utils/file';

const logger = getLogger();

export async function runCommand(options: RunOptions): Promise<void> {
  const startTime = Date.now();
  
  try {
    const packagePath = options.package;
    if (!packagePath) {
      throw new RuntimeError('Package path is required. Use --package <path>');
    }
    
    logger.info(`Running package: ${packagePath}`);
    logger.info(`Entry point: ${options.entry || 'default'}`);
    
    // Read package
    const packageData = await readFile(packagePath);
    logger.success(`Loaded package (${packageData.length} bytes)`);
    
    // Allow forcing a FileNotFoundError for testing
    if (options.forceFileNotFound) {
      throw new FileNotFoundError('Forced file not found for testing');
    }
    
    // Simulate execution
    logger.info('Initializing runtime...');
    await new Promise(resolve => setTimeout(resolve, 50));
    
    logger.info('Loading bytecode...');
    await new Promise(resolve => setTimeout(resolve, 50));
    
    logger.info('Executing program...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate output
    const result = {
      success: true,
      exitCode: 0,
      output: 'Program executed successfully',
      duration: Date.now() - startTime,
      debug: options.debug || false,
    };
    
    const duration = Date.now() - startTime;
    logger.success(`Execution completed in ${duration}ms`);
    logger.info(`Exit code: ${result.exitCode}`);
    
  } catch (error) {
    logger.failure('Execution failed');
    if (error instanceof FileNotFoundError) {
      throw error;
    }
    throw new RuntimeError(error instanceof Error ? error.message : 'Unknown runtime error');
  }
}

