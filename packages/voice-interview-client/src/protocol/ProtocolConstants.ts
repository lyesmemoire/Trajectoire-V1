/**
 * Protocol constants shared across the SDK.
 */
export const PROTOCOL_VERSION = 1 as const;

export const HEARTBEAT_MESSAGE = JSON.stringify({
  protocolVersion: PROTOCOL_VERSION,
  type: "PING" as const,
});

export const MAX_MESSAGE_SIZE_BYTES = 1_048_576; // 1 MB
