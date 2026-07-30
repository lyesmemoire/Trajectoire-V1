/**
 * Blueprint DSL IR Region
 * 
 * Groups basic blocks into regions for analysis.
 */

import { IRBasicBlock, IRFunction } from './ir-generator';

export enum RegionType {
  SIMPLE = 'SIMPLE',
  LOOP = 'LOOP',
  IF_THEN = 'IF_THEN',
  IF_THEN_ELSE = 'IF_THEN_ELSE',
  SWITCH = 'SWITCH',
  TRY_CATCH = 'TRY_CATCH',
  FUNCTION = 'FUNCTION',
}

export interface IRRegion {
  id: string;
  type: RegionType;
  name: string;
  blocks: IRBasicBlock[];
  entryBlock: string;
  exitBlocks: string[];
  subRegions: IRRegion[];
  parentRegion: IRRegion | null;
}

export class RegionBuilder {
  private regionCounter: number = 0;

  /**
   * Build regions from a function
   */
  public buildRegions(irFunction: IRFunction): IRRegion[] {
    const regions: IRRegion[] = [];

    // Create a function-level region
    const functionRegion: IRRegion = {
      id: this.generateRegionId(),
      type: RegionType.FUNCTION,
      name: irFunction.name,
      blocks: irFunction.basicBlocks,
      entryBlock: irFunction.basicBlocks[0]?.name || '',
      exitBlocks: this.findExitBlocks(irFunction.basicBlocks),
      subRegions: [],
      parentRegion: null,
    };

    // Identify loop regions
    const loopRegions = this.identifyLoopRegions(irFunction.basicBlocks);
    functionRegion.subRegions.push(...loopRegions);

    // Identify conditional regions
    const conditionalRegions = this.identifyConditionalRegions(irFunction.basicBlocks);
    functionRegion.subRegions.push(...conditionalRegions);

    regions.push(functionRegion);

    return regions;
  }

  /**
   * Identify loop regions
   */
  private identifyLoopRegions(blocks: IRBasicBlock[]): IRRegion[] {
    const regions: IRRegion[] = [];
    const visited = new Set<string>();

    for (const block of blocks) {
      if (visited.has(block.name)) {
        continue;
      }

      const loop = this.detectLoop(block, blocks);
      if (loop) {
        const region: IRRegion = {
          id: this.generateRegionId(),
          type: RegionType.LOOP,
          name: `loop_${block.name}`,
          blocks: loop.blocks,
          entryBlock: loop.entry,
          exitBlocks: loop.exits,
          subRegions: [],
          parentRegion: null,
        };

        regions.push(region);

        for (const b of loop.blocks) {
          visited.add(b.name);
        }
      }
    }

    return regions;
  }

  /**
   * Detect a loop starting from a block
   */
  private detectLoop(startBlock: IRBasicBlock, blocks: IRBasicBlock[]): { blocks: IRBasicBlock[]; entry: string; exits: string[] } | null {
    const loopBlocks = new Set<string>([startBlock.name]);
    const queue = [startBlock];
    let hasBackEdge = false;

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!current) continue;

