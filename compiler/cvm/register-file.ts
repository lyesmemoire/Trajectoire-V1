/**
 * Blueprint DSL CVM Register File
 * 
 * Manages the register file for the virtual machine.
 */

import { Register, RegisterTable } from '../cbs/register-table';

export interface RegisterFileOptions {
  size?: number;
}

export class RegisterFile {
  private registers: Map<Register, number>;
  private dirty: Set<Register> = new Set();

  constructor(options: RegisterFileOptions = {}) {
    this.registers = this.initializeRegisters();
  }

  /**
   * Initialize registers
   */
  private initializeRegisters(): Map<Register, number> {
    const registers = new Map<Register, number>();

    for (const register of RegisterTable.getAllRegisters()) {
      registers.set(register, 0);
    }

    return registers;
  }

  /**
   * Get register value
   */
  public get(register: Register): number {
    return this.registers.get(register) || 0;
  }

  /**
   * Set register value
   */
  public set(register: Register, value: number): void {
    this.registers.set(register, value);
    this.dirty.add(register);
  }

  /**
   * Get multiple register values
   */
  public getMultiple(registers: Register[]): Map<Register, number> {
    const result = new Map<Register, number>();

    for (const register of registers) {
      result.set(register, this.get(register));
    }

    return result;
  }

  /**
   * Set multiple register values
   */
  public setMultiple(values: Map<Register, number>): void {
    for (const [register, value] of values) {
      this.set(register, value);
    }
  }

  /**
   * Check if register is dirty
   */
  public isDirty(register: Register): boolean {
    return this.dirty.has(register);
  }

  /**
   * Get all dirty registers
   */
  public getDirtyRegisters(): Register[] {
    return Array.from(this.dirty);
  }

  /**
   * Clear dirty flag for register
   */
  public clearDirty(register: Register): void {
    this.dirty.delete(register);
  }

  /**
   * Clear all dirty flags
   */
  public clearAllDirty(): void {
    this.dirty.clear();
  }

  /**
   * Get all registers
   */
  public getAll(): Map<Register, number> {
    return new Map(this.registers);
  }

  /**
   * Reset all registers
   */
  public reset(): void {
    for (const register of RegisterTable.getAllRegisters()) {
      this.registers.set(register, 0);
    }
    this.dirty.clear();
  }

  /**
   * Get general purpose registers
   */
  public getGeneralPurpose(): Map<Register, number> {
    const result = new Map<Register, number>();

    for (const register of RegisterTable.getGeneralPurpose()) {
      result.set(register, this.get(register));
    }

    return result;
  }

  /**
   * Get special purpose registers
   */
  public getSpecialPurpose(): Map<Register, number> {
    const result = new Map<Register, number>();

    for (const register of RegisterTable.getSpecialPurpose()) {
      result.set(register, this.get(register));
    }

    return result;
  }

  /**
   * Get caller-saved registers
   */
  public getCallerSaved(): Map<Register, number> {
    const result = new Map<Register, number>();

    for (const register of RegisterTable.getCallerSaved()) {
      result.set(register, this.get(register));
    }

    return result;
  }

  /**
   * Get callee-saved registers
   */
  public getCalleeSaved(): Map<Register, number> {
    const result = new Map<Register, number>();

    for (const register of RegisterTable.getCalleeSaved()) {
      result.set(register, this.get(register));
    }

    return result;
  }

  /**
   * Save callee-saved registers
   */
  public saveCalleeSaved(): Map<Register, number> {
    return this.getCalleeSaved();
  }

  /**
   * Restore callee-saved registers
   */
  public restoreCalleeSaved(values: Map<Register, number>): void {
    for (const [register, value] of values) {
      if (RegisterTable.isCalleeSaved(register)) {
        this.set(register, value);
      }
    }
  }

  /**
   * Validate register file
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [register, value] of this.registers) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors.push(`Register ${register} has invalid value`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalRegisters: number;
    dirtyRegisters: number;
    zeroRegisters: number;
  } {
    let zeroCount = 0;

    for (const value of this.registers.values()) {
      if (value === 0) {
        zeroCount++;
      }
    }

    return {
      totalRegisters: this.registers.size,
      dirtyRegisters: this.dirty.size,
      zeroRegisters: zeroCount,
    };
  }
}
