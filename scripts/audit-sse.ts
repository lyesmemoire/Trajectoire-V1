import fetch from "node-fetch";

// Configuration
const SSE_URL = process.env.SSE_URL || "http://localhost:3000/api/stream";
const CONNECTIONS = Number(process.env.SSE_CONNECTIONS) || 10;
const ABORT_PROBABILITY = Number(process.env.ABORT_PROBABILITY) || 0.3;
const INTERVAL_MS = 5000;

function logMetrics(stage: _string) {
  const mem = process.memoryUsage();
  const handles = (process as unknown)._getActiveHandles?.().length ?? "n/a";
  const requests = (process as unknown)._getActiveRequests?.().length ?? "n/a";
  console.log(
    `[${new Date().toISOString()}] ${stage} | rss=${(mem.rss / 1e6).toFixed(2)}MB heapUsed=${(mem.heapUsed / 1e6).toFixed(2)}MB handles=${handles} requests=${requests}`,
  );
}

async function startConnection(_id: number) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Math.random() * 60000 + 30000,
  );

  try {
    const res = await fetch(SSE_URL, { signal: controller.signal });
    if (!res.body) throw new Error("No body");
    const reader = res.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chunk = Buffer.from(value).toString();
    }
  } catch {
    // Expected aborts
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  logMetrics("start");
  const promises = [];
  for (let i = 0; i < CONNECTIONS; i++) {
    if (Math.random() < ABORT_PROBABILITY) {
      // Simulate abrupt abort by not awaiting the connection
      promises.push(startConnection(i));
    } else {
      promises.push(startConnection(i));
    }
  }
  await Promise.allSettled(promises);
  logMetrics("end");
}

setInterval(main, INTERVAL_MS);
