/**
 * Blueprint DSL CBS Memory Addressing
 * 
 * Manages memory addressing modes for bytecode.
 */

export enum AddressingMode {
  IMMEDIATE = 'IMMEDIATE',
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
  REGISTER_DIRECT = 'REGISTER_DIRECT',
  REGISTER_INDIRECT = 'REGISTER_INDIRECT',
  REGISTER_INDIRECT_OFFSET = 'REGISTER_INDIRECT_OFFSET',
  REGISTER_INDIRECT_INDEXED = 'REGISTER_INDIRECT_INDEXED',
  BASE_PLUS_OFFSET = 'BASE_PLUS_OFFSET',
  PC_RELATIVE = 'PC_RELATIVE',
}

export interface Address {
  mode: AddressingMode;
  base?: number;
  offset?: number;
  index?: number;
  scale?: number;
}

export interface MemoryRegion {
  start: number;
  end: number;
  name: string;
  permissions: MemoryPermissions;
}

export enum MemoryPermissions {
  READ = 'READ',
  WRITE = 'WRITE',
  EXECUTE = 'EXECUTE',
  READ_WRITE = 'READ_WRITE',
  READ_EXECUTE = 'READ_EXECUTE',
  READ_WRITE_EXECUTE = 'READ_WRITE_EXECUTE',
}

export class MemoryAddressing {
  private regions: MemoryRegion[] = [];

  /**
   * Calculate effective address
   */
  public static calculateEffectiveAddress(address: Address, registers: Map<number, number>, pc: number): number {
    switch (address.mode) {
      case AddressingMode.IMMEDIATE:
        return address.base || 0;

      case AddressingMode.DIRECT:
        return address.base || 0;

      case AddressingMode.INDIRECT:
        return address.base || 0;

      case AddressingMode.REGISTER_DIRECT: {
const regValue = registers.get(address.base || 0) || 0;
        return regValue;
      }case AddressingMode.REGISTER_INDIRECT: {
const regIndirect = registers.get(address.base || 0) || 0;
        return regIndirect;
      }case AddressingMode.REGISTER_INDIRECT_OFFSET: {
const regOffset = registers.get(address.base || 0) || 0;
        return regOffset + (address.offset || 0);
      }case AddressingMode.REGISTER_INDIRECT_INDEXED: {
const regIndex = registers.get(address.base || 0) || 0;
        const idxValue = registers.get(address.index || 0) || 0;
        const scale = address.scale || 1;
        return regIndex + (idxValue * scale);
      }case AddressingMode.BASE_PLUS_OFFSET:
        return (address.base || 0) + (address.offset || 0);

      case AddressingMode.PC_RELATIVE:
        return pc + (address.offset || 0);

      default:
        throw new Error(`Unknown addressing mode: ${address.mode}`);
    }
  }

  /**
   * Parse address from operands
   */
  public static parseAddress(operands: number[], mode: AddressingMode): Address {
    const address: Address = { mode };

    switch (mode) {
      case AddressingMode.IMMEDIATE:
        address.base = operands[0];
        break;

      case AddressingMode.DIRECT:
        address.base = operands[0];
        break;

      case AddressingMode.INDIRECT:
        address.base = operands[0];
        break;

      case AddressingMode.REGISTER_DIRECT:
        address.base = operands[0];
        break;

      case AddressingMode.REGISTER_INDIRECT:
        address.base = operands[0];
        break;

      case AddressingMode.REGISTER_INDIRECT_OFFSET:
        address.base = operands[0];
        address.offset = operands[1];
        break;

      case AddressingMode.REGISTER_INDIRECT_INDEXED:
        address.base = operands[0];
        address.index = operands[1];
        address.scale = operands[2];
        break;

      case AddressingMode.BASE_PLUS_OFFSET:
        address.base = operands[0];
        address.offset = operands[1];
        break;

      case AddressingMode.PC_RELATIVE:
        address.offset = operands[0];
        break;
    }

    return address;
  }

