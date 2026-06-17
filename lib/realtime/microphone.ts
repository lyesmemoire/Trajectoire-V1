export class MicrophoneCapture {
  private context: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private worklet: AudioWorkletNode | null = null;

  public onAudioData: ((float32Array: Float32Array) => void) | null = null;

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    this.context = new window.AudioContext({ sampleRate: 16000 });
    await this.context.audioWorklet.addModule("/worklets/vad-worklet.js");

    this.source = this.context.createMediaStreamSource(this.stream);
    this.worklet = new AudioWorkletNode(this.context, "vad-processor");

    this.worklet.port.onmessage = (event) => {
      if (event.data.type === "audio" && this.onAudioData) {
        this.onAudioData(event.data.payload);
      }
    };

    this.source.connect(this.worklet);
    this.worklet.connect(this.context.destination);
  }

  stop() {
    if (this.worklet) {
      this.worklet.disconnect();
      this.worklet = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
