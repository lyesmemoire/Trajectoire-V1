/**
 * Blueprint DSL SSA Form
 * 
 * Converts IR to Static Single Assignment (SSA) form.
 */

import { IRFunction, IRBasicBlock, IRInstruction, IRInstructionType } from './ir-generator';

export interface SSABlock extends IRBasicBlock {
  phiInstructions: IRInstruction[];
}

export interface SSAFunction extends IRFunction {
  basicBlocks: SSABlock[];
  dominanceFrontiers: Map<string, Set<string>>;
  dominanceTree: Map<string, string>;
}

export class SSAForm {
  /**
   * Convert a function to SSA form
   */
  public convertToSSA(irFunction: IRFunction): SSAFunction {
    const ssaFunction: SSAFunction = {
      ...irFunction,
      basicBlocks: irFunction.basicBlocks.map(block => ({
        ...block,
        phiInstructions: [],
      })),
      dominanceFrontiers: new Map(),
      dominanceTree: new Map(),
    };

    // Compute dominance frontiers
    this.computeDominanceFrontiers(ssaFunction);

    // Insert phi nodes
    this.insertPhiNodes(ssaFunction);

    // Rename variables
    this.renameVariables(ssaFunction);

    return ssaFunction;
  }

  /**
   * Compute dominance frontiers
   */
  private computeDominanceFrontiers(ssaFunction: SSAFunction): void {
    const blocks = ssaFunction.basicBlocks;
    const entryBlock = blocks[0];

    // Compute immediate dominators
    const dominators = this.computeDominators(blocks, entryBlock);

    // Compute dominance frontiers
    for (const block of blocks) {
      const frontier = new Set<string>();
      
      for (const pred of block.predecessors) {
        let runner = pred;
        while (runner !== block.name && runner !== entryBlock.name) {
          frontier.add(runner);
          const runnerBlock = blocks.find(b => b.name === runner);
          if (runnerBlock) {
            const idom = dominators.get(runner);
            if (idom) {
              runner = idom;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      ssaFunction.dominanceFrontiers.set(block.name, frontier);
    }

    // Build dominance tree
    for (const [block, idom] of dominators) {
      if (idom) {
        ssaFunction.dominanceTree.set(block, idom);
      }
    }
  }

  /**
   * Compute immediate dominators
   */
  private computeDominators(blocks: SSABlock[], entry: SSABlock): Map<string, string> {
    const dominators = new Map<string, Set<string>>();

    // Initialize
    for (const block of blocks) {
      if (block.name === entry.name) {
        dominators.set(block.name, new Set([block.name]));
      } else {
        dominators.set(block.name, new Set(blocks.map(b => b.name)));
      }
    }

    // Iterate until convergence
    let changed = true;
    while (changed) {
      changed = false;

      for (const block of blocks) {
        if (block.name === entry.name) {
          continue;
        }

        const newDoms = new Set<string>([block.name]);

        // Intersect predecessors' dominators
        if (block.predecessors.length > 0) {
          const firstPred = block.predecessors[0];
          const predDoms = dominators.get(firstPred);
          if (predDoms) {
            newDoms.add(...predDoms);
          }

          for (let i = 1; i < block.predecessors.length; i++) {
            const pred = block.predecessors[i];
            const predDoms = dominators.get(pred);
            if (predDoms) {
              for (const dom of newDoms) {
                if (!predDoms.has(dom) && dom !== block.name) {
                  newDoms.delete(dom);
                }
              }
            }
          }
        }

        const currentDoms = dominators.get(block.name);
        if (currentDoms && !this.setsEqual(newDoms, currentDoms)) {
          dominators.set(block.name, newDoms);
          changed = true;
        }
      }
    }

    // Compute immediate dominators
    const idoms = new Map<string, string>();
    for (const [block, doms] of dominators) {
      if (block === entry.name) {
        continue;
      }

      doms.delete(block);
      const idom = this.findImmediateDominator(block, doms, dominators);
      if (idom) {
        idoms.set(block, idom);
      }
    }

    return idoms;
  }

  /**
   * Find immediate dominator
   */
  private findImmediateDominator(
    block: string,
    dominators: Set<string>,
    allDominators: Map<string, Set<string>>
  ): string | null {
    for (const dom of dominators) {
      let isImmediate = true;
      const domDoms = allDominators.get(dom);
      
      if (domDoms) {
        for (const otherDom of dominators) {
          if (otherDom !== dom && domDoms.has(otherDom)) {
            isImmediate = false;
            break;
          }
        }
      }

      if (isImmediate) {
        return dom;
      }
    }

    return null;
  }

  /**
   * Check if two sets are equal
   */
  private setsEqual<T>(set1: Set<T>, set2: Set<T>): boolean {
    if (set1.size !== set2.size) {
      return false;
    }

    for (const item of set1) {
      if (!set2.has(item)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Insert phi nodes
   */
  private insertPhiNodes(ssaFunction: SSAFunction): void {
    const variableDefinitions = this.collectVariableDefinitions(ssaFunction);
    const variableUses = this.collectVariableUses(ssaFunction);

    for (const [variable, definingBlocks] of variableDefinitions) {
      const workList = new Set(definingBlocks);

      while (workList.size > 0) {
        const blockName = workList.values().next().value;
        if (!blockName) break;
        workList.delete(blockName);

        const frontier = ssaFunction.dominanceFrontiers.get(blockName);
        if (frontier) {
          for (const frontierBlock of frontier) {
            const block = ssaFunction.basicBlocks.find(b => b.name === frontierBlock);
            if (block) {
              // Check if phi node already exists
              const hasPhi = block.phiInstructions.some(
                phi => phi.operands.includes(variable)
              );

              if (!hasPhi) {
                // Insert phi node
                const phiInstruction: IRInstruction = {
                  id: `phi_${variable}_${block.name}`,
                  type: 'INSTRUCTION' as unknown,
                  instructionType: IRInstructionType.PHI,
                  operands: [variable, ...block.predecessors],
                  line: 0,
                  column: 0,
                };
                block.phiInstructions.push(phiInstruction);

                if (variableUses.has(frontierBlock)) {
                  workList.add(frontierBlock);
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Collect variable definitions
   */
  private collectVariableDefinitions(ssaFunction: SSAFunction): Map<string, Set<string>> {
    const definitions = new Map<string, Set<string>>();

    for (const block of ssaFunction.basicBlocks) {
      for (const instruction of block.instructions) {
        if (instruction.result) {
          if (!definitions.has(instruction.result)) {
            definitions.set(instruction.result, new Set());
          }
          definitions.get(instruction.result)!.add(block.name);
        }
      }
    }

    return definitions;
  }

  /**
   * Collect variable uses
   */
  private collectVariableUses(ssaFunction: SSAFunction): Map<string, Set<string>> {
    const uses = new Map<string, Set<string>>();

    for (const block of ssaFunction.basicBlocks) {
      for (const instruction of block.instructions) {
        for (const operand of instruction.operands) {
          if (typeof operand === 'string') {
            if (!uses.has(operand)) {
              uses.set(operand, new Set());
            }
            uses.get(operand)!.add(block.name);
          }
        }
      }
    }

    return uses;
  }

  /**
   * Rename variables in SSA form
   */
  private renameVariables(ssaFunction: SSAFunction): void {
    const counters = new Map<string, number>();
    const stacks = new Map<string, string[]>();

    // Initialize stacks
    for (const block of ssaFunction.basicBlocks) {
      for (const instruction of block.instructions) {
        if (instruction.result) {
          counters.set(instruction.result, 0);
          stacks.set(instruction.result, []);
        }
      }
    }

    // Rename recursively
    this.renameBlock(ssaFunction.basicBlocks[0], counters, stacks);
  }

  /**
   * Rename a block
   */
  private renameBlock(
    block: SSABlock,
    counters: Map<string, number>,
    stacks: Map<string, string[]>
  ): void {
    // Rename phi node operands
    for (const phi of block.phiInstructions) {
      if (phi.result) {
        const newName = `${phi.result}_${counters.get(phi.result)!}`;
        stacks.get(phi.result)!.push(newName);
        phi.result = newName;
      }
    }

    // Rename instructions
    for (const instruction of block.instructions) {
      // Rename operands
      for (let i = 0; i < instruction.operands.length; i++) {
        const operand = instruction.operands[i];
        if (typeof operand === 'string' && stacks.has(operand)) {
          const stack = stacks.get(operand)!;
          if (stack.length > 0) {
            instruction.operands[i] = stack[stack.length - 1];
          }
        }
      }

      // Rename result
      if (instruction.result) {
        const newName = `${instruction.result}_${counters.get(instruction.result)!}`;
        counters.set(instruction.result, counters.get(instruction.result)! + 1);
        stacks.get(instruction.result)!.push(newName);
        instruction.result = newName;
      }
    }

    // Rename successors
    for (const successorName of block.successors) {
      const successor = block.predecessors.includes(successorName) ? block : null;
      if (successor) {
        this.renameSuccessor(successor, block.name, counters, stacks);
      }
    }

    // Pop stacks
    for (const phi of block.phiInstructions) {
      if (phi.result) {
        stacks.get(phi.result)!.pop();
      }
    }

    for (const instruction of block.instructions) {
      if (instruction.result) {
        stacks.get(instruction.result)!.pop();
      }
    }
  }

  /**
   * Rename a successor block
   */
  private renameSuccessor(
    block: SSABlock,
    predecessor: string,
    counters: Map<string, number>,
    stacks: Map<string, string[]>
  ): void {
    // Rename phi nodes
    for (const phi of block.phiInstructions) {
      for (let i = 0; i < phi.operands.length; i++) {
        const operand = phi.operands[i];
        if (typeof operand === 'string' && operand === predecessor) {
          if (stacks.has(operand)) {
            const stack = stacks.get(operand)!;
            if (stack.length > 0) {
              phi.operands[i] = stack[stack.length - 1];
            }
          }
        }
      }
    }
  }
}
