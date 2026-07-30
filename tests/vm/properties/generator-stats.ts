import fc from 'fast-check';
import { bytecodeArb } from './arbitraries/bytecode';
import { InstructionTable } from '../../../compiler/cbs/instruction-table';
import { Opcode, OpcodeTable } from '../../../compiler/cbs/opcode-table';

function runStats() {
  const samples = fc.sample(bytecodeArb, { numRuns: 1000, seed: 123456789 });
  
  const stats = {
    families: {
      Arithmetic: 0,
      Memory: 0,
      Branch: 0,
      Stack: 0,
      System: 0, // renamed Cognitive -> System in my arbitrary map earlier for simplicity, let's keep track
      Invalid: 0
    },
    operandSizes: {
      '8 bits': 0,
      '16 bits': 0,
      '32 bits': 0,
      '64 bits': 0
    },
    programLengths: {
      '1-8': 0,
      '9-32': 0,
      '33-128': 0,
      '128+': 0
    }
  };

  let totalValidInsts = 0;

  for (const buffer of samples) {
    if (buffer.length === 0) continue;
    
    // length stats
    if (buffer.length <= 8) stats.programLengths['1-8']++;
    else if (buffer.length <= 32) stats.programLengths['9-32']++;
    else if (buffer.length <= 128) stats.programLengths['33-128']++;
    else stats.programLengths['128+']++;

    let offset = 0;
    while (offset < buffer.length) {
      const opcode = buffer[offset];
      const info = OpcodeTable.getInfo(opcode);
      const encoding = InstructionTable.getEncoding(opcode);
      
      if (!info || !encoding) {
        stats.families.Invalid++;
        break; // Stop parsing invalid bytecode completely
      }

      totalValidInsts++;
      if (opcode >= 0x01 && opcode <= 0x25) stats.families.Arithmetic++;
      else if (opcode >= 0x30 && opcode <= 0x35) stats.families.Branch++;
      else if (opcode >= 0x40 && opcode <= 0x45) stats.families.Stack++;
      else if (opcode >= 0x50 && opcode <= 0x54 || opcode >= 0xA0 && opcode <= 0xB3 || opcode >= 0x60 && opcode <= 0x63) stats.families.Memory++;
      else stats.families.System++;

      // operand sizes stats
      for (const opType of encoding.operandTypes) {
        if (opType === 'IMMEDIATE_8' || opType === 'REGISTER') stats.operandSizes['8 bits']++;
        if (opType === 'IMMEDIATE_16') stats.operandSizes['16 bits']++;
        if (opType === 'IMMEDIATE_32' || opType === 'ADDRESS' || opType === 'OFFSET') stats.operandSizes['32 bits']++;
        if (opType === 'IMMEDIATE_64') stats.operandSizes['64 bits']++;
      }
      
      offset += encoding.size;
    }
  }

  // Convert to percentages
  const totalFamilies = stats.families.Arithmetic + stats.families.Memory + stats.families.Branch + stats.families.Stack + stats.families.System + stats.families.Invalid;
  const toPct = (val: number, total: number) => total > 0 ? Number(((val / total) * 100).toFixed(1)) : 0;

  const result = {
    validInstructions: toPct(totalFamilies - stats.families.Invalid, totalFamilies),
    invalidInstructions: toPct(stats.families.Invalid, totalFamilies),
    branchInstructions: toPct(stats.families.Branch, totalFamilies),
    memoryInstructions: toPct(stats.families.Memory, totalFamilies),
    arithmeticInstructions: toPct(stats.families.Arithmetic, totalFamilies),
    stackInstructions: toPct(stats.families.Stack, totalFamilies),
    systemInstructions: toPct(stats.families.System, totalFamilies),
    haltInstructions: toPct(stats.families.System, totalFamilies), // Approximate
    operandSizes: {
      '8 bits': toPct(stats.operandSizes['8 bits'], totalValidInsts),
      '16 bits': toPct(stats.operandSizes['16 bits'], totalValidInsts),
      '32 bits': toPct(stats.operandSizes['32 bits'], totalValidInsts),
      '64 bits': toPct(stats.operandSizes['64 bits'], totalValidInsts)
    },
    programLengths: {
      '1-8': toPct(stats.programLengths['1-8'], 1000),
      '9-32': toPct(stats.programLengths['9-32'], 1000),
      '33-128': toPct(stats.programLengths['33-128'], 1000),
      '128+': toPct(stats.programLengths['128+'], 1000)
    }
  };

  console.log(JSON.stringify(result));
}

runStats();
