import { ChaosTarget } from '../engine/interfaces';

// SIMULATED EXTERNAL DEPENDENCIES (Mocked APIs for Chaos to disrupt)
export const ExternalDeps = {
  db: {
    async query(sql: string, params: any[]): Promise<any> { return { rows: [] }; }
  },
  stripe: {
    async fetch(): Promise<any> { return { status: 'ok' }; }
  },
  llm: {
    async generate(prompt: string, signal?: AbortSignal): Promise<string> {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve('LLM Response'), 50);
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('AbortError');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    }
  },
  fs: {
    async write(path: string, data: any): Promise<void> {}
  }
};

// BUSINESS SERVICES (Resilient implementation)
export class DatabaseClient {
  static async queryWithRetry(sql: string, params: any[], maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await ExternalDeps.db.query(sql, params);
      } catch (err: any) {
        if (err.code === 'ECONNRESET' || err.message === 'DB_UNAVAILABLE') {
          attempt++;
          if (attempt >= maxRetries) throw err;
          // Exponential backoff
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 10));
        } else {
          throw err;
        }
      }
    }
  }
}

export class StripeService {
  static async handleWebhook(eventId: string, credits: number, state: any) {
    // Idempotency check
    const queryRes = await DatabaseClient.queryWithRetry('SELECT 1 FROM stripe_events WHERE id = $1', [eventId]);
    if (state.processedEvents && state.processedEvents.includes(eventId)) {
      return; // Idempotency: Already processed
    }
    
    // Simulate DB logic
    if (!state.processedEvents) state.processedEvents = [];
    state.processedEvents.push(eventId);
    state.credits = (state.credits || 0) + credits;
    await DatabaseClient.queryWithRetry('INSERT INTO stripe_events', [eventId]);
  }
}

export class ATSService {
  static async processCV(prompt: string, state: any) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 100); // Timeout métier 100ms
    
    try {
      // Circuit Breaker / LLM Fetch
      const response = await ExternalDeps.llm.generate(prompt, controller.signal);
      // Facturation SI ET SEULEMENT SI le LLM a répondu
      state.credits = (state.credits || 0) - 1;
      return response;
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'Timeout') {
        // Rollback / No debit
        console.log('LLM Timeout - No credits debited');
      } else {
        throw err;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}

export class UploadService {
  static async uploadFile(path: string, data: any, state: any) {
    state.tempFiles = (state.tempFiles || 0) + 1; // start tx
    try {
      await ExternalDeps.fs.write(path, data);
      state.documents = (state.documents || 0) + 1;
      state.tempFiles--; // commit
    } catch (err: any) {
      // Rollback
      state.tempFiles--; 
      throw err;
    }
  }
}

export class BusinessChaosTarget implements ChaosTarget {
  name = 'BusinessServices';
  
  // The system state observable by Oracles
  public state: any = {
    credits: 0,
    processedEvents: [],
    documents: 0,
    tempFiles: 0,
    wsConnected: false
  };
  
  async initialize() {
    this.state = { credits: 0, processedEvents: [], documents: 0, tempFiles: 0, wsConnected: true };
  }
  
  async shutdown() {}
  
  async executeScenario(scenarioId: string) {
    if (scenarioId === 'kill-server') {
      // simulate normal operation interrupted
      await StripeService.handleWebhook('evt_1', 25, this.state);
      // external fault will throw before next lines
      await ExternalDeps.db.query('SELECT 1', []);
    }
    
    if (scenarioId === 'llm-timeout') {
      this.state.credits = 10;
      await ATSService.processCV('test cv', this.state);
    }
    
    if (scenarioId === 'network-loss') {
      // simulate an operation trying to call external service
      this.state.wsConnected = false; // network dropped
      try {
        await DatabaseClient.queryWithRetry('SELECT 1', []);
        // If DB recovered, WS also recovers (network is back)
        this.state.wsConnected = true;
      } catch {
        // Network still down — WS stays disconnected
      }
    }

    if (scenarioId === 'browser-crash') {
      // ws disconnets
    }

    if (scenarioId === 'duplicate-request') {
       await StripeService.handleWebhook('evt_idemp_1', 10, this.state);
       await StripeService.handleWebhook('evt_idemp_1', 10, this.state);
    }
    
    if (scenarioId === 'stripe-double') {
       await StripeService.handleWebhook('evt_stripe_1', 10, this.state);
       await StripeService.handleWebhook('evt_stripe_1', 10, this.state);
    }
    
    if (scenarioId === 'ws-disconnect') {
       // logic for reconnect
       this.state.wsConnected = false;
       setTimeout(() => { this.state.wsConnected = true; }, 10);
       await new Promise(r => setTimeout(r, 20));
    }

    if (scenarioId === 'upload-interrupted') {
       await UploadService.uploadFile('/doc.pdf', 'content', this.state).catch(() => {});
    }

    if (scenarioId === 'db-unavailable') {
       await DatabaseClient.queryWithRetry('SELECT 1', []);
    }

    if (scenarioId === 'queue-stopped') {
       // simulate queue processing
    }
    
    return this.state;
  }
}
