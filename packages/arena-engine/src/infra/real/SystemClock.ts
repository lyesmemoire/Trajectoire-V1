import { IClock } from "../../ports/IInfra";

export class SystemClock implements IClock {
  now(): number {
    // eslint-disable-next-line no-restricted-syntax
    return Date.now();
  }
}
