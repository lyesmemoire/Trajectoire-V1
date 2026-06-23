export interface IRuntimeOrchestrator {
  process(event: any): Promise<any>;
  getState?: () => any;
  state?: any;
}

export interface IRuntimeEventBus {
  publish(event: any): void;
  subscribe(topic: string, handler: (payload: any) => void): void;
}
