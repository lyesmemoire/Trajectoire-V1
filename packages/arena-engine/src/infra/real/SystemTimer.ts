import { ITimer, TimerHandle } from "../../ports/IInfra";

export class SystemTimer implements ITimer {
  setTimeout(callback: (value?: unknown) => void, ms: number): TimerHandle {
     
    return setTimeout(callback, ms) as unknown as TimerHandle;
  }

  setInterval(callback: () => void, ms: number): TimerHandle {
     
    return setInterval(callback, ms) as unknown as TimerHandle;
  }

  clearTimeout(handle: TimerHandle): void {
     
    clearTimeout(handle as NodeJS.Timeout);
  }

  clearInterval(handle: TimerHandle): void {
     
    clearInterval(handle as NodeJS.Timeout);
  }
}
