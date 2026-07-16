/**
 * Audio processing pipeline: gain control, noise gate.
 * Uses Web Audio API. Framework-agnostic.
 */

export class AudioProcessingPipeline {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private destinationStream: MediaStream | null = null;

  async initialize(stream: MediaStream, sampleRate: number): Promise<MediaStream> {
    this.context = new AudioContext({ sampleRate });

    this.sourceNode = this.context.createMediaStreamSource(stream);
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 1.0;

    this.analyserNode = this.context.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.8;

    const destination = this.context.createMediaStreamDestination();

    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(destination);

    this.destinationStream = destination.stream;
    return this.destinationStream;
  }

  setGain(value: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(2, value));
    }
  }

  getFrequencyData(): Float32Array {
    if (!this.analyserNode) return new Float32Array(0);
    const data = new Float32Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getFloatFrequencyData(data);
    return data;
  }

  getTimeDomainData(): Float32Array {
    if (!this.analyserNode) return new Float32Array(0);
    const data = new Float32Array(this.analyserNode.fftSize);
    this.analyserNode.getFloatTimeDomainData(data);
    return data;
  }

  getRmsLevel(): number {
    const data = this.getTimeDomainData();
    if (data.length === 0) return 0;
    let sumSquares = 0;
    for (let i = 0; i < data.length; i++) {
      sumSquares += data[i]! * data[i]!;
    }
    return Math.sqrt(sumSquares / data.length);
  }

  getPeakLevel(): number {
    const data = this.getTimeDomainData();
    if (data.length === 0) return 0;
    let peak = 0;
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i]!);
      if (abs > peak) peak = abs;
    }
    return peak;
  }

  destroy(): void {
    this.sourceNode?.disconnect();
    this.gainNode?.disconnect();
    this.analyserNode?.disconnect();
    if (this.context && this.context.state !== "closed") {
      void this.context.close();
    }
    this.sourceNode = null;
    this.gainNode = null;
    this.analyserNode = null;
    this.context = null;
    this.destinationStream = null;
  }
}
