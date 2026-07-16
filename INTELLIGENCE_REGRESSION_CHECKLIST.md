# Intelligence Regression Checklist

## Purpose
Verify that migrating business logic to intelligence engines maintains identical behavior.

## SPRINT 10.1 - useInterviewReport Migration

### Report Generation
- [ ] Rapport identique - Same report structure and content
- [ ] Scores identiques - Same global score calculation
- [ ] Décisions identiques - Same recruiter decision estimation
- [ ] Recommandations identiques - Same recommendations generated
- [ ] Timeline identique - Same timeline events
- [ ] STAR identique - Same STAR analysis results
- [ ] Comparaisons identiques - Same comparison data
- [ ] Coach identique - Same coaching plan

### Display Projection
- [ ] Highlights display correctly from raw strength data
- [ ] Improvements display correctly from raw weakness data
- [ ] No UI logic in engines (colors, icons, badges)
- [ ] Raw data format: `{ priority, category, impact, confidence, evidence }`

## SPRINT 10.2 - useInterviewEvaluation Migration

### Score Updates
- [ ] updateScore clamps correctly (0-100)
- [ ] updateScoresBasedOnResponse produces same deltas
- [ ] incrementDifficulty adjusts stress management correctly
- [ ] resetScores returns to initial values

### Engine Methods
- [ ] ScoreEngine.clampScore works identically
- [ ] ScoreEngine.calculateResponseImpact produces same deltas
- [ ] ScoreEngine.adjustDifficulty produces same result

## Verification Commands

```bash
# Typecheck
npx tsc --noEmit

# Lint
npx eslint core/intelligence/engines/ app/dashboard/interview-simulation/hooks/

# Build
npm run build
```

## Test Scenarios

### Score Clamping
- Input: 150 → Expected: 100
- Input: -10 → Expected: 0
- Input: 50 → Expected: 50

### Response Impact
- Quality: "excellent", length: 100 → Expected: +5 to communication, confidence, structure, +3 to leadership, impact
- Quality: "short", length: 30 → Expected: -2 to communication, confidence, structure, -3 to communication, -2 to impact
- Quality: "long", length: 600 → Expected: +1 to communication, confidence, structure, -2 to synthesis

### Difficulty Adjustment
- Current: 50 → Expected: 52
- Current: 99 → Expected: 100
- Current: 100 → Expected: 100

## Notes

- All engines return raw data only
- No UI-specific logic in engines
- Hook is pure orchestrator
- Backward compatibility wrappers prefixed with `_`
