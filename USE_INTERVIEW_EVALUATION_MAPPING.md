# useInterviewEvaluation Migration Mapping

## Overview
This document tracks the migration of business logic from `useInterviewEvaluation.ts` to dedicated intelligence engines.

## File Analysis

**File:** `app/dashboard/interview-simulation/hooks/useInterviewEvaluation.ts`
**Current Size:** 65 lines
**Target Size:** < 150 lines (already compliant)

## Function Audit

### Function: `updateScore`
- **Lines:** 17-22
- **Responsibility:** Update individual score with clamping (0-100)
- **Dependencies:** React state, LiveScores type
- **Pure:** No (state mutation)
- **Target Engine:** ScoreEngine
- **Action:** Migrate to `ScoreEngine.clampScore()`

### Function: `updateScoresBasedOnResponse`
- **Lines:** 24-44
- **Responsibility:** Update multiple scores based on response quality and length
- **Dependencies:** updateScore, responseLength, responseQuality
- **Pure:** No (calls state mutation)
- **Target Engine:** ScoreEngine
- **Action:** Migrate to `ScoreEngine.calculateResponseImpact()`

### Function: `incrementDifficulty`
- **Lines:** 46-51
- **Responsibility:** Increment stress management score
- **Dependencies:** React state
- **Pure:** No (state mutation)
- **Target Engine:** ScoreEngine
- **Action:** Migrate to `ScoreEngine.adjustDifficulty()`

### Function: `resetScores`
- **Lines:** 53-55
- **Responsibility:** Reset scores to initial values
- **Dependencies:** React state, INITIAL_SCORES constant
- **Pure:** No (state mutation)
- **Target Engine:** ScoreEngine
- **Action:** Keep in hook (state initialization)

## Migration Strategy

### Phase 1: ScoreEngine Extensions

Add to `ScoreEngine`:
- `clampScore(score: number): number` - Clamp score between 0-100
- `calculateResponseImpact(responseLength: number, quality: string): Partial<LiveScores>` - Calculate score deltas
- `adjustDifficulty(currentScores: LiveScores): LiveScores` - Increment difficulty

### Phase 2: Hook Refactoring

The hook becomes:
- State management (React only)
- Engine calls for business logic
- Return interface unchanged

### Phase 3: Normalization

Engine methods return raw data:
- `{ communication: number, leadership: number, ... }`
- No UI logic
- No React state mutations

## Current Status

- ✅ File size already < 150 lines
- ⏳ Audit complete
- ⏳ Migration pending
- ⏳ Normalization pending

## Notes

This hook is primarily a React state management hook with simple business rules. The migration will focus on extracting the scoring rules into ScoreEngine for consistency and reusability.
