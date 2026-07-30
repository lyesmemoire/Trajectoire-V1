/**
 * Blueprint DSL IR Pipeline
 * 
 * Chains operations on IR for processing.
 */

import { IRModule } from './ir-generator';
import { Optimizer } from './optimizer';
import { SSAForm } from './ssa-form';
import { CFGBuilder, ControlFlowGraph } from './cfg-builder';
import { IRSerializer } from './ir-serializer';
import { IRValidator } from './ir-visitor';
import { IRPrinter } from './ir-visitor';

export interface PipelineStage {
  name: string;
  description: string;
  execute(module: IRModule): StageResult;
  isEnabled: boolean;
}

export interface StageResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  metrics: Map<string, number>;
  duration: number;
}

export interface PipelineResult {
  success: boolean;
  stageResults: Map<string, StageResult>;
  errors: string[];
  warnings: string[];
  metrics: Map<string, number>;
  totalDuration: number;
}

export class IRPipeline {
  private stages: PipelineStage[] = [];
  private stageResults: Map<string, StageResult> = new Map();
  private totalDuration: number = 0;

  /**
   * Add a stage to the pipeline
   */
  public addStage(stage: PipelineStage): void {
    this.stages.push(stage);
  }

  /**
   * Remove a stage by name
   */
  public removeStage(name: string): void {
    this.stages = this.stages.filter(stage => stage.name !== name);
  }

  /**
   * Enable a stage by name
   */
  public enableStage(name: string): void {
    const stage = this.stages.find(s => s.name === name);
    if (stage) {
      stage.isEnabled = true;
    }
  }

  /**
   * Disable a stage by name
   */
  public disableStage(name: string): void {
    const stage = this.stages.find(s => s.name === name);
    if (stage) {
      stage.isEnabled = false;
    }
  }

  /**
   * Run the pipeline
   */
  public run(module: IRModule): PipelineResult {
    this.stageResults.clear();
    this.totalDuration = 0;

    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allMetrics = new Map<string, number>();
    let pipelineSuccess = true;

    for (const stage of this.stages) {
      if (!stage.isEnabled) {
        continue;
      }

      const startTime = Date.now();
      const result = stage.execute(module);
      const duration = Date.now() - startTime;

      result.duration = duration;
      this.stageResults.set(stage.name, result);
      this.totalDuration += duration;

      allErrors.push(...result.errors.map(e => `${stage.name}: ${e}`));
      allWarnings.push(...result.warnings.map(w => `${stage.name}: ${w}`));

      for (const [key, value] of result.metrics) {
        allMetrics.set(`${stage.name}_${key}`, value);
      }

      if (!result.success) {
        pipelineSuccess = false;
      }
    }

    return {
      success: pipelineSuccess,
      stageResults: new Map(this.stageResults),
      errors: allErrors,
      warnings: allWarnings,
      metrics: allMetrics,
      totalDuration: this.totalDuration,
    };
  }

  /**
   * Get stage result by name
   */
  public getStageResult(name: string): StageResult | null {
    return this.stageResults.get(name) || null;
  }

  /**
   * Get all stage results
   */
  public getAllStageResults(): Map<string, StageResult> {
    return new Map(this.stageResults);
  }

  /**
   * Get total duration
   */
  public getTotalDuration(): number {
    return this.totalDuration;
  }

  /**
   * Clear all stage results
   */
  public clearResults(): void {
    this.stageResults.clear();
    this.totalDuration = 0;
  }

  /**
   * Get all stages
   */
  public getStages(): PipelineStage[] {
    return [...this.stages];
  }
}

export class ValidationStage implements PipelineStage {
  public name: string = 'validation';
  public description: string = 'Validates IR structure';
  public isEnabled: boolean = true;

  private validator: IRValidator;

  constructor() {
    this.validator = new IRValidator();
  }

  public execute(module: IRModule): StageResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    this.validator.clear();
    this.validator.visitModule(module);

    errors.push(...this.validator.getErrors());
    warnings.push(...this.validator.getWarnings());

    metrics.set('error_count', this.validator.getErrors().length);
    metrics.set('warning_count', this.validator.getWarnings().length);

    const duration = Date.now() - startTime;

    return {
      success: this.validator.isValid(),
      errors,
      warnings,
      metrics,
      duration,
    };
  }
}

export class SSAConversionStage implements PipelineStage {
  public name: string = 'ssa_conversion';
  public description: string = 'Converts IR to SSA form';
  public isEnabled: boolean = true;

  private ssaForm: SSAForm;

  constructor() {
    this.ssaForm = new SSAForm();
  }

  public execute(module: IRModule): StageResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    try {
      for (const func of module.functions) {
        this.ssaForm.convertToSSA(func);
      }

      metrics.set('functions_converted', module.functions.length);
    } catch (error) {
      errors.push(`SSA conversion failed: ${error}`);
    }

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      errors,
      warnings,
      metrics,
      duration,
    };
  }
}

