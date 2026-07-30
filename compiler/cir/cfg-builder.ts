/**
 * Blueprint DSL CFG Builder
 * 
 * Builds Control Flow Graph (CFG) from IR.
 */

import { IRFunction, IRBasicBlock, IRInstructionType } from './ir-generator';

export interface CFGNode {
  id: string;
  basicBlock: IRBasicBlock;
  predecessors: Set<string>;
  successors: Set<string>;
  isEntry: boolean;
  isExit: boolean;
}

export interface CFGEdge {
  from: string;
  to: string;
  type: 'unconditional' | 'conditional' | 'fallthrough';
  condition?: string;
}

export interface ControlFlowGraph {
  nodes: Map<string, CFGNode>;
  edges: CFGEdge[];
  entryNode: string;
  exitNodes: Set<string>;
}

export class CFGBuilder {
  /**
   * Build CFG from a function
   */
  public buildCFG(irFunction: IRFunction): ControlFlowGraph {
    const cfg: ControlFlowGraph = {
      nodes: new Map(),
      edges: [],
      entryNode: irFunction.basicBlocks[0]?.name || '',
      exitNodes: new Set(),
    };

    // Create nodes
    for (const block of irFunction.basicBlocks) {
      const node: CFGNode = {
        id: block.name,
        basicBlock: block,
        predecessors: new Set(block.predecessors),
        successors: new Set(block.successors),
        isEntry: block.predecessors.length === 0,
        isExit: this.isExitBlock(block),
      };

      cfg.nodes.set(block.name, node);

      if (node.isExit) {
        cfg.exitNodes.add(block.name);
      }
    }

    // Create edges
    for (const block of irFunction.basicBlocks) {
      const lastInstruction = block.instructions[block.instructions.length - 1];

      if (lastInstruction) {
        switch (lastInstruction.instructionType) {
          case IRInstructionType.BR:
            // Unconditional branch
            if (lastInstruction.operands.length > 0) {
              const target = String(lastInstruction.operands[0]);
              cfg.edges.push({
                from: block.name,
                to: target,
                type: 'unconditional',
              });
            }
            break;

          case IRInstructionType.BR_COND:
            // Conditional branch
            if (lastInstruction.operands.length >= 3) {
              const condition = String(lastInstruction.operands[0]);
              const thenTarget = String(lastInstruction.operands[1]);
              const elseTarget = String(lastInstruction.operands[2]);

              cfg.edges.push({
                from: block.name,
                to: thenTarget,
                type: 'conditional',
                condition,
              });

              cfg.edges.push({
                from: block.name,
                to: elseTarget,
                type: 'conditional',
                condition: `!${condition}`,
              });
            }
            break;

          case IRInstructionType.RET:
            // Return - no edge
            break;

          default:
            // Fallthrough to next block
            if (block.successors.length > 0) {
              for (const successor of block.successors) {
                cfg.edges.push({
                  from: block.name,
                  to: successor,
                  type: 'fallthrough',
                });
              }
            }
            break;
        }
      }
    }

    return cfg;
  }

  /**
   * Check if a block is an exit block
   */
  private isExitBlock(block: IRBasicBlock): boolean {
    const lastInstruction = block.instructions[block.instructions.length - 1];
    return lastInstruction?.instructionType === IRInstructionType.RET;
  }

  /**
   * Get reverse postorder traversal of CFG
   */
  public getReversePostorder(cfg: ControlFlowGraph): string[] {
    const visited = new Set<string>();
    const postorder: string[] = [];

    const visit = (nodeId: string): void => {
      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);

      const node = cfg.nodes.get(nodeId);
      if (node) {
        for (const successor of node.successors) {
          visit(successor);
        }
      }

      postorder.push(nodeId);
    };

    visit(cfg.entryNode);

