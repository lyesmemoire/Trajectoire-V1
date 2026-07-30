import { EngineResult } from "./EngineResult";
import { BaseEvent } from "./Event";

export interface EngineInput<Context = any, Payload = any> {
  sessionId: string;
  context: Context;
  payload: Payload;
}

export interface Engine<I extends EngineInput = EngineInput, E extends BaseEvent = BaseEvent> {
  readonly name: string;
  readonly version: string;
  
  execute(input: I): Promise<EngineResult<E>>;
}
