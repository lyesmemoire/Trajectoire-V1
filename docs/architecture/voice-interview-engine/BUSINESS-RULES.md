# Business Rules - Voice Interview Engine

**Phase**: 3A - Architecture & Domain Design  
**Status**: DRAFT  
**Date**: 2025-01-11

---

## Overview

This document defines all business rules enforced by the Voice Interview Engine.

---

## Interview Lifecycle Rules

### BR-001: Interview State Transitions

**Rule**: Interview state must follow valid transitions

**Valid Transitions**:
- `NOT_STARTED` → `STARTING` → `IN_PROGRESS`
- `IN_PROGRESS` → `PAUSED`
- `PAUSED` → `IN_PROGRESS`
- `IN_PROGRESS` → `COMPLETING` → `COMPLETED`
- `IN_PROGRESS` → `CANCELLING` → `CANCELLED`
- `IN_PROGRESS` → `ABORTING` → `ABORTED`
- `PAUSED` → `CANCELLING` → `CANCELLED`
- `PAUSED` → `ABORTING` → `ABORTED`
- Any state → `TIMEOUT` (on timeout)

**Enforcement**: TransitionService

**Violation**: StateTransitionError

---

### BR-002: Interview Cannot Be Started Twice

**Rule**: An interview cannot be started if it is already in progress

**Condition**: `state !== NOT_STARTED`

**Enforcement**: InterviewSessionAggregate.start()

**Violation**: ValidationError

---

### BR-003: Interview Cannot Be Paused If Not In Progress

**Rule**: An interview can only be paused if it is in progress

**Condition**: `state === IN_PROGRESS`

**Enforcement**: PauseResumeService.validatePause()

**Violation**: ValidationError

---

### BR-004: Interview Cannot Be Resumed If Not Paused

**Rule**: An interview can only be resumed if it is paused

**Condition**: `state === PAUSED`

**Enforcement**: PauseResumeService.validateResume()

**Violation**: ValidationError

---

### BR-005: Interview Cannot Be Completed If Not In Progress

**Rule**: An interview can only be completed if it is in progress

**Condition**: `state === IN_PROGRESS`

**Enforcement**: CompletionService.validateCompletion()

**Violation**: ValidationError

---

## Question Lifecycle Rules

### BR-006: Question State Transitions

**Rule**: Question state must follow valid transitions

**Valid Transitions**:
- `PENDING` → `STARTING` → `ASKING` → `WAITING_RESPONSE` → `LISTENING` → `PROCESSING_RESPONSE` → `COMPLETED`
- `PENDING` → `STARTING` → `ASKING` → `WAITING_RESPONSE` → `LISTENING` → `SKIPPED`
- `PENDING` → `STARTING` → `ASKING` → `WAITING_RESPONSE` → `LISTENING` → `TIMEOUT`
- Any state → `TIMEOUT` (on timeout)

**Enforcement**: TransitionService

**Violation**: StateTransitionError

---

### BR-007: Questions Must Be Executed In Order

**Rule**: Questions must be executed in the order defined in the interview plan

**Condition**: `currentQuestionIndex === nextQuestionIndex`

**Enforcement**: QuestionOrderPolicy.validateOrder()

**Violation**: ValidationError

---

### BR-008: Question Cannot Be Skipped If Not Allowed

**Rule**: A question can only be skipped if the policy allows it

**Condition**: `QuestionOrderPolicy.isSkipAllowed() === true`

**Enforcement**: QuestionOrderPolicy.validateOrder()

**Violation**: ValidationError

---

## Response Lifecycle Rules

### BR-009: Response State Transitions

**Rule**: Response state must follow valid transitions

**Valid Transitions**:
- `NOT_STARTED` → `SPEAKING` → `COMPLETED`
- `NOT_STARTED` → `SPEAKING` → `SILENCE` → `COMPLETED`
- `NOT_STARTED` → `SPEAKING` → `INTERRUPTED` → `COMPLETED`
- `NOT_STARTED` → `SPEAKING` → `TIMEOUT`
- `NOT_STARTED` → `SILENCE` → `TIMEOUT`

