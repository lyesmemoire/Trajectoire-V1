const fs = require('fs');

// Mutations sur des constantes de configuration et valeurs par défaut non critiques
const configMutations = {
  'execution-context': [
    {
      type: 'F',
      line: 28,
      description: 'Change default stackSize from 65536 to 65535',
      original: 'this.stack = new Stack(options.stackSize || 65536);',
      mutation: 'this.stack = new Stack(options.stackSize || 65535);'
    },
    {
      type: 'F',
      line: 30,
      description: 'Change default heapSize from 1024 to 1023',
      original: 'this.heap.setMaxBlocks(options.heapSize || 1024);',
      mutation: 'this.heap.setMaxBlocks(options.heapSize || 1023);'
    }
  ],
  'memory-manager': [
    {
      type: 'F',
      line: 47,
      description: 'Change default maxMemory from 1GB to 999MB',
      original: 'maxMemory: options.maxMemory || 1024 * 1024 * 1024, // 1GB',
      mutation: 'maxMemory: options.maxMemory || 1024 * 1024 * 1024 - 1, // 1GB'
    }
  ],
  'instruction-cache': [
    {
      type: 'F',
      line: 32,
      description: 'Change default maxSize from 256 to 255',
      original: 'this.maxSize = maxSize;',
      mutation: 'this.maxSize = maxSize - 1;'
    }
  ],
  'instruction-fetch': [
    {
      type: 'F',
      line: 30,
      description: 'Change default cacheSize from 256 to 255',
      original: 'this.cacheSize = options.size || 256;',
      mutation: 'this.cacheSize = options.size || 255;'
    }
  ],
  'instruction-decode': [
    {
      type: 'I',
      line: 106,
      description: 'Return UNKNOWN with different format',
      original: 'return `UNKNOWN(${opcode})`;',
      mutation: 'return `UNKNOWN_OPCODE(${opcode})`;'
    }
  ],
  'instruction-execute': [
    {
      type: 'I',
      line: 95,
      description: 'Change error message format',
      original: 'return { success: false, error: `Unknown opcode: ${decoded.opcode}` };',
      mutation: 'return { success: false, error: `UNKNOWN_OPCODE: ${decoded.opcode}` };'
    }
  ],
  'rollback-manager': [
    {
      type: 'F',
      line: 35,
      description: 'Change default maxSnapshots from 10 to 9',
      original: 'maxSnapshots: options.maxSnapshots || 10,',
      mutation: 'maxSnapshots: options.maxSnapshots || 9,'
    }
  ],
  'thread-manager': [
    {
      type: 'F',
      line: 45,
      description: 'Change default maxThreads from 64 to 63',
      original: 'maxThreads: options.maxThreads || 64,',
      mutation: 'maxThreads: options.maxThreads || 63,'
    },
    {
      type: 'F',
      line: 46,
      description: 'Change default quantum from 1000 to 999',
      original: 'defaultQuantum: options.defaultQuantum || 1000,',
      mutation: 'defaultQuantum: options.defaultQuantum || 999,'
    }
  ],
  'execution-pipeline': [
    {
      type: 'I',
      line: 42,
      description: 'Change initial instructionsExecuted to 1',
      original: 'instructionsExecuted: 0,',
      mutation: 'instructionsExecuted: 1,'
    }
  ]
};

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(configMutations, null, 2));
console.log('Config mutations saved to mutations-identified.json');
