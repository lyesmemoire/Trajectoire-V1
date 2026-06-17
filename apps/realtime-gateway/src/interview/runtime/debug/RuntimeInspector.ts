import {
  runtime_backpressure_queue_depth,
  eventsReceived,
  runtime_backpressure_drop_total,
  runtime_replay_validations_total
} from "../fsm/metrics/RuntimeMetrics";

export class RuntimeInspector {
  static async getSnapshot() {
    const getMetricValue = async (metric: any) => {
      try {
        const data = await metric.get();
        return data.values?.[0]?.value ?? 0;
      } catch {
        return 0;
      }
    };

    return {
      queueDepth: await getMetricValue(runtime_backpressure_queue_depth),
      circuitState: "CLOSED", // Defaulting to CLOSED as aggregated states are harder to extract simply
      processedEvents: await getMetricValue(eventsReceived),
      droppedEvents: await getMetricValue(runtime_backpressure_drop_total),
      replayCount: await getMetricValue(runtime_replay_validations_total),
      uptime: process.uptime()
    };
  }
}