**Enforcement**: TransitionService

**Violation**: StateTransitionError

---

## Timing Rules

### BR-010: Silence Timeout Must Be Enforced

**Rule**: If silence exceeds the configured timeout, the response must be marked as timeout

**Condition**: `silenceDuration > SilenceTimeout.maxTimeouts * SilenceTimeout.subsequentTimeout`

**Enforcement**: MaxSilencePolicy.validateSilence()

**Violation**: TimeoutError

---

### BR-011: Question Timeout Must Be Enforced

**Rule**: If a question exceeds the configured time limit, it must be marked as timeout

**Condition**: `questionDuration > TimeLimitPolicy.questionTimeLimit`

**Enforcement**: TimeLimitPolicy.validateTimeLimit()

**Violation**: TimeoutError

---

### BR-012: Interview Timeout Must Be Enforced

**Rule**: If the interview exceeds the configured time limit, it must be marked as timeout

**Condition**: `interviewDuration > TimeLimitPolicy.interviewTimeLimit`

**Enforcement**: TimeLimitPolicy.validateTimeLimit()

**Violation**: TimeoutError

---

## Interruption Rules

### BR-013: Interruption Must Be Allowed By Policy

**Rule**: Interruptions are only allowed if the policy permits them

**Condition**: `InterruptionPolicy.allowInterruption === true`

**Enforcement**: InterruptionPolicy.validateInterruption()

**Violation**: ValidationError

---

### BR-014: Interruption Must Respect Cooldown

**Rule**: Interruptions must respect the cooldown period

**Condition**: `timeSinceLastInterruption > InterruptionPolicy.interruptionCooldown`

**Enforcement**: InterruptionService.validateInterruption()

**Violation**: ValidationError

---

### BR-015: AI Can Only Interrupt Candidate If Speaking

**Rule**: AI can only interrupt the candidate if the candidate is speaking

**Condition**: `responseState === SPEAKING`

**Enforcement**: InterruptionService.detectInterruption()

**Violation**: ValidationError

---

### BR-016: Candidate Can Only Interrupt AI If AI Is Speaking

**Rule**: Candidate can only interrupt AI if AI is speaking

**Condition**: `aiState === SPEAKING`

**Enforcement**: InterruptionService.detectInterruption()

**Violation**: ValidationError

---

## Completion Rules

### BR-017: Interview Can Only Complete If All Questions Completed

**Rule**: An interview can only complete if all questions are completed or skipped

**Condition**: `completedQuestions + skippedQuestions === totalQuestions`

**Enforcement**: CompletionPolicy.isCompletionAllowed()

**Violation**: ValidationError

---

### BR-018: Interview Can Complete Early If Policy Allows

**Rule**: An interview can complete early if the policy allows it

**Condition**: `CompletionPolicy.allowEarlyCompletion === true`

**Enforcement**: CompletionPolicy.isCompletionAllowed()

**Violation**: ValidationError

---

## Retry Rules

### BR-019: Retry Attempts Must Not Exceed Maximum

**Rule**: Retry attempts must not exceed the configured maximum

**Condition**: `retryAttempts < RetryPolicy.maxRetries`

**Enforcement**: MaxRetriesPolicy.validateRetry()

**Violation**: ValidationError

---

### BR-020: Retry Delay Must Be Respected

**Rule**: Retry delay must be respected between retry attempts

**Condition**: `timeSinceLastRetry >= RetryPolicy.retryDelay * RetryPolicy.backoffMultiplier ^ retryAttempt`

**Enforcement**: MaxRetriesPolicy.validateRetry()

**Violation**: ValidationError

---

## Turn-Taking Rules

### BR-021: Only One Speaker At A Time

**Rule**: Only one speaker (candidate or AI) can speak at a time

**Condition**: `candidateState !== SPEAKING || aiState !== SPEAKING`

