import { describe, expect, it, vi } from "vitest";

import {
  handleVoiceV3TextMessage,
} from "./voice-v3-text-message.js";

describe("handleVoiceV3TextMessage", () => {
  it("rejects mock_transcript in production without injecting transcript", () => {
    const onFinalTranscript = vi.fn();
    const send = vi.fn();
    const warn = vi.fn();

    const handled = handleVoiceV3TextMessage(
      JSON.stringify({
        type: "mock_transcript",
        text: "synthetic transcript",
      }),
      {
        nodeEnv: "production",
        sessionId: "session-prod",
        userId: "user-prod",
        sttCallbacks: {
          onFinalTranscript,
        },
        send,
        warn,
      },
    );

    expect(handled).toBe(true);

    expect(onFinalTranscript).not.toHaveBeenCalled();

    expect(warn).toHaveBeenCalledWith({
      event: "mock_transcript_rejected",
      sessionId: "session-prod",
      userId: "user-prod",
    });

    expect(send).toHaveBeenCalledWith({
      type: "error",
      message: "Unsupported message type.",
    });
  });

  it("allows mock_transcript in test mode", () => {
    const onFinalTranscript = vi.fn();
    const send = vi.fn();
    const warn = vi.fn();

    const handled = handleVoiceV3TextMessage(
      JSON.stringify({
        type: "mock_transcript",
        text: "test transcript",
      }),
      {
        nodeEnv: "test",
        sessionId: "session-test",
        sttCallbacks: {
          onFinalTranscript,
        },
        send,
        warn,
      },
    );

    expect(handled).toBe(true);

    expect(onFinalTranscript).toHaveBeenCalledTimes(1);
    expect(onFinalTranscript).toHaveBeenCalledWith(
      "test transcript",
    );

    expect(send).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not inject an empty or missing mock transcript", () => {
    const onFinalTranscript = vi.fn();

    handleVoiceV3TextMessage(
      JSON.stringify({
        type: "mock_transcript",
      }),
      {
        nodeEnv: "test",
        sessionId: "session-test",
        sttCallbacks: {
          onFinalTranscript,
        },
        send: vi.fn(),
        warn: vi.fn(),
      },
    );

    expect(onFinalTranscript).not.toHaveBeenCalled();
  });

  it("ignores malformed JSON safely", () => {
    const send = vi.fn();
    const warn = vi.fn();

    const handled = handleVoiceV3TextMessage(
      "{bad json",
      {
        nodeEnv: "production",
        sessionId: "session-prod",
        send,
        warn,
      },
    );

    expect(handled).toBe(false);
    expect(send).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("accepts end_speech without side effects", () => {
    const send = vi.fn();
    const warn = vi.fn();

    const handled = handleVoiceV3TextMessage(
      JSON.stringify({
        type: "end_speech",
      }),
      {
        nodeEnv: "production",
        sessionId: "session-prod",
        send,
        warn,
      },
    );

    expect(handled).toBe(true);
    expect(send).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it("ignores unknown message types", () => {
    const send = vi.fn();
    const warn = vi.fn();

    const handled = handleVoiceV3TextMessage(
      JSON.stringify({
        type: "something_else",
      }),
      {
        nodeEnv: "production",
        sessionId: "session-prod",
        send,
        warn,
      },
    );

    expect(handled).toBe(false);
    expect(send).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});
