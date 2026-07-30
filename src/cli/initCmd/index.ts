/**
 * Init Command
 * Initialize a new Blueprint project
 */

import * as path from 'path';
import { InitOptions } from '../types';
import { getLogger } from '../logging';
import { CommandError } from '../errors';
import { ensureDirectory, writeFile, fileExists } from '../utils/file';

const logger = getLogger();

export async function initCommand(options: InitOptions): Promise<void> {
  const startTime = Date.now();
  
  try {
    const projectName = options.name || 'blueprint-project';
    const targetDir = options.directory || path.resolve(process.cwd(), projectName);
    
    logger.info(`Initializing Blueprint project: ${projectName}`);
    logger.info(`Target directory: ${targetDir}`);
    
    // Check if directory already exists
    if (await fileExists(targetDir) && !options.force) {
      throw new CommandError(`Directory already exists: ${targetDir}. Use --force to overwrite.`);
    }
    
    // Create directory structure
    logger.info('Creating directory structure...');
    
    const dirs = [
      'src',
      'src/contracts',
      'src/modules',
      'tests',
      'artifacts',
      'config',
    ];
    
    for (const dir of dirs) {
      await ensureDirectory(path.join(targetDir, dir));
      logger.progress(`Created directory: ${dir}`, dirs.indexOf(dir) + 1, dirs.length);
    }
    
    // Create configuration file
    logger.info('Creating configuration files...');
    
    const config = {
      name: projectName,
      version: '1.0.0',
      description: 'Blueprint V3 Enterprise Project',
      compiler: {
        target: 'cvm-v3',
        optimize: true,
        emitIR: true,
        emitBytecode: true,
        emitPackage: true,
      },
      runtime: {
        debug: false,
        trace: false,
        profile: false,
      },
      output: {
        directory: 'artifacts',
        format: 'json',
      },
    };
    
    await writeFile(path.join(targetDir, 'blueprint.config.json'), JSON.stringify(config, null, 2));
    logger.success('Created blueprint.config.json');
    
    // Create sample contract
    const sampleContract = `// Blueprint Contract
contract SampleContract {
  // Define your contract here
  state: {
    counter: number = 0;
  }
  
  increment(): void {
    this.state.counter += 1;
  }
  
  decrement(): void {
    this.state.counter -= 1;
  }
}
`;
    
    await writeFile(path.join(targetDir, 'src/contracts/SampleContract.bp'), sampleContract);
    logger.success('Created sample contract');
    
    // Create README
    const readme = `# ${projectName}

Blueprint V3 Enterprise Project

## Getting Started

\`\`\`bash
# Compile the project
blueprint compile src/contracts/SampleContract.bp

# Run the project
blueprint run artifacts/SampleContract.bpp

# Generate graphs
blueprint graph --type dependency

# Run health checks
blueprint doctor
\`\`\`

## Configuration

Edit \`blueprint.config.json\` to customize compilation and runtime options.

## Documentation

For more information, visit the Blueprint documentation.
`;
    
    await writeFile(path.join(targetDir, 'README.md'), readme);
    logger.success('Created README.md');
    
    const duration = Date.now() - startTime;
    logger.success(`Project initialized successfully in ${duration}ms`);
    logger.info(`\nNext steps:`);
    logger.info(`  cd ${projectName}`);
    logger.info(`  blueprint compile src/contracts/SampleContract.bp`);
    
  } catch (error) {
    logger.failure('Initialization failed');
    throw error;
  }
}

