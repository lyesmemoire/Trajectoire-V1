import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface CorpusEntry {
  hash: string;
  data: Uint8Array;
  size: number;
  tags: string[]; // e.g. 'interesting', 'coverage', 'seed'
}

export class CorpusManager {
  private baseDir: string;

  constructor(baseDir: string = path.join(process.cwd(), 'tests', 'fuzzing')) {
    this.baseDir = baseDir;
    this.ensureDirs();
  }

  private ensureDirs() {
    const dirs = [
      'corpus',
      'corpus/seed',
      'corpus/interesting',
      'corpus/coverage',
      'corpus/regressions',
      'corpus/pbt',
      'crashes',
      'crashes/TypeError',
      'crashes/Failure',
      'crashes/Oracle',
      'crashes/OOM',
      'crashes/Timeout'
    ];
    for (const d of dirs) {
      const p = path.join(this.baseDir, d);
      if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
      }
    }
  }

  static hash(data: Uint8Array): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  loadAll(): CorpusEntry[] {
    const entries: CorpusEntry[] = [];
    const dirsToScan = ['seed', 'interesting', 'coverage', 'regressions', 'pbt'].map(d => path.join(this.baseDir, 'corpus', d));
    
    for (const dir of dirsToScan) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.bin')) {
            const data = fs.readFileSync(path.join(dir, file));
            entries.push({
              hash: CorpusManager.hash(new Uint8Array(data)),
              data: new Uint8Array(data),
              size: data.length,
              tags: [path.basename(dir)]
            });
          }
        }
      }
    }
    return entries;
  }

  saveToCorpus(data: Uint8Array, category: string = 'interesting'): string {
    const h = CorpusManager.hash(data);
    const filepath = path.join(this.baseDir, 'corpus', category, `${h}.bin`);
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, data);
    }
    return h;
  }

  saveCrash(data: Uint8Array, type: string, signature: string): string {
    const h = CorpusManager.hash(data);
    
    // Categorize crash
    let category = 'Unknown';
    if (type.includes('TypeError') || type.includes('ReferenceError') || type.includes('Error')) category = 'TypeError';
    if (type.includes('Assertion')) category = 'Failure';
    if (type.includes('Oracle')) category = 'Oracle';
    if (type.includes('Timeout')) category = 'Timeout';
    if (type.includes('OOM')) category = 'OOM';

    const dir = path.join(this.baseDir, 'crashes', category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save with the robust signature embedded in name
    const safeSig = crypto.createHash('sha256').update(signature).digest('hex').substring(0, 16);
    const filepath = path.join(dir, `crash-${safeSig}-${h}.bin`);
    
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, data);
    }
    return filepath;
  }
}
