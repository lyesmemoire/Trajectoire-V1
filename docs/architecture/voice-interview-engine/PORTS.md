# Ports (Interfaces) - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

Ports are interfaces defined in the Application Layer that represent external dependencies. They enable infrastructure independence and follow the Hexagonal Architecture pattern.

---

## Port: SpeechRecognitionPort

**Responsibility**: Speech-to-Text (STT) operations

**Location**: `application/ports/SpeechRecognitionPort.ts`

**Methods**:

### startRecognition

```typescript
startRecognition(
  sessionId: UUID,
  questionExecutionId: UUID,
  language: string,
  options?: RecognitionOptions
): Promise<RecognitionSession>
```

**Description**: Start speech recognition for a question

**Parameters**:
- `sessionId`: Interview session ID
- `questionExecutionId`: Question execution ID
- `language`: Language code (e.g., "en-US", "fr-FR")
- `options`: Optional recognition options

**Returns**: Recognition session

**Errors**:
- `SpeechRecognitionError`: Recognition failed to start

---

### stopRecognition

```typescript
stopRecognition(
  sessionId: UUID,
  questionExecutionId: UUID
): Promise<void>
```

**Description**: Stop speech recognition for a question

**Parameters**:
- `sessionId`: Interview session ID
- `questionExecutionId`: Question execution ID

**Returns**: void

**Errors**:
- `SpeechRecognitionError`: Recognition failed to stop

---

### onTranscript

```typescript
onTranscript(
  callback: (transcript: Transcript) => void
): void
```

**Description**: Register callback for transcript events

**Parameters**:
- `callback`: Callback function

**Returns**: void

---

### onSilence

```typescript
onSilence(
  callback: (silence: Silence) => void
): void
```

**Description**: Register callback for silence events

**Parameters**:
- `callback`: Callback function

**Returns**: void

---

## Port: SpeechSynthesisPort

**Responsibility**: Text-to-Speech (TTS) operations

**Location**: `application/ports/SpeechSynthesisPort.ts`

**Methods**:

### synthesize

```typescript
synthesize(
  sessionId: UUID,
  questionExecutionId: UUID,
  text: string,
  voice: string,
  language: string
): Promise<SynthesisSession>
```

**Description**: Synthesize speech from text

**Parameters**:
- `sessionId`: Interview session ID
- `questionExecutionId`: Question execution ID
- `text`: Text to synthesize
- `voice`: Voice to use
- `language`: Language code

**Returns**: Synthesis session

**Errors**:
- `SpeechSynthesisError`: Synthesis failed

---

### stopSynthesis

```typescript
stopSynthesis(
  sessionId: UUID,
  questionExecutionId: UUID
): Promise<void>
```

**Description**: Stop speech synthesis

**Parameters**:
- `sessionId`: Interview session ID
- `questionExecutionId`: Question execution ID

**Returns**: void

**Errors**:
- `SpeechSynthesisError`: Synthesis failed to stop

---

### onPlaybackStarted

```typescript
onPlaybackStarted(
  callback: (event: PlaybackStartedEvent) => void
): void
```

**Description**: Register callback for playback started events

**Parameters**:
- `callback`: Callback function

**Returns**: void

---

### onPlaybackCompleted

```typescript
onPlaybackCompleted(
  callback: (event: PlaybackCompletedEvent) => void
): void
```

**Description**: Register callback for playback completed events

**Parameters**:
- `callback`: Callback function

**Returns**: void

---

## Port: RuntimePort

**Responsibility**: Communication with Runtime

**Location**: `application/ports/RuntimePort.ts`

**Methods**:

### getInterviewPlan

```typescript
getInterviewPlan(
  interviewPlanId: UUID
): Promise<InterviewPlan>
```

**Description**: Get interview plan from Interview Preparation Engine

**Parameters**:
- `interviewPlanId`: Interview plan ID

**Returns**: Interview plan

**Errors**:
- `RuntimeError`: Failed to get interview plan

---

### notifyInterviewStarted

```typescript
notifyInterviewStarted(
  sessionId: UUID,
  candidateId: string,
  interviewPlanId: UUID
): Promise<void>
```

**Description**: Notify Runtime that interview started

**Parameters**:
- `sessionId`: Interview session ID
- `candidateId`: Candidate ID
- `interviewPlanId`: Interview plan ID

**Returns**: void

**Errors**:
- `RuntimeError`: Failed to notify Runtime

---

### notifyInterviewCompleted

```typescript
notifyInterviewCompleted(
  sessionId: UUID,
  progress: InterviewProgress,
  statistics: InterviewStatistics
): Promise<void>
```

**Description**: Notify Runtime that interview completed

