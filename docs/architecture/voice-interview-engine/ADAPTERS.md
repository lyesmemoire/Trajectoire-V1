# Infrastructure Adapters - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

Adapters are concrete implementations of ports in the Infrastructure Layer. They encapsulate external dependencies and provide the actual implementation for the interfaces defined in the Application Layer.

**IMPORTANT**: Adapters contain NO business logic. They ONLY handle infrastructure concerns.

---

## Adapter: OpenAIRealtimeAdapter

**Responsibility**: Implements SpeechRecognitionPort and SpeechSynthesisPort using OpenAI Realtime API

**Location**: `infrastructure/adapters/OpenAIRealtimeAdapter.ts`

**Implements**:
- SpeechRecognitionPort
- SpeechSynthesisPort

**Configuration**:
- `apiKey`: OpenAI API key
- `model`: OpenAI model (e.g., "gpt-4o-realtime-preview")
- `timeout`: Request timeout
- `retryAttempts`: Retry attempts
- `retryDelay`: Retry delay

**Methods**:

### startRecognition

**Implementation**:
- Initialize OpenAI Realtime connection
- Configure recognition settings
- Start listening for audio
- Register transcript callback
- Register silence callback

**Error Handling**:
- Translate OpenAI errors to SpeechRecognitionError
- Handle connection failures
- Handle timeout

---

### stopRecognition

**Implementation**:
- Close OpenAI Realtime connection
- Clean up resources

**Error Handling**:
- Translate OpenAI errors to SpeechRecognitionError

---

### synthesize

**Implementation**:
- Send text to OpenAI Realtime API
- Configure voice and language
- Start playback
- Register playback callbacks

**Error Handling**:
- Translate OpenAI errors to SpeechSynthesisError
- Handle synthesis failures

---

### stopSynthesis

**Implementation**:
- Stop playback
- Clean up resources

**Error Handling**:
- Translate OpenAI errors to SpeechSynthesisError

---

## Adapter: DeepgramAdapter

**Responsibility**: Implements SpeechRecognitionPort using Deepgram API

**Location**: `infrastructure/adapters/DeepgramAdapter.ts`

**Implements**:
- SpeechRecognitionPort

**Configuration**:
- `apiKey`: Deepgram API key
- `model`: Deepgram model (e.g., "nova-2")
- `language`: Language code
- `timeout`: Request timeout
- `retryAttempts`: Retry attempts
- `retryDelay`: Retry delay

**Methods**:

### startRecognition

**Implementation**:
- Initialize Deepgram connection
- Configure recognition settings
- Start listening for audio
- Register transcript callback
- Register silence callback

**Error Handling**:
- Translate Deepgram errors to SpeechRecognitionError
- Handle connection failures
- Handle timeout

---

### stopRecognition

**Implementation**:
- Close Deepgram connection
- Clean up resources

**Error Handling**:
- Translate Deepgram errors to SpeechRecognitionError

---

## Adapter: AzureSpeechAdapter

**Responsibility**: Implements SpeechRecognitionPort and SpeechSynthesisPort using Azure Speech Services

**Location**: `infrastructure/adapters/AzureSpeechAdapter.ts`

**Implements**:
- SpeechRecognitionPort
- SpeechSynthesisPort

**Configuration**:
- `subscriptionKey`: Azure subscription key
- `region`: Azure region
- `language`: Language code
- `voice`: Azure voice
- `timeout`: Request timeout
- `retryAttempts`: Retry attempts
- `retryDelay`: Retry delay

**Methods**:

### startRecognition

**Implementation**:
- Initialize Azure Speech SDK
- Configure recognition settings
- Start listening for audio
- Register transcript callback
- Register silence callback

**Error Handling**:
- Translate Azure errors to SpeechRecognitionError
- Handle connection failures
- Handle timeout

---

### stopRecognition

**Implementation**:
- Close Azure Speech SDK connection
- Clean up resources

**Error Handling**:
- Translate Azure errors to SpeechRecognitionError

---

### synthesize

**Implementation**:
- Initialize Azure Speech SDK
- Configure voice and language
- Synthesize speech from text
- Start playback
- Register playback callbacks

**Error Handling**:
- Translate Azure errors to SpeechSynthesisError
- Handle synthesis failures

---

### stopSynthesis

**Implementation**:
- Stop playback
- Clean up resources

**Error Handling**:
- Translate Azure errors to SpeechSynthesisError

---

## Adapter: ElevenLabsAdapter

**Responsibility**: Implements SpeechSynthesisPort using ElevenLabs API

**Location**: `infrastructure/adapters/ElevenLabsAdapter.ts`

**Implements**:
- SpeechSynthesisPort

**Configuration**:
- `apiKey`: ElevenLabs API key
- `voice`: ElevenLabs voice
- `model`: ElevenLabs model
- `timeout`: Request timeout
- `retryAttempts`: Retry attempts
- `retryDelay`: Retry delay

**Methods**:

### synthesize

**Implementation**:
- Call ElevenLabs API
- Configure voice and model
- Synthesize speech from text
- Start playback
- Register playback callbacks

