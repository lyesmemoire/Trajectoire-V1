const fs = require('fs');

// Mutations très subtiles pour éviter les timeouts
const subtleMutations = {
  'execution-context': [
    {
      type: 'F',
      line: 211,
      description: 'Invert validation result (errors.length === 0)',
      original: 'valid: errors.length === 0,',
      mutation: 'valid: errors.length === 1,' // Change 0 to 1
    },
    {
      type: 'I',
      line: 73,
      description: 'Return -1 instead of 0 for missing register',
      original: 'return this.registers.get(register) || 0;',
      mutation: 'return this.registers.get(register) || -1;'
    },
    {
      type: 'F',
      line: 229,
      description: 'Add 1 to stack utilization',
      original: 'stackUtilization: stackStats.utilization,',
      mutation: 'stackUtilization: stackStats.utilization + 1,'
    }
  ],
  'memory-manager': [
    {
      type: 'F',
      line: 316,
      description: 'Invert validation check (totalAllocated < 0)',
      original: 'if (this.statistics.totalAllocated < 0) {',
      mutation: 'if (this.statistics.totalAllocated >= 0) {'
    },
    {
      type: 'I',
      line: 162,
      description: 'Return -1 instead of 0 for missing allocation',
      original: 'return this.allocations.get(address) || 0;',
      mutation: 'return this.allocations.get(address) || -1;'
    },
    {
      type: 'F',
      line: 149,
      description: 'Change peakUsage update condition',
      original: 'if (this.statistics.currentUsage > this.peakUsage) {',
      mutation: 'if (this.statistics.currentUsage >= this.peakUsage) {'
    }
  ],
  'instruction-cache': [
    {
      type: 'F',
      line: 194,
      description: 'Swap hits and misses in hitRate calculation',
      original: 'this.statistics.hitRate = this.statistics.hits / total;',
      mutation: 'this.statistics.hitRate = this.statistics.misses / total;'
    },
    {
      type: 'I',
      line: 231,
      description: 'Change threshold for hot entries',
      original: 'return Array.from(this.cache.values()).filter(entry => entry.accessCount >= threshold);',
      mutation: 'return Array.from(this.cache.values()).filter(entry => entry.accessCount > threshold);'
    },
    {
      type: 'F',
      line: 268,
      description: 'Add 1 to utilization calculation',
      original: 'return this.cache.size / this.maxSize;',
      mutation: 'return (this.cache.size + 1) / this.maxSize;'
    }
  ],
  'instruction-fetch': [
    {
      type: 'F',
      line: 148,
      description: 'Swap hits and misses in hitRate calculation',
      original: 'const hitRate = total > 0 ? this.cacheHits / total : 0;',
      mutation: 'const hitRate = total > 0 ? this.cacheMisses / total : 0;'
    },
    {
      type: 'I',
      line: 200,
      description: 'Invert address validation',
      original: 'return address >= 0 && address < this.bytecode.length;',
      mutation: 'return address >= 0 && address <= this.bytecode.length;'
    },
    {
      type: 'F',
      line: 229,
      description: 'Change instruction count check',
      original: 'if (size === 0) {',
      mutation: 'if (size <= 0) {'
    }
  ],
  'instruction-decode': [
    {
      type: 'F',
      line: 78,
      description: 'Invert validation result',
      original: 'valid: errors.length === 0,',
      mutation: 'valid: errors.length === 1,'
    },
    {
      type: 'I',
      line: 87,
      description: 'Add 1 to instruction size',
      original: 'return InstructionTable.getSize(instruction.opcode as Opcode);',
      mutation: 'return InstructionTable.getSize(instruction.opcode as Opcode) + 1;'
    },
    {
      type: 'F',
      line: 71,
      description: 'Change operand count comparison',
      original: 'if (instruction.operands.length !== encoding.operandTypes.length) {',
      mutation: 'if (instruction.operands.length < encoding.operandTypes.length) {'
    }
  ],
  'instruction-execute': [
    {
      type: 'F',
      line: 150,
      description: 'Add 1 to division result',
      original: 'stack.push(Math.floor(a / b));',
      mutation: 'stack.push(Math.floor(a / b) + 1);'
    },
    {
      type: 'F',
      line: 166,
      description: 'Add 1 to modulo result',
      original: 'stack.push(a % b);',
      mutation: 'stack.push((a % b) + 1);'
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
      type: 'F',
      line: 261,
      description: 'Invert validation result',
      original: 'valid: errors.length === 0,',
      mutation: 'valid: errors.length === 1,'
    },
    {
      type: 'I',
      line: 282,
      description: 'Add 1 to utilization calculation',
      original: 'utilization: this.snapshots.size / this.options.maxSnapshots!,',
      mutation: 'utilization: (this.snapshots.size + 1) / this.options.maxSnapshots!,'
    },
    {
      type: 'F',
      line: 252,
      description: 'Change empty stack check',
      original: 'if (snapshot.stack.length === 0) {',
      mutation: 'if (snapshot.stack.length < 1) {'
    }
  ],
  'thread-manager': [
    {
      type: 'F',
      line: 272,
      description: 'Invert priority validation',
      original: 'if (thread.priority < 0) {',
      mutation: 'if (thread.priority <= 0) {'
    },
    {
      type: 'F',
      line: 276,
      description: 'Invert quantum validation',
      original: 'if (thread.quantum < 0) {',
      mutation: 'if (thread.quantum <= 0) {'
    },
    {
      type: 'F',
      line: 113,
      description: 'Change priority sort order',
      original: 'nextThread = readyThreads.sort((a, b) => b.priority - a.priority)[0];',
      mutation: 'nextThread = readyThreads.sort((a, b) => a.priority - b.priority)[0];'
    }
  ],
  'execution-pipeline': [
    {
      type: 'F',
      line: 74,
      description: 'Increment instructionsExecuted by 2 instead of 1',
      original: 'this.statistics.instructionsExecuted++;',
      mutation: 'this.statistics.instructionsExecuted += 2;'
    },
    {
      type: 'F',
      line: 75,
      description: 'Increment cycles by 2 instead of 1',
      original: 'this.statistics.cycles++;',
      mutation: 'this.statistics.cycles += 2;'
    },
    {
      type: 'F',
      line: 84,
      description: 'Increment calls by 2 instead of 1',
      original: 'this.statistics.calls++;',
      mutation: 'this.statistics.calls += 2;'
    }
  ]
};

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(subtleMutations, null, 2));
console.log('Subtle mutations saved to mutations-identified.json');
