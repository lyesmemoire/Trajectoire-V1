/**
 * Base error class for the Voice Interview SDK.
 * All SDK errors inherit from this class.
 */
export class VoiceClientError extends Error {
  public readonly code: string;
  public readonly recoverable: boolean;
  public readonly timestamp: number;

  constructor(message: string, code: string, recoverable: boolean = false) {
    super(message);
    this.name = "VoiceClientError";
    this.code = code;
    this.recoverable = recoverable;
    this.timestamp = Date.now();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
