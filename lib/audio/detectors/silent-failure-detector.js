/**
 * Détecte les échecs silencieux du micro (permissions OK mais volume nul).
 */
export class SilentFailureDetector {
    analyser;
    dataArray;
    silenceCounter = 0;
    THRESHOLD = 5; // Sensibilité
    MAX_SILENCE_SAMPLES = 50; // Env 2-3 sec à 60fps
    constructor(context, stream) {
        this.analyser = context.createAnalyser();
        const source = context.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
    check(onFailure) {
        this.analyser.getByteFrequencyData(this.dataArray);
        const volume = this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;
        if (volume < this.THRESHOLD) {
            this.silenceCounter++;
        }
        else {
            this.silenceCounter = 0;
        }
        if (this.silenceCounter > this.MAX_SILENCE_SAMPLES) {
            onFailure();
            this.silenceCounter = 0; // Reset pour éviter les alertes en boucle
        }
    }
}
//# sourceMappingURL=silent-failure-detector.js.map