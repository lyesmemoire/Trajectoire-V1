import { describe, it, expect } from "vitest";
import { InterviewStateMachine } from "../../src/state-machine/InterviewStateMachine.js";
import { ClientState, ClientEvent } from "../../src/state-machine/States.js";
import type { GuardContext } from "../../src/state-machine/Guards.js";
import { StateError } from "../../src/errors/StateError.js";

const DEFAULT_GUARD: GuardContext = Object.freeze({
  ticket: "valid-ticket",
  retryCount: 0,
  maxRetries: 5,
  transcript: "some transcript",
});

describe("InterviewStateMachine", () => {
  it("should start in Disconnected state", () => {
    const fsm = new InterviewStateMachine();
    expect(fsm.currentState).toBe(ClientState.Disconnected);
    expect(fsm.isTerminal).toBe(false);
  });

  it("should transition Disconnected → Authenticating on CONNECT", () => {
    const fsm = new InterviewStateMachine();
    const result = fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    expect(result.previousState).toBe(ClientState.Disconnected);
    expect(result.currentState).toBe(ClientState.Authenticating);
    expect(fsm.currentState).toBe(ClientState.Authenticating);
  });

  it("should complete the full happy path", () => {
    const fsm = new InterviewStateMachine();

    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Authenticating);

    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Connecting);

    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.WaitingInterview);

    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Listening);

    fsm.transition(ClientEvent.SPEECH_END, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.UploadingAudio);

    fsm.transition(ClientEvent.TURN_SENT, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.WaitingAI);

    fsm.transition(ClientEvent.AUDIO_RECEIVED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.PlayingTTS);

    fsm.transition(ClientEvent.PLAYBACK_ENDED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Listening);

    fsm.transition(ClientEvent.SERVER_COMPLETED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Completed);
    expect(fsm.isTerminal).toBe(true);
  });

  it("should throw StateError on invalid transition", () => {
    const fsm = new InterviewStateMachine();
    expect(() => fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD))
      .toThrowError(StateError);
  });

  it("should enforce hasValidTicket guard", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);

    const noTicket: GuardContext = { ...DEFAULT_GUARD, ticket: null };
    expect(() => fsm.transition(ClientEvent.TICKET_RECEIVED, noTicket))
      .toThrowError(StateError);
  });

  it("should enforce hasTranscript guard on SPEECH_END", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);

    const noTranscript: GuardContext = { ...DEFAULT_GUARD, transcript: null };
    expect(() => fsm.transition(ClientEvent.SPEECH_END, noTranscript))
      .toThrowError(StateError);
  });

  it("should support barge-in from PlayingTTS → Listening", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);
    fsm.transition(ClientEvent.SPEECH_END, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TURN_SENT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.AUDIO_RECEIVED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.PlayingTTS);

    fsm.transition(ClientEvent.BARGE_IN, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Listening);
  });

  it("should support pause/resume cycle", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);

    fsm.transition(ClientEvent.PAUSE, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Paused);

    fsm.transition(ClientEvent.RESUME, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Listening);
  });

  it("should transition to Reconnecting on WS_LOST from active states", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);

    fsm.transition(ClientEvent.WS_LOST, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Reconnecting);
  });

  it("should go to Error on MAX_RETRIES_EXCEEDED from Reconnecting", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_LOST, DEFAULT_GUARD);

    fsm.transition(ClientEvent.MAX_RETRIES_EXCEEDED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Error);
    expect(fsm.isTerminal).toBe(true);
  });

  it("should reset from terminal states", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.AUTH_FAILED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Error);

    fsm.transition(ClientEvent.RESET, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Disconnected);
  });

  it("should record transition history", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);

    const history = fsm.transitionHistory;
    expect(history).toHaveLength(2);
    expect(history[0]!.event).toBe(ClientEvent.CONNECT);
    expect(history[1]!.event).toBe(ClientEvent.TICKET_RECEIVED);
  });

  it("should clear history on reset()", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.reset();
    expect(fsm.currentState).toBe(ClientState.Disconnected);
    expect(fsm.transitionHistory).toHaveLength(0);
  });

  it("should handle TEXT_ONLY_RECEIVED from WaitingAI", () => {
    const fsm = new InterviewStateMachine();
    fsm.transition(ClientEvent.CONNECT, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TICKET_RECEIVED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.WS_OPENED, DEFAULT_GUARD);
    fsm.transition(ClientEvent.START_INTERVIEW, DEFAULT_GUARD);
    fsm.transition(ClientEvent.SPEECH_END, DEFAULT_GUARD);
    fsm.transition(ClientEvent.TURN_SENT, DEFAULT_GUARD);

    fsm.transition(ClientEvent.TEXT_ONLY_RECEIVED, DEFAULT_GUARD);
    expect(fsm.currentState).toBe(ClientState.Listening);
  });
});
