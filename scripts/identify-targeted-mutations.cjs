const fs = require('fs');

// Mutations très ciblées sur des getters simples et des valeurs non critiques
const targetedMutations = {
  'execution-context': [
    {
      type: 'I',
      line: 87,
      description: 'Return programCounter + 1',
      original: 'return this.programCounter;',
      mutation: 'return this.programCounter + 1;'
    },
    {
      type: 'I',
      line: 108,
      description: 'Return !halted instead of halted',
      original: 'return this.halted;',
      mutation: 'return !this.halted;'
    }
  ],
  'memory-manager': [
    {
      type: 'I',
      line: 230,
      description: 'Return statistics with +1 on totalAllocated',
      original: 'return { ...this.statistics };',
      mutation: 'return { ...this.statistics, totalAllocated: this.statistics.totalAllocated + 1 };'
    },
    {
      type: 'I',
      line: 265,
      description: 'Return !isProtectionEnabled',
      original: 'return this.options.enableProtection!;',
      mutation: 'return !this.options.enableProtection!;'
    }
  ],
  'instruction-cache': [
    {
      type: 'I',
      line: 201,
      description: 'Return cache.size + 1',
      original: 'return this.cache.size;',
      mutation: 'return this.cache.size + 1;'
    },
    {
      type: 'I',
      line: 208,
      description: 'Return maxSize + 1',
      original: 'return this.maxSize;',
      mutation: 'return this.maxSize + 1;'
    }
  ],
  'instruction-fetch': [
    {
      type: 'I',
      line: 151,
      description: 'Return cache.size + 1',
      original: 'size: this.cache.size,',
      mutation: 'size: this.cache.size + 1,'
    },
    {
      type: 'I',
      line: 194,
      description: 'Return bytecode.length + 1',
      original: 'return this.bytecode;',
      mutation: 'return new Uint8Array([...this.bytecode, 0]);'
    }
  ],
  'instruction-decode': [
    {
      type: 'I',
      line: 87,
      description: 'Return size + 1',
      original: 'return InstructionTable.getSize(instruction.opcode as Opcode);',
      mutation: 'return InstructionTable.getSize(instruction.opcode as Opcode) + 1;'
    },
    {
      type: 'I',
      line: 95,
      description: 'Return empty array instead of operand types',
      original: 'return encoding ? encoding.operandTypes.map(t => String(t)) : [];',
      mutation: 'return [];'
    }
  ],
  'instruction-execute': [
    {
      type: 'I',
      line: 417,
      description: 'Return new context instead of current',
      original: 'return this.context;',
      mutation: 'return new ExecutionContext();'
    },
    {
      type: 'F',
      line: 112,
      description: 'Change addition to subtraction',
      original: 'stack.push(a + b);',
      mutation: 'stack.push(a - b);'
    }
  ],
  'rollback-manager': [
    {
      type: 'I',
      line: 278,
      description: 'Return snapshotCount + 1',
      original: 'snapshotCount: this.snapshots.size,',
      mutation: 'snapshotCount: this.snapshots.size + 1,'
    },
    {
      type: 'I',
      line: 297,
      description: 'Return new context instead of current',
      original: 'return this.context;',
      mutation: 'return new ExecutionContext();'
    }
  ],
  'thread-manager': [
    {
      type: 'I',
      line: 217,
      description: 'Return threadCount + 1',
      original: 'return this.threads.size;',
      mutation: 'return this.threads.size + 1;'
    },
    {
      type: 'I',
      line: 240,
      description: 'Return FIFO instead of current policy',
      original: 'return this.options.schedulingPolicy!;',
      mutation: 'return SchedulingPolicy.FIFO;'
    }
  ],
  'execution-pipeline': [
    {
      type: 'I',
      line: 144,
      description: 'Return statistics with +1 instructionsExecuted',
      original: 'return { ...this.statistics };',
      mutation: 'return { ...this.statistics, instructionsExecuted: this.statistics.instructionsExecuted + 1 };'
    },
    {
      type: 'I',
      line: 172,
      description: 'Return new context instead of current',
      original: 'return this.context;',
      mutation: 'return new ExecutionContext();'
    }
  ]
};

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(targetedMutations, null, 2));
console.log('Targeted mutations saved to mutations-identified.json');