    return postorder.reverse();
  }

  /**
   * Get dominator tree from CFG
   */
  public getDominatorTree(cfg: ControlFlowGraph): Map<string, string> {
    const dominators = new Map<string, Set<string>>();

    // Initialize
    for (const [nodeId] of cfg.nodes) {
      if (nodeId === cfg.entryNode) {
        dominators.set(nodeId, new Set([nodeId]));
      } else {
        dominators.set(nodeId, new Set(cfg.nodes.keys()));
      }
    }

    // Iterate until convergence
    let changed = true;
    while (changed) {
      changed = false;

      for (const [nodeId, node] of cfg.nodes) {
        if (nodeId === cfg.entryNode) {
          continue;
        }

        const newDoms = new Set<string>([nodeId]);

        // Intersect predecessors' dominators
        if (node.predecessors.size > 0) {
          const firstPred = Array.from(node.predecessors)[0];
          const predDoms = dominators.get(firstPred);
          if (predDoms) {
            for (const dom of predDoms) {
              newDoms.add(dom);
            }
          }

          for (const pred of node.predecessors) {
            if (pred === firstPred) continue;
            const predDoms = dominators.get(pred);
            if (predDoms) {
              for (const dom of newDoms) {
                if (!predDoms.has(dom) && dom !== nodeId) {
                  newDoms.delete(dom);
                }
              }
            }
          }
        }

        const currentDoms = dominators.get(nodeId);
        if (currentDoms && !this.setsEqual(newDoms, currentDoms)) {
          dominators.set(nodeId, newDoms);
          changed = true;
        }
      }
    }

    // Build immediate dominator tree
    const idomTree = new Map<string, string>();
    for (const [nodeId, doms] of dominators) {
      if (nodeId === cfg.entryNode) {
        continue;
      }

      doms.delete(nodeId);
      const idom = this.findImmediateDominator(nodeId, doms, dominators);
      if (idom) {
        idomTree.set(nodeId, idom);
      }
    }

    return idomTree;
  }

  /**
   * Find immediate dominator
   */
  private findImmediateDominator(
    nodeId: string,
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
   * Get natural loops from CFG
   */
  public getNaturalLoops(cfg: ControlFlowGraph): Set<string>[] {
    const loops: Set<string>[] = [];
    const dominatorTree = this.getDominatorTree(cfg);

    for (const edge of cfg.edges) {
      if (edge.type === 'conditional' || edge.type === 'unconditional') {
        // Check if this is a back edge (target dominates source)
        const targetDoms = this.getAllDominators(edge.to, dominatorTree);
        
        if (targetDoms.has(edge.from)) {
          // This is a back edge, extract the loop
          const loop = this.extractLoop(cfg, edge.to, edge.from, dominatorTree);
          loops.push(loop);
        }
      }
    }

    return loops;
  }

  /**
   * Get all dominators of a node
   */
  private getAllDominators(nodeId: string, dominatorTree: Map<string, string>): Set<string> {
    const dominators = new Set<string>();
    let current = nodeId;

    while (dominatorTree.has(current)) {
      current = dominatorTree.get(current)!;
      dominators.add(current);
    }

    return dominators;
  }

  /**
   * Extract a natural loop
   */
  private extractLoop(
    cfg: ControlFlowGraph,
    header: string,
    backEdgeSource: string,
    dominatorTree: Map<string, string>
  ): Set<string> {
    const loop = new Set<string>();
    loop.add(header);

    const workList = [backEdgeSource];

    while (workList.length > 0) {
      const node = workList.pop()!;

      if (loop.has(node)) {
        continue;
      }

      // Check if node is dominated by header
      const nodeDoms = this.getAllDominators(node, dominatorTree);
      if (!nodeDoms.has(header)) {
        continue;
      }

      loop.add(node);

      const cfgNode = cfg.nodes.get(node);
      if (cfgNode) {
        for (const pred of cfgNode.predecessors) {
          workList.push(pred);
        }
      }
    }

    return loop;
  }

  /**
   * Validate CFG
   */
  public validateCFG(cfg: ControlFlowGraph): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check entry node exists
    if (!cfg.nodes.has(cfg.entryNode)) {
      errors.push(`Entry node ${cfg.entryNode} does not exist`);
    }

    // Check all edges have valid nodes
    for (const edge of cfg.edges) {
      if (!cfg.nodes.has(edge.from)) {
        errors.push(`Edge from non-existent node: ${edge.from}`);
      }
      if (!cfg.nodes.has(edge.to)) {
        errors.push(`Edge to non-existent node: ${edge.to}`);
      }
    }

    // Check all nodes are reachable from entry
    const reachable = this.getReachableNodes(cfg);
    for (const [nodeId] of cfg.nodes) {
      if (!reachable.has(nodeId)) {
        errors.push(`Node ${nodeId} is not reachable from entry`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get all nodes reachable from entry
   */
  private getReachableNodes(cfg: ControlFlowGraph): Set<string> {
    const reachable = new Set<string>();
    const workList = [cfg.entryNode];

    while (workList.length > 0) {
      const node = workList.pop()!;

      if (reachable.has(node)) {
        continue;
      }

      reachable.add(node);

      const cfgNode = cfg.nodes.get(node);
      if (cfgNode) {
        for (const successor of cfgNode.successors) {
          workList.push(successor);
        }
      }
    }

    return reachable;
  }
}
