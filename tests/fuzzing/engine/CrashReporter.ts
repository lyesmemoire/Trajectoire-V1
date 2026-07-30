import { FuzzTarget, OracleResult } from './interfaces';

export class CrashReporter {
  constructor(private targetName: string) {}

  generateSignature(error: Error | null, oracle: OracleResult | null, gitCommit: string): string {
    let type = 'Unknown';
    let stackTop = 'unknown:0';
    
    if (error) {
      type = error.name || 'Error';
      if (error.stack) {
        const lines = error.stack.split('\n');
        for (const line of lines) {
          if (line.includes('at ') && !line.includes('fuzzing')) {
            stackTop = line.trim();
            break;
          }
        }
      }
    } else if (oracle && oracle.status !== 'PASS') {
      type = `Oracle:${oracle.reason || 'Violation'}`;
      if (oracle.error && oracle.error.stack) {
        const lines = oracle.error.stack.split('\n');
        for (const line of lines) {
          if (line.includes('at ') && !line.includes('fuzzing')) {
            stackTop = line.trim();
            break;
          }
        }
      }
    }

    return `${type}|${stackTop}|${this.targetName}|${gitCommit}`;
  }

  getType(error: Error | null, oracle: OracleResult | null): string {
    if (oracle && oracle.status !== 'PASS') {
      if (oracle.reason?.includes('Memory')) return 'OOM';
      if (oracle.reason?.includes('Timeout')) return 'Timeout';
      return 'Oracle';
    }
    if (error) {
      if (error.name.includes('Type')) return 'TypeError';
      if (error.name.includes('Reference')) return 'ReferenceError';
      if (error.message.includes('Assertion')) return 'Failure';
      return error.name;
    }
    return 'Unknown';
  }

  async minimize(target: FuzzTarget, input: Uint8Array, originalSignature: string, gitCommit: string, oracleFn: (res: any, inp: Uint8Array) => OracleResult | null): Promise<Uint8Array> {
    let minimized = new Uint8Array(input);
    let size = minimized.length;
    
    // Simple delta debugging: try removing chunks and see if it still produces the same signature
    for (let chunkSize = Math.floor(size / 2); chunkSize > 0; chunkSize = Math.floor(chunkSize / 2)) {
      for (let i = 0; i <= size - chunkSize; i++) {
        const testInput = new Uint8Array(size - chunkSize);
        testInput.set(minimized.subarray(0, i), 0);
        testInput.set(minimized.subarray(i + chunkSize), i);
        
        try {
          const res = await target.execute(testInput);
          const oracleRes = oracleFn(res, testInput);
          if (oracleRes && oracleRes.status !== 'PASS') {
            const sig = this.generateSignature(null, oracleRes, gitCommit);
            if (sig === originalSignature) {
              minimized = testInput;
              size = minimized.length;
              i -= 1; // Re-check this position with new smaller buffer
            }
          }
        } catch (e: any) {
          const sig = this.generateSignature(e, null, gitCommit);
          if (sig === originalSignature) {
            minimized = testInput;
            size = minimized.length;
            i -= 1;
          }
        }
      }
    }
    return minimized;
  }
}