**Error Handling**:
- Translate ElevenLabs errors to SpeechSynthesisError
- Handle synthesis failures
- Handle timeout

---

### stopSynthesis

**Implementation**:
- Stop playback
- Clean up resources

**Error Handling**:
- Translate ElevenLabs errors to SpeechSynthesisError

---

## Adapter: SupabaseAdapter

**Responsibility**: Implements InterviewPersistencePort using Supabase

**Location**: `infrastructure/adapters/SupabaseAdapter.ts`

**Implements**:
- InterviewPersistencePort

**Configuration**:
- `url`: Supabase URL
- `anonKey`: Supabase anon key
- `serviceRoleKey`: Supabase service role key
- `timeout`: Request timeout
- `retryAttempts`: Retry attempts
- `retryDelay`: Retry delay

**Methods**:

### save

**Implementation**:
- Map InterviewSessionAggregate to database DTO
- Execute Supabase upsert
- Handle errors

**Error Handling**:
- Translate Supabase errors to PersistenceError
- Handle connection failures
- Handle timeout

---

### load

**Implementation**:
- Execute Supabase select
- Map database DTO to InterviewSessionAggregate
- Handle not found

**Error Handling**:
- Translate Supabase errors to PersistenceError
- Translate not found to NotFoundError
- Handle connection failures

---

### delete

**Implementation**:
- Execute Supabase delete
- Handle errors

**Error Handling**:
- Translate Supabase errors to PersistenceError
- Handle connection failures

---

## Adapter: LoggerAdapter

**Responsibility**: Implements LoggingPort using console or logging service

**Location**: `infrastructure/adapters/LoggerAdapter.ts`

**Implements**:
- LoggingPort

**Configuration**:
- `level`: Log level (DEBUG, INFO, WARN, ERROR)
- `format`: Log format (JSON, TEXT)
- `output`: Log output (CONSOLE, FILE)

**Methods**:

### debug

**Implementation**:
- Format log message
- Output to configured destination

**Error Handling**:
- Handle output failures gracefully

---

### info

**Implementation**:
- Format log message
- Output to configured destination

**Error Handling**:
- Handle output failures gracefully

---

### warn

**Implementation**:
- Format log message
- Output to configured destination

**Error Handling**:
- Handle output failures gracefully

---

### error

**Implementation**:
- Format log message with error
- Output to configured destination

**Error Handling**:
- Handle output failures gracefully

---

## Adapter: TelemetryAdapter

**Responsibility**: Implements TelemetryPort using telemetry service (e.g., OpenTelemetry, Sentry)

**Location**: `infrastructure/adapters/TelemetryAdapter.ts`

**Implements**:
- TelemetryPort

**Configuration**:
- `endpoint`: Telemetry endpoint
- `apiKey`: Telemetry API key
- `samplingRate`: Sampling rate

**Methods**:

### trackEvent

**Implementation**:
- Format telemetry event
- Send to telemetry service

**Error Handling**:
- Handle telemetry failures gracefully
- Do not block on telemetry errors

---

### trackMetric

**Implementation**:
- Format telemetry metric
- Send to telemetry service

**Error Handling**:
- Handle telemetry failures gracefully
- Do not block on telemetry errors

---

## Adapter: AnalyticsAdapter

**Responsibility**: Implements AnalyticsPort using analytics service (e.g., PostHog, Google Analytics)

**Location**: `infrastructure/adapters/AnalyticsAdapter.ts`

**Implements**:
- AnalyticsPort

**Configuration**:
- `endpoint`: Analytics endpoint
- `apiKey`: Analytics API key
- `flushInterval`: Flush interval

**Methods**:

### track

**Implementation**:
- Format analytics event
- Send to analytics service

**Error Handling**:
- Handle analytics failures gracefully
- Do not block on analytics errors

---

## Adapter: ClockAdapter

**Responsibility**: Implements ClockPort using system time

**Location**: `infrastructure/adapters/ClockAdapter.ts`

**Implements**:
- ClockPort

**Configuration**: None

**Methods**:

### now

**Implementation**:
- Return current timestamp

**Error Handling**: None

---

### sleep

**Implementation**:
- Sleep for specified duration

**Error Handling**: None

---

## Adapter: UUIDAdapter

**Responsibility**: Implements UUIDPort using UUID library

**Location**: `infrastructure/adapters/UUIDAdapter.ts`

**Implements**:
- UUIDPort

**Configuration**: None

**Methods**:

### generate

**Implementation**:
- Generate UUID v4

**Error Handling**: None

---

## Mappers

### InterviewSessionMapper

**Responsibility**: Map between InterviewSessionAggregate and database DTO

**Location**: `infrastructure/mappers/InterviewSessionMapper.ts`

**Methods**:
- `toDatabaseDTO(aggregate: InterviewSessionAggregate): DatabaseDTO`
- `fromDatabaseDTO(dto: DatabaseDTO): InterviewSessionAggregate`

**NO business logic, ONLY data transformation.**

---

## Conclusion

The Voice Interview Engine defines 9 adapters for infrastructure dependencies. All adapters implement ports and contain NO business logic, only infrastructure concerns.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
