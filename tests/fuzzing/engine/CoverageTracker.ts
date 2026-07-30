import inspector from 'inspector';

export interface CoverageData {
  lines: number;
  functions: number;
  branches: number;
  basicBlocks: number;
  edgeCoverage: number;
}

export class CoverageTracker {
  private session: inspector.Session;
  private isCollecting: boolean = false;
  private totalCoverage: CoverageData = { lines: 0, functions: 0, branches: 0, basicBlocks: 0, edgeCoverage: 0 };
  private knownFunctions = new Set<string>();
  private knownRanges = new Set<string>();

  constructor() {
    this.session = new inspector.Session();
  }

  async initialize(): Promise<void> {
    this.session.connect();
    return new Promise((resolve, reject) => {
      this.session.post('Profiler.enable', (err) => {
        if (err) return reject(err);
        this.session.post('Profiler.startPreciseCoverage', { callCount: true, detailed: true }, (err) => {
          if (err) return reject(err);
          this.isCollecting = true;
          resolve();
        });
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.isCollecting) return;
    return new Promise((resolve, reject) => {
      this.session.post('Profiler.stopPreciseCoverage', (err) => {
        if (err) return reject(err);
        this.session.post('Profiler.disable', (err) => {
          if (err) return reject(err);
          this.session.disconnect();
          this.isCollecting = false;
          resolve();
        });
      });
    });
  }

  async getCoverageDiff(): Promise<{ newCoverage: boolean; diff: number }> {
    return new Promise((resolve, reject) => {
      if (!this.isCollecting) return resolve({ newCoverage: false, diff: 0 });
      
      this.session.post('Profiler.takePreciseCoverage', (err, params) => {
        if (err) return reject(err);
        
        let diff = 0;
        let newCoverage = false;
        
        // Very basic parsing of V8 coverage to detect new code paths
        for (const script of params.result) {
          // Ignore node internals and the fuzzer itself
          if (!script.url.startsWith('file://') || script.url.includes('fuzzing')) continue;

          for (const func of script.functions) {
            const funcKey = `${script.url}:${func.functionName}:${func.ranges[0].startOffset}`;
            if (!this.knownFunctions.has(funcKey)) {
              if (func.ranges.some(r => r.count > 0)) {
                this.knownFunctions.add(funcKey);
                this.totalCoverage.functions++;
                diff++;
                newCoverage = true;
              }
            }

            for (const range of func.ranges) {
              if (range.count > 0) {
                const rangeKey = `${funcKey}:${range.startOffset}-${range.endOffset}`;
                if (!this.knownRanges.has(rangeKey)) {
                  this.knownRanges.add(rangeKey);
                  this.totalCoverage.basicBlocks++;
                  diff++;
                  newCoverage = true;
                }
              }
            }
          }
        }
        
        resolve({ newCoverage, diff });
      });
    });
  }

  getStatistics(): CoverageData {
    return this.totalCoverage;
  }
}
