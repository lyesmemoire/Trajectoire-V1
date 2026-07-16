# Interface Catalog - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This catalog documents all interfaces (ports) defined in the Voice Interview Engine.

---

## Port: SpeechRecognitionPort

**Package**: `application/ports`

**File**: `SpeechRecognitionPort.ts`

**Purpose**: Speech-to-Text (STT) operations

**Methods**:
- `startRecognition(sessionId, questionExecutionId, language, options?)`: Promise<RecognitionSession>
- `stopRecognition(sessionId, questionExecutionId)`: Promise<void>
- `onTranscript(callback)`: void
- `onSilence(callback)`: void

**Implemented By**:
- OpenAIRealtimeAdapter
- DeepgramAdapter
- AzureSpeechAdapter

---

## Port: SpeechSynthesisPort

**Package**: `application/ports`

**File**: `SpeechSynthesisPort.ts`

**Purpose**: Text-to-Speech (TTS) operations

**Methods**:
- `synthesize(sessionId, questionExecutionId, text, voice, language)`: Promise<SynthesisSession>
- `stopSynthesis(sessionId, questionExecutionId)`: Promise<void>
- `onPlaybackStarted(callback)`: void
- `onPlaybackCompleted(callback)`: void

**Implemented By**:
- OpenAIRealtimeAdapter
- AzureSpeechAdapter
- ElevenLabsAdapter

---

## Port: RuntimePort

**Package**: `application/ports`

**File**: `RuntimePort.ts`

**Purpose**: Communication with Runtime

**Methods**:
- `getInterviewPlan(interviewPlanId)`: Promise<InterviewPlan>
- `notifyInterviewStarted(sessionId, candidateId, interviewPlanId)`: Promise<void>
- `notifyInterviewCompleted(sessionId, progress, statistics)`: Promise<void>
- `notifyInterviewCancelled(sessionId, reason)`: Promise<void>

**Implemented By**:
- RuntimeAdapter (to be implemented)

---

## Port: InterviewPersistencePort

**Package**: `application/ports`

**File**: `InterviewPersistencePort.ts`

**Purpose**: Interview session persistence

**Methods**:
- `save(session)`: Promise<void>
- `load(sessionId)`: Promise<InterviewSessionAggregate>
- `delete(sessionId)`: Promise<void>

**Implemented By**:
- SupabaseAdapter

---

## Port: TelemetryPort

**Package**: `application/ports`

**File**: `TelemetryPort.ts`

**Purpose**: Telemetry operations

**Methods**:
- `trackEvent(event)`: Promise<void>
- `trackMetric(metric)`: Promise<void>

**Implemented By**:
- TelemetryAdapter

---

## Port: AnalyticsPort

**Package**: `application/ports`

**File**: `AnalyticsPort.ts`

**Purpose**: Analytics operations

**Methods**:
- `track(event)`: Promise<void>

**Implemented By**:
- AnalyticsAdapter

---

## Port: LoggingPort

**Package**: `application/ports`

**File**: `LoggingPort.ts`

**Purpose**: Logging operations

**Methods**:
- `debug(message, context?)`: void
- `info(message, context?)`: void
- `warn(message, context?)`: void
- `error(message, error?, context?)`: void

**Implemented By**:
- LoggerAdapter

---

## Port: ClockPort

**Package**: `application/ports`

**File**: `ClockPort.ts`

**Purpose**: Time operations

**Methods**:
- `now()`: Timestamp
- `sleep(duration)`: Promise<void>

**Implemented By**:
- ClockAdapter

---

## Port: UUIDPort

**Package**: `application/ports`

**File**: `UUIDPort.ts`

**Purpose**: UUID generation

**Methods**:
- `generate()`: UUID

**Implemented By**:
- UUIDAdapter

---

## Interface Summary

| Port | Purpose | Methods | Implementations |
|------|---------|---------|-----------------|
| SpeechRecognitionPort | STT operations | 4 | 3 |
| SpeechSynthesisPort | TTS operations | 4 | 3 |
| RuntimePort | Runtime communication | 4 | 1 |
| InterviewPersistencePort | Persistence | 3 | 1 |
| TelemetryPort | Telemetry | 2 | 1 |
| AnalyticsPort | Analytics | 1 | 1 |
| LoggingPort | Logging | 4 | 1 |
| ClockPort | Time | 2 | 1 |
| UUIDPort | UUID generation | 1 | 1 |
| **Total** | **9 ports** | **25 methods** | **13 implementations** |

---

## Conclusion

The Voice Interview Engine defines 9 ports with 25 methods, implemented by 13 adapters. All ports are interfaces in the Application Layer, enabling infrastructure independence.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
