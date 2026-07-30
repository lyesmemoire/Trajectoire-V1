import { ExternalDeps } from '../targets/BusinessApp';
import { ChaosFault, FaultFamily } from './interfaces';

export class FaultInjector {
  private activeFaults: Set<string> = new Set();
  
  // Originals for restoration
  private originalDbQuery = ExternalDeps.db.query;
  private originalStripeFetch = ExternalDeps.stripe.fetch;
  private originalLlmGenerate = ExternalDeps.llm.generate;
  private originalFsWrite = ExternalDeps.fs.write;

  public async inject(fault: ChaosFault, state: any): Promise<boolean> {
    if (fault.triggerCondition && !fault.triggerCondition(state)) {
      return false;
    }
    if (this.activeFaults.has(fault.id)) return true;

    await fault.activate();
    this.activeFaults.add(fault.id);
    return true;
  }

  public async cleanup(): Promise<void> {
    ExternalDeps.db.query = this.originalDbQuery;
    ExternalDeps.stripe.fetch = this.originalStripeFetch;
    ExternalDeps.llm.generate = this.originalLlmGenerate;
    ExternalDeps.fs.write = this.originalFsWrite;
    this.activeFaults.clear();
  }

  public static createProcessKillFault(): ChaosFault {
    return {
      id: 'fault-kill',
      family: 'Process',
      activate: () => {
        ExternalDeps.db.query = async () => { throw new Error('PROCESS_KILLED'); };
      },
      deactivate: () => {}
    };
  }

  public static createLlmTimeoutFault(): ChaosFault {
    return {
      id: 'fault-llm-timeout',
      family: 'Network',
      activate: () => {
        ExternalDeps.llm.generate = async (prompt, signal) => {
          return new Promise((resolve, reject) => {
            const timer = setTimeout(() => resolve('Delayed'), 5000); // Beyond 100ms timeout
            if (signal) {
              signal.addEventListener('abort', () => {
                clearTimeout(timer);
                const err = new Error('AbortError');
                err.name = 'AbortError';
                reject(err);
              });
            }
          });
        };
      },
      deactivate: () => {}
    };
  }
  
  public static createNetworkDropFault(): ChaosFault {
    return {
      id: 'fault-network-drop',
      family: 'Network',
      activate: () => {
        let calls = 0;
        ExternalDeps.db.query = async () => { 
          calls++;
          if (calls <= 2) {
            const err = new Error('ECONNRESET');
            (err as any).code = 'ECONNRESET';
            throw err;
          }
          // Network recovers on 3rd attempt (transient outage)
          return { rows: [] };
        };
        ExternalDeps.fs.write = async () => { throw new Error('NETWORK_DROP'); };
      },
      deactivate: () => {}
    };
  }
  
  public static createDatabaseUnavailableFault(): ChaosFault {
    return {
      id: 'fault-db-unavailable',
      family: 'Database',
      activate: () => {
        let calls = 0;
        ExternalDeps.db.query = async (sql: string, params: any[]) => { 
           calls++;
           if (calls <= 2) {
             const err = new Error('DB_UNAVAILABLE');
             throw err;
           }
           // Recover on 3rd retry
           return { rows: [] };
        };
      },
      deactivate: () => {}
    };
  }

  public static createDiskFullFault(): ChaosFault {
    return {
      id: 'fault-disk-full',
      family: 'System',
      activate: () => {},
      deactivate: () => {}
    };
  }

  public static createPermissionDeniedFault(): ChaosFault {
    return {
      id: 'fault-permission-denied',
      family: 'System',
      activate: () => {},
      deactivate: () => {}
    };
  }

  public static createOOMFault(): ChaosFault {
    return {
      id: 'fault-oom',
      family: 'System',
      activate: () => {},
      deactivate: () => {}
    };
  }
}
