// @ts-nocheck
type PipelineSample = number;

class MetricsStore {
  private pipelineSamples: PipelineSample[] = [];
  private maxSamples = 100;

  public errorCount = 0;
  public rejectedConnections = 0;
  public slowTtsCount = 0;

  addPipelineSample(ms: number) {
    this.pipelineSamples.push(ms);

    if (this.pipelineSamples.length > this.maxSamples) {
      this.pipelineSamples.shift();
    }
  }

  get avgPipelineMs(): number {
    if (this.pipelineSamples.length === 0) return 0;

    const sum = this.pipelineSamples.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.pipelineSamples.length);
  }

  get maxPipelineMs(): number {
    if (this.pipelineSamples.length === 0) return 0;
    return Math.max(...this.pipelineSamples);
  }
}

export const metricsStore = new MetricsStore();