**Parameters**:
- `sessionId`: Interview session ID
- `progress`: Interview progress
- `statistics`: Interview statistics

**Returns**: void

**Errors**:
- `RuntimeError`: Failed to notify Runtime

---

### notifyInterviewCancelled

```typescript
notifyInterviewCancelled(
  sessionId: UUID,
  reason: string
): Promise<void>
```

**Description**: Notify Runtime that interview cancelled

**Parameters**:
- `sessionId`: Interview session ID
- `reason`: Cancellation reason

**Returns**: void

**Errors**:
- `RuntimeError`: Failed to notify Runtime

---

## Port: InterviewPersistencePort

**Responsibility**: Interview session persistence

**Location**: `application/ports/InterviewPersistencePort.ts`

**Methods**:

### save

```typescript
save(
  session: InterviewSessionAggregate
): Promise<void>
```

**Description**: Save interview session

**Parameters**:
- `session`: Interview session aggregate

**Returns**: void

**Errors**:
- `PersistenceError`: Failed to save session

---

### load

```typescript
load(
  sessionId: UUID
): Promise<InterviewSessionAggregate>
```

**Description**: Load interview session

**Parameters**:
- `sessionId`: Interview session ID

**Returns**: Interview session aggregate

**Errors**:
- `PersistenceError`: Failed to load session
- `NotFoundError`: Session not found

---

### delete

```typescript
delete(
  sessionId: UUID
): Promise<void>
```

**Description**: Delete interview session

**Parameters**:
- `sessionId`: Interview session ID

**Returns**: void

**Errors**:
- `PersistenceError`: Failed to delete session

---

## Port: TelemetryPort

**Responsibility**: Telemetry operations

**Location**: `application/ports/TelemetryPort.ts`

**Methods**:

### trackEvent

```typescript
trackEvent(
  event: TelemetryEvent
): Promise<void>
```

**Description**: Track telemetry event

**Parameters**:
- `event`: Telemetry event

**Returns**: void

**Errors**:
- `TelemetryError`: Failed to track event

---

### trackMetric

```typescript
trackMetric(
  metric: TelemetryMetric
): Promise<void>
```

**Description**: Track telemetry metric

**Parameters**:
- `metric`: Telemetry metric

**Returns**: void

**Errors**:
- `TelemetryError`: Failed to track metric

---

## Port: AnalyticsPort

**Responsibility**: Analytics operations

**Location**: `application/ports/AnalyticsPort.ts`

**Methods**:

### track

```typescript
track(
  event: AnalyticsEvent
): Promise<void>
```

**Description**: Track analytics event

**Parameters**:
- `event`: Analytics event

**Returns**: void

**Errors**:
- `AnalyticsError`: Failed to track event

---

## Port: LoggingPort

**Responsibility**: Logging operations

**Location**: `application/ports/LoggingPort.ts`

**Methods**:

### debug

```typescript
debug(
  message: string,
  context?: Record<string, unknown>
): void
```

**Description**: Log debug message

**Parameters**:
- `message`: Log message
- `context`: Optional context

**Returns**: void

---

### info

```typescript
info(
  message: string,
  context?: Record<string, unknown>
): void
```

**Description**: Log info message

**Parameters**:
- `message`: Log message
- `context`: Optional context

**Returns**: void

---

### warn

```typescript
warn(
  message: string,
  context?: Record<string, unknown>
): void
```

**Description**: Log warning message

**Parameters**:
- `message`: Log message
- `context`: Optional context

**Returns**: void

---

### error

```typescript
error(
  message: string,
  error?: Error,
  context?: Record<string, unknown>
): void
```

**Description**: Log error message

**Parameters**:
- `message`: Log message
- `error`: Optional error
- `context`: Optional context

**Returns**: void

---

## Port: ClockPort

**Responsibility**: Time operations

**Location**: `application/ports/ClockPort.ts`

**Methods**:

### now

```typescript
now(): Timestamp
```

**Description**: Get current timestamp

**Returns**: Current timestamp

---

### sleep

```typescript
sleep(
  duration: number
): Promise<void>
```

**Description**: Sleep for duration

**Parameters**:
- `duration`: Duration in milliseconds

**Returns**: void

---

## Port: UUIDPort

**Responsibility**: UUID generation

**Location**: `application/ports/UUIDPort.ts`

**Methods**:

### generate

```typescript
generate(): UUID
```

**Description**: Generate UUID

**Returns**: UUID

---

## Conclusion

The Voice Interview Engine defines 9 ports for external dependencies. All ports are interfaces in the Application Layer, enabling infrastructure independence and following the Hexagonal Architecture pattern.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
