/**
 * Blueprint DSL CBS Register Table
 * 
 * Defines virtual registers for the bytecode VM.
 */

export enum Register {
  // General purpose registers
  R0 = 0,
  R1 = 1,
  R2 = 2,
  R3 = 3,
  R4 = 4,
  R5 = 5,
  R6 = 6,
  R7 = 7,
  R8 = 8,
  R9 = 9,
  R10 = 10,
  R11 = 11,
  R12 = 12,
  R13 = 13,
  R14 = 14,
  R15 = 15,

  // Special purpose registers
  SP = 16,  // Stack Pointer
  FP = 17,  // Frame Pointer
  PC = 18,  // Program Counter
  SR = 19,  // Status Register
  TR = 20,  // Temporary Register

  // Cognitive registers
  CR0 = 21, // Cognitive Reasoning Register
  CR1 = 22, // Cognitive Inference Register
  CR2 = 23, // Cognitive Knowledge Register
  CR3 = 24, // Cognitive Memory Register

  // Provider registers
  PR0 = 25, // Provider Result Register
  PR1 = 26, // Provider Status Register
  PR2 = 27, // Provider Context Register

  // Debug registers
  DR0 = 28, // Debug Breakpoint Register
  DR1 = 29, // Debug Trace Register
  DR2 = 30, // Debug Profile Register,

  // Reserved registers
  RESERVED_31 = 31,
}

export interface RegisterInfo {
  register: Register;
  name: string;
  description: string;
  isGeneralPurpose: boolean;
  isSpecialPurpose: boolean;
  isCognitive: boolean;
  isProvider: boolean;
  isDebug: boolean;
  isReserved: boolean;
  isCallerSaved: boolean;
  isCalleeSaved: boolean;
}

export class RegisterTable {
  private static table: Map<Register, RegisterInfo> = new Map();
  private static generalPurpose: Register[] = [];
  private static specialPurpose: Register[] = [];
  private static callerSaved: Register[] = [];
  private static calleeSaved: Register[] = [];

