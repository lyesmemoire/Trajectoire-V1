/**
 * CLI Configuration
 * Configuration file parsing and management
 */

import * as path from 'path';
import * as yaml from 'js-yaml';
import { readFile, fileExists } from '../utils/file';
import { ConfigError } from '../errors';

export interface BlueprintConfig {
  name?: string;
  version?: string;
  description?: string;
  compiler?: CompilerConfig;
  runtime?: RuntimeConfig;
  output?: OutputConfig;
  [key: string]: any;
}

export interface CompilerConfig {
  target?: string;
  optimize?: boolean;
  emitIR?: boolean;
  emitBytecode?: boolean;
  emitPackage?: boolean;
}

export interface RuntimeConfig {
  debug?: boolean;
  trace?: boolean;
  profile?: boolean;
}

export interface OutputConfig {
  directory?: string;
  format?: 'json' | 'binary';
}

export class ConfigManager {
  private config: BlueprintConfig = {};
  private configPath: string | null = null;

  async load(configPath?: string): Promise<BlueprintConfig> {
    if (configPath) {
      this.configPath = path.resolve(configPath);
    } else {
      this.configPath = await this.findConfigFile();
    }

    if (this.configPath && await fileExists(this.configPath)) {
      const content = await readFile(this.configPath);
      
      if (this.configPath.endsWith('.json')) {
        this.config = JSON.parse(content);
      } else if (this.configPath.endsWith('.yaml') || this.configPath.endsWith('.yml')) {
        this.config = yaml.load(content) as BlueprintConfig;
      } else if (this.configPath.endsWith('.ts')) {
        // TypeScript config would require compilation
        throw new ConfigError('TypeScript config not yet supported');
      } else {
        this.config = JSON.parse(content);
      }
    }

    // Load environment variables
    this.loadEnvVars();

    return this.config;
  }

  private async findConfigFile(): Promise<string | null> {
    const possiblePaths = [
      'blueprint.config.json',
      'blueprint.config.yaml',
      'blueprint.config.yml',
      'blueprint.config.ts',
      '.blueprintrc',
      '.blueprintrc.json',
    ];

    for (const configPath of possiblePaths) {
      if (await fileExists(configPath)) {
        return path.resolve(configPath);
      }
    }

    return null;
  }

  private loadEnvVars(): void {
    if (process.env.BLUEPRINT_TARGET) {
      this.config.compiler = this.config.compiler || {};
      this.config.compiler.target = process.env.BLUEPRINT_TARGET;
    }

    if (process.env.BLUEPRINT_OPTIMIZE) {
      this.config.compiler = this.config.compiler || {};
      this.config.compiler.optimize = process.env.BLUEPRINT_OPTIMIZE === 'true';
    }

    if (process.env.BLUEPRINT_OUTPUT_DIR) {
      this.config.output = this.config.output || {};
      this.config.output.directory = process.env.BLUEPRINT_OUTPUT_DIR;
    }
  }

  get<K extends keyof BlueprintConfig>(key: K): BlueprintConfig[K] {
    return this.config[key];
  }

  set<K extends keyof BlueprintConfig>(key: K, value: BlueprintConfig[K]): void {
    this.config[key] = value;
  }

  getAll(): BlueprintConfig {
    return { ...this.config };
  }
}

export const configManager = new ConfigManager();
