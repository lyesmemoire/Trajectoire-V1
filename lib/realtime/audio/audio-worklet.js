// lib/realtime/audio/audio-worklet.js
// This file is loaded as an AudioWorkletProcessor.
// It computes RMS of incoming audio frames and posts a message to the main thread
// indicating when speech starts and ends based on configurable thresholds.

class VadProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "silenceThreshold",
        defaultValue: 0.02,
        minValue: 0,
        maxValue: 1,
      },
      { name: "minSpeechMs", defaultValue: 300, minValue: 0 },
      { name: "maxSilenceMs", defaultValue: 800, minValue: 0 },
    ];
  }

  constructor() {
    super();
    this.speaking = false;
    this.lastTransition = currentTime();
    this.sampleRate = sampleRate;
    this.port.onmessage = (_event) => {
      // future extensions (e.g., dynamic threshold updates)
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channelData = input[0];
    if (!channelData) return true;

    // Compute RMS for the current frame
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
      const v = channelData[i];
      sum += v * v;
    }
    const rms = Math.sqrt(sum / channelData.length);

    // Grab parameters (they may be arrays if automation is used)
    const silenceThreshold =
      parameters.silenceThreshold.length > 0
        ? parameters.silenceThreshold[0]
        : 0.02;
    const minSpeechMs =
      parameters.minSpeechMs.length > 0 ? parameters.minSpeechMs[0] : 300;
    const maxSilenceMs =
      parameters.maxSilenceMs.length > 0 ? parameters.maxSilenceMs[0] : 800;

    const now = currentTime();
    if (rms > silenceThreshold) {
      // Potential speech
      if (!this.speaking && now - this.lastTransition >= minSpeechMs / 1000) {
        this.speaking = true;
        this.lastTransition = now;
        this.port.postMessage({ type: "speechStart" });
      }
    } else {
      // Silence
      if (this.speaking && now - this.lastTransition >= maxSilenceMs / 1000) {
        this.speaking = false;
        this.lastTransition = now;
        this.port.postMessage({ type: "speechEnd" });
      }
    }
    return true; // keep processor alive
  }
}

registerProcessor("vad-processor", VadProcessor);
