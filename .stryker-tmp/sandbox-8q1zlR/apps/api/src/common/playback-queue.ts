// @ts-nocheck
export class PlaybackQueue {
  private queue: Buffer[] = [];
  enqueue(chunk: Buffer) {
    this.queue.push(chunk);
  }
  drain(callback: (chunk: Buffer) => void) {
    while (this.queue.length) {
      const chunk = this.queue.shift()!;
      callback(chunk);
    }
  }
  clear() {
    this.queue = [];
  }
}
