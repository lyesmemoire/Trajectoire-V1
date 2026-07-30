/**
 * Détecte les échecs silencieux du micro (permissions OK mais volume nul).
 */
export class SilentFailureDetector {
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private silenceCounter: number = 0;
  private readonly THRESHOLD = 5; // Sensibilité
  private readonly MAX_SILENCE_SAMPLES = 50; // Env 2-3 sec à 60fps

  constructor(context: AudioContext, stream: MediaStream) {
    this.analyser = context.createAnalyser();
    const source = context.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  check(onFailure: () => void) {
    this.analyser.getByteFrequencyData(this.dataArray  as any);
    const volume =
      this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;

    if (volume < this.THRESHOLD) {
      this.silenceCounter++;
    } else {
      this.silenceCounter = 0;
    }

    if (this.silenceCounter > this.MAX_SILENCE_SAMPLES) {
      onFailure();
      this.silenceCounter = 0; // Reset pour éviter les alertes en boucle
    }
  }
}
