import { ITimer, TimerHandle } from "../../ports/IInfra";

export class SystemTimer implements ITimer {
  setTimeout(callback: (value?: unknown) => void, ms: number): TimerHandle {
    // eslint-disable-next-line no-restricted-globals
    return setTimeout(callback, ms) as unknown as TimerHandle;
  }

  setInterval(callback: () => void, ms: number): TimerHandle {
    // eslint-disable-next-line no-restricted-globals
    return setInterval(callback, ms) as unknown as TimerHandle;
  }

  clearTimeout(handle: TimerHandle): void {
    // eslint-disable-next-line no-restricted-globals
    clearTimeout(handle as NodeJS.Timeout);
  }

  clearInterval(handle: TimerHandle): void {
    // eslint-disable-next-line no-restricted-globals
    clearInterval(handle as NodeJS.Timeout);
  }
}