  /**
   * Add memory region
   */
  public addRegion(region: MemoryRegion): void {
    this.validateRegion(region);
    this.regions.push(region);
    this.sortRegions();
  }

  /**
   * Remove memory region
   */
  public removeRegion(name: string): void {
    this.regions = this.regions.filter(r => r.name !== name);
  }

  /**
   * Get region by address
   */
  public getRegionByAddress(address: number): MemoryRegion | null {
    for (const region of this.regions) {
      if (address >= region.start && address < region.end) {
        return region;
      }
    }
    return null;
  }

  /**
   * Get region by name
   */
  public getRegionByName(name: string): MemoryRegion | null {
    return this.regions.find(r => r.name === name) || null;
  }

  /**
   * Check if address is accessible with given permissions
   */
  public isAccessible(address: number, permission: MemoryPermissions): boolean {
    const region = this.getRegionByAddress(address);
    if (!region) {
      return false;
    }

    return this.hasPermission(region.permissions, permission);
  }

  /**
   * Check if region has permission
   */
  private hasPermission(region: MemoryPermissions, required: MemoryPermissions): boolean {
    if (region === required) {
      return true;
    }

    if (region === MemoryPermissions.READ_WRITE_EXECUTE) {
      return true;
    }

    if (region === MemoryPermissions.READ_WRITE && required !== MemoryPermissions.EXECUTE) {
      return true;
    }

    if (region === MemoryPermissions.READ_EXECUTE && required !== MemoryPermissions.WRITE) {
      return true;
    }

    if (region === MemoryPermissions.READ && required === MemoryPermissions.READ) {
      return true;
    }

    if (region === MemoryPermissions.WRITE && required === MemoryPermissions.WRITE) {
      return true;
    }

    if (region === MemoryPermissions.EXECUTE && required === MemoryPermissions.EXECUTE) {
      return true;
    }

    return false;
  }

  /**
   * Validate memory region
   */
  private validateRegion(region: MemoryRegion): void {
    if (region.start < 0) {
      throw new Error('Region start must be non-negative');
    }

    if (region.end <= region.start) {
      throw new Error('Region end must be greater than start');
    }

    // Check for overlapping regions
    for (const existing of this.regions) {
      if (this.regionsOverlap(region, existing)) {
        throw new Error('Region overlaps with existing region');
      }
    }
  }

  /**
   * Check if two regions overlap
   */
  private regionsOverlap(r1: MemoryRegion, r2: MemoryRegion): boolean {
    return !(r1.end <= r2.start || r1.start >= r2.end);
  }

  /**
   * Sort regions by start address
   */
  private sortRegions(): void {
    this.regions.sort((a, b) => a.start - b.start);
  }

  /**
   * Get all regions
   */
  public getAllRegions(): MemoryRegion[] {
    return [...this.regions];
  }

  /**
   * Clear all regions
   */
  public clear(): void {
    this.regions = [];
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    regionCount: number;
    totalSize: number;
    averageSize: number;
  } {
    if (this.regions.length === 0) {
      return {
        regionCount: 0,
        totalSize: 0,
        averageSize: 0,
      };
    }

    const totalSize = this.regions.reduce(
      (sum, r) => sum + (r.end - r.start),
      0
    );

    return {
      regionCount: this.regions.length,
      totalSize,
      averageSize: totalSize / this.regions.length,
    };
  }

  /**
   * Allocate memory region
   */
  public allocate(size: number, permissions: MemoryPermissions, name: string): number {
    if (this.regions.length === 0) {
      const start = 0;
      const region: MemoryRegion = {
        start,
        end: start + size,
        name,
        permissions,
      };
      this.addRegion(region);
      return start;
    }

    // Find free space after last region
    const lastRegion = this.regions[this.regions.length - 1];
    const start = lastRegion.end;
    const region: MemoryRegion = {
      start,
      end: start + size,
      name,
      permissions,
    };
    this.addRegion(region);
    return start;
  }

  /**
   * Free memory region
   */
  public free(name: string): void {
    this.removeRegion(name);
  }
}