  static {
    // General purpose registers (caller-saved)
    for (let i = 0; i <= 7; i++) {
      const reg = i as Register;
      this.table.set(reg, {
        register: reg,
        name: `R${i}`,
        description: `General purpose register ${i}`,
        isGeneralPurpose: true,
        isSpecialPurpose: false,
        isCognitive: false,
        isProvider: false,
        isDebug: false,
        isReserved: false,
        isCallerSaved: true,
        isCalleeSaved: false,
      });
      this.generalPurpose.push(reg);
      this.callerSaved.push(reg);
    }

    // General purpose registers (callee-saved)
    for (let i = 8; i <= 15; i++) {
      const reg = i as Register;
      this.table.set(reg, {
        register: reg,
        name: `R${i}`,
        description: `General purpose register ${i}`,
        isGeneralPurpose: true,
        isSpecialPurpose: false,
        isCognitive: false,
        isProvider: false,
        isDebug: false,
        isReserved: false,
        isCallerSaved: false,
        isCalleeSaved: true,
      });
      this.generalPurpose.push(reg);
      this.calleeSaved.push(reg);
    }

    // Special purpose registers
    this.table.set(Register.SP, {
      register: Register.SP,
      name: 'SP',
      description: 'Stack Pointer',
      isGeneralPurpose: false,
      isSpecialPurpose: true,
      isCognitive: false,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });
    this.specialPurpose.push(Register.SP);

    this.table.set(Register.FP, {
      register: Register.FP,
      name: 'FP',
      description: 'Frame Pointer',
      isGeneralPurpose: false,
      isSpecialPurpose: true,
      isCognitive: false,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });
    this.specialPurpose.push(Register.FP);

    this.table.set(Register.PC, {
      register: Register.PC,
      name: 'PC',
      description: 'Program Counter',
      isGeneralPurpose: false,
      isSpecialPurpose: true,
      isCognitive: false,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });
    this.specialPurpose.push(Register.PC);

    this.table.set(Register.SR, {
      register: Register.SR,
      name: 'SR',
      description: 'Status Register',
      isGeneralPurpose: false,
      isSpecialPurpose: true,
      isCognitive: false,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });
    this.specialPurpose.push(Register.SR);

    this.table.set(Register.TR, {
      register: Register.TR,
      name: 'TR',
      description: 'Temporary Register',
      isGeneralPurpose: false,
      isSpecialPurpose: true,
      isCognitive: false,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });
    this.specialPurpose.push(Register.TR);

    // Cognitive registers
    this.table.set(Register.CR0, {
      register: Register.CR0,
      name: 'CR0',
      description: 'Cognitive Reasoning Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: true,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    this.table.set(Register.CR1, {
      register: Register.CR1,
      name: 'CR1',
      description: 'Cognitive Inference Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: true,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    this.table.set(Register.CR2, {
      register: Register.CR2,
      name: 'CR2',
      description: 'Cognitive Knowledge Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: true,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    this.table.set(Register.CR3, {
      register: Register.CR3,
      name: 'CR3',
      description: 'Cognitive Memory Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: true,
      isProvider: false,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    // Provider registers
    this.table.set(Register.PR0, {
      register: Register.PR0,
      name: 'PR0',
      description: 'Provider Result Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: true,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    this.table.set(Register.PR1, {
      register: Register.PR1,
      name: 'PR1',
      description: 'Provider Status Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: true,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    this.table.set(Register.PR2, {
      register: Register.PR2,
      name: 'PR2',
      description: 'Provider Context Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: true,
      isDebug: false,
      isReserved: false,
      isCallerSaved: true,
      isCalleeSaved: false,
    });

    // Debug registers
    this.table.set(Register.DR0, {
      register: Register.DR0,
      name: 'DR0',
      description: 'Debug Breakpoint Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: false,
      isDebug: true,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });

    this.table.set(Register.DR1, {
      register: Register.DR1,
      name: 'DR1',
      description: 'Debug Trace Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: false,
      isDebug: true,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });

    this.table.set(Register.DR2, {
      register: Register.DR2,
      name: 'DR2',
      description: 'Debug Profile Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: false,
      isDebug: true,
      isReserved: false,
      isCallerSaved: false,
      isCalleeSaved: false,
    });

    // Reserved register
    this.table.set(Register.RESERVED_31, {
      register: Register.RESERVED_31,
      name: 'RESERVED_31',
      description: 'Reserved Register',
      isGeneralPurpose: false,
      isSpecialPurpose: false,
      isCognitive: false,
      isProvider: false,
      isDebug: false,
      isReserved: true,
      isCallerSaved: false,
      isCalleeSaved: false,
    });
  }

  /**
   * Get register info
   */
  public static getInfo(register: Register): RegisterInfo | undefined {
    return this.table.get(register);
  }

  /**
   * Get register by name
   */
  public static getByName(name: string): Register | undefined {
    for (const [reg, info] of this.table) {
      if (info.name === name) {
        return reg;
      }
    }
    return undefined;
  }

  /**
   * Check if register is general purpose
   */
  public static isGeneralPurpose(register: Register): boolean {
    const info = this.table.get(register);
    return info ? info.isGeneralPurpose : false;
  }

  /**
   * Check if register is special purpose
   */
  public static isSpecialPurpose(register: Register): boolean {
    const info = this.table.get(register);
    return info ? info.isSpecialPurpose : false;
  }

  /**
   * Check if register is caller-saved
   */
  public static isCallerSaved(register: Register): boolean {
    const info = this.table.get(register);
    return info ? info.isCallerSaved : false;
  }

  /**
   * Check if register is callee-saved
   */
  public static isCalleeSaved(register: Register): boolean {
    const info = this.table.get(register);
    return info ? info.isCalleeSaved : false;
  }

  /**
   * Get general purpose registers
   */
  public static getGeneralPurpose(): Register[] {
    return [...this.generalPurpose];
  }

  /**
   * Get special purpose registers
   */
  public static getSpecialPurpose(): Register[] {
    return [...this.specialPurpose];
  }

  /**
   * Get caller-saved registers
   */
  public static getCallerSaved(): Register[] {
    return [...this.callerSaved];
  }

  /**
   * Get callee-saved registers
   */
  public static getCalleeSaved(): Register[] {
    return [...this.calleeSaved];
  }

  /**
   * Get all registers
   */
  public static getAllRegisters(): Register[] {
    return Array.from(this.table.keys());
  }

  /**
   * Get register count
   */
  public static getRegisterCount(): number {
    return this.table.size;
  }
}
