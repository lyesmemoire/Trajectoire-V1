/**
 * Blueprint DSL CBS Heap
 * 
 * Manages heap memory allocation and garbage collection.
 */

export interface HeapBlock {
  id: number;
  address: number;
  size: number;
  allocated: boolean;
  data: Uint8Array;
}

export interface AllocationResult {
  address: number;
  size: number;
}

export class Heap {
  private blocks: HeapBlock[] = [];
  private blockSize: number = 4096;
  private maxBlocks: number = 1024;
  private blockCounter: number = 0;
  private freeBlocks: number[] = [];

  /**
   * Allocate memory block
   */
  public allocate(size: number): AllocationResult {
    const requiredBlocks = Math.ceil(size / this.blockSize);
    const address = this.findFreeBlocks(requiredBlocks);

    if (address === -1) {
      throw new Error('Out of memory');
    }

    this.markBlocksAllocated(address, requiredBlocks, size);

    return {
      address,
      size,
    };
  }

  /**
   * Free memory block
   */
  public free(address: number): void {
    const blockIndex = this.blocks.findIndex(b => b.address === address && b.allocated);

    if (blockIndex === -1) {
      throw new Error('Invalid address');
    }

    this.blocks[blockIndex].allocated = false;
    this.freeBlocks.push(blockIndex);
  }

  /**
   * Read from heap
   */
  public read(address: number, size: number): Uint8Array {
    const block = this.findBlock(address);
    if (!block || !block.allocated) {
      throw new Error('Invalid address or unallocated block');
    }

    const offset = address - block.address;
    if (offset + size > block.size) {
      throw new Error('Read exceeds block size');
    }

    return block.data.slice(offset, offset + size);
  }

  /**
   * Write to heap
   */
  public write(address: number, data: Uint8Array): void {
    const block = this.findBlock(address);
    if (!block || !block.allocated) {
      throw new Error('Invalid address or unallocated block');
    }

    const offset = address - block.address;
    if (offset + data.length > block.size) {
      throw new Error('Write exceeds block size');
    }

    block.data.set(data, offset);
  }

  /**
   * Find block by address
   */
  private findBlock(address: number): HeapBlock | null {
    return this.blocks.find(b => address >= b.address && address < b.address + b.size) || null;
  }

  /**
   * Find free blocks
   */
  private findFreeBlocks(requiredBlocks: number): number {
    // Try to reuse freed blocks
    for (const blockIndex of this.freeBlocks) {
      const block = this.blocks[blockIndex];
      if (!block.allocated && block.size >= requiredBlocks * this.blockSize) {
        this.freeBlocks = this.freeBlocks.filter(i => i !== blockIndex);
        return block.address;
      }
    }

    // Allocate new blocks
    if (this.blocks.length + requiredBlocks > this.maxBlocks) {
      return -1;
    }

    const address = this.blocks.length * this.blockSize;
    return address;
  }

  /**
   * Mark blocks as allocated
   */
  private markBlocksAllocated(address: number, blockCount: number, size: number): void {
    const block: HeapBlock = {
      id: this.blockCounter++,
      address,
      size: blockCount * this.blockSize,
      allocated: true,
      data: new Uint8Array(blockCount * this.blockSize),
    };

    this.blocks.push(block);
  }

  /**
   * Get heap statistics
   */
  public getStatistics(): {
    totalBlocks: number;
    allocatedBlocks: number;
    freeBlocks: number;
    totalSize: number;
    allocatedSize: number;
    freeSize: number;
    utilization: number;
  } {
    const allocatedBlocks = this.blocks.filter(b => b.allocated).length;
    const freeBlocks = this.blocks.length - allocatedBlocks;
    const totalSize = this.blocks.length * this.blockSize;
    const allocatedSize = allocatedBlocks * this.blockSize;
    const freeSize = freeBlocks * this.blockSize;

    return {
      totalBlocks: this.blocks.length,
      allocatedBlocks,
      freeBlocks,
      totalSize,
      allocatedSize,
      freeSize,
      utilization: totalSize > 0 ? allocatedSize / totalSize : 0,
    };
  }

  /**
   * Clear heap
   */
  public clear(): void {
    this.blocks = [];
    this.blockCounter = 0;
    this.freeBlocks = [];
  }

  /**
   * Compact heap (move allocated blocks together)
   */
  public compact(): void {
    const allocated = this.blocks.filter(b => b.allocated);
    let currentAddress = 0;

    for (const block of allocated) {
      const oldAddress = block.address;
      block.address = currentAddress;
      currentAddress += block.size;
    }

    this.blocks = allocated;
    this.freeBlocks = [];
  }

  /**
   * Validate heap state
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const block of this.blocks) {
      if (block.address < 0) {
        errors.push(`Block ${block.id} has invalid address`);
      }

      if (block.size <= 0) {
        errors.push(`Block ${block.id} has invalid size`);
      }

      if (block.data.length !== block.size) {
        errors.push(`Block ${block.id} data size mismatch`);
      }
    }

    // Check for overlapping blocks
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = i + 1; j < this.blocks.length; j++) {
        const b1 = this.blocks[i];
        const b2 = this.blocks[j];

        if (this.blocksOverlap(b1, b2)) {
          errors.push(`Blocks ${b1.id} and ${b2.id} overlap`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if two blocks overlap
   */
  private blocksOverlap(b1: HeapBlock, b2: HeapBlock): boolean {
    return !(b1.address + b1.size <= b2.address || b2.address + b2.size <= b1.address);
  }

  /**
   * Set block size
   */
  public setBlockSize(size: number): void {
    if (this.blocks.length > 0) {
      throw new Error('Cannot change block size while blocks are allocated');
    }

    this.blockSize = size;
  }

  /**
   * Set max blocks
   */
  public setMaxBlocks(max: number): void {
    this.maxBlocks = max;
  }

  /**
   * Get block size
   */
  public getBlockSize(): number {
    return this.blockSize;
  }

  /**
   * Get max blocks
   */
  public getMaxBlocks(): number {
    return this.maxBlocks;
  }

  /**
   * Get all blocks
   */
  public getAllBlocks(): HeapBlock[] {
    return [...this.blocks];
  }

  /**
   * Get allocated blocks
   */
  public getAllocatedBlocks(): HeapBlock[] {
    return this.blocks.filter(b => b.allocated);
  }

  /**
   * Get free blocks
   */
  public getFreeBlocks(): HeapBlock[] {
    return this.blocks.filter(b => !b.allocated);
  }
}
