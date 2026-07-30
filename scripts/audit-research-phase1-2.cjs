const fs = require('fs');
const { execSync } = require('child_process');

// PHASE 1 - Analyse complète du composant
const componentAnalysis = {
  component: 'execution-pipeline',
  file: 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts',
  testFile: 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts',
  
  // Graphe d'appel
  callGraph: {
    publicMethods: [
      'constructor', 'cycle', 'run', 'runCycles', 'stop', 'reset',
      'getStatistics', 'getFetch', 'getDecode', 'getExecute', 'getContext',
      'setBytecode', 'getBytecode', 'step', 'getCacheStatistics',
      'enableCache', 'disableCache', 'setCacheSize', 'validate'
    ],
    privateMethods: ['initializeStatistics'],
    dependencies: ['InstructionFetch', 'InstructionDecode', 'InstructionExecute', 'ExecutionContext']
  },
  
  // Invariants métier
  invariants: [
    { name: 'statistics_sync', description: 'Les compteurs doivent être synchronisés avec le nombre réel d\'instructions', criticality: 'HIGH' },
    { name: 'pipeline_sequence', description: 'Le pipeline doit suivre la séquence fetch-decode-execute', criticality: 'CRITICAL' },
    { name: 'halt_prevents_execution', description: 'L\'état HALTED doit empêcher toute exécution', criticality: 'CRITICAL' },
    { name: 'pc_valid', description: 'Le PC doit être valide par rapport au bytecode', criticality: 'HIGH' }
  ],
  
  // États internes
  internalStates: [
    { name: 'running', type: 'boolean', values: ['true', 'false'], criticality: 'HIGH' },
    { name: 'statistics', type: 'PipelineStatistics', criticality: 'HIGH' }
  ],
  
  // Compteurs
  counters: [
    { name: 'instructionsExecuted', line: 74, criticality: 'HIGH' },
    { name: 'cycles', line: 75, criticality: 'HIGH' },
    { name: 'branchesTaken', line: 78, criticality: 'MEDIUM' },
    { name: 'branchesNotTaken', line: 80, criticality: 'MEDIUM' },
    { name: 'calls', line: 84, criticality: 'MEDIUM' },
    { name: 'returns', line: 88, criticality: 'MEDIUM' },
    { name: 'errors', line: 92, criticality: 'HIGH' }
  ],
  
  // Validations critiques
  validations: [
    { line: 57, description: 'if (this.context.isHalted())', criticality: 'CRITICAL', impact: 'BLOCKING' },
    { line: 91, description: 'if (!result.success)', criticality: 'HIGH', impact: 'ERROR_HANDLING' },
    { line: 234, description: 'if (this.context.getProgramCounter() < 0)', criticality: 'HIGH', impact: 'VALIDATION' },
    { line: 239, description: 'if (this.context.getProgramCounter() >= bytecode.length)', criticality: 'HIGH', impact: 'VALIDATION' },
    { line: 244, description: 'valid: errors.length === 0', criticality: 'HIGH', impact: 'VALIDATION' }
  ],
  
  // Conditions critiques
  criticalConditions: [
    { line: 77, description: 'if (result.branchTaken)', criticality: 'MEDIUM' },
    { line: 79, description: 'else if (result.branchTaken === false)', criticality: 'MEDIUM' },
    { line: 83, description: 'if (decoded.isCall)', criticality: 'MEDIUM' },
    { line: 87, description: 'if (decoded.isReturn)', criticality: 'MEDIUM' },
    { line: 105, description: 'while (!this.context.isHalted() && this.running)', criticality: 'CRITICAL' },
    { line: 116, description: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++)', criticality: 'CRITICAL' }
  ],
  
  // Structures de contrôle
  controlStructures: [
    { line: 57, type: 'if', description: 'Arrêt si halted' },
    { line: 77, type: 'if', description: 'Comptage branches prises' },
    { line: 79, type: 'else if', description: 'Comptage branches non prises' },
    { line: 83, type: 'if', description: 'Comptage appels' },
    { line: 87, type: 'if', description: 'Comptage retours' },
    { line: 91, type: 'if', description: 'Gestion erreurs' },
    { line: 105, type: 'while', description: 'Boucle run()' },
    { line: 116, type: 'for', description: 'Boucle runCycles()' }
  ]
};

// PHASE 2 - Génération automatique des mutations (10 familles)
const mutations = [];

