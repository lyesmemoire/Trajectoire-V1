// @ts-nocheck
import { PlatformEvent } from "./base.event";

export interface EventBus {
  publish(event: PlatformEvent): Promise<void>;
  subscribe(eventType: string, handler: (event: PlatformEvent) => Promise<void>): void;
}
