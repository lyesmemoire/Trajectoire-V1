const fs = require('fs');

// Mutations manuelles ciblées pour éviter les timeouts
const manualMutations = {
  'execution-context': [
    {
      type: 'F',
      line: 73,
      description: 'Return 1 instead of 0 in getRegister when register not found',
      original: 'return this.registers.get(register) || 0;',
      mutation: 'return this.registers.get(register) || 1;'
    },
    {
      type: 'G',
      line: 206,
      description: 'Invert comparator in validate (programCounter < 0)',
      original: 'if (this.programCounter < 0) {',
      mutation: 'if (this.programCounter >= 0) {'
    },
    {
      type: 'F',
      line: 211,
      description: 'Invert validation result (errors.length === 0)',
      original: 'valid: errors.length === 0,',
      mutation: 'valid: errors.length !== 0,'
    },
    {
      type: 'I',
      line: 87,
      description: 'Return wrong program counter',
      original: 'return this.programCounter;',
      mutation: 'return this.programCounter + 1;'
    },
    {
      type: 'A',
      line: 114,
      description: 'Invert halt condition',
      original: 'this.halted = true;',
      mutation: 'this.halted = false;'
    }
  ],
  'memory-manager': [
    {
      type: 'G',
      line: 145,
      description: 'Invert comparator in updateUsage',
      original: 'if (this.statistics.currentUsage > this.peakUsage) {',
      mutation: 'if (this.statistics.currentUsage <= this.peakUsage) {'
    },
    {
      type: 'F',
      line: 162,
      description: 'Return 1 instead of 0 in getAllocationSize',
      original: 'return this.allocations.get(address) || 0;',
      mutation: 'return this.allocations.get(address) || 1;'
    },
    {
      type: 'A',
      line: 251,
      description: 'Invert enableProtection',
      original: 'this.options.enableProtection = true;',
      mutation: 'this.options.enableProtection = false;'
    },
    {
      type: 'G',
      line: 336,
      description: 'Invert comparator in validate',
      original: 'if (this.statistics.currentUsage > this.options.maxMemory!) {',
      mutation: 'if (this.statistics.currentUsage <= this.options.maxMemory!) {'
    },
    {
      type: 'F',
      line: 316,
      description: 'Invert validation check (totalAllocated < 0)',
      original: 'if (this.statistics.totalAllocated < 0) {',
      mutation: 'if (this.statistics.totalAllocated >= 0) {'
    }
  ],
  'instruction-cache': [
    {
      type: 'G',
      line: 92,
      description: 'Invert comparator in evictIfNeeded',
      original: 'if (this.cache.size <= this.maxSize) {',
      mutation: 'if (this.cache.size > this.maxSize) {'
    },
    {
      type: 'F',
      line: 194,
      description: 'Invert hitRate calculation',
      original: 'this.statistics.hitRate = this.statistics.hits / total;',
      mutation: 'this.statistics.hitRate = this.statistics.misses / total;'
    },
    {
      type: 'A',
      line: 147,
      description: 'Invert prefetch condition',
      original: 'if (this.cache.has(address)) {',
      mutation: 'if (!this.cache.has(address)) {'
    },
    {
      type: 'G',
      line: 254,
      description: 'Invert comparator in validate',
      original: 'if (this.cache.size > this.maxSize) {',
      mutation: 'if (this.cache.size <= this.maxSize) {'
    },
    {
      type: 'F',
      line: 268,
      description: 'Invert utilization calculation',
      original: 'return this.cache.size / this.maxSize;',
      mutation: 'return (this.cache.size + 1) / this.maxSize;'
    }
  ],
  'instruction-fetch': [
    {
      type: 'A',
      line: 39,
      description: 'Invert cache condition',
      original: 'if (this.cacheEnabled && this.cache.has(address)) {',
      mutation: 'if (this.cacheEnabled && !this.cache.has(address)) {'
    },
    {
      type: 'G',
      line: 117,
      description: 'Invert comparator in evictIfNeeded',
      original: 'if (this.cache.size <= this.cacheSize) {',
      mutation: 'if (this.cache.size > this.cacheSize) {'
    },
    {
      type: 'F',
      line: 148,
      description: 'Invert hitRate calculation',
      original: 'const hitRate = total > 0 ? this.cacheHits / total : 0;',
      mutation: 'const hitRate = total > 0 ? this.cacheMisses / total : 0;'
    },
    {
      type: 'A',
      line: 169,
      description: 'Invert disableCache',
      original: 'this.cacheEnabled = false;',
      mutation: 'this.cacheEnabled = true;'
    },
    {
      type: 'G',
      line: 201,
      description: 'Invert comparator in validateAddress',
      original: 'return address >= 0 && address < this.bytecode.length;',
      mutation: 'return address >= 0 && address >= this.bytecode.length;'
    }
  ],
  'instruction-decode': [
    {
      type: 'C',
      line: 30,
      description: 'Remove throw for unknown opcode',
      original: 'throw new Error(`Unknown opcode: ${opcode}`);',
      mutation: '// throw removed'
    },
    {
      type: 'F',
      line: 71,
      description: 'Invert operand count comparison',
      original: 'if (instruction.operands.length !== encoding.operandTypes.length) {',
      mutation: 'if (instruction.operands.length === encoding.operandTypes.length) {'
    },
    {
      type: 'A',
      line: 60,
      description: 'Invert opcodeInfo condition',
      original: 'if (!opcodeInfo) {',
      mutation: 'if (opcodeInfo) {'
    },
    {
      type: 'F',
      line: 78,
      description: 'Invert validation result',
      original: 'valid: errors.length === 0,',
      mutation: 'valid: errors.length !== 0,'
    },
    {
      type: 'I',
      line: 87,
      description: 'Return wrong size',
      original: 'return InstructionTable.getSize(instruction.opcode as Opcode);',
      mutation: 'return InstructionTable.getSize(instruction.opcode as Opcode) + 1;'
    }
  ],
  'instruction-execute': [
    {
      type: 'G',
      line: 146,
      description: 'Invert division by zero check',
      original: 'if (b === 0) {',
      mutation: 'if (b !== 0) {'
    },
    {
      type: 'G',
      line: 162,
      description: 'Invert modulo by zero check',
      original: 'if (b === 0) {',
      mutation: 'if (b !== 0) {'
    },
    {
      type: 'F',
      line: 150,
      description: 'Invert division result',
      original: 'stack.push(Math.floor(a / b));',
      mutation: 'stack.push(Math.floor(a / b) + 1);'
    },
    {
      type: 'A',
      line: 299,
      description: 'Invert JZ condition',
      original: 'if (value === 0) {',
      mutation: 'if (value !== 0) {'
    },
    {
      type: 'A',
      line: 315,
      description: 'Invert JNZ condition',
      original: 'if (value !== 0) {',
      mutation: 'if (value === 0) {'
    }
  ],
  'rollback-manager': [
    {
      type: 'A',
      line: 70,
      description: 'Invert snapshot existence check',
      original: 'if (!snapshot) {',
      mutation: 'if (snapshot) {'
    },
    {
      type: 'G',
      line: 145,
      description: 'Invert comparator in evictIfNeeded',
      original: 'if (this.snapshots.size <= this.options.maxSnapshots!) {',
      mutation: 'if (this.snapshots.size > this.options.maxSnapshots!) {'
    },
    {
      type: 'F',
      line: 282,
      description: 'Invert utilization calculation',
      original: 'utilization: this.snapshots.size / this.options.maxSnapshots!,',
      mutation: 'utilization: (this.snapshots.size + 1) / this.options.maxSnapshots!,'
    },
    {
      type: 'A',
      line: 169,
      description: 'Invert autoSnapshot condition',
      original: 'if (!this.options.autoSnapshot) {',
      mutation: 'if (this.options.autoSnapshot) {'
    },
    {
      type: 'F',
      line: 261,
      description: 'Invert validation result',
      original: 'valid: errors.length === 0,',
      mutation: 'valid: errors.length !== 0,'
    }
  ],
  'thread-manager': [
    {
      type: 'G',
      line: 55,
      description: 'Invert max threads check',
      original: 'if (this.threads.size >= this.options.maxThreads!) {',
      mutation: 'if (this.threads.size < this.options.maxThreads!) {'
    },
    {
      type: 'A',
      line: 94,
      description: 'Invert thread existence check',
      original: 'if (thread) {',
      mutation: 'if (!thread) {'
    },
    {
      type: 'G',
      line: 113,
      description: 'Invert priority comparison',
      original: 'nextThread = readyThreads.sort((a, b) => b.priority - a.priority)[0];',
      mutation: 'nextThread = readyThreads.sort((a, b) => a.priority - b.priority)[0];'
    },
    {
      type: 'A',
      line: 165,
      description: 'Invert unblock condition',
      original: 'if (thread && thread.state === ThreadState.BLOCKED) {',
      mutation: 'if (thread && thread.state !== ThreadState.BLOCKED) {'
    },
    {
      type: 'F',
      line: 272,
      description: 'Invert priority validation',
      original: 'if (thread.priority < 0) {',
      mutation: 'if (thread.priority >= 0) {'
    }
  ],
  'execution-pipeline': [
    {
      type: 'A',
      line: 57,
      description: 'Invert halted condition',
      original: 'if (this.context.isHalted()) {',
      mutation: 'if (!this.context.isHalted()) {'
    },
    {
      type: 'G',
      line: 77,
      description: 'Invert branchTaken check',
      original: 'if (result.branchTaken) {',
      mutation: 'if (!result.branchTaken) {'
    },
    {
      type: 'A',
      line: 79,
      description: 'Invert branchTaken false check',
      original: '} else if (result.branchTaken === false) {',
      mutation: '} else if (result.branchTaken === true) {'
    },
    {
      type: 'F',
      line: 91,
      description: 'Invert success check',
      original: 'if (!result.success) {',
      mutation: 'if (result.success) {'
    },
    {
      type: 'A',
      line: 105,
      description: 'Invert running condition',
      original: 'while (!this.context.isHalted() && this.running) {',
      mutation: 'while (this.context.isHalted() && this.running) {'
    }
  ]
};

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(manualMutations, null, 2));
console.log('Manual mutations saved to mutations-identified.json');
