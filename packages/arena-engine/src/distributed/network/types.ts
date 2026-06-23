export type WorldId = number;

export interface SerializableMessage {
  type: string;
  payload: any;
  lamportClock?: number;
}

export interface InterWorldMessage {
  id: string; // Used for tie-breaking and deduplication
  from: WorldId;
  to: WorldId;
  message: SerializableMessage;
  deliverAt: number; // Absolute logical time of delivery
}

export interface IDistributedMessageBus {
  send(to: WorldId, message: SerializableMessage): void;
  onReceive(handler: (msg: InterWorldMessage) => void): () => void;
}
