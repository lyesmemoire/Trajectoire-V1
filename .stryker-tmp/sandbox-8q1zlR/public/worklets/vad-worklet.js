// @ts-nocheck
// public/worklets/vad-worklet.js
// ------------------------------------------------------------
// AudioWorkletProcessor that computes RMS and emits speechStart / speechEnd
// messages. Time values are in seconds, so we convert to milliseconds
// for the thresholds defined in the main thread.
// ------------------------------------------------------------
class VADProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "silenceThreshold",
        defaultValue: 0.02,
        minValue: 0,
        maxValue: 1,
      },
      { name: "minSpeechMs", defaultValue: 300, minValue: 0, maxValue: 5000 },
      { name: "maxSilenceMs", defaultValue: 800, minValue: 0, maxValue: 5000 },
    ];
  }

  constructor() {
    super();
    this.silenceThreshold = 0.02;
    this.minSpeechMs = 300;
    this.maxSilenceMs = 800;
    this.speaking = false;
    this.lastTransition = 0; // ms
    // receive config updates from the main thread
    this.port.onmessage = (event) => {
      const { type, value } = event.data;
      if (type === "silenceThreshold") this.silenceThreshold = value;
      if (type === "minSpeechMs") this.minSpeechMs = value;
      if (type === "maxSilenceMs") this.maxSilenceMs = value;
    };
  }

  process(inputs) {
    const input = inputs[0];
    if (!input?.length) return true;
    const channel = input[0];
    let sum = 0;
    for (let i = 0; i < channel.length; i++) sum += channel[i] * channel[i];
    const rms = Math.sqrt(sum / channel.length);
    const nowMs = currentTime * 1000; // convert seconds -> ms

    if (rms > this.silenceThreshold) {
      if (!this.speaking && nowMs - this.lastTransition >= this.minSpeechMs) {
        this.speaking = true;
        this.lastTransition = nowMs;
        this.port.postMessage({ type: "speechStart" });
      }
    } else {
      if (this.speaking && nowMs - this.lastTransition >= this.maxSilenceMs) {
        this.speaking = false;
        this.lastTransition = nowMs;
        this.port.postMessage({ type: "speechEnd" });
      }
    }

    // Always send the raw float32 audio channel back for streaming
    // We clone the data so it doesn't get neutered
    this.port.postMessage({
      type: "audio",
      payload: new Float32Array(channel),
    });

    return true;
  }
}

registerProcessor("vad-processor", VADProcessor);
