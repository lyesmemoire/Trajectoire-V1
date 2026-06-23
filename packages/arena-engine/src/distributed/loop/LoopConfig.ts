export const LoopConfig = {
  epochIntervalMs: 2000,
  maxEpochs: 50,
  retryPolicy: {
    maxRetries: 3,
    backoffMs: 150,
  },
  observability: {
    enableFileSink: true,
    enableConsole: true,
  },
};
