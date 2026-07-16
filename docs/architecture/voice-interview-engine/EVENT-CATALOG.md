# Event Catalog - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This catalog documents all domain events defined in the Voice Interview Engine.

---

## Event: InterviewStarted

**Category**: Interview Lifecycle

**Payload**:
- `sessionId`: UUID
- `candidateId`: string
- `interviewPlanId`: UUID
- `timestamp`: Timestamp

**Raised When**: Interview session is started

**Consumers**: Runtime, Live Analysis, Telemetry, Analytics

---

## Event: QuestionStarted

**Category**: Question Lifecycle

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `timestamp`: Timestamp

**Raised When**: Question execution is started

**Consumers**: Live Analysis, Telemetry, Analytics

---

## Event: QuestionCompleted

**Category**: Question Lifecycle

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `responseId`: UUID (optional)
- `timestamp`: Timestamp

**Raised When**: Question execution is completed

**Consumers**: Live Analysis, Telemetry, Analytics

---

## Event: CandidateSpeaking

**Category**: Conversation

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID
- `timestamp`: Timestamp

**Raised When**: Candidate starts speaking

**Consumers**: Live Analysis, Telemetry

---

## Event: CandidateStoppedSpeaking

**Category**: Conversation

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID
- `duration`: number
- `timestamp`: Timestamp

**Raised When**: Candidate stops speaking

**Consumers**: Live Analysis, Telemetry, Analytics

---

## Event: AIStartedSpeaking

**Category**: Conversation

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `timestamp`: Timestamp

**Raised When**: AI starts speaking

**Consumers**: Telemetry

---

## Event: AIStoppedSpeaking

**Category**: Conversation

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `duration`: number
- `timestamp`: Timestamp

**Raised When**: AI stops speaking

**Consumers**: Telemetry

---

## Event: SilenceDetected

**Category**: Conversation

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `responseId`: UUID (optional)
- `duration`: number
- `timestamp`: Timestamp

**Raised When**: Silence is detected

**Consumers**: Live Analysis, Telemetry

---

## Event: InterruptionDetected

**Category**: Conversation

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `interruptionType`: `CANDIDATE_INTERRUPTS_AI` | `AI_INTERRUPTS_CANDIDATE`
- `timestamp`: Timestamp

**Raised When**: Interruption is detected

**Consumers**: Live Analysis, Telemetry

---

## Event: QuestionSkipped

**Category**: Question Lifecycle

**Payload**:
- `sessionId`: UUID
- `questionExecutionId`: UUID
- `questionId`: string
- `index`: QuestionIndex
- `reason`: string
- `timestamp`: Timestamp

**Raised When**: Question is skipped

**Consumers**: Live Analysis, Telemetry, Analytics

---

## Event: InterviewPaused

**Category**: Interview Lifecycle

**Payload**:
- `sessionId`: UUID
- `timestamp`: Timestamp

**Raised When**: Interview is paused

**Consumers**: Runtime, Telemetry, Analytics

---

## Event: InterviewResumed

**Category**: Interview Lifecycle

**Payload**:
- `sessionId`: UUID
- `timestamp`: Timestamp

**Raised When**: Interview is resumed

**Consumers**: Runtime, Telemetry, Analytics

---

## Event: InterviewCompleted

**Category**: Interview Lifecycle

**Payload**:
- `sessionId`: UUID
- `candidateId`: string
- `progress`: InterviewProgress
- `statistics`: InterviewStatistics
- `timestamp`: Timestamp

**Raised When**: Interview is completed

**Consumers**: Runtime, Live Analysis, Telemetry, Analytics

---

## Event: InterviewCancelled

**Category**: Interview Lifecycle

**Payload**:
- `sessionId`: UUID
- `reason`: string
- `timestamp`: Timestamp

**Raised When**: Interview is cancelled

**Consumers**: Runtime, Telemetry, Analytics

---

## Event: InterviewTimeout

**Category**: Interview Lifecycle

**Payload**:
- `sessionId`: UUID
- `timeoutType`: `QUESTION_TIMEOUT` | `INTERVIEW_TIMEOUT`
- `timestamp`: Timestamp

**Raised When**: Interview or question times out

**Consumers**: Runtime, Live Analysis, Telemetry, Analytics

---

## Event: ConversationError

**Category**: Error

**Payload**:
- `sessionId`: UUID
- `errorType`: string
- `errorMessage`: string
- `timestamp`: Timestamp

**Raised When**: Conversation error occurs

**Consumers**: Runtime, Telemetry, Analytics

---

## Event Summary

| Event | Category | Payload Fields | Consumers |
|-------|----------|----------------|-----------|
| InterviewStarted | Interview Lifecycle | 4 | 4 |
| QuestionStarted | Question Lifecycle | 5 | 3 |
| QuestionCompleted | Question Lifecycle | 6 | 3 |
| CandidateSpeaking | Conversation | 4 | 2 |
| CandidateStoppedSpeaking | Conversation | 5 | 3 |
| AIStartedSpeaking | Conversation | 3 | 1 |
| AIStoppedSpeaking | Conversation | 4 | 1 |
| SilenceDetected | Conversation | 5 | 2 |
| InterruptionDetected | Conversation | 4 | 2 |
| QuestionSkipped | Question Lifecycle | 6 | 3 |
| InterviewPaused | Interview Lifecycle | 2 | 3 |
| InterviewResumed | Interview Lifecycle | 2 | 3 |
| InterviewCompleted | Interview Lifecycle | 5 | 4 |
| InterviewCancelled | Interview Lifecycle | 3 | 3 |
| InterviewTimeout | Interview Lifecycle | 3 | 4 |
| ConversationError | Error | 4 | 3 |
| **Total** | **4 categories** | **64 fields** | **42 consumer mappings** |

---

## Event Categories

### Interview Lifecycle (5 events)
- InterviewStarted
- InterviewPaused
- InterviewResumed
- InterviewCompleted
- InterviewCancelled
- InterviewTimeout

### Question Lifecycle (3 events)
- QuestionStarted
- QuestionCompleted
- QuestionSkipped

### Conversation (5 events)
- CandidateSpeaking
- CandidateStoppedSpeaking
- AIStartedSpeaking
- AIStoppedSpeaking
- SilenceDetected
- InterruptionDetected

### Error (1 event)
- ConversationError

---

## Conclusion

The Voice Interview Engine defines 16 domain events across 4 categories, with 42 consumer mappings. All events are raised in the Domain Layer and consumed by downstream contexts.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
