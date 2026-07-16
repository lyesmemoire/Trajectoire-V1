// @ts-nocheck
export interface TrustScore {
  nodeId: string;
  trust: number; // 0.0 to 1.0
  mode: 'honest' | 'faulty' | 'malicious';
}

export class TrustScoringEngine {
  // Simple deterministic scoring based on declared mode
  compute(nodes: any[]): TrustScore[] {
    return nodes.map((n) => {
      let trust = 0;
      switch (n.mode) {
        case 'honest':
          trust = 1.0;
          break;
        case 'faulty':
          trust = 0.5;
          break;
        case 'malicious':
          trust = 0.0;
          break;
        default:
          trust = 0.0;
      }
      return {
        nodeId: n.nodeId,
        trust,
        mode: n.mode,
      } as TrustScore;
    });
  }
}