export class CFGConstructionStage implements PipelineStage {
  public name: string = 'cfg_construction';
  public description: string = 'Builds Control Flow Graph';
  public isEnabled: boolean = true;

  private cfgBuilder: CFGBuilder;
  private cfgs: Map<string, ControlFlowGraph> = new Map();

  constructor() {
    this.cfgBuilder = new CFGBuilder();
  }

  public execute(module: IRModule): StageResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    try {
      this.cfgs.clear();

      for (const func of module.functions) {
        const cfg = this.cfgBuilder.buildCFG(func);
        this.cfgs.set(func.name, cfg);

        const validation = this.cfgBuilder.validateCFG(cfg);
        if (!validation.valid) {
          warnings.push(...validation.errors);
        }
      }

      metrics.set('cfgs_built', this.cfgs.size);
    } catch (error) {
      errors.push(`CFG construction failed: ${error}`);
    }

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      errors,
      warnings,
      metrics,
      duration,
    };
  }

  /**
   * Get built CFGs
   */
  public getCFGs(): Map<string, ControlFlowGraph> {
    return new Map(this.cfgs);
  }
}

export class OptimizationStage implements PipelineStage {
  public name: string = 'optimization';
  public description: string = 'Optimizes IR';
  public isEnabled: boolean = true;

  private optimizer: Optimizer;
  private optimizationLevel: string;

  constructor(optimizationLevel: string = 'O2') {
    this.optimizer = new Optimizer();
    this.optimizationLevel = optimizationLevel;
  }

  public execute(module: IRModule): StageResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    try {
      const result = this.optimizer.optimize(module, this.optimizationLevel);

      errors.push(...result.errors);
      warnings.push(...result.warnings);

      for (const [key, value] of result.metrics) {
        metrics.set(key, value);
      }

      if (result.statistics) {
        metrics.set('total_passes', result.statistics.total);
        metrics.set('successful_passes', result.statistics.successful);
        metrics.set('failed_passes', result.statistics.failed);
      }
    } catch (error) {
      errors.push(`Optimization failed: ${error}`);
    }

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      errors,
      warnings,
      metrics,
      duration,
    };
  }

  /**
   * Set optimization level
   */
  public setOptimizationLevel(level: string): void {
    this.optimizationLevel = level;
  }
}

export class SerializationStage implements PipelineStage {
  public name: string = 'serialization';
  public description: string = 'Serializes IR to JSON';
  public isEnabled: boolean = false;

  private serializer: IRSerializer;
  private serialized: string = '';

  constructor() {
    this.serializer = new IRSerializer();
  }

  public execute(module: IRModule): StageResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    try {
      this.serialized = this.serializer.serialize(module);
      metrics.set('serialized_size', this.serialized.length);
    } catch (error) {
      errors.push(`Serialization failed: ${error}`);
    }

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      errors,
      warnings,
      metrics,
      duration,
    };
  }

  /**
   * Get serialized IR
   */
  public getSerialized(): string {
    return this.serialized;
  }
}

export class PrintingStage implements PipelineStage {
  public name: string = 'printing';
  public description: string = 'Prints IR for debugging';
  public isEnabled: boolean = false;

  private printer: IRPrinter;
  private printed: string = '';

  constructor() {
    this.printer = new IRPrinter();
  }

  public execute(module: IRModule): StageResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics = new Map<string, number>();

    try {
      this.printer.clear();
      this.printer.visitModule(module);
      this.printed = this.printer.getOutput();
      metrics.set('printed_size', this.printed.length);
    } catch (error) {
      errors.push(`Printing failed: ${error}`);
    }

    const duration = Date.now() - startTime;

    return {
      success: errors.length === 0,
      errors,
      warnings,
      metrics,
      duration,
    };
  }

  /**
   * Get printed IR
   */
  public getPrinted(): string {
    return this.printed;
  }
}

export class DefaultPipeline extends IRPipeline {
  constructor() {
    super();

    // Add default stages
    this.addStage(new ValidationStage());
    this.addStage(new CFGConstructionStage());
    this.addStage(new SSAConversionStage());
    this.addStage(new OptimizationStage('O2'));
  }
}

export class FastPipeline extends IRPipeline {
  constructor() {
    super();

    // Add fast pipeline stages (minimal optimization)
    this.addStage(new ValidationStage());
    this.addStage(new OptimizationStage('O1'));
  }
}

export class AggressivePipeline extends IRPipeline {
  constructor() {
    super();

    // Add aggressive pipeline stages (maximum optimization)
    this.addStage(new ValidationStage());
    this.addStage(new CFGConstructionStage());
    this.addStage(new SSAConversionStage());
    this.addStage(new OptimizationStage('O3'));
  }
}
