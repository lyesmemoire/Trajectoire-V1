import { 
  runtime_backpressure_duration_ms, 
  runtime_backpressure_queue_depth, 
  runtime_backpressure_queue_capacity, 
  runtime_backpressure_drop_total 
} from "../fsm/metrics/RuntimeMetrics";

export class BackpressureQueue<T> {
  private queue: T[] = [];
  private capacity: number;

  constructor() {
    this.capacity = Number(process.env.BACKPRESSURE_CAPACITY ?? 1000);
    runtime_backpressure_queue_capacity.set(this.capacity);
    runtime_backpressure_queue_depth.set(0);
  }

  enqueue(item: T): boolean {
    const end = runtime_backpressure_duration_ms.startTimer();
    try {
      if (this.queue.length >= this.capacity) {
        this.drop(item);
        return false;
      }
      this.queue.push(item);
      runtime_backpressure_queue_depth.set(this.queue.length);
      return true;
    } finally {
      end();
    }
  }

  dequeue(): T | undefined {
    const end = runtime_backpressure_duration_ms.startTimer();
    try {
      const item = this.queue.shift();
      runtime_backpressure_queue_depth.set(this.queue.length);
      return item;
    } finally {
      end();
    }
  }

  private drop(item: T) {
    runtime_backpressure_drop_total.inc();
    // Optional logging here
  }

  public getDepth(): number {
    return this.queue.length;
  }
}
