/**
 * Build Command
 * Build a Blueprint package
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import { BuildOptions } from '../types';
import { getLogger } from '../logging';
import { CommandError } from '../errors';
import { ensureDirectory, writeFile } from '../utils/file';

const logger = getLogger();

export async function buildCommand(options: BuildOptions): Promise<void> {
  const startTime = Date.now();
  
  try {
    const inputDir = options.input || process.cwd();
    const outputDir = options.output || path.join(inputDir, 'dist');
    
    logger.info(`Building from: ${inputDir}`);
    logger.info(`Output directory: ${outputDir}`);
    
    // Create output directory
    await ensureDirectory(outputDir);
    
    // Find all .bp files
    logger.info('Scanning for Blueprint files...');
    const files = await fs.readdir(inputDir);
    const bpFiles = files.filter(f => f.endsWith('.bp'));
    
    if (bpFiles.length === 0) {
      logger.warn('No Blueprint files found');
      return;
    }
    
    logger.info(`Found ${bpFiles.length} Blueprint file(s)`);
    
    // Allow forcing an error for testing
    if (options.forceError) {
      throw new Error('Forced error for testing');
    }
    
    // Build each file
    for (const file of bpFiles) {
      logger.progress(`Building ${file}`, bpFiles.indexOf(file) + 1, bpFiles.length);
      
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.bp', '.bpp'));
      
      // Simulate build process
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Write output
      const result = {
        file,
        built: true,
        timestamp: new Date().toISOString(),
        optimized: options.optimize || false,
      };
      
      await writeFile(outputPath, JSON.stringify(result, null, 2));
    }
    
    const duration = Date.now() - startTime;
    logger.success(`Build completed in ${duration}ms`);
    logger.info(`Output: ${outputDir}`);
    
  } catch (error) {
    logger.failure('Build failed');
    throw new CommandError(error instanceof Error ? error.message : 'Unknown build error');
  }
}