// Famille A: Mutations arithmétiques
mutations.push(
  { id: 'A1', family: 'A', line: 74, function: 'cycle', original: 'this.statistics.instructionsExecuted++;', mutated: 'this.statistics.instructionsExecuted += 2;', description: 'Arithmetic: +=2 instead of ++' },
  { id: 'A2', family: 'A', line: 75, function: 'cycle', original: 'this.statistics.cycles++;', mutated: 'this.statistics.cycles += 2;', description: 'Arithmetic: +=2 instead of ++' },
  { id: 'A3', family: 'A', line: 78, function: 'cycle', original: 'this.statistics.branchesTaken++;', mutated: 'this.statistics.branchesTaken += 2;', description: 'Arithmetic: +=2 instead of ++' },
  { id: 'A4', family: 'A', line: 80, function: 'cycle', original: 'this.statistics.branchesNotTaken++;', mutated: 'this.statistics.branchesNotTaken += 2;', description: 'Arithmetic: +=2 instead of ++' },
  { id: 'A5', family: 'A', line: 84, function: 'cycle', original: 'this.statistics.calls++;', mutated: 'this.statistics.calls += 2;', description: 'Arithmetic: +=2 instead of ++' },
  { id: 'A6', family: 'A', line: 88, function: 'cycle', original: 'this.statistics.returns++;', mutated: 'this.statistics.returns += 2;', description: 'Arithmetic: +=2 instead of ++' },
  { id: 'A7', family: 'A', line: 92, function: 'cycle', original: 'this.statistics.errors++;', mutated: 'this.statistics.errors += 2;', description: 'Arithmetic: +=2 instead of ++' }
);

// Famille B: Comparaisons
mutations.push(
  { id: 'B1', family: 'B', line: 57, function: 'cycle', original: 'if (this.context.isHalted()) {', mutated: 'if (!this.context.isHalted()) {', description: 'Comparison: invert halted check' },
  { id: 'B2', family: 'B', line: 77, function: 'cycle', original: 'if (result.branchTaken) {', mutated: 'if (!result.branchTaken) {', description: 'Comparison: invert branchTaken' },
  { id: 'B3', family: 'B', line: 83, function: 'cycle', original: 'if (decoded.isCall) {', mutated: 'if (!decoded.isCall) {', description: 'Comparison: invert isCall' },
  { id: 'B4', family: 'B', line: 87, function: 'cycle', original: 'if (decoded.isReturn) {', mutated: 'if (!decoded.isReturn) {', description: 'Comparison: invert isReturn' },
  { id: 'B5', family: 'B', line: 91, function: 'cycle', original: 'if (!result.success) {', mutated: 'if (result.success) {', description: 'Comparison: invert success check' },
  { id: 'B6', family: 'B', line: 105, function: 'run', original: 'while (!this.context.isHalted() && this.running) {', mutated: 'while (this.context.isHalted() && this.running) {', description: 'Comparison: invert halted in while' },
  { id: 'B7', family: 'B', line: 234, function: 'validate', original: 'if (this.context.getProgramCounter() < 0) {', mutated: 'if (this.context.getProgramCounter() >= 0) {', description: 'Comparison: invert PC negative check' },
  { id: 'B8', family: 'B', line: 239, function: 'validate', original: 'if (this.context.getProgramCounter() >= bytecode.length) {', mutated: 'if (this.context.getProgramCounter() < bytecode.length) {', description: 'Comparison: invert PC bounds check' },
  { id: 'B9', family: 'B', line: 244, function: 'validate', original: 'valid: errors.length === 0,', mutated: 'valid: errors.length !== 0,', description: 'Comparison: invert valid check' }
);

// Famille C: Booléens
mutations.push(
  { id: 'C1', family: 'C', line: 103, function: 'run', original: 'this.running = true;', mutated: 'this.running = false;', description: 'Boolean: force running=false' },
  { id: 'C2', family: 'C', line: 127, function: 'stop', original: 'this.running = false;', mutated: 'this.running = true;', description: 'Boolean: invert stop' },
  { id: 'C3', family: 'C', line: 137, function: 'reset', original: 'this.running = false;', mutated: 'this.running = true;', description: 'Boolean: invert reset running' }
);

// Famille D: Contrôle
mutations.push(
  { id: 'D1', family: 'D', line: 57, function: 'cycle', original: 'return null;', mutated: 'return undefined;', description: 'Control: return undefined instead of null' },
  { id: 'D2', family: 'D', line: 96, function: 'cycle', original: 'return result;', mutated: 'return null;', description: 'Control: return null instead of result' },
  { id: 'D3', family: 'D', line: 109, function: 'run', original: 'return this.getStatistics();', mutated: 'return null;', description: 'Control: return null instead of stats' },
  { id: 'D4', family: 'D', line: 120, function: 'runCycles', original: 'return this.getStatistics();', mutated: 'return null;', description: 'Control: return null instead of stats' }
);