**Enforcement**: ConversationService.validateTurn()

**Violation**: ValidationError

---

### BR-022: Speaking Window Must Be Respected

**Rule**: Speaking must respect the configured speaking window

**Condition**: `speakingDuration >= SpeakingWindow.minDuration && speakingDuration <= SpeakingWindow.maxDuration`

**Enforcement**: ConversationService.validateTurn()

**Violation**: ValidationError

---

## Progress Rules

### BR-023: Progress Must Be Calculated Correctly

**Rule**: Progress must be calculated as (completed + skipped) / total

**Condition**: `progress = (completedQuestions + skippedQuestions) / totalQuestions * 100`

**Enforcement**: InterviewProgress.calculateProgress()

**Violation**: ValidationError

---

### BR-024: Current Question Index Must Be Valid

**Rule**: Current question index must be within valid range

**Condition**: `currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions`

**Enforcement**: InterviewProgress.validateIndex()

**Violation**: ValidationError

---

## Statistics Rules

### BR-025: Statistics Must Be Calculated Correctly

**Rule**: Statistics must be calculated correctly based on interview data

**Conditions**:
- `totalDuration = sum(all turn durations)`
- `speakingDuration = sum(candidate turn durations)`
- `silenceDuration = sum(silence durations)`
- `interruptionCount = count(interruption events)`
- `skippedCount = count(skipped questions)`
- `averageResponseTime = sum(response durations) / completedQuestions`
- `averageResponseLength = sum(response lengths) / completedQuestions`

**Enforcement**: InterviewStatistics.calculate()

**Violation**: ValidationError

---

## Business Rule Summary

| Rule ID | Category | Description | Enforcement |
|---------|----------|-------------|-------------|
| BR-001 | Interview Lifecycle | Interview state transitions | TransitionService |
| BR-002 | Interview Lifecycle | Cannot start twice | InterviewSessionAggregate |
| BR-003 | Interview Lifecycle | Cannot pause if not in progress | PauseResumeService |
| BR-004 | Interview Lifecycle | Cannot resume if not paused | PauseResumeService |
| BR-005 | Interview Lifecycle | Cannot complete if not in progress | CompletionService |
| BR-006 | Question Lifecycle | Question state transitions | TransitionService |
| BR-007 | Question Lifecycle | Questions in order | QuestionOrderPolicy |
| BR-008 | Question Lifecycle | Skip only if allowed | QuestionOrderPolicy |
| BR-009 | Response Lifecycle | Response state transitions | TransitionService |
| BR-010 | Timing | Silence timeout | MaxSilencePolicy |
| BR-011 | Timing | Question timeout | TimeLimitPolicy |
| BR-012 | Timing | Interview timeout | TimeLimitPolicy |
| BR-013 | Interruption | Interruption allowed | InterruptionPolicy |
| BR-014 | Interruption | Interruption cooldown | InterruptionService |
| BR-015 | Interruption | AI interrupt candidate | InterruptionService |
| BR-016 | Interruption | Candidate interrupt AI | InterruptionService |
| BR-017 | Completion | Complete if all done | CompletionPolicy |
| BR-018 | Completion | Early completion | CompletionPolicy |
| BR-019 | Retry | Max retries | MaxRetriesPolicy |
| BR-020 | Retry | Retry delay | MaxRetriesPolicy |
| BR-021 | Turn-Taking | One speaker at a time | ConversationService |
| BR-022 | Turn-Taking | Speaking window | ConversationService |
| BR-023 | Progress | Progress calculation | InterviewProgress |
| BR-024 | Progress | Valid question index | InterviewProgress |
| BR-025 | Statistics | Statistics calculation | InterviewStatistics |

**Total**: 25 business rules across 7 categories

---

## Conclusion

The Voice Interview Engine defines 25 business rules across 7 categories, enforced by domain services, policies, and aggregates.

**Status**: DRAFT - Ready for review and validation

---

**Signed Off By**: Cascade AI Assistant  
**Date**: 2025-01-11
