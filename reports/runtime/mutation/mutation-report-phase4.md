# Audit par mutation ciblée - execution-pipeline (Phase 4)

## Objectif

Mutations supplémentaires basées sur les patterns VALIDES des phases précédentes pour atteindre 30+ mutations valides.

## Résultats

| KILLED | 17 |
| SURVIVED | 0 |
| INVALID | 9 |
| Mutation Score | 100.00% |
| Nombre total de mutations valides | 17 |

## Détail des mutations

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
| 58 | 74 | +=4 instead of ++ | KILLED |
| 59 | 74 | +=5 instead of ++ | KILLED |
| 60 | 75 | +=4 instead of ++ | KILLED |
| 61 | 75 | +=5 instead of ++ | KILLED |
| 62 | 116 | i < n → i < n - 1 | KILLED |
| 63 | 116 | i < n → i < n + 1 | KILLED |
| 64 | 116 | i = 0 → i = 2 | KILLED |
| 65 | 116 | i++ → i += 2 | KILLED |
| 66 | 144 | +2 to instructionsExecuted in return | INVALID |
| 67 | 144 | +2 to cycles in return | INVALID |
| 68 | 144 | +1 to branchesNotTaken in return | INVALID |
| 69 | 144 | +1 to calls in return | INVALID |
| 70 | 144 | +1 to returns in return | INVALID |
| 71 | 222 | size * 3 | KILLED |
| 72 | 222 | size + 2 | KILLED |
| 73 | 222 | size - 1 | KILLED |
| 74 | 134 | remove context.reset | INVALID |
| 75 | 135 | remove clearCache | KILLED |
| 76 | 136 | remove statistics reset | KILLED |
| 77 | 127 | remove stop | KILLED |
| 78 | 201 | return stats with hits=1 | KILLED |
| 79 | 201 | return stats with misses=1 | KILLED |
| 80 | 201 | return stats with hits=1, misses=1 | KILLED |
| 81 | 194 | return undefined instead of cycle | INVALID |
| 82 | 43 | 0 → 2 | INVALID |
| 83 | 44 | 0 → 2 | INVALID |
