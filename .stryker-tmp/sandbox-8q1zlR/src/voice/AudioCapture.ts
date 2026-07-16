// @ts-nocheck
export class AudioCapture {
  private mediaRecorder?: MediaRecorder;
  private stream?: MediaStream;

  async start(onChunk: (chunk: Blob) => void) {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: "audio/webm",
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        onChunk(event.data);
      }
    };

    this.mediaRecorder.start(100); // 100ms chunks for low latency
  }

  stop() {
    this.mediaRecorder?.stop();
    this.stream?.getTracks().forEach((t) => t.stop());
  }
}
