import { IClock } from "../../ports/IInfra";

export class SystemClock implements IClock {
  now(): number {
     
    return Date.now();
  }
}