// Famille E: Validation
mutations.push(
  { id: 'E1', family: 'E', line: 57, function: 'cycle', original: 'if (this.context.isHalted()) {\n      return null;\n    }', mutated: '// Halted check removed', description: 'Validation: remove halted check' },
  { id: 'E2', family: 'E', line: 91, function: 'cycle', original: 'if (!result.success) {\n      this.statistics.errors++;\n      this.context.setError(new Error(result.error || \'Execution error\'));\n    }', mutated: '// Error handling removed', description: 'Validation: remove error handling' },
  { id: 'E3', family: 'E', line: 234, function: 'validate', original: 'if (this.context.getProgramCounter() < 0) {\n      errors.push(\'Program counter is negative\');\n    }', mutated: '// PC negative check removed', description: 'Validation: remove PC negative check' },
  { id: 'E4', family: 'E', line: 239, function: 'validate', original: 'if (this.context.getProgramCounter() >= bytecode.length) {\n      errors.push(\'Program counter exceeds bytecode length\');\n    }', mutated: '// PC bounds check removed', description: 'Validation: remove PC bounds check' }
);

// Famille F: Exceptions
mutations.push(
  { id: 'F1', family: 'F', line: 93, function: 'cycle', original: 'this.context.setError(new Error(result.error || \'Execution error\'));', mutated: '// Error not set', description: 'Exception: remove error propagation' },
  { id: 'F2', family: 'F', line: 93, function: 'cycle', original: 'new Error(result.error || \'Execution error\')', mutated: 'new Error(\'Mutated error message\')', description: 'Exception: change error message' }
);

// Famille G: État
mutations.push(
  { id: 'G1', family: 'G', line: 103, function: 'run', original: 'this.running = true;', mutated: '// running not set', description: 'State: skip running=true' },
  { id: 'G2', family: 'G', line: 137, function: 'reset', original: 'this.running = false;', mutated: '// running not reset', description: 'State: skip running=false' }
);

// Famille H: Compteurs (déjà couverts en partie par Famille A)
mutations.push(
  { id: 'H1', family: 'H', line: 74, function: 'cycle', original: 'this.statistics.instructionsExecuted++;', mutated: '// counter not incremented', description: 'Counter: skip increment' },
  { id: 'H2', family: 'H', line: 75, function: 'cycle', original: 'this.statistics.cycles++;', mutated: '// counter not incremented', description: 'Counter: skip increment' }
);

// Famille I: Pipeline
mutations.push(
  { id: 'I1', family: 'I', line: 64, function: 'cycle', original: 'const fetchResult = this.fetch.fetch(pc);', mutated: '// fetch removed', description: 'Pipeline: remove fetch' },
  { id: 'I2', family: 'I', line: 68, function: 'cycle', original: 'const decoded = this.decode.decode(fetchResult.instruction);', mutated: '// decode removed', description: 'Pipeline: remove decode' },
  { id: 'I3', family: 'I', line: 71, function: 'cycle', original: 'const result = this.execute.execute(decoded);', mutated: '// execute removed', description: 'Pipeline: remove execute' },
  { id: 'I4', family: 'I', line: 71, function: 'cycle', original: 'const result = this.execute.execute(decoded);\n\n    // Update statistics', mutated: 'return result;\n\n    // Update statistics', description: 'Pipeline: return before statistics' }
);

// Famille J: Valeurs de retour
mutations.push(
  { id: 'J1', family: 'J', line: 144, function: 'getStatistics', original: 'return { ...this.statistics };', mutated: 'return { instructionsExecuted: 0, cycles: 0, branchesTaken: 0, branchesNotTaken: 0, calls: 0, returns: 0, errors: 0 };', description: 'Return: return zeroed stats' },
  { id: 'J2', family: 'J', line: 144, function: 'getStatistics', original: 'return { ...this.statistics };', mutated: 'return null;', description: 'Return: return null' },
  { id: 'J3', family: 'J', line: 144, function: 'getStatistics', original: 'return { ...this.statistics };', mutated: 'return undefined;', description: 'Return: return undefined' }
);

console.log(`Total mutations generated: ${mutations.length}`);
console.log(`Family distribution:`);
const familyCounts = {};
mutations.forEach(m => {
  familyCounts[m.family] = (familyCounts[m.family] || 0) + 1;
});
Object.entries(familyCounts).forEach(([family, count]) => {
  console.log(`  Family ${family}: ${count}`);
});

// Sauvegarder l'analyse et les mutations
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/phase1-analysis.json', JSON.stringify(componentAnalysis, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/phase2-mutations.json', JSON.stringify(mutations, null, 2));

console.log('\nPhase 1 and 2 complete. Analysis and mutations saved.');
