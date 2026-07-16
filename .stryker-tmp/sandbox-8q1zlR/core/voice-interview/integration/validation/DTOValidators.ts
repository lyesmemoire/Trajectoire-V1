// @ts-nocheck
import type { InboundMessage, InboundStartMessage, InboundTurnMessage, InboundLifecycleMessage } from "../transport/WebSocketMessage.js";
import type { StartInterviewRequest, ProcessTurnRequest, PauseInterviewRequest, ResumeInterviewRequest, StopInterviewRequest } from "../../application/dtos/index.js";

export interface ValidationResult<T> {
  readonly valid: boolean;
  readonly data?: T;
  readonly error?: string;
}

function validationSuccess<T>(data: T): ValidationResult<T> {
  return { valid: true, data };
}

function validationFailure<T>(error: string): ValidationResult<T> {
  return { valid: false, error };
}

export function parseInboundMessage(raw: string): ValidationResult<InboundMessage> {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return validationFailure("Invalid JSON");
  }

  if (typeof parsed["type"] !== "string") {
    return validationFailure("Missing 'type' field");
  }

  const type = parsed["type"];

  switch (type) {
    case "START":
      return validateStartMessage(parsed);
    case "TURN":
      return validateTurnMessage(parsed);
    case "PAUSE":
    case "RESUME":
    case "STOP":
      return validateLifecycleMessage(parsed, type);
    case "PING":
      return validationSuccess({ type: "PING" } as InboundMessage);
    default:
      return validationFailure(`Unknown message type: ${type}`);
  }
}

function validateStartMessage(parsed: Record<string, unknown>): ValidationResult<InboundMessage> {
  if (typeof parsed["candidateId"] !== "string" || parsed["candidateId"] === "") {
    return validationFailure("Missing or invalid 'candidateId'");
  }
  if (typeof parsed["targetRole"] !== "string" || parsed["targetRole"] === "") {
    return validationFailure("Missing or invalid 'targetRole'");
  }
  return validationSuccess({
    type: "START",
    candidateId: parsed["candidateId"],
    targetRole: parsed["targetRole"]
  } as InboundStartMessage);
}

function validateTurnMessage(parsed: Record<string, unknown>): ValidationResult<InboundMessage> {
  if (typeof parsed["sessionId"] !== "string" || parsed["sessionId"] === "") {
    return validationFailure("Missing 'sessionId'");
  }
  if (typeof parsed["turnId"] !== "string" || parsed["turnId"] === "") {
    return validationFailure("Missing 'turnId'");
  }
  if (typeof parsed["transcript"] !== "string") {
    return validationFailure("Missing 'transcript'");
  }
  const validIntents = ["answer", "command", "silence", "interruption"];
  if (typeof parsed["intent"] !== "string" || !validIntents.includes(parsed["intent"])) {
    return validationFailure("Invalid 'intent'");
  }
  if (typeof parsed["timingMs"] !== "number" || parsed["timingMs"] < 0) {
    return validationFailure("Invalid 'timingMs'");
  }
  return validationSuccess({
    type: "TURN",
    sessionId: parsed["sessionId"],
    turnId: parsed["turnId"],
    transcript: parsed["transcript"],
    intent: parsed["intent"] as "answer" | "command" | "silence" | "interruption",
    timingMs: parsed["timingMs"]
  } as InboundTurnMessage);
}

function validateLifecycleMessage(parsed: Record<string, unknown>, type: "PAUSE" | "RESUME" | "STOP"): ValidationResult<InboundMessage> {
  if (typeof parsed["sessionId"] !== "string" || parsed["sessionId"] === "") {
    return validationFailure("Missing 'sessionId'");
  }
  return validationSuccess({
    type,
    sessionId: parsed["sessionId"]
  } as InboundLifecycleMessage);
}

export function toStartRequest(msg: InboundStartMessage): StartInterviewRequest {
  return { candidateId: msg.candidateId, targetRole: msg.targetRole };
}

export function toProcessTurnRequest(msg: InboundTurnMessage): ProcessTurnRequest {
  return {
    sessionId: msg.sessionId,
    turnId: msg.turnId,
    transcript: msg.transcript,
    intent: msg.intent,
    timingMs: msg.timingMs
  };
}

export function toPauseRequest(msg: InboundLifecycleMessage): PauseInterviewRequest {
  return { sessionId: msg.sessionId };
}

export function toResumeRequest(msg: InboundLifecycleMessage): ResumeInterviewRequest {
  return { sessionId: msg.sessionId };
}

export function toStopRequest(msg: InboundLifecycleMessage): StopInterviewRequest {
  return { sessionId: msg.sessionId };
}