      for (const successorName of current.successors) {
        if (successorName === startBlock.name) {
          hasBackEdge = true;
        } else if (!loopBlocks.has(successorName)) {
          const successor = blocks.find(b => b.name === successorName);
          if (successor) {
            loopBlocks.add(successorName);
            queue.push(successor);
          }
        }
      }
    }

    if (!hasBackEdge) {
      return null;
    }

    const loopBlocksArray = blocks.filter(b => loopBlocks.has(b.name));
    const exits = this.findLoopExits(loopBlocksArray);

    return {
      blocks: loopBlocksArray,
      entry: startBlock.name,
      exits,
    };
  }

  /**
   * Find loop exit blocks
   */
  private findLoopExits(loopBlocks: IRBasicBlock[]): string[] {
    const exits: string[] = [];

    for (const block of loopBlocks) {
      for (const successorName of block.successors) {
        if (!loopBlocks.find(b => b.name === successorName)) {
          exits.push(block.name);
        }
      }
    }

    return exits;
  }

  /**
   * Identify conditional regions
   */
  private identifyConditionalRegions(blocks: IRBasicBlock[]): IRRegion[] {
    const regions: IRRegion[] = [];

    for (const block of blocks) {
      if (block.successors.length === 2) {
        // This is a conditional branch
        const thenBlock = blocks.find(b => b.name === block.successors[0]);
        const elseBlock = blocks.find(b => b.name === block.successors[1]);

        if (thenBlock && elseBlock) {
          // Check if they converge
          const convergence = this.findConvergence(thenBlock, elseBlock, blocks);

          if (convergence) {
            const regionBlocks = [block, thenBlock, elseBlock];
            if (convergence) {
              regionBlocks.push(convergence);
            }

            const region: IRRegion = {
              id: this.generateRegionId(),
              type: RegionType.IF_THEN_ELSE,
              name: `if_else_${block.name}`,
              blocks: regionBlocks,
              entryBlock: block.name,
              exitBlocks: convergence ? [convergence.name] : [],
              subRegions: [],
              parentRegion: null,
            };

            regions.push(region);
          }
        }
      }
    }

    return regions;
  }

  /**
   * Find convergence point of two blocks
   */
  private findConvergence(block1: IRBasicBlock, block2: IRBasicBlock, blocks: IRBasicBlock[]): IRBasicBlock | null {
    const visited1 = new Set<string>();
    const queue1 = [block1];

    while (queue1.length > 0) {
      const current = queue1.shift()!;
      if (!current) continue;

      for (const successorName of current.successors) {
        if (!visited1.has(successorName)) {
          visited1.add(successorName);
          const successor = blocks.find(b => b.name === successorName);
          if (successor) {
            queue1.push(successor);
          }
        }
      }
    }

    const visited2 = new Set<string>();
    const queue2 = [block2];

    while (queue2.length > 0) {
      const current = queue2.shift()!;
      if (!current) continue;

      if (visited1.has(current.name)) {
        return current;
      }

      for (const successorName of current.successors) {
        if (!visited2.has(successorName)) {
          visited2.add(successorName);
          const successor = blocks.find(b => b.name === successorName);
          if (successor) {
            queue2.push(successor);
          }
        }
      }
    }

    return null;
  }

  /**
   * Find exit blocks
   */
  private findExitBlocks(blocks: IRBasicBlock[]): string[] {
    const exits: string[] = [];

    for (const block of blocks) {
      if (block.successors.length === 0) {
        exits.push(block.name);
      } else {
        const lastInstruction = block.instructions[block.instructions.length - 1];
        if (lastInstruction && lastInstruction.instructionType === 'RET') {
          exits.push(block.name);
        }
      }
    }

    return exits;
  }

  /**
   * Generate a unique region ID
   */
  private generateRegionId(): string {
    return `region_${this.regionCounter++}`;
  }

  /**
   * Get region hierarchy
   */
  public getRegionHierarchy(regions: IRRegion[]): Map<string, string[]> {
    const hierarchy = new Map<string, string[]>();

    for (const region of regions) {
      const children: string[] = [];
      this.collectChildren(region, children);
      hierarchy.set(region.id, children);
    }

    return hierarchy;
  }

  /**
   * Collect children of a region
   */
  private collectChildren(region: IRRegion, children: string[]): void {
    for (const subRegion of region.subRegions) {
      children.push(subRegion.id);
      this.collectChildren(subRegion, children);
    }
  }

  /**
   * Find region by block name
   */
  public findRegionByBlock(regions: IRRegion[], blockName: string): IRRegion | null {
    for (const region of regions) {
      if (region.blocks.find(b => b.name === blockName)) {
        return region;
      }

      const foundInSub = this.findRegionByBlock(region.subRegions, blockName);
      if (foundInSub) {
        return foundInSub;
      }
    }

    return null;
  }

  /**
   * Get all regions of a specific type
   */
  public getRegionsByType(regions: IRRegion[], type: RegionType): IRRegion[] {
    const result: IRRegion[] = [];

    for (const region of regions) {
      if (region.type === type) {
        result.push(region);
      }

      result.push(...this.getRegionsByType(region.subRegions, type));
    }

    return result;
  }

  /**
   * Calculate region complexity
   */
  public calculateRegionComplexity(region: IRRegion): number {
    let complexity = 0;

    switch (region.type) {
      case RegionType.SIMPLE:
        complexity = 1;
        break;
      case RegionType.LOOP:
        complexity = 2 + region.subRegions.reduce((sum, r) => sum + this.calculateRegionComplexity(r), 0);
        break;
      case RegionType.IF_THEN:
        complexity = 2 + region.subRegions.reduce((sum, r) => sum + this.calculateRegionComplexity(r), 0);
        break;
      case RegionType.IF_THEN_ELSE:
        complexity = 3 + region.subRegions.reduce((sum, r) => sum + this.calculateRegionComplexity(r), 0);
        break;
      case RegionType.SWITCH:
        complexity = region.blocks.length;
        break;
      default:
        complexity = 1;
    }

    return complexity;
  }

  /**
   * Validate region structure
   */
  public validateRegion(region: IRRegion): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!region.id) {
      errors.push('Region missing id');
    }

    if (!region.name) {
      errors.push('Region missing name');
    }

    if (region.blocks.length === 0) {
      errors.push('Region has no blocks');
    }

    if (!region.entryBlock) {
      errors.push('Region missing entry block');
    }

    const entryExists = region.blocks.find(b => b.name === region.entryBlock);
    if (!entryExists) {
      errors.push(`Entry block ${region.entryBlock} not found in region`);
    }

    for (const exitBlock of region.exitBlocks) {
      const exitExists = region.blocks.find(b => b.name === exitBlock);
      if (!exitExists) {
        errors.push(`Exit block ${exitBlock} not found in region`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
